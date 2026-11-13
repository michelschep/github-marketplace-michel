# Michel's Copilot plugin marketplace

A public marketplace containing the `testing` plugin for GitHub Copilot.
It uses the Agent Plugins 1.0 format. Skills are portable; the testing agent
and other namespaced components are specific to Copilot and may not be
supported by every client.

## Install with Copilot CLI

```shell
copilot plugin marketplace add michelschep/github-marketplace-michel
copilot plugin marketplace browse michel-marketplace
copilot plugin install testing@michel-marketplace
```

For an existing installation, run `copilot plugin update testing@michel-marketplace`.
From the project you want to test, start a testing-focused session:

```shell
copilot --agent testing:testing
```

In an existing session, select the agent with `/agent testing:testing`. Ask it
to create or run Bruno or Artillery tests, run existing suites, or show recorded
Bruno results. The agent discovers the project's own tools, configuration,
targets, and test runners rather than assuming a particular application.

## Plugin contents

- `plugins/testing/plugin.json`: plugin metadata.
- `plugins/testing/com.github.copilot/agents/testing.agent.md`: testing agent.
- `plugins/testing/skills/`: skills for Bruno, Artillery, xUnit, desktop UI,
  Playwright, combined test runs, and recorded Bruno results.
- `plugins/testing/com.github.copilot/commands/`, `hooks/`, and `rules/`:
  placeholders for future Copilot-specific components.

The agent can create or change Bruno tests and Artillery profiles when requested.
Other test suites, including xUnit, are run-only. It may create test-only
support files and reports but must not modify application code or configuration
or xUnit test files and their project/fixture configuration. It inspects
existing runners before using them and stops if they require prohibited changes.
These are agent instructions, not a technical security boundary; review tool
permissions and proposed changes.

HTML test-status overviews use the shared
`plugins/testing/skills/test-all/assets/test-overview-template.html` layout for
both fresh runs and recorded results. Detailed native reports remain available
as links when produced.

To add an existing skill, copy its directory, including `SKILL.md` and any
supporting files, into `plugins/testing/skills/`. Ensure it respects the same
change boundary; review its instructions and dependencies before publishing it.
Add agents as `*.agent.md` files in
`plugins/testing/com.github.copilot/agents/`.

No runner, hooks, MCP servers, or LSP servers are included. When needed, add an
Agent Plugins MCP configuration at `plugins/testing/mcp.json` or Copilot-specific
hook and LSP configurations under `plugins/testing/com.github.copilot/`.
See the [plugin authoring guide](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/plugins-creating)
and [CLI plugin reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference)
for supported formats and locations.

Keep the plugin version in `plugin.json` and the marketplace catalog in sync
when publishing changes. Review all content before pushing: this repository is
public.
