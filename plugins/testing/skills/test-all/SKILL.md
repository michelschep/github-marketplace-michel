---
name: test-all
description: Discover and run configured test suites and generate an HTML overview with linked detailed reports. Supports .NET, Bruno, Artillery, desktop UI, and standalone JavaScript Playwright suites.
---

# Run all tests and show the overview

Read applicable repository instructions, including `AGENTS.md` when present,
and testing documentation. Use focused skills for framework-specific work.
This skill coordinates the solution's actual suites, not a fixed suite count.
For a status or dashboard request without a new run, use `test-status` instead.

Never modify application code, configuration, dependencies, or behavior, or
create or modify xUnit tests or their project/fixture configuration. This is a
run-only skill: do not create or modify tests of any kind. Test-only runners and
reports may be created when needed. Inspect runners for prohibited persistent
changes before use; stop if they are required.

## Discover the execution plan

1. Identify the selected solution(s), test projects/frameworks, API collections,
   performance profiles, native UI tests, and browser tests. Inspect SDK/tool
   configuration, manifests, runsettings, existing runners, service requirements,
   result schemas, and artifact conventions. A standalone JavaScript Playwright
   project and its UI URL do not require a .NET solution or application source.
2. Build a suite inventory with category, tool/framework, source, supported
   command, prerequisites, dependencies, target, required/optional status, and
   output location. Use explicit project policy where present; otherwise treat
   configured suites in the requested scope as required.
3. Do not assume every category exists. Report absent categories as
   NOT CONFIGURED, not failures, PASS, or executed skips. Do not scaffold missing
   applications, tests, collections, profiles, or runners.
4. Include configured NUnit/MSTest/other .NET frameworks under their real names,
   not as xUnit. Detect VSTest versus Microsoft.Testing.Platform before selecting
   arguments/reporters. Do not run UI projects twice through a backend solution
   command and a separate UI stage.
5. Prefer a verified project orchestrator if it covers the discovered scope
   safely. Inspect its actual parameters, dependencies, and outputs first.
   If it covers only part of the scope, account for the remainder explicitly.
   Without a suitable runner, invoke configured tools directly using the focused
   skills and actual framework configuration; no prebuilt universal script is
   assumed. Resolve material scope/target ambiguity before execution.

## Execute

- Execute the requested suites, not just instructions for the user. Preserve
  project versions, configurations, browser matrices, and approved load limits.
  A run-only request is not permission to add tests or change thresholds.
- For a missing Bruno CLI or a Bruno TLS error, follow `test-bruno`: install a
  compatible CLI locally when needed, and ask before an eligible local TLS
  bypass. Never globally install tools or silently disable TLS verification.
- For browser suites, follow `test-playwright`; request approval before UI
  actions that change data. A run-only request does not create tests.
- For Artillery, follow `test-artillery` for telemetry, verified ensure checks,
  isolated evidence and fail-closed runner behavior. Do not create a profile
  merely because all suites were requested.
- Verify target ownership/readiness. Use documented owned services and isolated
  data; do not start an API/database for a library-only solution or silently use
  an unidentified shared service.
- Honor actual dependencies. Continue independent suites after a failure when
  safe; mark dependents NOT RUN with their reason. Serialize shared mutable data,
  desktop focus, and output paths; avoid duplicate background runs.
- Native desktop/headed browser prerequisites do not block headless browser or
  backend tests. A configured required UI suite that cannot run is NOT RUN and
  prevents overall success; never bypass desktop safeguards.
- Cloud/paid tests, production/shared targets, uploads, and larger load require
  explicit authorization. If a required suite cannot safely execute, show it as
  NOT RUN rather than silently dropping it from "all".
- Keep output isolated by run, suite, project, and target framework. Clean up
  only owned processes/data and restore temporary settings, even on failure.

## Build and verify the overview

1. Inspect each command exit code and fresh raw results. Derive actual counts,
   skips, errors, thresholds, and timings from the producer's schema; do not
   assume a specific summary JSON layout or equate HTTP success with test PASS.
   Label Bruno duration "Functional runtime, not performance". Missing
   Artillery threshold evidence is INVALID/UNKNOWN, never PASS.
2. Use `assets/test-overview-template.html` in this skill directory for the
   archived HTML overview of this run. Fill every placeholder
   using verified results; never publish the template with placeholders or
   fabricate missing data. Escape all dynamic text and attribute values.
   `SCOPE`, `TIMES`, and `OVERALL_STATUS` are text; `OVERALL_CLASS` is a
   fixed status class from the template. `ROWS` contains one table row per
   suite, with row-header test type, technology, status, a `metrics` list,
   duration, a Last run cell with run time and ID, and a `details` cell with
   relative links to existing artifacts.
   `NOTES` contains short paragraphs describing scope/status limitations;
   `SUMMARY_LINK` is an optional link to a verified machine-readable summary.
   Use `-` for unavailable details and do not invent links. Reuse project
   reporters for linked details, or create local detail pages from raw results
   where needed and disclose their limits. Never fetch remote scripts to parse
   evidence.
3. Keep the full category inventory visible, including categories without tests
   as NOT CONFIGURED and existing suites outside the requested scope as
   NOT SELECTED. Neither counts as executed or passed. Keep FAIL,
   ERROR, NOT RUN, and skipped tests visible; never relabel them PASS. If nothing
   executes, report no tests run, not "all passed".
4. Verify all current-run detail links. Never substitute archived success when a
   new suite fails to produce a report. Retain partial results and distinguish
   reporting errors from the available test outcomes.
5. Overall success requires actual execution and every required configured suite
   passing. Retain nonzero execution outcome for required failures/blocked suites
   and reporting errors; list any optional omissions without implying coverage.
6. Record each suite attempt, including blocked attempts, then refresh the
   canonical latest-per-suite dashboard using `test-status`; preserve the archived
   run overview. Report dashboard
   refresh failures separately. Summarize actual scope, suite outcomes, separate
   counts/latency units, and relative paths in English. Open a report only when
   requested and claim it opened only after launch succeeds.
