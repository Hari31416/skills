# SVG Diagram Conventions

Read this file when the article includes inline SVG diagrams.

## Rules

- **ViewBox:** Always set `viewBox="0 0 W H"` explicitly and `width="100%"` so diagrams are responsive.
- **Colors:** Map to CSS variables where possible: `fill="#2563eb"` for accent, `fill="#1e293b"` for dark backgrounds, `fill="#94a3b8"` for muted labels.
- **Typography:** Use `font-family="Inter, sans-serif"` and `font-size` in px units. Keep label text short.
- **Arrows:** Draw arrows with `<line>` + `<polygon>` for arrowheads, or use `<marker>` with `markerUnits="strokeWidth"`.
- **Grouping:** Wrap each logical element in a `<g>` with a descriptive comment.
- **Container:** Wrap the SVG in a `<figure>` and always include a `<figcaption>`.

## Minimal Skeleton

```html
<figure>
  <svg viewBox="0 0 600 200" width="100%" xmlns="http://www.w3.org/2000/svg">
    <!-- Producer node -->
    <g>
      <rect
        x="20"
        y="70"
        width="120"
        height="60"
        rx="8"
        fill="#eff6ff"
        stroke="#2563eb"
        stroke-width="2"
      />
      <text
        x="80"
        y="105"
        text-anchor="middle"
        font-family="Inter, sans-serif"
        font-size="13"
        fill="#1e293b"
      >
        Producer
      </text>
    </g>
    <!-- Arrow -->
    <line
      x1="140"
      y1="100"
      x2="200"
      y2="100"
      stroke="#64748b"
      stroke-width="2"
      marker-end="url(#arrow)"
    />
    <defs>
      <marker
        id="arrow"
        markerWidth="8"
        markerHeight="8"
        refX="6"
        refY="3"
        orient="auto"
      >
        <path d="M0,0 L0,6 L8,3 z" fill="#64748b" />
      </marker>
    </defs>
  </svg>
  <figcaption>Caption describing what the diagram shows.</figcaption>
</figure>
```
