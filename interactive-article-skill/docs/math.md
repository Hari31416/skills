# MathJax Setup

Read this file when the article covers algorithms, formulas, or performance models requiring mathematical notation.

## Loading MathJax

Add these two script tags to `<head>`:

```html
<script>
  window.MathJax = {
    tex: { inlineMath: [["\\(", "\\)"]], displayMath: [["\\[", "\\]"]] },
  };
</script>
<script
  src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"
  async
></script>
```

## Usage

- **Inline math:** Use `\(...\)` — e.g. `\(k_1\)` renders as _k₁_.
- **Block (display) math:** Use `\[...\]` for centered, larger equations.
- **When not to use MathJax:** Do not use it for simple subscripts or superscripts that HTML `<sub>`/`<sup>` tags handle cleanly. Reserve it for real formulas.
