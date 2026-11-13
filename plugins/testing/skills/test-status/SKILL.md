---
name: test-status
description: Show the overall HTML test status dashboard for all test types from existing recorded results, without running tests. Use when asked for the overall test status, test overview, or status page.
---

# Show the overall test status

Use this skill when the user asks to show, open, or view the overall test
status, dashboard, or overview. `/test-status` is also an explicit request to
show the overall status page. This is not a request to execute tests. If the
user explicitly asks for a fresh run, use `test-all` instead.

Never run tests, start services, call test APIs, install tools, or execute a
project runner to answer a status request or refresh the dashboard. Do not
modify application code, application configuration or dependencies, xUnit
tests or their project or fixture configuration, test sources, or archived raw
results. The managed dashboard is the only existing report this skill updates.

## Canonical dashboard

- Use the project's documented test-status dashboard if it is clearly a
  generated test artifact; otherwise use `test-results/index.html` at the
  project root. If that path exists but ownership or purpose is unclear, stop
  and ask before overwriting it. Do not create competing overview filenames.
- The dashboard is a latest-per-suite view: each suite shows its latest
  matching recorded attempt, with its own run time, run identifier, target or
  environment when known, outcome, and links. Runs may be from different times;
  explicitly label this, and never describe them as one simultaneous run.
- Each test execution skill refreshes this same page after recording its run,
  including failures and blocked attempts; `test-all` refreshes it after its
  execution. A status-only request reads or refreshes it from recorded evidence
  without running tests. Preserve separate per-run reports and raw evidence.
- Before refreshing after a run, write a test-only attempt record under
  `test-results/.testing-plugin/attempts/<run-id>/<suite-id>.json` unless the
  project has an equivalent discoverable record. Use unique, filesystem-safe
  identifiers. Record suite/category, technology, target/environment without
  secrets, run ID, scope, start/end timestamps, outcome and reason, counts when
  known, and project-relative artifact paths. Record blocked and failed attempts
  even when no raw report exists. Never invent PASS or fabricate counts. A
  status-only request must not create attempt records.
- Select the latest attempt, not the latest successful result. If a newer
  attempt failed, was blocked, or produced no readable results, show its
  failure, NOT RUN, ERROR, or UNKNOWN rather than substituting an older PASS.
  Do not treat a NOT SELECTED row in another run as a new suite execution.
- Serialize dashboard updates and replace the managed page safely, without
  truncating it on an error. If refresh fails, retain the previous page, report
  the refresh failure and do not claim the dashboard is current.

## Find the right evidence

1. Read the project's testing instructions and discover its configured test
   categories, suites, report locations, and runners without executing them.
   Always show rows for unit/integration, Bruno API, Artillery performance,
   native desktop UI, and Playwright browser UI, even if a category is absent;
   mark absent categories NOT CONFIGURED. Do not invent configured suites.
   Include other discovered categories under their actual names and technologies.
2. Locate attempt records, associated recorded summaries, and raw results.
   Include existing project reports predating this convention. For each suite,
   identify the latest matching attempt by scope, run identity, target, and
   recorded time, not simply the newest HTML file. If multiple targets are
   plausible and there is no documented default, ask which to show; do not
   silently combine results from different targets.
3. Read evidence using its actual schema. Preserve each suite's outcome, run
   identity, execution time, counts, duration, and relative artifact links.
   When only file modification time is available, label it as such. If report
   identity, freshness, or results cannot be verified, mark them UNKNOWN or
   STALE and explain why.
4. Include missing categories as NOT CONFIGURED and configured suites with no
   recorded execution as NOT RUN. Preserve recorded failures, errors, and skips. Never
   infer PASS from a missing result, a prior run, or a zero exit code alone.
   If there is no evidence, state that no results are available; do not run
   tests to obtain them.

## Show the page

1. Use the HTML template embedded below for the overview. It is included here
   so no access to a file outside the project is needed. Fill every placeholder
   using verified per-suite evidence and times. Escape dynamic text and
   attribute values.
   `SCOPE`, `TIMES`, and `OVERALL_STATUS` are text; `OVERALL_CLASS` is a fixed
   status class from the template. `ROWS` contains one row per suite, with a
   test-type row header, technology, status, a `metrics` list, duration, a
   Last run cell containing that suite's recorded time and run ID, and a
   `details` cell with relative links to existing artifacts. `NOTES` contains
   short paragraphs describing scope/status limitations; `SUMMARY_LINK` is an
   optional link to a verified machine-readable summary. Use `-` for missing
   values and omit unavailable links. Label the page as latest recorded results
   from potentially different runs. Every executed suite row must include its
   own recorded execution time and run ID in its Last run cell, not just in
   the page header; use UNKNOWN if unavailable. Explain missing or stale
   evidence. The overall banner must not
   imply a complete fresh pass when the evidence cannot establish one.
2. Read or refresh the canonical dashboard as described above; do not create a
   separate status page for each request. Verify every link is relative, exists,
   and belongs to that row's run. Escape dynamic HTML and do not execute report
   scripts to extract data.
3. Open the selected or generated local page in the default browser when the
   user asks to show/open the page or invokes `/test-status`. If launch is not
   supported or fails, report the verified path and the error instead of
   claiming it opened. If the user asks for a path only, do not open it.
4. Report the relative page path, per-suite run times, and any freshness or
   missing-evidence limitations. For status-only requests explicitly state:
   **No new run was performed.**

For detailed recorded Bruno scenarios, use `bruno-status`; it is not a
substitute for the overall dashboard.

## HTML template

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Test overview</title>
  <style>
    body{font:16px system-ui,sans-serif;background:#f4f6fa;color:#17233b;max-width:1600px;margin:40px auto;padding:0 24px}
    table{width:100%;border-collapse:collapse;background:white}
    th,td{text-align:left;padding:16px;border-bottom:1px solid #dfe4ed;vertical-align:top}
    thead{background:#e8edf5}
    .pass{color:#146c36;font-weight:bold}
    .fail,.error{color:#a32222;font-weight:bold}
    .not-run,.not-configured,.not-selected,.skipped,.unknown,.stale{color:#667085;white-space:nowrap}
    .banner{padding:18px;background:white;border-left:5px solid currentColor;margin:24px 0}
    a{color:#164fa4}
    small{color:#536079}
    .times{white-space:pre-line}
    .table-wrap{overflow-x:auto}
    .details{min-width:360px;white-space:nowrap}
    .metrics{list-style:none;margin:0;padding:0;display:grid;gap:6px;font-variant-numeric:tabular-nums}
  </style>
</head>
<body>
  <h1>Test overview</h1>
  <p>{{SCOPE}}</p>
  <p class="times">{{TIMES}}</p>
  <div class="banner {{OVERALL_CLASS}}">{{OVERALL_STATUS}}</div>
  <div class="table-wrap">
    <table>
      <thead>
        <tr><th>Test type</th><th>Technology</th><th>Status</th><th>Main results</th><th>Duration</th><th>Last run</th><th>Details</th></tr>
      </thead>
      <tbody>
        {{ROWS}}
      </tbody>
    </table>
  </div>
  {{NOTES}}
  {{SUMMARY_LINK}}
</body>
</html>
```
