---
name: test-artillery
description: Discover, create, update, and run bounded Artillery performance tests using a project's approved profiles and tool versions, with JSON metrics and local HTML reporting.
---

# Artillery performance testing

Read applicable repository instructions, including `AGENTS.md` when present,
and the project's performance-testing documentation. No specific API, workload,
Artillery version, reporter version, or runner script is required by this skill.

Never modify application code, configuration, dependencies, or behavior, or
create or modify xUnit tests or their project/fixture configuration. Create or
update Artillery tests only when requested; test-only runners, fixtures,
configuration, dependencies, and reports are permitted when needed. Inspect
runners for prohibited persistent changes before use; stop if they are required.

## Discover and approve scope

- Locate actual Artillery profiles, processors, plugins, package manifests,
  lock files, environments, and existing runners. Inspect the selected profile
  and API contract before execution.
- Resolve target, credentials, duration, arrival/concurrency limits, HTTP
  timeouts, assertions, and thresholds. Use the documented approved local smoke
  profile by default; never pick an arbitrary larger profile or remote target.
- If target ownership or safe load bounds are unclear, stop before generating
  traffic and clarify. "Run all" does not authorize cloud/paid load testing,
  production traffic, uploads, or an increased workload.
- No configured profile means NOT CONFIGURED, not permission to invent one.
  Create a profile only when requested, with explicit bounded workload settings.

## Create or update only when requested

- Exercise meaningful user scenarios from the actual application contract.
  Capture per-user identifiers; isolate and clean up only owned data, including
  after failed checks. Serialize against other mutable-data suites if needed.
- Validate functional outcomes as well as performance. Use supported assertion
  and threshold mechanisms that actually affect the run's failure status.
- Preserve approved limits and thresholds on a run/report-only request. Do not
  confuse a functional HTTP success with a passing latency/completion threshold,
  or a smoke test with a capacity benchmark.

## Execute and report

1. Prefer a verified scoped project runner; otherwise use the project's pinned
   CLI with its supported profile/environment/target/output options. Verify
   service identity/readiness and use isolated data. Disable optional telemetry
   and unrelated browser downloads where supported; restore temporary settings.
2. Save fresh JSON and logs in an isolated run directory. Inspect exit status,
   errors, assertions, completion, and threshold outcomes, not HTTP counts alone.
3. Detect the JSON schema before reading metrics. Common formats expose
   `aggregate.counters` and `aggregate.summaries`, but names/availability vary.
   Report created/completed/failed users, requests, checks, and latency
   percentiles separately, with actual units. Missing metrics are unknown, not
   zero. State whether configured thresholds were evaluated.
4. Verify the installed version's HTML reporting capability and actual output;
   a `report` command in help is not proof it creates HTML. Reuse a documented
   compatible local converter when present. Otherwise render a local HTML
   summary from JSON, clearly labeling its scope. Do not automatically downgrade,
   install an unsupported legacy reporter, or upload results to obtain HTML.
5. Verify HTML/raw/log links belong to this run. Preserve the combined overview
   during focused execution. Report scope, tool version, target without secrets,
   workload, real metrics/outcomes, and relative report path.
6. Distinguish test failure from HTML conversion failure. Retain partial raw
   results, clean up owned resources, and open the report only when requested.
