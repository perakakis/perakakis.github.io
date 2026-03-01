# Plan: Restructure Research Pages

## Context

The site currently puts everything on a long homepage (hero, research cards, publications table, news) and has a single research page with prose descriptions. The goal is to:

1. Simplify the homepage to just the essentials (hero + linked cards)
2. Add a navbar dropdown for direct navigation to each research programme
3. Create a card-based research overview page
4. Build three individual programme pages with publication listings styled like the Heiss reference site (category badges + link buttons), powered by YAML data files and a custom EJS template

Each change is a separate commit. The cosmo/darkly theme, existing `styles.css`, and `_quarto.yml` structure are preserved — extended, not replaced.

---

## Commit 1: Simplify homepage, link research cards to programme pages

**Files:** `index.qmd`, `styles.css`

**index.qmd changes:**
- Keep the hero section (lines 7-46) exactly as-is
- Keep the `## Research Interests` section and the three `.research-card` divs
- Make each card heading a link to its programme page:
  - `### [Affect Dynamics](research/affect-dynamics/index.qmd)`
  - `### [Scholarly Communication](research/scholarly-communication/index.qmd)`
  - `### [Exercise, Brain & Cognition](research/exercise-brain-cognition/index.qmd)`
- **Remove** lines 69-93: the `## Recent Publications` table, "See all publications" link, `## Latest News` section, and "See all posts" link

**styles.css changes — append:**
```css
.research-card h3 a {
  color: inherit;
  text-decoration: none;
}
.research-card h3 a:hover {
  color: var(--bs-primary);
}
```

---

## Commit 2: Add Research dropdown to navbar

**File:** `_quarto.yml`

Replace the flat Research nav item (lines 21-22) with a dropdown:
```yaml
- text: Research
  menu:
    - text: Overview
      href: research/index.qmd
    - text: Affect Dynamics
      href: research/affect-dynamics/index.qmd
    - text: Scholarly Communication
      href: research/scholarly-communication/index.qmd
    - text: "Exercise, Brain & Cognition"
      href: research/exercise-brain-cognition/index.qmd
```

---

## Commit 3: Rewrite research index as overview with card grid

**File:** `research/index.qmd`

Replace full prose + key publications with a concise overview paragraph and three cards (reusing existing `.card-grid` / `.research-card` CSS). Each card has:
- Linked heading → programme page
- One-line description
- "View programme →" button link

Set `toc: false` since the page is short.

---

## Commit 4: Add EJS listing template and CSS for publication listings

**Create:** `html/research/listing.ejs`
**Modify:** `styles.css`

### EJS template (adapted from Heiss listing.ejs)

Simplified version — no haiku, no "Full details" link. Renders per item:
1. `<%- item.reference %>` — HTML-formatted citation (unescaped since data is self-authored)
2. Category badges — Bootstrap `badge rounded-pill` elements
3. Link buttons — `btn btn-outline-primary btn-sm` with Bootstrap Icons (`bi bi-*`)

### CSS additions (appended to styles.css)
```css
/* Publication listing */
.pub-list ul { list-style: none; padding: 0; }
.pub-list li.pub-item { margin-bottom: 2em; padding-left: 0.75em; border-left: 4px solid var(--bs-primary); }
.pub-content p { margin: 0; font-size: 0.95rem; line-height: 1.65; }
.pub-categories { display: flex; flex-wrap: wrap; gap: 0.4em; margin: 0.5em 0; }
.pub-category { font-size: 0.7em; text-transform: uppercase; background-color: var(--bs-primary); color: #fff; }
.pub-links { display: flex; flex-wrap: wrap; gap: 0.4em; margin-top: 0.5em; }
.pub-link-btn { font-size: 0.8rem; }
.programme-links { display: flex; flex-wrap: wrap; gap: 0.5rem; margin: 1rem 0 1.5rem; }
```

Uses `var(--bs-primary)` throughout for cosmo/darkly compatibility.

---

## Commits 5-7: Three programme pages

Each programme gets two files: `index.qmd` + `papers.yml`

### Programme page template (`index.qmd`)
- Introductory paragraph (from current `research/index.qmd`)
- OSF + GitHub buttons (placeholder URLs — `#` for now)
- Three listing sections: Journal Articles, Preprints, In Progress
- Each listing reads from `papers.yml`, filtered by `section` field using `include:`
- Template path: `../../html/research/listing.ejs`

### YAML data structure (`papers.yml`)
```yaml
- title: "Paper title"
  date: "2025-01-01"
  reference: >-
    Authors (Year). <strong>Title.</strong> <em>Journal</em>, volume, pages.
    doi: <a href="https://doi.org/...">10.xxxx/xxx</a>
  section: "Journal Articles"      # or "Preprints" or "In Progress"
  categories:
    - Topic tag
  links:
    - name: "PDF"
      url: "https://doi.org/..."
      icon: "bi bi-file-earmark-pdf"
    - name: "GitHub"
      url: "https://github.com/..."
      icon: "bi bi-github"
```

### Commit 5: Affect Dynamics
- **Create:** `research/affect-dynamics/index.qmd`, `research/affect-dynamics/papers.yml`
- Initial papers: Goicoechea et al. (2025), Bailon et al. (2020), Bailon et al. (2019)

### Commit 6: Scholarly Communication
- **Create:** `research/scholarly-communication/index.qmd`, `research/scholarly-communication/papers.yml`
- Initial papers: Brembs et al. (2023), Bernal & Perakakis (2023), Perakakis et al. (2017), Perakakis et al. (2010)

### Commit 7: Exercise, Brain & Cognition
- **Create:** `research/exercise-brain-cognition/index.qmd`, `research/exercise-brain-cognition/papers.yml`
- Initial papers: Ciria et al. (2023), Yoris et al. (2024), Ciria et al. (2018), Luque-Casado et al. (2016), Sanabria et al. (2019)

---

## Final directory structure

```
perakakis.github.io/
├── _quarto.yml                          (modified)
├── index.qmd                            (modified)
├── styles.css                           (modified)
├── html/research/listing.ejs            (new)
├── research/
│   ├── index.qmd                        (modified)
│   ├── affect-dynamics/
│   │   ├── index.qmd                    (new)
│   │   └── papers.yml                   (new)
│   ├── scholarly-communication/
│   │   ├── index.qmd                    (new)
│   │   └── papers.yml                   (new)
│   └── exercise-brain-cognition/
│       ├── index.qmd                    (new)
│       └── papers.yml                   (new)
└── publications/                        (unchanged — bib-based page remains)
```

## Risk: YAML listing `include` filtering

Quarto's `include` filter may not work on YAML-sourced items the same way it works on `.qmd` frontmatter. If `include: section: "Journal Articles"` fails to filter, the fallback is to split each `papers.yml` into three files: `journal-articles.yml`, `preprints.yml`, `in-progress.yml`. I'll test after Commit 5 and adjust if needed.

## Verification

After each commit, run `quarto render` and check:
1. Homepage shows hero + linked cards only (no publications table or news)
2. Navbar Research dropdown shows 4 entries and links work
3. Research overview shows 3 cards with working links
4. Each programme page renders publication listings with badges and link buttons
5. Dark mode toggle works correctly (all new CSS uses `var(--bs-*)` variables)
