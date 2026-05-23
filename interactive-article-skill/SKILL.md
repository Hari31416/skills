---
name: interactive-article-skill
description: Create polished, single-page technical HTML articles that teach topics through fully functional interactive web components. Use this whenever the user asks for an HTML technical guide, explainer, tutorial, article, visual walkthrough, interactive documentation page, or any request to explain engineering topics via an interactive webpage. Apply this skill even if the user does not explicitly mention "HTML skill" but asks for a standalone educational web page.
---

# HTML Interactive Article Skill

## Goal

Produce a premium, distraction-free, single-page HTML article that explains technical topics with concise prose, strong structure, and real interactive learning elements.

## Bundled Resources

Before generating output, familiarize yourself with these bundled files in `./assets/`:

- `./assets/template.html` — base page structure boilerplate
- `./assets/base.css` — centralized layout, typography system, and base component styles
- `./assets/base.js` — copy-button behavior for code blocks
- `./assets/components/` — optional per-component CSS and JS files

## Fast Bootstrap (Recommended)

Use this script to copy the base article files into a working directory:

```bash
python <skill-path>/scripts/bootstrap_article_files.py <target-dir> --article-file <topic>.html
```

To include interactive components, add `--components`:

```bash
python <skill-path>/scripts/bootstrap_article_files.py <target-dir> --article-file <topic>.html \
  --components quiz stepper
```

Available components: `flashcard`, `quiz`, `stepper`, `comparison-slider`, `comparison-tabs`, `primitives`

Use `--components all` to include everything.

> Note: Create a new directory per article to avoid confusion. Example: `kafka-rebalance-article/`.

## Creating a Standalone Single-File HTML

When the article is complete, produce a portable single-file HTML with all CSS and JS inlined:

```bash
python <skill-path>/scripts/merge_standalone_html.py <input-html> --output <output-html>
```

The merge script walks all `<link>` and `<script>` tags referencing local files (including component files) and inlines them automatically. No extra steps needed.

## Trigger Guidance

Use this skill when the user asks for:

- A technical article, guide, or tutorial as HTML
- A topic explained through interactive web UI
- A visual or simulation-based explanation of system behavior
- A polished standalone documentation page (not a full site)
- Developer education content with runnable UI interactions

## Article Specification & Design Philosophy

When requested to produce a single-page HTML article, the target deliverable is a **distraction-free, pure reading document** that feels premium, crisp, and beautifully typeset.

### 1. Architectural Philosophy & Layout

- **No Site Navigation Banners:** Do not wrap the article in fake blog/website headers, logo navigation bars, or top categories.
- **No Sidebars:** Avoid injecting right or left sidebars containing related links, tags, or platform ads.
- **Centered Reading Measure:** Wrap the entire content in a clean central layout container restricted to an optimal horizontal reading measure (e.g., `max-width: 760px`).
- **Minimal Header Metadata:** Begin directly with the core document `<header>` containing a single `<h1 class="article-title">`. Omit author profiles, read-time estimates, and published dates unless explicitly requested.

### 2. Typography & Styling Rules

- **Fonts:** Premium Google Fonts are imported via document `<head>`:
  - **Body Text:** `Inter` (Weights: 400, 500, 600, 700)
  - **Headings:** `Outfit` (Weights: 500, 600, 700, 800)
  - **Code/Monospace:** `Fira Code` (Weights: 400, 500)
- **Shared Base Stylesheet (`base.css`):** All foundational variables, typography rules, responsive layout measures, and standard component modules (Table of Contents, callouts, code blocks) are centralized in `./base.css`. Always reference it via `<link rel="stylesheet" href="./base.css" />`. Component CSS files are linked separately only when that component is used in the article.
- **Bold Text Rendering:** Use standard HTML `<strong>` tags for bold inline highlights. Never leak markdown asterisks (`**bold**`) into the HTML source.

### 3. Research & Technical Foundation

- **Research-First Approach:** Always conduct targeted web research and consult active API documentation prior to authoring. Avoid writing code or explanations based on outdated patterns or "general knowledge."
- **Codebase Auditing:** If generating an article based on a specific repository, read the codebase thoroughly to understand implementation details before writing.
- **Fact-Checking Primitives:** Ensure internal system mechanics (handshakes, state transitions, constraints) are described with 100% accuracy.

### 4. Language, Tone & Editorial Voice

The article's voice must be spartan, informative, and authoritative. Use clear, simple language and follow these strict editorial rules:

- **Direct Address:** Use "you" and "your" to directly address the reader.
- **Support with Data:** Use data and concrete examples to support claims. Avoid generalizations, metaphors, and clichés.
- **Punctuation Constraints:** Use only commas, periods, or other standard punctuation. Never use em dashes (—) or semicolons. If you need to connect ideas, use a period.
- **Eliminate Complex Constructions:** Avoid "not just X, but also Y" patterns. State concepts affirmatively and directly.
- **Banned Words & Filler:** Do not use: _comprehensive, robust, seamless, delve, unlock, leverage, landscape, empowers, or transformative._
- **No Setup Language:** Do not use "in conclusion" or "in closing."
- **Clean HTML Output:** No markdown, asterisks, or literal formatting symbols in the final HTML. Use `<strong>`, `<em>` for emphasis.
- **Brevity & Sentence Structure:** Keep sentences short and highly scannable. Break long multi-clause blocks into independent thoughts.
- **No Fluff:** Remove any content that does not directly advance the reader's understanding of the technical subject matter.
- **Avoid Excessive Use of Horizontal Rules:** Do not use horizontal rules (`<hr>`) or similar elements to separate sections. Use semantic HTML tags like `<section>` and `<article>` to create a well-structured document.

## Required Output Contract & Hard Constraints

Always deliver a single-page HTML document that adheres to these absolute constraints:

1. Uses `template.html` as the baseline.
2. References shared assets via external links:
   - `<link rel="stylesheet" href="./base.css" />`
   - `<script src="./base.js"></script>`
   - Additional `<link>` and `<script>` tags for each component used.
3. Keeps a centered reading layout. No fake product chrome (no site navigation banners, sidebars, ads, branding strips, or dashboard filler).
4. Includes exactly one primary title `<h1 class="article-title">` inside the document `<header>`.
5. Includes a collapsible table of contents using semantic `<details>` + nested lists mapping heading anchor IDs.
6. Uses `.code-container` blocks with `.code-header`, `.code-label`, and `.copy-btn`.
7. Uses `<strong>` tags for bold emphasis (never markdown `**bold**` in HTML text).
8. **Zero Mock Elements:** No decorative placeholders, dummy controls, or non-functional "mock" widgets. Every UI control must be fully wired and functional end-to-end.
9. Do not duplicate base typography/layout styles inline when `base.css` already defines them.

## Interactive Component Rules

Articles that feature embedded JavaScript widgets must adhere to these rules:

- **Granular Contextual Placement:** Prefer multiple smaller, targeted interactive widgets placed contextually alongside the concepts they explain, rather than one large monolithic simulation at the end.
- **100% Active Functional Scope:** Every interface action, status badge, data visualization panel, form input, or dynamic counter must be fully interactive and wired to robust Vanilla JavaScript event logic.
- **State Management & Direct DOM Manipulation:** Keep script logic self-contained. Maintain a local state object per widget. Build intuitive interactive logic loops: user trigger → state update → DOM update.
- **Event Binding & Reactivity:** Bind explicit event listeners for each control. Re-render all dependent UI elements on state change.
- **Visible Transitions:** Reflect state transitions visibly (status text, counters, highlighted steps, diagrams, etc.).
- **Simulator Formula Transparency:** Every widget that derives output values from a formula (e.g. a slider that computes estimated recall, latency, throughput, or memory from a numeric input) **must** include a collapsible `<details class="formula-details">` block immediately below the widget output area. The block must:
  1. Use `<summary class="formula-summary">How are these values calculated?</summary>` as the toggle label.
  2. Show each derived metric with a short plain-English description of the model, followed by the exact formula in a `.code-container` code block.
  3. End with a one-sentence disclaimer stating the assumptions behind the approximation (dataset size, hardware, implementation used).
  This makes the simulation educational rather than decorative — the reader can inspect the model and decide whether it applies to their situation.

## Component Usage Gate

**Default position: do not include a component.** Only add a component when it passes the gate below. If you cannot articulate a concrete learning benefit in one sentence, skip it.

### Flashcards
- **Use** when the article introduces 4+ discrete terms, constants, or constraints that the reader needs to memorize (e.g., Kafka config knobs, HTTP status codes, algorithm parameters).
- **Skip** when there are fewer than 4 items, when the terms are trivially obvious from context, or when a simple `<ul>` list communicates the same information equally well.

### Quizzes
- **Use** when a section makes a non-obvious claim or teaches a decision rule that the reader could easily get wrong (e.g., "which isolation level prevents phantom reads?"). The correct answer must not be trivially deducible from the question alone.
- **Skip** when the answer is obvious from surrounding prose, when the section is introductory/definitional, or when the question would feel patronizing to a technical reader.

### Steppers
- **Use** when explaining a strict sequential protocol, handshake, or algorithm where each step has a distinct precondition and outcome, and the order is non-trivial (e.g., TLS handshake, Raft leader election, 2PC commit flow).
- **Skip** when the "steps" are just a numbered list of independent tips, configuration options, or bullet points repackaged as slides. If the content reads fine as a `<ol>`, use `<ol>`.

### Comparison Slider / Tabs
- **Use** when the article contrasts two concrete states, configurations, or code paths where seeing both side-by-side materially aids understanding (e.g., optimized vs. naive query plan, before/after architecture diagram).
- **Skip** when the comparison is qualitative ("faster" vs. "slower"), when one option is obviously better, or when a simple prose paragraph or table communicates the contrast clearly.

### Primitives (Range Sliders)
- **Use** only when a numeric parameter has a non-linear or non-obvious impact on a measurable outcome, and the widget computes and displays that outcome in real time (e.g., adjusting `efSearch` and seeing estimated recall change, tuning batch size and seeing throughput).
- **Skip** when the slider output is a static label or decorative counter that doesn't compute anything meaningful. A slider that just changes a displayed number with no derived result is always wrong.

## Workflow

1. Read `template.html`, `base.css`, and `base.js` before writing.
   - Prefer bootstrapping with `./scripts/bootstrap_article_files.py`.
   - Decide which components you need and pass them via `--components`.
   - Read `./docs/components.md` if using any interactive components.
2. Build an article outline with teaching flow:
   - Core concept → Internal mechanics → Tradeoffs and edge cases → Production considerations
3. Implement the page from the template, preserving semantic HTML and class naming conventions.
4. Add high-signal visuals:
   - Inline SVG diagrams, state-flow visuals, or interactive panels where relevant. Read `./docs/svgs.md` for SVG conventions. Every diagram must have a `<figcaption>`.
5. Add at least one practical code example in `.code-container`.
6. Implement interaction logic in vanilla JavaScript near the end of `<body>`, using direct DOM updates and explicit state transitions.
7. Keep all interactions responsive and deterministic (button/input → state update → UI update).
8. Ensure the article reads like a complete engineering guide, not a generic blog post.

## Quality Checklist (Run Before Final Output)

- Single-page HTML only
- Base CSS/JS linked correctly; component CSS/JS linked for each component used
- TOC present and anchors working
- Heading IDs match TOC links
- Code blocks use copy-button structure
- Interactive elements are functional end-to-end (100% active functional scope)
- No fake UI, mock controls, or placeholder artifacts
- Prose is spartan, active, and technically accurate
- No em dashes (—) or semicolons used in text
- Direct address ("you/your") used throughout
- No generalizations, metaphors, or clichés
- Every diagram/visual asset includes a descriptive `<figcaption>` caption
- Every computing simulator has a `<details class="formula-details">` block revealing its formulas and model assumptions

## Be Creative with Visuals

Even though there is a layout guide that you need to follow, you have a lot of freedom to be creative with the visuals and interactive elements. Use inline SVGs, CSS animations, and dynamic DOM updates to create engaging learning experiences that go beyond static text.

## Optional References

Read these supplementary docs only when needed:

| When you need...                                                            | Read                   |
| --------------------------------------------------------------------------- | ---------------------- |
| Flashcards, quizzes, steppers, comparison views, or range-slider primitives | `./docs/components.md` |
| Inline SVG diagram conventions                                              | `./docs/svgs.md`       |
| MathJax / mathematical notation                                             | `./docs/math.md`       |

## Example Requests That Should Trigger This Skill

1. "Create an interactive HTML article that teaches Kafka consumer group rebalancing."
2. "Build a standalone webpage explaining OAuth token rotation with a simulation."
3. "I need a polished technical guide in HTML that visually demonstrates event loop phases."
