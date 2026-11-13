---
name: test-playwright
description: Create standalone JavaScript Playwright browser UI tests from an authorized UI URL, or run existing Playwright tests, without modifying the application.
---

# Playwright website testing

Read applicable test-workspace instructions, including `AGENTS.md` when
present, and available testing documentation. The application may be available
only through a UI URL; access to its source, solution, or xUnit tests is not
required. No particular web framework, API, or test-project layout is assumed.
Use `test-ui` for native desktop controls.

Create or update JavaScript Playwright tests only when requested; a run-only
request must not create or change tests. Never create or modify xUnit tests or
their project/fixture configuration, or application code, configuration,
dependencies, or behavior. Test-only project files, runners, fixtures,
configuration, dependencies, and reports are permitted when needed. Inspect
runners for prohibited persistent changes before use; stop if they are required.
Use `test-status` for the canonical HTML dashboard; native detailed reports may
be linked.

## Discover and setup

- Obtain the UI URL, requested scenarios, expected behavior, and authorization
  to access the target. Ask when any are unclear. A URL alone does not establish
  business rules, credentials, or permission to change server-side data.
- Resolve a user-approved test workspace, separate from the application source;
  ask where to create it if unclear. Inspect available test-only instructions,
  manifests, fixtures, browser settings, and existing runners. Reuse an
  identified suitable JavaScript Playwright project; never require or modify
  an application solution, manifest, or xUnit test project.
- For an explicit creation request with no suitable JavaScript project, create
  a separate test-only JavaScript project using `@playwright/test`, its own
  manifest and configuration, and local dependencies. Keep the target URL
  configurable, for example through a test-process environment variable.
  Configure test output and HTML/JSON reporting so individual runs can use
  separate paths without editing tests. Do not scaffold or edit an application
  or invent an API dependency.
- If no Playwright tests exist and the request is run-only, report NOT
  CONFIGURED. Run existing .NET Playwright suites without modifying them;
  distinguish .NET reports from Playwright Test's Node HTML reporter.
- Match browser binaries to the configured Playwright package. After a
  missing-browser failure, use the test project's documented install command
  or generated script. For .NET, resolve the actual build configuration,
  framework, and output directory instead of hard-coding the script path.
- Install only required browsers after checking the failure and setup guidance,
  with explicit setup approval, not all browsers on every run. Respect configured
  browser channels; do not silently substitute system Chrome or upgrade packages.
- Use headless execution by default unless the project requires otherwise.
  Headless runs do not inherit Windows desktop checks. A requested headed demo
  needs an accessible interactive desktop and must not overlap native automation.
  Never unlock/reconfigure a session or attach to a user's browser.

## Create or update JavaScript tests

- Inspect the authorized UI in a browser and confirm expected behavior with the
  user or reliable documentation. Use observed accessible roles, labels, and
  stable locators with bounded waits; never invent selectors or assertions or
  modify the application to add test identifiers. If a reliable test cannot
  be written without app changes, report the limitation.
- Navigation and clicks can themselves have side effects. Inspect the requested
  action before performing it. Obtain explicit approval for data-changing
  actions, a suitable test environment, and test data before probing or running
  them. If safety cannot be established, leave the scenario blocked and report
  it; never submit changes to an unknown, shared, or production target.
- Obtain authentication through an approved secure mechanism; do not place
  secrets in test source, command output, reports, traces, or committed files.
  Keep TLS verification enabled; never silently bypass certificate errors.
- Use isolated browser contexts and uniquely owned fixtures. Clean up only
  confirmed owned data in failure-safe paths; report possible leftovers and
  never delete unrelated records. Avoid concurrent tests that share mutable
  data. Retain controlled-page evidence locally and prevent evidence-capture
  failures from masking test failures.

## Execute and report

1. Prefer a verified browser-scoped project runner; otherwise invoke the actual
   test runner with supported project/filter/browser/report settings. Before
   starting, inspect the runner's output locations. Assign a unique run directory
   with separate artifact, HTML, and JSON paths; do not overwrite existing
   reports or the canonical dashboard. For a compatible Node Playwright version,
   use its supported `--output`, `PLAYWRIGHT_HTML_OUTPUT_DIR`, and
   `PLAYWRIGHT_JSON_OUTPUT_FILE` options with the relevant reporters. Do not
   place the HTML report inside the runner's cleaned artifact directory. Restore
   temporary environment changes. If output cannot be safely isolated or
   existing owned reports cannot be preserved, stop before executing.
2. Use the authorized UI URL directly when the application is already available.
   Start only documented owned services with isolated test data when needed,
   passing target settings explicitly and verifying readiness. Preserve unrelated
   services, browser sessions, and data. Do not invent a backend.
3. Inspect exit status, actual executed tests, native raw results, and errors.
   Missing browsers, service startup failures, missing results, and zero tests
   are not PASS. Report skipped tests distinctly.
4. Produce HTML through supported reporters or a local raw-result summary.
   Verify current-run links to raw results, logs, and available screenshots/traces.
   Preserve archived run overviews during a focused run.
5. Dispose owned contexts, browsers, and services even after failure; restore
   settings. Report actual framework/browser/mode, scope, time, counts, outcomes,
   and relative detail path. Open reports/traces only when requested, using a
   matching local trace viewer; stop temporary viewer helpers afterward.
6. Record each completed, failed, or blocked attempt and refresh the canonical
   dashboard using `test-status`. Persist a readable attempt record before
   refreshing; if it cannot be written, report that the dashboard could not be
   reliably updated rather than claiming a durable status. Report refresh
   failures separately.
