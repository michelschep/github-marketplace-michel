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
Use the `test-all` skill's `assets/test-overview-template.html` for any HTML
test-status overview, following that skill's rendering instructions; native
detailed reports may be linked.

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

## Missing Bruno CLI

- When a test run is requested, check for the project's configured Bruno CLI,
  including a local `node_modules/.bin` executable; do not rely solely on a
  global `bru` command. Prefer the configured CLI and version when available.
- If the CLI is missing, install it automatically in a test-only location;
  do not ask for separate permission to install it. Do not install anything for
  a status-only or create-only request. Do not use global installation or modify
  application or xUnit manifests, lockfiles, or source.
- Reuse a documented test-only dependency setup if it is safe. Otherwise use
  an isolated test-tools directory, outside application dependency trees. Use
  the project's pinned CLI version when available; otherwise resolve a
  compatible stable version from the configured package registry, checking the
  installed Node.js version, package engine requirements, and collection format.
  Do not silently use an unpinned latest version or upgrade a project pin.
- Install `@usebruno/cli` locally with the project's package manager or npm;
  avoid implicit downloads by unpinned `npx`. Use the explicit local executable
  from the collection root and verify its version and supported options. If
  Node.js, the package manager, a compatible version, or installation is
  unavailable, report the blocker and mark the suite NOT RUN. Never silently
  install Node.js or change machine-wide settings.

## TLS certificate errors

- Verify TLS normally. Prefer a documented trusted local CA and the installed
  CLI's supported CA option, such as `--cacert`, over disabling verification.
  Do not change the system trust store or persist global TLS settings.
- If certificate verification fails for an identified, owned local test target
  and a trusted CA is unavailable, explain the risk and ask the user for
  explicit approval before using `--insecure` for that specific run.
  Verify that the installed CLI supports the flag.
- `--insecure` affects the run, not just one host. Use it only when every
  request, scripted request, redirect, and proxy involved is verified to stay
  within the approved local test target. If that cannot be established, or a
  remote/shared target is involved, do not bypass verification; report the
  blocker. Never use global environment variables to disable TLS verification.
- Before retrying, verify whether the failed run already performed requests or
  created data. Repeat only when safe with isolated fixtures and cleanup; retain
  the original failure evidence. Label a run using `--insecure` in its report.

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
