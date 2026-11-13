---
name: test-xunit
description: Discover and run existing xUnit unit or integration tests in .NET solutions using their existing frameworks, fixtures, runners, and reporting conventions.
---

# xUnit testing

Read applicable repository instructions, including `AGENTS.md` when present,
and the project's testing documentation. This skill does not require an API,
database, particular target framework, or a particular runner script.

Never create or modify xUnit tests, their project or fixture configuration, or
application code, configuration, dependencies, or behavior. Test-only runners
and reports may be created when needed. Inspect existing runners for prohibited
persistent changes before use; stop and explain if those changes are necessary.
Use `test-status` for the canonical HTML dashboard; native detailed reports may
be linked.

## Discover and scope

1. Locate the selected solution and actual xUnit projects. Read their packages,
   fixtures, and test source; do not infer framework or test category from names.
   Respect the SDK, target frameworks, configuration, and central build settings.
2. Detect xUnit version and VSTest versus Microsoft.Testing.Platform. Inspect
   the existing runner and its supported arguments/reporters before execution.
   Do not pass VSTest logger options to another runner without checking support.
3. Select the requested unit/integration projects and filters. Use `test-ui` or
   `test-playwright` for their configured UI projects; do not accidentally run
   them through a solution-wide backend command.
4. If no xUnit tests exist, report NOT CONFIGURED. Do not relabel NUnit/MSTest
   tests or create a test project merely to run this skill. `test-all` can
   coordinate those other frameworks using their actual configured runners.

## Execute and report

- Prefer a verified project runner with a selector covering only the requested
  projects. Otherwise invoke their configured .NET test runner directly using
  its supported project/filter/report options; resolve paths from discovery.
- Run the smallest relevant scope. Keep output unique per run, project, and
  target framework. Preserve archived run overviews during a focused run.
- Generate native raw results (TRX when supported) and HTML using available
  reporters. If native HTML is unavailable, create a local HTML summary from
  raw results; do not install a reporter or switch runners without justification.
- Inspect exit codes, actual discovered/executed tests, counters, skips, and
  failure details. Missing/unreadable artifacts or zero tests are not PASS.
- Report actual category, xUnit/runner, scope, counts, time, and verified relative
  detail/raw/log paths. Distinguish test failures from setup/reporting errors.
  Do not imply other suites passed or open reports unless requested.
- Record each completed, failed, or blocked attempt and refresh the canonical
  dashboard using `test-status`. Report refresh failures separately.
