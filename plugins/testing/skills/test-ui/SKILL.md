---
name: test-ui
description: Discover and run existing native Windows desktop UI tests for .NET applications using their configured automation stack, such as FlaUI, with local reports and safe failure evidence.
---

# Native Windows desktop UI testing

Read applicable repository instructions, including `AGENTS.md` when present,
and desktop/testing documentation. For websites use `test-playwright`.

Run existing tests only: never create or modify desktop UI or xUnit tests, xUnit
project/fixture configuration, or application code, configuration, dependencies,
or behavior. Test-only runners and reports may be created when needed. Inspect
runners for prohibited persistent changes before use; stop if they are required.
Use the `test-all` skill's `assets/test-overview-template.html` for any HTML
test-status overview, following that skill's rendering instructions; native
detailed reports may be linked.

## Discover and preflight

- Locate the actual desktop application and UI tests. Inspect UI technology,
  Windows target/runtime, test framework, automation packages/backend, startup
  configuration, executable output, fixtures, and existing runner.
- Reuse the configured automation stack and test framework; do not force xUnit
  or a particular FlaUI version. With FlaUI, inspect whether UIA2 or UIA3 is used
  and verify it exposes the actual controls. Do not assume every .NET UI has
  compatible Windows UI Automation providers.
- Do not create a desktop application, API, database, or test project merely to
  run this skill. Missing UI tests are NOT CONFIGURED. An unsupported platform
  or provider is a stated limitation, not permission to substitute browser tests.
- Native Windows automation requires Windows and an accessible unlocked input
  desktop; a user-interactive flag alone is insufficient. Verify the actual
  session/desktop before launch. If unavailable, record configured tests as
  NOT RUN with a reason and nonzero execution outcome.
- Never unlock/reconfigure the workstation, automate a secure desktop, or bypass
  checks. Warn about focus/input before execution; do not run concurrently with
  other visible automation or interact with unrelated applications.

## Execute and report

1. Use a verified project runner scoped to native UI, or the discovered test
   runner with its supported filters and report arguments. Build the actual
   application/configuration and resolve its real output path.
2. Launch only an owned instance with documented test settings. Start isolated
   dependencies only if required by that application; verify their readiness.
   Never attach to a user's already-running application.
3. Preserve actual failures if the desktop becomes unavailable after preflight.
   Inspect command status and fresh native raw results, actual counts, and
   failure details. Missing prerequisites/results and zero tests are not PASS.
4. Produce HTML and raw results using supported reporters or a local raw-result
   summary. Link only this run's existing logs and safe failure screenshots.
   Screenshot failure must not mask the original test failure.
5. Close only owned processes, including on timeout; validate recorded PID,
   start time, and executable identity before cleanup. Restore test settings and
   remove only owned data. Preserve unrelated browser/application sessions.
6. Report test category, actual automation library/backend and test framework,
   scope, time, outcomes/counts, and verified relative report path. Preserve the
   combined overview on focused runs and open reports only when requested.
