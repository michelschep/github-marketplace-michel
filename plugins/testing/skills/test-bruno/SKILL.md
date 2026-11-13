---
name: test-bruno
description: Discover, create, update, and run Bruno functional API tests for a project's actual collections, contracts, and environments, with HTML and JSON reporting.
---

# Bruno API testing

Read applicable repository instructions, including `AGENTS.md` when present,
and the project's API/testing documentation. For recorded results only, use
`bruno-status`; do not execute requests.

Never modify application code, configuration, dependencies, or behavior, or
create or modify xUnit tests or their project/fixture configuration. Create or
update Bruno tests only when requested; test-only runners, fixtures,
configuration, dependencies, and reports are permitted when needed. Inspect
runners for prohibited persistent changes before use; stop if they are required.

## Discover

- Locate collection roots from Bruno configuration and request files. Inspect
  environments, variables, scripts, dependencies, and the installed/pinned CLI.
  Do not assume collection names, environment names, token values, or URL keys.
- Read the actual API contract and relevant implementation/tests. Derive fields,
  statuses, authentication, and update semantics from evidence, not examples.
- Inspect the project's runner and reporter options. Resolve multiple collections
  or targets from the request/documented defaults; ask if materially ambiguous.
- If no collection exists, report NOT CONFIGURED unless creating tests was
  requested. Do not scaffold an API, collection, or authentication scheme simply
  because this skill was invoked.

## Create or update only when requested

- Preserve collection ordering, `meta.seq`, naming, and folder conventions.
  Cover observable responses, validation, authorization, boundaries, and saved
  state relevant to the requested behavior.
- Chain captured identifiers in lifecycle scenarios. Use unique owned fixtures
  and failure-safe cleanup; never delete unrelated records.
- Follow scripting APIs supported by the configured CLI. For intentional error
  responses, ensure the HTTP client passes those responses to assertions rather
  than throwing first. Do not assume an option works in every CLI version.
- Serialize list-invariance/shared-state scenarios; do not weaken checks to
  accommodate concurrent writers.

## Execute and report

1. Prefer a verified project runner scoped to the selected collections. Otherwise
   run the configured CLI from each collection root, using supported recursion,
   environment, target-override, and reporter arguments.
2. Verify target identity/readiness before requests. Prefer the documented owned
   test host and isolated data; do not silently reuse a developer/shared service.
   Keep secrets out of command output, logs, and reports.
3. Save fresh JSON and HTML in the project's artifact layout, isolated per run
   and collection. Use native reporters when supported; otherwise render a local
   HTML summary from JSON and disclose reporting limitations.
4. Check exit codes and detect the actual result schema. Inspect request errors,
   statuses, assertions, and pre/post-response/script test outcomes across every
   iteration. HTTP success alone does not mean PASS.
5. Distinguish unique requests, request executions, scripted tests, and assertions.
   Internal scripted HTTP calls are not additional top-level request entries.
   Missing/unknown/skipped results must remain visible.
6. Preserve actual collection sequence/numeric labels in scenario tables. Include
   scope, environment without secrets, time, totals, and verified relative
   report/raw/log links. Do not overwrite another suite's combined overview.
   Open HTML only when requested; CLI reports are not Desktop run history.
