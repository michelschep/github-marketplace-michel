'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const runner = path.resolve(__dirname, '..', 'assets', 'run-artillery.cjs');

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'testing-artillery-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const pkg = path.join(root, 'artillery');
  const modules = path.join(pkg, 'node_modules');
  fs.mkdirSync(path.join(modules, 'artillery-plugin-ensure'), { recursive: true });
  fs.mkdirSync(path.join(modules, 'js-yaml'), { recursive: true });
  fs.writeFileSync(path.join(pkg, 'package.json'), JSON.stringify({
    name: 'artillery', bin: { artillery: 'run.cjs' }
  }));
  fs.writeFileSync(path.join(modules, 'artillery-plugin-ensure', 'index.js'),
    'module.exports = { Plugin: class Plugin {} };');
  fs.writeFileSync(path.join(modules, 'js-yaml', 'index.js'),
    'exports.load = JSON.parse;');
  fs.writeFileSync(path.join(pkg, 'run.cjs'), `
    const fs = require('node:fs');
    const args = process.argv.slice(2);
    if (process.env.MOCK_MODE !== 'no-results') {
      const aggregate = process.env.MOCK_MODE === 'empty-results' ? {} : { counters: { 'http.requests': 1 } };
      fs.writeFileSync(args[args.indexOf('--output') + 1], JSON.stringify({ aggregate }));
    }
    if (process.env.MOCK_MODE !== 'no-checks') {
      console.log('Checks:');
      console.log((process.env.MOCK_MODE === 'fail' ? 'fail' : 'ok') + ': http.response_time.p95 < 500');
      if (process.env.MOCK_MODE !== 'partial-checks') console.log('ok: maxErrorRate < 0');
      if (process.env.MOCK_MODE === 'optional-pass') console.log('ok: http.requests > 0');
      if (process.env.MOCK_MODE === 'optional-fail') console.log('fail: http.requests > 0 (optional)');
    }
    process.exitCode = process.env.MOCK_MODE === 'fail' ? 1 : 0;
  `);
  const profile = path.join(root, 'profile.json');
  fs.writeFileSync(profile, JSON.stringify({
    config: { plugins: { ensure: {
      thresholds: [{ 'http.response_time.p95': 500 }], maxErrorRate: 0
    } } }
  }));
  return { root, pkg, profile };
}

function run(f, mode, extraEnv = {}) {
  const out = path.join(f.root, 'run');
  const env = { ...process.env, MOCK_MODE: mode, ...extraEnv };
  delete env.ARTILLERY_DISABLE_ENSURE;
  delete env.ARTILLERY_PLUGINS;
  delete env.ARTILLERY_PLUGIN_PATH;
  Object.assign(env, extraEnv);
  const processResult = spawnSync(process.execPath, [runner, f.pkg, f.profile, out], {
    encoding: 'utf8', env
  });
  return {
    status: processResult.status,
    verification: JSON.parse(fs.readFileSync(path.join(out, 'verification.json'), 'utf8'))
  };
}

test('requires complete passing ensure evidence', t => {
  const result = run(fixture(t), 'pass');
  assert.equal(result.status, 0);
  assert.equal(result.verification.outcome, 'PASS');
  assert.equal(result.verification.checks.length, 2);
});

test('rejects a run that did not emit threshold checks', t => {
  const result = run(fixture(t), 'no-checks');
  assert.notEqual(result.status, 0);
  assert.equal(result.verification.outcome, 'INVALID');
});

test('rejects a run missing one configured threshold result', t => {
  const result = run(fixture(t), 'partial-checks');
  assert.notEqual(result.status, 0);
  assert.equal(result.verification.outcome, 'INVALID');
});

test('retains a failed threshold as a valid failure', t => {
  const result = run(fixture(t), 'fail');
  assert.notEqual(result.status, 0);
  assert.equal(result.verification.outcome, 'FAIL');
  assert.equal(result.verification.checks[0].passed, false);
});

test('records optional checks without failing the run', async t => {
  for (const mode of ['optional-pass', 'optional-fail']) {
    await t.test(mode, t => {
      const f = fixture(t);
      const profile = JSON.parse(fs.readFileSync(f.profile, 'utf8'));
      profile.config.plugins.ensure.conditions = [{ expression: 'http.requests > 0', strict: false }];
      fs.writeFileSync(f.profile, JSON.stringify(profile));
      const result = run(f, mode);
      assert.equal(result.status, 0);
      assert.equal(result.verification.outcome, 'PASS');
      assert.equal(result.verification.checks.find(check => check.name === 'http.requests > 0').passed,
        mode === 'optional-pass');
    });
  }
});

test('rejects missing raw results', t => {
  const result = run(fixture(t), 'no-results');
  assert.notEqual(result.status, 0);
  assert.equal(result.verification.outcome, 'INVALID');
});

test('rejects results without metrics', t => {
  const result = run(fixture(t), 'empty-results');
  assert.notEqual(result.status, 0);
  assert.equal(result.verification.outcome, 'INVALID');
});

test('blocks a missing or disabled ensure plugin before traffic', async t => {
  await t.test('missing module', t => {
    const f = fixture(t);
    fs.rmSync(path.join(f.pkg, 'node_modules', 'artillery-plugin-ensure'), { recursive: true });
    const result = run(f, 'pass');
    assert.notEqual(result.status, 0);
    assert.equal(result.verification.outcome, 'INVALID');
    assert.equal(fs.existsSync(path.join(f.root, 'run', 'results.json')), false);
  });
  await t.test('disabled plugin', t => {
    const f = fixture(t);
    const result = run(f, 'pass', { ARTILLERY_DISABLE_ENSURE: '1' });
    assert.notEqual(result.status, 0);
    assert.equal(result.verification.outcome, 'INVALID');
    assert.equal(fs.existsSync(path.join(f.root, 'run', 'results.json')), false);
  });
  await t.test('not configured', t => {
    const f = fixture(t);
    fs.writeFileSync(f.profile, JSON.stringify({ config: { plugins: {} } }));
    const result = run(f, 'pass');
    assert.notEqual(result.status, 0);
    assert.equal(result.verification.outcome, 'INVALID');
    assert.equal(fs.existsSync(path.join(f.root, 'run', 'results.json')), false);
  });
});
