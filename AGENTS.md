# Working rules

- Read only files needed for the current task; use targeted `rg` searches and bounded file reads.
- Make small, focused patches and reuse existing dependencies and patterns.
- Do not reread unchanged files or print large generated files, dependency trees, or secrets.
- Run the narrowest relevant checks, then the project build or full test suite when needed.
- Keep summaries concise and report exact checks and unresolved risks.
- Never weaken security to save tokens; never copy credentials into source, tests, logs, or documentation.

