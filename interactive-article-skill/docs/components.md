# Component Reference

Read this file when the article uses any of the five interactive component types. Each section shows the exact HTML markup and explains when to use the component.

Bootstrap the component files with:

```bash
python bootstrap_article_files.py <target-dir> --article-file <topic>.html \
  --components flashcard quiz stepper comparison-slider comparison-tabs primitives
```

Use only the components relevant to the article. The `merge_standalone_html.py` script will inline all referenced CSS and JS into the final single-file HTML.

---

## 1. Flashcards

Best for terminology, constants, or key constraints. Wrap them in a `.flashcard-grid`.

```html
<div class="flashcard-grid">
  <div class="flashcard">
    <div class="flashcard-inner">
      <div class="flashcard-front">
        <span class="flashcard-label">Concept</span>
        <p>What is the default retention period in Kafka?</p>
      </div>
      <div class="flashcard-back">
        <span class="flashcard-label">Answer</span>
        <p>7 days (168 hours)</p>
      </div>
    </div>
  </div>
</div>
```

**Required files:** `components/flashcard.css`, `components/flashcard.js`

---

## 2. Knowledge Checks (Quizzes)

Use inline to verify understanding. Mark the correct option with `data-correct="true"`. Provide specific feedback using `data-feedback`. Add `data-allow-retry="true"` to the `.quiz-container` to show a **Try Again** button after a wrong answer.

```html
<div class="quiz-container" data-allow-retry="true">
  <div class="quiz-question">
    Which Kafka component manages partition leadership?
  </div>
  <div class="quiz-options">
    <div class="quiz-option" data-correct="false">Producer</div>
    <div class="quiz-option" data-correct="true">The Controller</div>
    <div class="quiz-option" data-correct="false">Consumer Group</div>
  </div>
  <div class="quiz-feedback">
    <div data-feedback="correct">
      <strong>Correct!</strong> The Controller broker is responsible for
      managing partition leadership and replicas.
    </div>
    <div data-feedback="incorrect">
      <strong>Not quite.</strong> While Producers send data, the Controller
      manages the internal state of partition leadership.
    </div>
    <div data-feedback="general">
      <em>Tip: There is only one Controller in a Kafka cluster at any time.</em>
    </div>
  </div>
</div>
```

**Required files:** `components/quiz.css`, `components/quiz.js`

---

## 3. Process Steppers

Ideal for multi-stage walkthroughs (handshakes, algorithms). A **Step N of M** counter is automatically injected into the header by `stepper.js` — do not add it manually.

```html
<div class="stepper">
  <div class="stepper-header">
    <div class="stepper-dot is-active"></div>
    <div class="stepper-dot"></div>
  </div>
  <div class="stepper-content-wrapper">
    <div class="stepper-step is-active">
      <h3>Step 1: Initiation</h3>
      <p>The client sends a SYN packet to the server...</p>
    </div>
    <div class="stepper-step">
      <h3>Step 2: Acknowledgment</h3>
      <p>The server responds with SYN-ACK...</p>
    </div>
  </div>
  <div class="stepper-controls">
    <button class="stepper-btn is-prev">Back</button>
    <button class="stepper-btn is-next">Next</button>
  </div>
</div>
```

**Required files:** `components/stepper.css`, `components/stepper.js`

---

## 4. Comparison Components

Two variants are available.

### Image Slider

Drag a handle to reveal a before/after image pair. Use when comparing screenshots or architecture diagrams rendered as images.

```html
<div class="comparison-container">
  <div class="comparison-before">
    <img src="unoptimized.png" alt="Unoptimized Architecture" />
    <span class="comparison-label">Before</span>
  </div>
  <div class="comparison-after">
    <img src="optimized.png" alt="Optimized Architecture" />
    <span class="comparison-label">After</span>
  </div>
  <div class="comparison-handle"></div>
</div>
```

**Required files:** `components/comparison-slider.css`, `components/comparison-slider.js`

### Tab Switcher

Toggle between two panels of text, code, or any HTML content. Use for code comparisons, config diffs, or any non-image before/after.

```html
<div class="comparison-tabs">
  <div class="comparison-tab-headers">
    <button class="comparison-tab-btn is-active" data-tab="before">
      Before
    </button>
    <button class="comparison-tab-btn" data-tab="after">After</button>
  </div>
  <div class="comparison-tab-panel is-active" data-panel="before">
    <div class="code-container">
      <div class="code-header">
        <div class="code-label">naive.py</div>
        <button class="copy-btn">Copy</button>
      </div>
      <pre><code># Unoptimized code here</code></pre>
    </div>
  </div>
  <div class="comparison-tab-panel" data-panel="after">
    <div class="code-container">
      <div class="code-header">
        <div class="code-label">optimized.py</div>
        <button class="copy-btn">Copy</button>
      </div>
      <pre><code># Optimized code here</code></pre>
    </div>
  </div>
</div>
```

**Required files:** `components/comparison-tabs.css`, `components/comparison-tabs.js`

---

## 5. Interactive Primitives (Explorable Explanations)

Use range inputs and a linked value display to create parameter-tuning widgets.

```html
<div class="primitive-control-group">
  <div class="primitive-control">
    <label class="primitive-label">
      Batch Size (KB)
      <span class="primitive-value">16</span>
    </label>
    <input type="range" min="1" max="128" value="16" id="batch-size-slider" />
  </div>
</div>
```

**Required files:** `components/primitives.css`, `components/primitives.js`
