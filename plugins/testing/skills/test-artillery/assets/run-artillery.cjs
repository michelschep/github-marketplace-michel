#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');
const { pathToFileURL } = require('node:url');
const { spawnSync } = require('node:child_process');

async function main() {
  const [packageDir, profileArg, runDirArg] = process.argv.slice(2);
  if (!packageDir || !profileArg || !runDirArg || process.argv.length !== 5) {
    throw new Error('Usage: node run-artillery.cjs <artillery-package-dir> <profile> <new-run-directory>');
  }

  const profile = path.resolve(profileArg);
  const runDir = path.resolve(runDirArg);
  fs.mkdirSync(runDir, { recursive: false });
  const verification = { valid: false, outcome: 'INVALID', checks: [] };
  let exitCode = 1;

  try {
    const manifestPath = path.resolve(packageDir, 'package.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    if (manifest.name !== 'artillery') throw new Error('Not an Artillery package directory');
    const requireArtillery = createRequire(manifestPath);
    const yaml = requireArtillery('js-yaml');
    const script = yaml.load(fs.readFileSync(profile, 'utf8'));
    const config = script?.config;
    if (!config || !config.plugins || !Object.hasOwn(config.plugins, 'ensure') ||
        !config.plugins.ensure || typeof config.plugins.ensure !== 'object' ||
        config.pluginsScope || config.plugins.ensure.scope) {
      throw new Error('Profile must explicitly enable the standard ensure plugin');
    }
    if (process.env.ARTILLERY_DISABLE_ENSURE !== undefined ||
        process.env.ARTILLERY_PLUGINS !== undefined ||
        process.env.ARTILLERY_PLUGIN_PATH !== undefined) {
      throw new Error('Ensure-disabling or plugin-override environment variables are set');
    }

    const ensure = config.ensure || config.plugins.ensure;
    const expected = [];
    for (const threshold of ensure.thresholds || []) {
      const entries = Object.entries(threshold);
      if (entries.length !== 1 || typeof entries[0][1] !== 'number' ||
          !Number.isFinite(entries[0][1])) throw new Error('Unsupported threshold');
      expected.push({ name: `${entries[0][0]} < ${entries[0][1]}`, strict: true });
    }
    for (const condition of ensure.conditions || []) {
      if (typeof condition.expression !== 'string' || condition.expression.includes('{{')) {
        throw new Error('Unsupported condition expression');
      }
      expected.push({ name: condition.expression, strict: condition.strict !== false });
    }
    for (const metric of ['min', 'max', 'median', 'p95', 'p99']) {
      if (ensure[metric] !== undefined) {
        if (!Number.isInteger(ensure[metric])) throw new Error('Unsupported legacy threshold');
        expected.push({ name: `${metric} < ${ensure[metric]}`, strict: true });
      }
    }
    if (ensure.maxErrorRate !== undefined) {
      if (typeof ensure.maxErrorRate !== 'number' || !Number.isFinite(ensure.maxErrorRate)) {
        throw new Error('Unsupported error-rate threshold');
      }
      expected.push({ name: `maxErrorRate < ${ensure.maxErrorRate}`, strict: true });
    }
    if (!expected.some(check => check.strict) ||
        new Set(expected.map(check => check.name)).size !== expected.length) {
      throw new Error('At least one unique strict ensure check is required');
    }

    let pluginPath;
    try {
      pluginPath = requireArtillery.resolve('artillery-plugin-ensure');
    } catch {
      pluginPath = requireArtillery.resolve('./dist/builtin-packages/artillery-plugin-ensure');
    }
    const loaded = await import(pathToFileURL(pluginPath).href);
    const plugin = loaded.default ?? loaded;
    if (typeof plugin !== 'function' && typeof plugin.Plugin !== 'function' &&
        typeof loaded.Plugin !== 'function') throw new Error('Ensure plugin is not loadable');

    const bin = typeof manifest.bin === 'string' ? manifest.bin : manifest.bin?.artillery;
    if (!bin) throw new Error('Artillery executable not found');
    const resultsPath = path.join(runDir, 'results.json');
    const result = spawnSync(process.execPath, [
      path.resolve(packageDir, bin), 'run', profile, '--output', resultsPath
    ], {
      cwd: path.dirname(profile),
      env: { ...process.env, ARTILLERY_DISABLE_TELEMETRY: '1', FORCE_COLOR: '0' },
      encoding: 'utf8',
      maxBuffer: 20 * 1024 * 1024
    });
    fs.writeFileSync(path.join(runDir, 'stdout.log'), result.stdout || '');
    fs.writeFileSync(path.join(runDir, 'stderr.log'), result.stderr || '');
    verification.artilleryExitCode = result.status;
    if (result.error || result.signal || result.status === null) {
      throw new Error(`Artillery did not complete: ${result.error?.message || result.signal}`);
    }
    const raw = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
    if (!raw.aggregate || typeof raw.aggregate !== 'object' || Array.isArray(raw.aggregate)) {
      throw new Error('Missing aggregate results');
    }
    const metrics = [raw.aggregate.counters, raw.aggregate.rates, raw.aggregate.summaries];
    if (!metrics.some(group => group && typeof group === 'object' &&
        !Array.isArray(group) && Object.keys(group).length > 0)) {
      throw new Error('Aggregate results contain no metrics');
    }

    const text = (result.stdout || '').replace(/\x1b\[[0-9;]*m/g, '');
    const checksSection = text.lastIndexOf('Checks:');
    if (checksSection < 0) throw new Error('Ensure produced no threshold results');
    const lines = text.slice(checksSection).split(/\r?\n/);
    for (const check of expected) {
      const matches = lines.map(line => line.trim()).filter(line =>
        line === `ok: ${check.name}` || line === `fail: ${check.name}` ||
        line === `ok: ${check.name} (optional)` || line === `fail: ${check.name} (optional)`);
      if (matches.length !== 1 ||
          (matches[0].startsWith('fail: ') &&
           matches[0].endsWith(' (optional)') === check.strict) ||
          (check.strict && matches[0].endsWith(' (optional)'))) {
        throw new Error(`Missing or ambiguous ensure result: ${check.name}`);
      }
      verification.checks.push({ ...check, passed: matches[0].startsWith('ok: ') });
    }
    verification.valid = true;
    verification.outcome = result.status === 0 &&
      verification.checks.every(check => !check.strict || check.passed) ? 'PASS' : 'FAIL';
    exitCode = verification.outcome === 'PASS' ? 0 : 1;
  } catch (error) {
    verification.reason = error.message;
    console.error(`Invalid Artillery attempt: ${error.message}`);
  }

  fs.writeFileSync(path.join(runDir, 'verification.json'), JSON.stringify(verification, null, 2) + '\n');
  console.log(`Artillery attempt: ${verification.outcome}; evidence: ${runDir}`);
  process.exitCode = exitCode;
}

main().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
