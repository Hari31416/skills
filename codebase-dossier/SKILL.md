---
name: codebase-dossier
description: Create a comprehensive multi-file Markdown dossier for agentic AI codebases, especially projects with a Python backend, TypeScript/Vite frontend, and self-hosted or on-prem infrastructure. Use this skill whenever the user asks for a codebase understanding report, architecture dossier, interview preparation guide, onboarding report, technical deep dive, or explanation of what is unique, impressive, or novel in an AI product codebase.
---

# Codebase Interview Dossier

## Goal

Create a comprehensive Markdown dossier that helps a technical reader understand an agentic AI codebase deeply enough to answer interview, design review, onboarding, or architecture questions.

The dossier should explain what the system does, how it is built, how data and control flow through it, what engineering decisions are distinctive, and how to discuss those choices clearly.

## Default Output

Create a folder named `codebase-dossier/` unless the user gives another path.

The folder must contain these files:

```text
codebase-dossier/
├── Makefile
├── mkdocs-dossier.yml
└── src/
    ├── index.md
    ├── 00-evidence-map.md
    ├── 01-product-and-system-overview.md
    ├── 02-agentic-ai-architecture.md
    ├── 03-backend-deep-dive.md
    ├── 04-frontend-deep-dive.md
    ├── 05-data-model-and-storage.md
    ├── 06-infra-and-local-ops.md
    ├── 07-security-and-safety.md
    ├── 08-testing-and-quality.md
    ├── 09-unique-engineering-highlights.md
    ├── 10-interview-prep.md
    └── 11-open-questions-and-risks.md
```

If the codebase is small, keep the files concise. If the codebase is large, expand each file enough to be useful without turning it into a raw file listing.

## Workflow

### 1. Inspect before writing

Start by reading the repository. Prefer fast targeted inspection:

- Source tree: `rg --files`, excluding generated/vendor/build directories.
- Project manifests: `pyproject.toml`, `package.json`, lockfiles, `vite.config.*`, `tsconfig*.json`.
- Runtime and infra: `docker-compose*.yml`, `Dockerfile*`, `.env.example`, `justfile`, `Makefile`, deployment manifests.
- Backend entrypoints: app factories, routers, dependency injection, settings, schemas, services, repositories, jobs, tests.
- Frontend entrypoints: `src/main.*`, `src/App.*`, routes, stores, API clients, streaming clients, components, tests.
- Agentic AI implementation: graph definitions, agent loops, prompts, tools, subagents, memory/state, checkpointing, model providers, streaming events, sandbox or code execution layers.
- Data model: ORM models, migrations, repositories, SQL, schemas, object storage paths, cache usage.
- Existing docs: README files, architecture docs, API docs, plans, ADRs.

Do not ask the user where things are if the repository can answer that. Ask only when the requested audience, output path, or scope is ambiguous and the decision would materially change the report.

### 2. Prefer evidence over assumptions

Base claims on code, config, tests, or docs. Use file references where they help the reader verify important claims.

Use relative file paths when linking to repository files. Do not use absolute machine paths in the dossier. Prefer paths relative to the repository root, such as `backend/app/main.py`, `frontend/src/App.tsx`, or `docker-compose.yml`.

When evidence is incomplete, say so explicitly:

- `Confirmed:` for facts directly supported by code or docs.
- `Inferred:` for reasonable conclusions based on naming, structure, or partial flows.
- `Unknown:` for important areas that could not be verified.

Avoid presenting framework defaults as project-specific innovation. Separate ordinary plumbing from decisions that are genuinely distinctive.

### 3. Build a system model

Before writing the final files, form a concise model of:

- Product purpose and main user workflows.
- Major runtime components and their responsibilities.
- Request, agent, data, artifact, and streaming flows.
- Persistence boundaries and storage ownership.
- Security and safety boundaries.
- Local development and deployment topology.
- Testing strategy and quality signals.
- The most novel or interview-worthy engineering work.

Use Mermaid diagrams as a core part of the dossier, not as decoration. Create diagrams when they make architecture, control flow, data flow, data model, deployment, or agent orchestration easier to explain. Keep diagrams readable and avoid sprawling graphs.

### 4. Create explanatory Mermaid diagrams

Include Mermaid diagrams wherever they materially improve understanding. Prefer smaller focused diagrams over one large overloaded diagram.

Use these diagram types when supported by the codebase:

- `flowchart` for high-level architecture, service topology, tool execution, and component responsibilities.
- `sequenceDiagram` for request lifecycles, streaming flows, agent/tool interactions, auth flows, file upload/download, and background jobs.
- `erDiagram` for database entities, domain models, ownership, and relationships.
- `stateDiagram-v2` for run lifecycle, agent states, job states, or sandbox/session states.
- `C4Context` or `C4Container` only when the Markdown renderer is known to support Mermaid C4 syntax. Otherwise use `flowchart`.

Every diagram should have:

- A short title before the Mermaid block.
- A one-paragraph explanation after the diagram.
- Names that match the codebase vocabulary.
- Only relationships that are evidenced by code, config, or docs.
- A note when the diagram contains inferred relationships.

Avoid diagrams that merely restate a folder tree. Use diagrams to explain runtime behavior, ownership, dependencies, or tradeoffs.

### 5. Write the dossier

Each file should be useful on its own and linked from `index.md`. Prefer clear explanations, tables, diagrams, and interview-oriented summaries.

Do not write a generic essay. Tie every section to the inspected codebase.

### 6. Create a MkDocs site for the dossier

After writing the Markdown notes inside the `src/` directory, create `mkdocs-dossier.yml` and a `Makefile` in the `codebase-dossier/` folder so the dossier can be served as a browsable documentation site, consolidated dynamically into a single Markdown file, and exported as a high-quality PDF.

Use `docs_dir: src` because the dossier Markdown files live inside the `src/` directory. Use a build output directory such as `site_dir: site-dossier` so generated files do not mix with the source notes.

Configure MkDocs to support:

- Syntax highlighting for fenced code blocks.
- Tables, nested lists, and math equations.
- Mermaid charts through `pymdownx.superfences` custom fences.
- Print site layout for browser preview and print styling.

Start from this `mkdocs-dossier.yml` shape and update the nav, site_name and any other tweaks.

```yaml
site_name: Codebase Interview Dossier
site_description: Technical onboarding dossier for the platform.
docs_dir: src
site_dir: site-dossier

theme:
  name: material
  palette:
    - media: "(prefers-color-scheme: light)"
      scheme: default
      primary: indigo
      accent: indigo
      toggle:
        icon: material/brightness-7
        name: Switch to dark mode
    - media: "(prefers-color-scheme: dark)"
      scheme: slate
      primary: indigo
      accent: indigo
      toggle:
        icon: material/brightness-4
        name: Switch to light mode
  features:
    - navigation.tabs
    - navigation.sections
    - navigation.expand
    - navigation.top
    - search.suggest
    - search.highlight
    - content.code.copy
    - content.code.annotate

extra_javascript:
  - javascripts/mathjax.js
  - https://unpkg.com/mathjax@3/es5/tex-mml-chtml.js

markdown_extensions:
  - pymdownx.highlight:
      anchor_linenums: true
  - pymdownx.inlinehilite
  - pymdownx.snippets
  - pymdownx.superfences:
      custom_fences:
        - name: mermaid
          class: mermaid
          format: !!python/name:pymdownx.superfences.fence_code_format
  - pymdownx.tabbed:
      alternate_style: true
  - pymdownx.details
  - pymdownx.magiclink
  - pymdownx.tasklist:
      custom_checkbox: true
  - admonition
  - attr_list
  - md_in_html
  - tables
  - toc:
      permalink: true
  - pymdownx.arithmatex:
      generic: true

plugins:
  - search
  - print-site:
      add_to_navigation: true
      print_page_title: "Consolidated Dossier (Print to PDF)"

nav:
  - Welcome: index.md
  - Dossier Chapters:
      - "00. Evidence Map": 00-evidence-map.md
      - "01. Product & System Overview": 01-product-and-system-overview.md
      - "02. Agentic AI Architecture": 02-agentic-ai-architecture.md
      - "03. Backend Deep Dive": 03-backend-deep-dive.md
      - "04. Frontend Deep Dive": 04-frontend-deep-dive.md
      - "05. Data Model & Storage": 05-data-model-and-storage.md
      - "06. Infra & Local Ops": 06-infra-and-local-ops.md
      - "07. Security & Safety": 07-security-and-safety.md
      - "08. Testing & Quality": 08-testing-and-quality.md
      - "09. Unique Engineering Highlights": 09-unique-engineering-highlights.md
      - "10. Interview Prep Guide": 10-interview-prep.md
      - "11. Risks & Next Steps": 11-open-questions-and-risks.md
```

Create a **`Makefile`** in the `codebase-dossier/` directory that orchestrates dependency tracking, consolidation of individual chapter markdown files, high-resolution Mermaid graphics parsing via Chrome, and LaTeX-level hacks to prevent column wrapping overlaps in PDFs:

```makefile
.PHONY: setup serve build clean pdf consolidate

# Using uv to run mkdocs with required plugins dynamically in an isolated Python 3.12 environment.
UV_RUN := uv run --python 3.12 --with mkdocs --with mkdocs-material --with pymdown-extensions --with mkdocs-print-site-plugin

setup:
 @echo "Checking for uv..."
 @command -v uv >/dev/null 2>&1 || (echo "Error: uv is not installed. Please install uv first." && exit 1)
 @echo "uv is available."

serve: setup
 $(UV_RUN) mkdocs serve -f ./mkdocs-dossier.yml

build: setup
 $(UV_RUN) mkdocs build -f ./mkdocs-dossier.yml

clean:
 rm -rf ./site-dossier consolidated_dossier.md consolidated_dossier.pdf mermaid-filter.err

consolidated_dossier.md: src/index.md \
                         src/00-evidence-map.md \
                         src/01-product-and-system-overview.md \
                         src/02-agentic-ai-architecture.md \
                         src/03-backend-deep-dive.md \
                         src/04-frontend-deep-dive.md \
                         src/05-data-model-and-storage.md \
                         src/06-infra-and-local-ops.md \
                         src/07-security-and-safety.md \
                         src/08-testing-and-quality.md \
                         src/09-unique-engineering-highlights.md \
                         src/10-interview-prep.md \
                         src/11-open-questions-and-risks.md
 @echo "Consolidating src markdown files into consolidated_dossier.md..."
 cat src/index.md > consolidated_dossier.md
 @for f in 00-evidence-map.md \
           01-product-and-system-overview.md \
           02-agentic-ai-architecture.md \
           03-backend-deep-dive.md \
           04-frontend-deep-dive.md \
           05-data-model-and-storage.md \
           06-infra-and-local-ops.md \
           07-security-and-safety.md \
           08-testing-and-quality.md \
           09-unique-engineering-highlights.md \
           10-interview-prep.md \
           11-open-questions-and-risks.md; do \
  echo "" >> consolidated_dossier.md; \
  echo "---" >> consolidated_dossier.md; \
  echo "" >> consolidated_dossier.md; \
  cat src/$$f >> consolidated_dossier.md; \
 done
 @echo "Consolidation complete."

consolidate: consolidated_dossier.md

pdf: consolidated_dossier.md
 PUPPETEER_EXECUTABLE_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
 MERMAID_FILTER_SCALE=3 \
 pandoc consolidated_dossier.md -o consolidated_dossier.pdf \
  --toc \
  --pdf-engine=xelatex \
  -V mainfont="Arial" \
  -V monofont="Menlo" \
  -V geometry:margin=1in \
  --filter mermaid-filter \
  -V header-includes="\usepackage[htt]{hyphenat}\setlength{\tabcolsep}{4pt}\let\oldlongtable\longtable\let\endoldlongtable\endlongtable\renewenvironment{longtable}[2][]{\small\oldlongtable[#1]{#2}}{\endoldlongtable}"
 @rm -f mermaid-filter.err
```

> You might need to chnages `consolidated_dossier.md` command if there are different naming conventions than used in the codebase for the md files.
> You can also have a look at files in `scipts` folder for ready made `mkdocs-dossier.yml`, makefile and other commands, but dont copy blindly. Make sure to update them based on the codebase structure and requirements.

## File Templates

### `mkdocs-dossier.yml`

Create a MkDocs configuration that treats the `src/` folder as the docs directory, lists every chapter in `nav` inside sequential hierarchy, enables tables, math equations, details blocks, custom syntax highlighting, and Mermaid rendering via superfences.

### `Makefile`

Create a standard Unix Makefile that defines the targets `setup`, `serve`, `build`, `clean`, `consolidate` (which builds `consolidated_dossier.md` on demand from `src/` inputs), and `pdf` (which compiles `consolidated_dossier.pdf` with high-density vector diagrams and hyphenation wrap/global scale corrections for table formatting).

### `index.md`

Include:

- Title and timestamp or repository name when available.
- Reading order.
- MkDocs local preview and PDF export commands.
- Executive summary.
- System map with a compact Mermaid diagram.
- Links to the most important architecture, data-flow, data-model, and deployment diagrams in the dossier.
- Top 10 things to know.
- Most impressive or unique engineering work.
- Report coverage table linking every dossier file.
- Open questions and verification gaps.

### `00-evidence-map.md`

Include:

- Repository areas inspected.
- Key source files, manifests, docs, tests, and infra files used as evidence.
- Important commands run during inspection.
- Areas intentionally skipped, such as generated files, vendored code, build output, or dependency folders.
- Confirmed facts, inferred facts, and unknowns.
- A short confidence assessment for each major subsystem.

### `01-product-and-system-overview.md`

Include:

- What the product appears to do.
- Primary users and workflows.
- Major subsystems and responsibilities.
- High-level architecture diagram.
- Request-to-result sequence diagram when the product has a clear primary workflow.
- Key technical bets and tradeoffs.
- What to say in an interview when asked, "What did you build?"

### `02-agentic-ai-architecture.md`

Include:

- Agent loop and orchestration model.
- Model provider boundaries.
- Prompts and templates.
- Tools and tool execution flow.
- Subagents, specialist agents, or graph nodes if present.
- Mermaid diagram of the agent orchestration model.
- Mermaid sequence diagram for a representative user request through model/tool execution.
- Memory, state, checkpoints, run lifecycle, and resumability.
- State diagram for run, job, or agent lifecycle when those states are explicit in code.
- Streaming, trace, or event emission behavior.
- Human-in-the-loop behavior if present.
- Failure handling, retries, validation, and guardrails.
- Interview Q&A for agent architecture decisions.

### `03-backend-deep-dive.md`

Include:

- Python backend layout and entrypoints.
- API routing and request lifecycle.
- Service, repository, domain, and schema boundaries.
- Async behavior and concurrency model.
- Auth, permissions, validation, and configuration.
- Background jobs, queues, streaming, or realtime APIs.
- Error handling and logging.
- Notable backend implementation choices.
- Backend interview questions and answers.

### `04-frontend-deep-dive.md`

Include:

- TypeScript/Vite app structure and entrypoints.
- Routing and page layout.
- State management and server-state strategy.
- API client and streaming client behavior.
- Component system, design system, and UI composition.
- Chat, artifact, file, trace, or debugging UI if present.
- Loading, error, empty, and optimistic states.
- Type safety and build quality.
- Frontend interview questions and answers.

### `05-data-model-and-storage.md`

Include:

- Core domain entities and relationships.
- Database schema, migrations, ORM models, and repositories.
- Object storage layout and artifact lifecycle.
- Cache, pub/sub, or queue storage usage.
- File upload/download/export flows.
- Mermaid ER or data-flow diagrams.
- Mermaid data-flow diagram for artifact/file lifecycle when object storage or generated assets are present.
- Data consistency and idempotency patterns.
- Data-model interview questions and answers.

### `06-infra-and-local-ops.md`

Include:

- Local development commands.
- Docker Compose or on-prem service topology.
- Mermaid deployment/topology diagram for local or self-hosted infrastructure.
- Environment variables and config loading.
- Networking, ports, volumes, and service dependencies.
- Startup, shutdown, migration, and health-check flows.
- Secrets handling.
- Observability, logs, debugging, and operational runbooks.
- Infra interview questions and answers.

### `07-security-and-safety.md`

Include:

- Authentication and authorization.
- Tenant, user, or workspace isolation.
- Sandbox, code execution, or tool safety.
- Input validation and file handling.
- Secret management.
- Model/tool safety boundaries.
- Audit logging and traceability.
- Known gaps, risks, and hardening opportunities.
- Security interview questions and answers.

### `08-testing-and-quality.md`

Include:

- Test layout and test commands.
- Backend unit/integration coverage.
- Frontend type checks, builds, and UI tests.
- Agent/tool/sandbox tests if present.
- Fixtures, mocks, factories, and test data.
- CI or local quality gates.
- What is well-tested and what remains risky.
- Quality interview questions and answers.

### `09-unique-engineering-highlights.md`

Focus this file on what is new, exciting, distinctive, or unusually well-engineered.

For each highlight, include:

- Name of the highlight.
- What problem it solves.
- How it works.
- Why it is technically interesting.
- Tradeoffs and alternatives.
- Evidence from code/docs.
- How to explain it in an interview.

Prefer 5 to 10 strong highlights over a long list of ordinary features.

### `10-interview-prep.md`

Include:

- A 2-minute architecture explanation script.
- A deeper 5-minute architecture explanation script.
- Likely system design questions.
- Likely backend questions.
- Likely frontend questions.
- Likely infra/security questions.
- Likely data/agent questions.
- STAR-style project stories.
- Weak spots to acknowledge honestly.
- Short answers for "What was hard?", "What would you improve?", and "What are you proud of?"

### `11-open-questions-and-risks.md`

Include:

- Architecture questions that remain unanswered after inspection.
- Missing or unclear implementation details.
- Security, reliability, scalability, and operability risks.
- Testing and documentation gaps.
- Product or UX assumptions that the code does not fully explain.
- Questions to ask the team or original authors.
- Practical next steps to reduce the highest-priority risks.

## Quality Bar

The dossier is successful when a reader can:

- Explain the product and architecture without opening the code.
- Navigate the repository quickly when asked for implementation details.
- Describe the agentic AI flow from user request to model/tool execution to persisted artifacts.
- Explain backend, frontend, data, infra, security, and testing choices.
- Use diagrams to explain architecture, data flow, data model, infra topology, and agent orchestration without relying only on prose.
- Identify the most impressive engineering work and defend why it matters.
- Answer likely technical interview questions with specific examples from the codebase.

## Style Guide

- Write in clear technical prose.
- Keep paragraphs short.
- Use tables for comparisons, responsibilities, commands, and tradeoffs.
- Use Mermaid for system, sequence, ER/data-model, state, deployment, and agent orchestration diagrams when useful.
- Include file references for important evidence.
- Always use repository-relative file paths for links and evidence references.
- Create `mkdocs.yml` and `requirements-mkdocs.txt` so the dossier can be hosted locally and exported as PDF.
- Avoid filler and marketing language.
- Avoid unsupported claims.
- Mark uncertainty instead of hiding it.
- Do not paste large code blocks unless a short excerpt is essential.

## Final Response

After creating the dossier, summarize:

- Output folder path.
- The most important files to read first.
- How to preview the MkDocs site and export the PDF.
- Any major areas where evidence was incomplete.
- Any commands or tests you ran to validate the report generation.
