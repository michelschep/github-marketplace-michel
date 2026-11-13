---
name: test-playwright
description: Discover and run existing Playwright browser UI tests for .NET websites using their existing test framework and browser configuration, with local reports, screenshots, and traces.
---

# Playwright website testing

Read applicable repository instructions, including `AGENTS.md` when present,
and website/testing documentation. No particular web framework, API, browser,
target framework, or test-project layout is assumed. Use `test-ui` for native
desktop controls.

Run existing tests only: never create or modify Playwright or xUnit tests, xUnit
project/fixture configuration, or application code, configuration, dependencies,
or behavior. Test-only runners and reports may be created when needed. Inspect
runners for prohibited persistent changes before use; stop if they are required.

## Discover and setup

- Locate the web application and actual Playwright tests. Inspect packages,
  test framework, SDK/runner, browser matrix, launch/context settings, fixtures,
  target URLs, dependent services, and existing runner.
- Reuse the project's framework/language. Distinguish .NET runner reporters from
  Node Playwright Test's HTML reporter.
- If no Playwright tests exist, report NOT CONFIGURED. Do not scaffold a website
  or assume a separate API is needed.
- Match browser binaries to the configured Playwright package. After a
  missing-browser failure, use that project's actual generated install script
  or configured CLI. Resolve its build configuration/framework/output directory;
  do not hard-code a framework or script path.
- Install only required browsers after checking the failure and setup guidance,
  not all browsers on every run. Respect deliberately configured browser channels;
  do not silently substitute system Chrome or upgrade packages.
- Use headless execution by default unless the project requires otherwise.
  Headless runs do not inherit Windows desktop checks. A requested headed demo
  needs an accessible interactive desktop and must not overlap native automation.
  Never unlock/reconfigure a session or attach to a user's browser.

## Execute and report

1. Prefer a verified browser-scoped project runner; otherwise invoke the actual
   test runner with supported project/filter/browser/report settings.
2. Start only documented owned services with isolated test data, passing target
   settings explicitly and verifying readiness. Preserve unrelated services,
   browser sessions, and data. A standalone website needs no invented backend.
3. Inspect exit status, actual executed tests, native raw results, and errors.
   Missing browsers, service startup failures, missing results, and zero tests
   are not PASS. Report skipped tests distinctly.
4. Produce HTML through supported reporters or a local raw-result summary.
   Verify current-run links to raw results, logs, and available screenshots/traces.
   Preserve archives and the combined overview during a focused run.
5. Dispose owned contexts, browsers, and services even after failure; restore
   settings. Report actual framework/browser/mode, scope, time, counts, outcomes,
   and relative detail path. Open reports/traces only when requested, using a
   matching local trace viewer; stop temporary viewer helpers afterward.
