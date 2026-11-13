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
project runner to answer a status request. Do not modify application code,
application configuration or dependencies, xUnit tests or their project or
fixture configuration, other test sources, or existing results. You may create
a separate local HTML status page from recorded evidence.

## Find the right evidence

1. Read the project's testing instructions and discover its configured test
   categories, suites, report locations, and runners without executing them.
   Always show rows for unit/integration, Bruno API, Artillery performance,
   native desktop UI, and Playwright browser UI, even if a category is absent;
   mark absent categories NOT CONFIGURED. Do not invent configured suites.
   Include other discovered categories under their actual names and technologies.
2. Locate the project's existing overall dashboard and associated recorded
   summary or raw results. Identify the most recent matching **overall run**
   by its scope, run identity, and recorded time, not by the newest HTML file.
   A focused or partial run is not an overall run. If there are multiple
   plausible overall runs or targets and no documented default, ask which to
   show. If only focused runs exist, clearly label their scope; do not present
   one as a complete overall run or merge separate runs as if simultaneous.
3. Read the evidence using its actual schema. Preserve suite-level outcome,
   execution time, counts, duration, and relative artifact links. Identify
   later focused runs separately if relevant; do not replace the overall run's
   rows with their results. When only file modification time is available, label
   it as such. If report identity, freshness, or results cannot be verified,
   mark them UNKNOWN or STALE and explain why.
4. Include configured suites not selected for the chosen run as NOT SELECTED,
   missing categories as NOT CONFIGURED, and configured suites with no recorded
   execution as NOT RUN. Preserve recorded failures, errors, and skips. Never
   infer PASS from a missing result, a prior run, or a zero exit code alone.
   If there is no evidence, state that no results are available; do not run
   tests to obtain them.

## Show the page

1. Use the HTML template embedded below for the overview. It is included here
   so no access to a file outside the project is needed. Fill every placeholder
   using only the identified run's verified
   data, scope and recorded time. Escape dynamic text and attribute values.
   `SCOPE`, `TIMES`, and `OVERALL_STATUS` are text; `OVERALL_CLASS` is a fixed
   status class from the template. `ROWS` contains one row per suite, with a
   test-type row header, technology, status, a `metrics` list, duration, and a
   `details` cell with relative links to existing artifacts. `NOTES` contains
   short paragraphs describing scope/status limitations; `SUMMARY_LINK` is an
   optional link to a verified machine-readable summary. Use `-` for missing
   values and omit unavailable links. Label the page **Recorded results — no
   new run was performed**. Explain missing or stale evidence and ensure the
   overall banner does not imply a fresh or complete pass when the evidence
   cannot establish one.
2. Reuse an existing dashboard only if it has the required layout, accurately
   represents the selected run, and clearly says that the results are recorded
   and no new run was performed. Otherwise write a separate status page in the
   project's test artifact location, or an appropriate local results directory;
   do not overwrite existing reports. Use unique names if necessary. Verify
   every link is relative, exists, and belongs to the reported run. Escape
   dynamic HTML and do not execute report scripts to extract data.
3. Open the selected or generated local page in the default browser when the
   user asks to show/open the page or invokes `/test-status`. If launch is not
   supported or fails, report the verified path and the error instead of
   claiming it opened. If the user asks for a path only, do not open it.
4. Report the relative page path, selected run scope and recorded time, any
   freshness or missing-evidence limitations, and explicitly state:
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
        <tr><th>Test type</th><th>Technology</th><th>Status</th><th>Main results</th><th>Duration</th><th>Details</th></tr>
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
