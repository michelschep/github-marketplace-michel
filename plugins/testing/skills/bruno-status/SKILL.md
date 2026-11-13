---
name: bruno-status
description: Show a project's latest recorded Bruno results with actual collection ordering and numbering. Never rerun tests to answer a status request.
---

# Bruno test status

Read applicable repository instructions, including `AGENTS.md` when present,
and testing documentation. This is an overview of recorded results, not a new
test run. Do not change test sources, existing results, or the application;
generating a separate local status report is permitted.
Do not require a specific collection path, report location, or CLI version.
For an overall dashboard covering all test types, use `test-status` instead.

Never modify application code, configuration, dependencies, or behavior, or
create or modify xUnit tests or their project/fixture configuration. For an
explicit fresh run, inspect runners for prohibited persistent changes before use
and stop if they are required.

## Evidence

1. Discover the selected collection(s) from actual Bruno configuration and
   request files. Exclude environments and collection/folder metadata from request
   counts. Resolve multiple collections/environments from the requested scope and
   documented defaults; never silently pick the first match.
2. Locate recorded artifacts through project documentation, runner output paths,
   manifests, and existing results. Identify the newest matching run by recorded
   run time and collection/environment, not simply the newest unrelated file.
   If no collection exists, report NOT CONFIGURED without creating anything.
3. Prefer matching machine-readable JSON. Detect the actual schema before
   reading results. If only HTML exists, inspect its format without executing it:
   when it contains `JSON.parse(decodeBase64('...'))`, decode that payload locally
   as UTF-8 JSON. Other formats need their own verified parser. Do not execute
   HTML/JavaScript, fetch external scripts, install tools, or run requests.
4. Read recorded execution time/environment when present (for example
   `runCompletionTime` and `environment`). If only file modification time is
   available, label it as such, not an exact execution time. If identity cannot
   be established, say so rather than presenting unrelated evidence.
5. Normalize recorded request paths against the collection. Inspect statuses,
   errors, assertions, and every pre/post-response/script test result using the
   detected schema. Account for all iterations. A request is PASS only when all
   its recorded executions/checks passed; HTTP status alone is insufficient.
6. Keep failures, errors, skips, and UNKNOWN results distinct. A current request
   without a recorded result is NOT RUN. Label recorded results STALE when files
   changed afterward; disclose incomplete freshness evidence. Mention removed
   requests/report-only entries separately.
7. Missing, unreadable, or unsupported report formats must be stated plainly.
   List current requests as UNKNOWN/NOT RUN as appropriate. Never fill gaps from
   conversation memory or execute tests to obtain a convenient answer.

## Output

- Write in English.
- Start with **Latest recorded run**, its time and environment when available.
- Display a table with columns **Bruno number**, **Test**, and **Status**.
- Preserve actual folder/request numeric prefixes and sequence (`meta.seq` where
  used), not report traversal order. Use actual filenames for labels; do not
  invent numbering for unnumbered collections. Identify collections separately
  when reporting several.
- Summarize requests, scripted tests, and assertions separately. Count recorded
  checks from the report rather than hard-coding the current totals. If multiple
  iterations exist, distinguish unique requests from request executions.
- For failures, include the failing check's description and error without
  printing tokens, authorization headers, or unrelated request/response data.
- Finish with the relative report path and explicitly state:
  **No new run was performed.**
- For an HTML test-status overview, use the `test-all` skill's
  `assets/test-overview-template.html` and its rendering instructions. Label it
  as recorded, include the recorded time and freshness, and link only verified
  artifacts from that run. Preserve existing reports; do not generate fresh
  results by running tests. A detailed scenario table may supplement the overview.

## Explicit requests to rerun or open results

Only rerun when the user explicitly requests a fresh run. Follow `test-bruno`
using that repository's discovered runner/collection/environment/target.

Check the CLI exit code and report generation before describing the new run.
If the run fails, report its real outcome; do not present an older report as new.
For a fresh run, replace "No new run was performed" with an explicit statement
that these are newly executed results.

Only open the HTML report in the browser when requested. A generated report is
not Bruno Desktop run history and does not automatically appear in its GUI.
