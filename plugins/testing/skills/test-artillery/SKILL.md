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
Use `test-status` for the canonical HTML dashboard; native detailed reports may
be linked.

## Discover and approve scope

- Locate actual Artillery profiles, processors, plugins, package manifests,
  lock files, environments, and existing runners. Inspect the selected profile
  and API contract before execution.
- Resolve target, credentials, duration, arrival/concurrency limits, HTTP
  timeouts, assertions, and thresholds. Prefer an existing approved profile.
  Otherwise use the safe local smoke defaults below for a requested performance
  test; never pick an arbitrary larger profile or remote target.
- If target ownership or safe load bounds are unclear, stop before generating
  traffic and clarify. "Run all" does not authorize cloud/paid load testing,
  production traffic, uploads, or an increased workload.
- A request to perform an Artillery test permits creating a test-only smoke
  profile if none exists. A status request or `test-all` does not. When no
  profile exists and creation was not requested, report NOT CONFIGURED.

## Default local smoke profile

For an authorized, owned local test service, when no approved profile or load
limits are supplied, use 20 seconds at 5 virtual users per second. Select only
verified read-only GET endpoints, with no side effects; GET alone does not prove
that an endpoint is safe. Confirm the target and that this load is safe before
traffic if either is unclear. Never infer authorization for a shared, remote,
production, or paid target. Do not invent endpoints, response codes, credentials,
or a service.

Create the test-only profile with the installed Artillery version's supported
`config.plugins.ensure` syntax: `http.response_time.p95 < 500` milliseconds
and `maxErrorRate: 0`. The latter checks incomplete virtual users, not HTTP error
responses. Also enforce successful responses: derive the expected status from
the actual endpoint and add a strict check that all requests received the
expected status, such as `http.codes.200 == http.requests` only when 200 is
verified. Require both `http.requests > 0` and
`vusers.completed == vusers.created and vusers.created > 0` as strict checks.
Some Artillery versions label the legacy zero-error check `maxErrorRate < 0`
in their output although it evaluates error rate as `<= 0`; preserve the
original log and describe the actual check as zero errors.
Do not silently remove or relax checks for missing metrics. This is a bounded
smoke test, not a capacity, throughput, or production-readiness benchmark.

For a verified endpoint returning 200, adapt this example only after replacing
the target and path with the observed, authorized local service and endpoint:

```yaml
config:
  target: "http://127.0.0.1:PORT"
  phases:
    - duration: 20
      arrivalRate: 5
  plugins:
    ensure:
      thresholds:
        - "http.response_time.p95": 500
      maxErrorRate: 0
      conditions:
        - expression: "http.codes.200 == http.requests and http.requests > 0"
        - expression: "vusers.completed == vusers.created and vusers.created > 0"
scenarios:
  - flow:
      - get:
          url: "/VERIFIED-READ-ONLY-PATH"
```

## Local tooling

For a requested run, prefer the existing pinned test-only CLI. If missing,
install a compatible pinned Artillery version under `.test-tools/artillery`
at the project root, not globally or in an application dependency tree. Verify
Node and package engine compatibility and use a test-only manifest and lockfile.
Before installing, ensure `.test-tools/artillery/` and `node_modules/` are
ignored by Git; add narrow ignore entries without changing tracked dependencies
or overriding existing rules. If this cannot be done safely, use a test-only
directory outside the project. Set `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1` during
installation. Set `ARTILLERY_DISABLE_TELEMETRY=1` for every Artillery command
and do not enable cloud recording or uploads. If the installed version does not
honor this setting, stop rather than silently sending telemetry. Restore
temporary environment changes. Do not install tools for status-only requests.

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

1. Verify service identity/readiness and use isolated data. For profiles with
   ensure checks, use a verified project runner that enforces the checks below,
   or copy `assets/run-artillery.cjs` from this skill into a test-only project
   directory and execute it with Node:

   `node <runner> <artillery-package-directory> <profile.yml> <new-run-directory>`

   The package directory is the `node_modules/artillery` directory of the
   selected local installation, not the `.bin` shim. The run-directory parent
   must already exist and the run directory must not exist. The runner accepts
   the profile's default configuration only; it does not support overrides,
   separate configuration files, or named environments. For other cases, adapt
   a test-only runner after verifying the installed version's effective
   configuration. Do not bypass the checks for an unsupported profile; record
   NOT RUN or INVALID instead.
2. Before traffic, the runner must verify that the effective profile explicitly
   enables `ensure`, that its plugin can load, and that at least one strict
   check is configured and not disabled. After traffic, it must verify fresh raw
   results and evidence for *every* configured check, including failures; return
   nonzero and record INVALID when checks or readable raw results are missing.
   Failed strict checks and a nonzero Artillery exit are FAIL. Preserve raw
   output, logs, and a machine-readable validation record. Review logs for
   secrets before sharing.
   Artillery versions may write JSON before evaluating `ensure`, so a missing
   check array in the native `results.json` is not proof of failure by itself:
   validate the actual check output for the installed version and save the
   verified checks in `verification.json`. Never claim PASS from exit code or
   HTTP counts alone. For unsupported formats or unverified effective
   configuration, fail closed. Profiles without verifiable thresholds must not
   be represented as passing a performance threshold.
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
5. Verify HTML/raw/log links belong to this run. Preserve archived run overviews
   during focused execution. Report scope, tool version, target without secrets,
   workload, real metrics/outcomes, and relative report path.
6. Distinguish test failure from HTML conversion failure. Retain partial raw
   results, clean up owned resources, and open the report only when requested.
7. Record each completed, failed, or blocked attempt and refresh the canonical
   dashboard using `test-status`. Report refresh failures separately.
