# Personal academic website: rebuild plan

Status: **orientation and planning only.** Nothing has been installed or scaffolded.
Date: 2026-10-20

**How I gathered this:**
- I loaded both sites in headless Chrome 155, using the DevTools protocol directly. I captured full-page screenshots at 1440px and 375px, opened the 375px hamburger menu, and expanded a paper cluster.
- I read the computed styles of every distinct element.
- I downloaded ghassemi.xyz's own stylesheet (`/static/css/site.css`, 1,208 lines) and script (`/static/js/site.js`), so the values below come from the source and were checked against computed styles.
- I read the resume PDF fully: text, layout, embedded fonts, and all 40 hyperlinks.

---

## 0. Orientation summary

**Reference site (ghassemi.xyz):**
- Hand-written static HTML with one CSS file and about 70 lines of JS. The JS does only two things: the mobile hamburger, and sizing the portrait to the height of the text beside it.
- Pages: Home (`index.html`), Professional (`employment.html`), Research (`projects.html`), Academic (`academic.html`), and CV (a PDF).
- Structure throughout:
  - Sections alternate between white and light grey, separated by hairlines.
  - Headings are left-aligned, with a short accent bar above each one.
  - Lists use a title on the left and the date on the right.
  - Paper groups are collapsible `<details>` blocks.
  - News sits in a tinted callout with an accent left border.

**Current site (khanmohammadi.me):**
- A single long Framer page with a dark theme, glassy gradient cards, orange accents, carousels, a logo marquee, and YouTube embeds.
- Hosted on Framer. The DNS is at GoDaddy (nameservers `ns19/ns20.domaincontrol.com`), and `www` is served by `sites.framer.app`.
- The footer still says "© 2024". The `<meta description>` describes older work ("LLMs and GNNs … healthcare, finance, and social networks").

---

## a. Design spec

Values are **measured from ghassemi.xyz**. The "Ours" column is what I propose for your site. Where the two differ, the reason is in the notes.

### a.1 Color tokens

| Token | ghassemi.xyz (measured) | Ours | Notes |
|---|---|---|---|
| `--accent` | `#F32853` | **`#0E7490`** | Petrol blue. Contrast is 5.4:1 on white and 5.1:1 on `#F8F8F8`, so it passes WCAG AA even for small kicker text. |
| `--accent-hover` | `#F21040` | **`#155E75`** | A darker step of the same hue. |
| `--accent-soft` | `rgba(243,40,83,.08)` | **`rgba(14,116,144,.08)`** | |
| `--ink` (headings, strong) | `#2B2B30` | `#2B2B30` | |
| `--text` (body) | `#55555C` | `#55555C` | Dark grey body text. |
| `--muted` (dates, meta, nav) | `#8A8A92` | `#8A8A92` *(see Q13)* | Only 3.4:1 on white, which fails AA at the 12–14px sizes where it is used. |
| `--line` (hairlines, card borders) | `rgba(20,20,25,.08)` | same | |
| `--bg` | `#FFFFFF` | `#FFFFFF` | |
| `--bg-alt` (alternating bands) | `#F9F9F9` | **`#F8F8F8`** | Your brief says `#F8F8F8`. His is actually `#F9F9F9`, which looks the same. |
| News callout background | `color-mix(#C1C7EA 38%, white)` = `#E7EAF7` (lavender) | `#E7EAF7` *(see Q12)* | |
| `--link` | `#0645AD` | `#0645AD` | Classic blue, underlined. |
| `--link-visited` | `#551A8B` | `#551A8B` *(see Q16)* | |
| `--link-hover` | `#0B0080` | `#0B0080` | |

### a.2 Typography

**Fonts**
- **ghassemi.xyz:** Raleway 600/700 for headings, Inter 400/500/600 for body. Both come from Google Fonts with `display=swap`.
- **Ours:** Inter for body. For the display font I recommend **Lexend** 500/600, the heading font in your resume PDF (see Q1). I'll self-host the fonts so visitors don't make a request to Google.

Global rules:
- `line-height: 1.7` for body text.
- Paragraph spacing is `0 0 1.25em`.
- `strong` is ink-colored at weight 600.
- Headings use `line-height: 1.15` and `letter-spacing: -0.01em`.

| Role | Rule (from source) | Desktop (1440) | Mobile (375) |
|---|---|---|---|
| Body | `clamp(1rem, .95rem + .25vw, 1.125rem)`, Inter 400, `--text` | **18px** / 30.6px | 16.1px / 27.4px |
| Hero name (h1) | `clamp(1.9rem, 1.3rem + 2.2vw, 2.7rem)`, display font 600, ls .01em | 43.2px | 30.4px |
| Sub-page title (h1) | `clamp(2rem, 1.4rem + 2.4vw, 3rem)`, 600, UPPERCASE, ls .02em, centered | 48px | 32px |
| Section title (h2) | `clamp(1.375rem, 1.15rem + .9vw, 1.75rem)`, 600, left-aligned | 28px | 22px |
| Card title (h3) | 1.1rem, display font 600 | 19.8px | 17.8px |
| Entry title | 1.05rem, display font 600, lh 1.35, `--ink` | 16.8px | 16.8px |
| Kicker / accent label | .72rem, Inter 600, ls .12em, UPPERCASE, `--accent` | 11.5px | 11.5px |
| Hero role line | .92rem, Inter, role part in **bold** | 14.7px | 14.7px |
| Hero link row | .95rem, `--muted`, links comma-separated | 15.2px | 15.2px |
| Hero intro | 1.02em | 18.4px | 16.5px |
| Entry meta (venue, org) | .88rem, `--muted` | 14.1px | 14.1px |
| Entry date | .85rem, `--muted`, tabular numbers, ls .02em, right-aligned, no wrapping | 13.6px | 13.6px |
| Entry description | .97rem | 15.5px | 15.5px |
| Entry link row | .85rem, `--muted`, items separated by " · " | 13.6px | 13.6px |
| Nav link | .78rem, Inter 500, ls .12em, UPPERCASE, `--muted` | 12.5px | 14.4px (in menu) |
| Brand (site name in header) | 1.05rem, display font 700, ls .06em, UPPERCASE, `--ink` | 16.8px | 16.8px |
| Footer | .85rem, `--muted`, ls .02em, centered | 13.6px | 13.6px |

Link styling:
- Links are underlined at 1px thickness with a `.18em` underline offset.
- On hover, the underline thickens to 2px and the color changes to `--link-hover`.
- Focus shows a 2px solid outline with a 3px offset.

### a.3 Layout and spacing

| Thing | Rule | Measured |
|---|---|---|
| Header inner width | `max-width: 1040px` | 1040px |
| Content column (all sections) | `max-width: 820px`, centered | 820px (x = 310 at 1440) |
| Reading measure (paragraphs, lists) | `max-width: 70ch` | |
| Side gutter | `clamp(1.25rem, 4vw, 2.5rem)` | 40px desktop / 20px mobile |
| Section vertical padding | `clamp(3rem, 6vw, 5rem)` | **80px** desktop / 48px mobile |
| Section separator | `border-top: 1px solid --line`; bands alternate white and `--bg-alt` | |
| Hero padding | top `clamp(3rem, 7vw, 5.5rem)`, bottom `clamp(2rem, 4vw, 3rem)` | 88px / 48px desktop |
| Hero layout | flex row, gap 2rem; text column fixed at 540px; portrait on the left | portrait 287px (JS-sized) |
| Portrait | circle (`border-radius: 50%`), `object-fit: cover`, `filter: drop-shadow(0 8px 20px rgba(20,20,25,.12))` | |
| Sub-page header band | padding `clamp(2.5rem,6vw,4.5rem)` top, `clamp(1.5rem,4vw,3rem)` bottom; title centered with a centered **2.5rem × 3px** accent bar 1rem below it | |
| Section title accent bar | `::before`, **2rem × 3px**, radius 3px, `--accent`, 0.7rem above the title | 32 × 3px |
| Title to content | about 2rem | |

**Our change:** his portrait size is set by JS to match the text height. I'll use a fixed size instead (about 220px on desktop, `clamp(150px, 45vw, 200px)` on mobile), which needs no client JS.

### a.4 Components

| Component | Spec (measured) |
|---|---|
| **Card** (impact / pillar) | Background `#fff` (white also inside grey bands). Border `1px solid --line`, **radius 14px**. Shadow-sm `0 1px 2px rgba(20,20,25,.05), 0 6px 18px rgba(20,20,25,.06)`. Padding `1.4rem 1.5rem 1.3rem`. Grid `repeat(auto-fit, minmax(240px, 1fr))` with gap 1.25rem, giving 3 columns at 820px and 1 column on a phone. Layout: kicker, then title, then muted caption (.9rem), then content. |
| **News callout** | Max width 820px. Background as in a.1. `border-left: 4px solid --accent`, radius 14px. Padding `1.5rem clamp(1.25rem,3vw,2rem)`, shadow-sm. Items are separated by a 1px `rgba(20,20,25,.1)` line with 1.1rem padding. Each item has a title row (display font 600, 1.02rem, left) and a date (right, muted), then a description (.97rem). The list ends with an "Older news" item. |
| **Entry list** | Items separated by a 1px `--line` with `1.15rem 0` padding. The header row is flex, space-between, baseline-aligned: title on the left, date on the right. Below it come meta, description, and the link row. An optional 52px greyscale logo column appears at 50% opacity and turns full color on hover (40px under 520px). |
| **Collapsible cluster** | A `<details>` element. The summary uses the display font at 600, 1.15rem, `--ink`, with "+" / "–" in `--accent` and a "N papers" count right-aligned (.85rem muted). The nested list has a 2px `--line` left rule and `padding-left: 1.6rem`. |
| **Chips** (inline list) | .85rem, `--ink`, radius 999px, padding `.3rem .8rem`, 1px `--line` border. |
| **Button** (rare) | Pill shape (radius 999px), `--accent` background, white 600 text at .92rem, padding `.7rem 1.3rem`. |
| **Footer** | `border-top: 1px --line`, padding 2.5rem, centered, muted .85rem. |
| **Shadow-md** (menus) | `0 10px 30px rgba(20,20,25,.12)` |
| **Motion** | Only hover transitions (.2–.3s, `cubic-bezier(.2,.7,.2,1)`), with `prefers-reduced-motion` respected. **No scroll animations.** |

### a.5 Navigation bar

**Desktop (≥ 800px)**
- The bar is sticky, 64px tall, with a hairline bottom border.
- The brand sits on the left. The links (HOME · PROFESSIONAL · RESEARCH · ACADEMIC · CV) sit on the right, with gap `clamp(.75rem, 1.6vw, 1.5rem)`.
- The current page's link is accent-colored, with a 2px accent underline bar 2px below the text. On hover, the same bar grows from the left.
- Each item opens a hover dropdown that lists the sections on that page.
  - The dropdown is white, with a 12px radius and shadow-md, and is at least 13.5rem wide.
  - Its links are sentence case at .88rem.

**Narrow (≤ 799px), checked at 375px**
- The links collapse behind a **44×44px hamburger**: three bars, each 20×2px with 5px gaps, which turn into an ×.
- Tapping it opens a **full-width white panel under the header**, with shadow-md and padding `.5rem 20px 1rem`.
  - Top-level links are UPPERCASE at .9rem (14.4px), with `.85rem` vertical padding and 1px dividers.
  - Each page's section links appear indented 1rem beneath it, in sentence case at about 14px.
- The panel closes on a link tap, on Escape, or on a click outside. All of this needs about 30 lines of JS.

**Other responsive breakpoints in his CSS:**
- 899px: the hero stacks. The photo is centered (169px at 375), the name and roles are centered, and the intro stays left-aligned.
- 640px: two-column lists become one column.
- 520px: logos and clusters tighten.

**Our changes:**
1. **Solid white header** instead of his `rgba(255,255,255,.86)` with `backdrop-filter: blur(14px)`. That blur is the glass effect you ruled out.
2. **No hover dropdowns.** Your pages are short, so they don't need them.
3. **Mobile nav:** see Q15. I recommend a no-JS layout where the brand sits on row 1 and the 4 links on row 2. A hamburger would work too.

---

## b. Content audit: resume (source of truth) vs. current site

### b.1 Outdated or wrong on the current site

| Item on khanmohammadi.me | Resume / correct | Action |
|---|---|---|
| Footer "© 2024" | — | Auto-generate the year. |
| Meta description: "LLMs and GNNs … healthcare, finance, and social networks" | Your focus is now confidence estimation for LLMs, LRMs, and VLMs. | Rewrite it. |
| "Donwload Resume" links to an old Google Drive file | — | Fix the typo and serve `/resume.pdf` from your own domain. |
| EACL'26 summary says "**five** high-stakes domains" | The resume lists **four**: clinical, financial, legal, mathematical. | **Q5.** Which is right? |
| "Efficient CTCAE Grading" (IJROBP'25): the author list ends "…& Ghassemi, M. M., Thind, K", and the second DOI link points to a different (2024) paper | — | Fix it in the data. |
| Prose2Poem DOI shown as `10.1145/359279` (truncated) | `10.1145/3592791` | Fix. |
| BJR\|AI paper: the author line says "(2023)" while the venue says 2025, and the title links to the old arXiv version | BJR\|AI 2025; collaboration with HFH **and Cedars-Sinai** | Fix. |
| Fetal sex paper marked "Under review" (arXiv 2021), yet your Presentations slide shows it at **IEEE BHI'23** | — | **Q4.** What is its real status? |
| "Feature Imitation" paper marked "Under review" (arXiv 2023) | Not on the resume | **Q4.** |
| Awards: "Selected Tutorial — 4th ACM ICAIF (2023)" | Resume: "ACM ICAIF'23 **Workshop Organizing Committee Member**" | Use the resume wording (**Q5**). |
| Awards: "Selected Speaker … Poster Award Winner at 'Cancer Control & Prevention'" (2023; the link is a Nov 2023 news post) | Resume: "**Top Cancer Control Abstract Award** and invited to deliver a talk", **Jan 2023** | Use the resume wording (**Q5**). |
| FISU Ambassador **2019** | Resume: **Jan 2020** | Use the resume (**Q5**). |
| English: "Proficient" | Resume: "Fluent" | Use the resume. |
| Guilan NLP Research Assistant **Sep 2018 – Jul 2022** | The resume nests this role under the B.Sc. (Sep 2017 – Aug 2021) with no separate dates. | **Q5.** Keep the 2018–2022 dates or not? |
| "Teacher Assistanship" typo | — | Fix if teaching is kept. |

### b.2 On the resume but missing from the current site

- **Thesis title**: *Signals of Trust: Confidence Estimation in Language, Reasoning, and Vision-Language Models*. Also the expected graduation date, **Spring 2028**, and the advisor link.
- **The AACL'26 paper**: *Grounded or Guessing? … BICR*, with its code (GitHub) and VLCB data (Hugging Face).
- **The under-review VLM attack paper**: *Vision-Language Model Confidence Is Not a Property of the Answer*, with arXiv and code links.
- **Applied papers, under review**: *Calibrated Triage, Not Autonomy* (medical VLMs) and *Confidence Estimation for Financial VLMs*.
- **ASTRO'26 / IJROBP'26**:
  - *Teaching Language Models Safe Clinical Decision Making* (oral, top 11%)
  - *Risk-Controlled Selective Automation …* (spotlight)
  - *Clinical Validation of a Privacy-Preserving LLM for CTCAE …*
- **Code and data links** for CCPS and RMCB (GitHub and Hugging Face).
- **The EMNLP 2025 Outstanding Paper nomination as an honor in its own right.** It is currently only a bullet under the paper.
- **Peer review and PC service**:
  - Program committees: AAAI'27, IEEE BHI'26, ICML'26 AI4Law Workshop, CIKM'26 LASS Workshop.
  - 24+ reviews across 8 journals.
- **Scholarships**: the Guilan undergraduate full scholarship (2017) and the graduate scholarship (2020).
- **Headline facts**: 20+ publications; 7 oncology-conference presentations (5 ASTRO, 2 AAPM); collaborations with JPMorgan AI Research, Henry Ford Health, and Cedars-Sinai.
- **Name variants for search**: you publish as **"Khanmohammadi, R."** but the site says "Reza Khan Mohammadi". Both spellings should go into the page metadata.

### b.3 On the current site but not on the resume (proposed handling)

| Item | Proposal | Why |
|---|---|---|
| **M.Sc. Computer Science, MSU (Aug 2022 – Apr 2024)** | **Ask (Q3)** | The resume omits it. I won't drop a degree without your say. |
| **Techstack** logo marquee (AWS, PyTorch, Hugging Face, PyG, NumPy, Pandas, Neo4j) | **Drop** | Logo walls say little on an academic site, and the resume already lists your skills. At most, one plain line (Q8). |
| **Certifications** (10: Coursera 2019, Basketball Coaching License, Web Dev 2016, …) | **Drop** | Dated, below the level of a PhD candidate with EMNLP/EACL/AACL papers, and not on the resume. |
| **Leadership** (3 undergraduate student-association roles, 2020–2022) | **Drop** | Not on the resume, and weak next to the rest. |
| **Teacher Assistantships** (8 Guilan courses, 2018–2022, duplicated in a carousel) | **Condense or drop (Q9)** | Not on the resume. If you keep it, it becomes one compact list, like his "Teaching" section. |
| **Presentations** carousel (2 YouTube videos: BHI'23 fetal-sex talk `xQLEryZHWns`; Henry Ford + MSU symposium talk `8ma7UzopwKQ`) | **Keep as a "Talks" text list with links, no embeds (Q10)** | Embeds are heavy and load third-party JS. |
| Paper-thumbnail strip under Experience | **Drop** | Decorative only. |
| Language flags | **Replace with one line** | Restraint. |
| Extra papers: PGST (NLE 2023), COPER (ICWR'21), Feature Imitation (arXiv), Fetal sex (arXiv/BHI'23?), Temporal Heterogeneous Graph dataset (under review) | **Ask (Q4)** | Your "20+ publications" claim depends on them. The resume lists 17. |
| "Marathoner — Long Beach Marathon" | **Keep, but as a personal line rather than an honor (Q11)** | It is on the resume. Listing it among academic honors reads oddly. |

---

## c. Proposed sitemap

Nav: **HOME · RESEARCH · ACADEMIC · RESUME**. Resume links straight to `/resume.pdf`, as on his site. There is no "Professional" page, because the resume lists no industry employment. Your industry ties show up as collaborators instead.

### `/` Home
| Section | Band | Reason |
|---|---|---|
| **Hero**: round portrait, name, "Ph.D. Candidate, Computer Science, Michigan State University", "HAAIL lab · advised by Mohammad M. Ghassemi", links (Google Scholar, GitHub, LinkedIn, Hugging Face, Email, Resume), 2–3 sentence intro | white | Says who you are and what you work on within 5 seconds. Your current tagline ("I work on making AI systems honest about their own certainty…") is good and I'd keep it. |
| **At a Glance**: three highlight cards (Track Record / Confidence Estimation / Oncology & Financial AI), `src/components/Highlights.astro` | white (flush, no title) | Numbers and flagship papers at a glance. |
| **News**: year tabs over a compact date \| text list (`news.yaml`) | grey | Shows you're active. It's the only section that changes often. |

Home ends with News. Collaborations and Outreach were removed from Home; `collaborators.yaml` and `outreach.yaml` are kept, unused, in case they move to another page.

### `/research` Research
| Section | Band | Reason |
|---|---|---|
| Page title RESEARCH, then a one-paragraph overview with the thesis title | white | Frames confidence estimation as one coherent program. |
| **Selected publications**: the 4 core papers in full (venue, award line, authors with your name in bold, 2–3 line summary, links Paper · Code · Data · arXiv · BibTeX) | grey | Mirrors the resume's "Selected Publications". These are the papers people come for. |
| **Applied publications**: collapsible clusters for *Healthcare (9)* and *Finance (2)* | white | Mirrors the resume's "Applied Publications". Collapsing keeps the page short, the way his Research page does. |
| **Earlier work**: Prose2Poem, MambaNet, and any extras from Q4, collapsed | grey | Keeps them visible without diluting the main story. |
| Footer note: "Full list on Google Scholar" | — | Keeps the site's list honest without needing to be exhaustive. |

### `/academic` Academic
| Section | Band | Reason |
|---|---|---|
| **Education & Research Experience**: MSU Ph.D. (HAAIL RA, advisor, thesis, expected Spring 2028); Guilan B.Sc. (Guilan NLP Group RA, advisor, thesis); plus the M.Sc. if Q3 says so | white | Taken directly from the resume. Uses his entry layout (degree on the left, dates on the right, a THESIS label). |
| **Honors & Distinctions**: the resume's list with dates, places, and links | grey | Taken directly from the resume. |
| **Service**: PC memberships, the ICAIF'23 workshop committee, and reviewing (24+ reviews, 8 journals) | white | Standard on academic sites, and missing today. |
| **Talks** (if Q10 = yes) | grey | Your oncology and BHI presentations, plus the two videos. |
| **Teaching** (if Q9 = yes) | white | Compact list. |
| **Languages** as one line, plus a personal line (marathon) per Q11 | — | Small human touch. |

### Also
- `/resume.pdf`: your resume PDF.
- `/404`: a simple page in the same style.
- `sitemap.xml` and `robots.txt`.

---

## d. Project structure and data model

Stack:
- Astro (current stable version, checked at scaffold time), with `output: 'static'` and no UI framework.
- No client JS by default.
- Plain CSS with custom properties.
- Content lives in YAML, validated by **Astro content collections with Zod schemas**. A typo or missing field in a YAML file fails the build with a message that names the file and field, so a broken paper entry can't ship silently.

```
/
├── astro.config.mjs            # site URL, static output, sitemap integration
├── package.json
├── README.md                   # how to run, add a paper, add news, deploy
├── docs/PLAN.md
├── resume/                     # your source resume (not published)
├── public/
│   ├── resume.pdf              # served at /resume.pdf
│   ├── favicon.svg
│   ├── robots.txt
│   └── CNAME                   # only if GitHub Pages
├── src/
│   ├── assets/images/          # portrait.jpg, logos/ (Astro makes resized WebP versions)
│   ├── content.config.ts       # collection schemas (Zod)
│   ├── data/
│   │   ├── profile.yaml
│   │   ├── publications.yaml
│   │   ├── news.yaml
│   │   ├── research-threads.yaml
│   │   ├── education.yaml
│   │   ├── honors.yaml
│   │   ├── service.yaml
│   │   ├── talks.yaml          # if Q10
│   │   ├── teaching.yaml       # if Q9
│   │   └── collaborators.yaml
│   ├── layouts/Base.astro      # <head>, SEO meta, JSON-LD, header, footer
│   ├── components/
│   │   ├── Header.astro  Footer.astro  PageHead.astro  Section.astro (band + title + accent bar)
│   │   ├── Hero.astro  Card.astro  NewsCallout.astro
│   │   ├── Entry.astro  PubEntry.astro  Cluster.astro  LinkRow.astro
│   ├── pages/
│   │   ├── index.astro  research.astro  academic.astro  404.astro
│   └── styles/
│       ├── tokens.css          # every value from §a, the single place to change the accent
│       ├── base.css            # reset, typography, links
│       └── components.css
```

### Data files and fields

**`profile.yaml`** (one object)
- `name` ("Reza Khan Mohammadi")
- `name_variants` (["Reza Khanmohammadi", "Khanmohammadi, R."]), used for SEO and for bolding your name in author lists
- `title` and `affiliation`
- `lab` {name, url}
- `advisor` {name, url}
- `email`, `location`
- `intro` (Markdown)
- `tagline`
- `links[]` {label, url}, in display order
- `cv` (path)
- `seo` {description, og_image}

**`publications.yaml`** (list). Adding a paper means adding one block here.
```yaml
- id: ccps-emnlp25                 # also the anchor: /research#ccps-emnlp25
  title: "Calibrating LLM Confidence by Probing Perturbed Representation Stability"
  authors: ["Khanmohammadi, R.", "Miahi, E.", "Mardikoraem, M.", "Kaur, S.", "Brugere, I.",
            "Smiley, C. H.", "Thind, K.", "Ghassemi, M. M."]
  venue: { short: "EMNLP 2025", full: "Conference on Empirical Methods in Natural Language Processing", type: conference, track: "Main" }
  year: 2025
  status: published                 # published | accepted | under-review | preprint
  group: core                       # core | healthcare | finance | earlier
  thread: llm                       # llm | lrm | vlm  (optional)
  featured: true                    # shown in "Selected publications"
  highlight: "Outstanding Paper Award nominee (top 0.4% of 8,174 submissions)"
  collaborators: [jpmorgan, hfh]    # keys into collaborators.yaml
  summary: >                        # Markdown, first person, from the resume
    I introduced CCPS, a confidence estimation method that perturbs an LLM's final hidden
    states and predicts answer correctness from how stable its representations are. …
  links:
    paper: https://aclanthology.org/2025.emnlp-main.530/
    code:  https://github.com/ledengary/CCPS
    data:  https://huggingface.co/datasets/ledengary/CCPS
    # also allowed: arxiv, doi, slides, video, poster, bibtex
  notes: { impact_factor: null }    # only shown if Q6 says so
```

**`news.yaml`** (list): `date` (YYYY-MM or YYYY-MM-DD), `title`, `body` (Markdown, may link to `/research#id`). The home page shows the 5–6 newest entries.

**`research-threads.yaml`** (3 items): `kicker`, `title`, `blurb`, `paper` (a publication id, from which venue and link are filled in).

**`education.yaml`** (list): `degree`, `field`, `institution`, `location`, `start`, `end`, `expected`, `role` {title, lab, lab_url}, `advisor` {name, url}, `thesis`, `gpa` (shown only if Q6 says so), `logo` (optional).

**`honors.yaml`** (list): `title`, `org`, `date`, `location`, `description` (Markdown), `links[]` {label, url}, `kind` (award | membership | service | personal).

**`service.yaml`**: `program_committees[]` {venue, year, url?}, `organizing[]` {role, event, year, links[]}, `reviewing` {reviews, journals_count, journals[]}.

**`talks.yaml`** (list): `title`, `event`, `date`, `location`, `type` (oral | spotlight | poster | invited), `links` {video, slides, paper}.

**`teaching.yaml`** (list): `course`, `institution`, `role` (TA | Head TA), `terms[]`, `instructor`.

**`collaborators.yaml`** (list): `key`, `name`, `url`, `logo?`. Example keys: jpmorgan, hfh, cedars, nyuad, hudl.

---

## e. Build plan (each phase ends with something to review in the browser; I stop after each one)

| Phase | Work | You review |
|---|---|---|
| **1. Scaffold and design system** | Init Astro (static), self-hosted fonts, `tokens.css`/`base.css`/`components.css`, Base layout, header and nav (desktop and mobile), footer. A temporary **`/styleguide`** page showing every component (type scale, bands, accent bars, card, news callout, entry, cluster, link row) with sample text clearly marked "SAMPLE". | `npm run dev` → `localhost:4321/styleguide` at desktop and 375px. I'll also send screenshots at both widths. You sign off on font, spacing, and accent use. |
| **2. Data layer and Home** | `content.config.ts` schemas, `profile.yaml`, `research-threads.yaml`, `news.yaml`, `collaborators.yaml`; build the Home page from them. If the portrait isn't ready, the page shows a grey circle labelled "portrait pending" rather than a stand-in photo. | `localhost:4321/` |
| **3. Publications and Research** | Enter all 17 resume papers (plus extras per Q4) into `publications.yaml` and build `/research` with clusters. Then show the workflow by adding one paper by editing only the YAML. **Note:** Link CCPS, RMCB, BICR in the Home highlights to their /research#id anchors once publications exist. **Note:** The research-thread cards (`src/data/research-threads.yaml`, `src/components/ResearchCard.astro`) are no longer on Home and currently unused; place them at the top of `/research`. | `localhost:4321/research`, and a check that every link resolves |
| **4. Academic page** | `education.yaml`, `honors.yaml`, `service.yaml`, plus `talks.yaml` and `teaching.yaml` per Q9 and Q10; build `/academic`. | `localhost:4321/academic` |
| **5. Polish** | `/resume.pdf`; SEO (title, description, canonical, Open Graph and Twitter cards, JSON-LD `Person` with name variants and `sameAs` links, sitemap, robots); favicon; 404; accessibility pass (contrast, focus states, alt text, landmarks); Lighthouse run; automated external-link check. Remove `/styleguide`. Delete `/highlights-lab` (`src/pages/highlights-lab.astro`); Home's "At a Glance" keeps using `src/components/Highlights.astro`. | Lighthouse report, `/404`, a link-check report |
| **6. Preview deploy** | Create the repo and set up the GitHub Actions deploy (or Cloudflare Pages per Q17). You get a public preview URL. | The preview URL on your phone and laptop |
| **7. Domain cutover** | Change the DNS at GoDaddy, set up HTTPS and the www/apex redirect, and remove the domain from Framer. Before touching DNS I confirm with you. I'd keep the Framer project (unpublished, not deleted) for a few weeks as a fallback. | `https://www.khanmohammadi.me` |
| **8. Handover** | README: run locally, add a paper, add news, update the CV, deploy. | README |

---

## f. Open questions (decisions I need)

The questions marked **(blocks Phase 1)** or **(blocks Phase 2)** must be answered before that phase. I can carry a sensible default for the rest, and I've noted my recommendation each time.

1. **Display font (blocks Phase 1).** Options: **Lexend** (the heading font in your resume, which ties the site to your CV and avoids copying his look), **Raleway** (the reference's font), or another. *Recommend Lexend.*
2. **Page structure (blocks Phase 1).** The three pages plus CV above, or one long single page? *Recommend three pages*, which matches the reference and gives Research its own URL to share.
3. **M.Sc. MSU (Aug 2022 – Apr 2024)**: show it? The resume omits it. *(blocks Phase 4)*
4. **Papers not on the resume**: PGST (NLE 2023), COPER (ICWR'21), Feature Imitation (arXiv 2309.12279), Fetal sex identification (arXiv 2110.06131; was it published at BHI'23?), Temporal Heterogeneous Graph dataset (still under review?). Include them under "Earlier work", and with what status? *(blocks Phase 3)*
5. **Conflicts to settle**:
   - (a) EACL'26: 4 or 5 domains?
   - (b) Henry Ford + MSU symposium: Jan 2023, "Top Cancer Control Abstract Award + invited talk" (resume) vs. a Nov 2023 link and "Poster Award" (site)?
   - (c) FISU ambassador: 2019 or Jan 2020?
   - (d) ICAIF'23: organizing committee member (resume) or tutorial (site), or both?
   - (e) Guilan NLP RA dates: Sep 2018 – Jul 2022?
   - *By default I'll follow the resume.*
6. **Impact factors and GPA**: the resume shows IF (e.g., "IF=6.5") and GPAs. *Recommend leaving both off the site.* IFs are unusual in CS, and GPA is unusual past the PhD-candidate stage. The schema keeps them in case you want them.
7. **News items and dates (blocks Phase 2)**: which items, and in which months? I can draft candidates from the resume: EMNLP'25 nomination (Sep 2025), NextGen Scholar at BHI'25 (Sep 2025), EACL'26 acceptance, AACL'26 acceptance, ASTRO'26 oral and spotlight, AAAI'27 PC. But I don't know the acceptance months, and I won't guess them.
8. **Confirm the drops**: Techstack, Certifications, Leadership, paper-thumbnail strip, language flags. Should skills appear as one plain line or not at all? *Recommend not at all; the CV covers them.*
9. **Teaching**: keep a compact Guilan TA list (8 courses) or drop it? *Recommend a compact list.* It's real experience and costs one short section.
10. **Talks section**: yes or no? If yes, I need the list (see "What I need" #8).
11. **Marathon**: personal line, honors list, or drop?
12. **News callout background**: keep his lavender `#E7EAF7` (strictly "only the accent changes"), or tint it toward petrol, `#ECF4F6`? *Recommend petrol.* Lavender next to a petrol border clashes a little. I'll show both in Phase 1.
13. **Muted grey accessibility**: `#8A8A92` is 3.4:1 on white, below WCAG AA for the small date and meta text. Darken it to `#6E6E76` (5.1:1)? *Recommend yes.* It looks nearly the same.
14. **Collaborators**: plain text names or greyscale logos (JPMorgan, Henry Ford Health, Cedars-Sinai, NYU Abu Dhabi, Hudl)? *Recommend text.* Using logos of organizations you don't work for can raise trademark and affiliation questions.
15. **Mobile nav**: a no-JS two-row header (brand, then 4 links), or a hamburger like his (about 30 lines of inline JS)? *Recommend no-JS two-row*, since there are only 4 links.
16. **Visited-link purple** (`#551A8B`): keep it, as he does, or keep every link blue? *Recommend keeping it.*
17. **Hosting**:
    - **GitHub Pages** keeps the DNS at GoDaddy: you'd add a `www` CNAME pointing to `ledengary.github.io` and four apex A records.
    - **Cloudflare Pages** can serve `www` the same way, but the apex domain usually requires moving the nameservers to Cloudflare.
    - *Recommend GitHub Pages.* Also: which repo name, and should it be public?
18. **Canonical host**: `www.khanmohammadi.me` (current) or the apex? *Recommend keeping `www`*, with the apex redirecting, so existing links keep working.
19. **Analytics**: none, or a privacy-friendly option (Cloudflare Web Analytics or GoatCounter, no cookies)? *Recommend none at launch.*
20. **BibTeX**: show a "BibTeX" link per paper? It requires the entries (see "What I need" #9). *Optional.*

---

## What I need from you

| # | Item | Where to put it | Format and size | Blocks? |
|---|---|---|---|---|
| 1 | **Portrait photo** (head and shoulders, face centered, plain or soft background; your current Brooklyn Bridge full-length shot won't crop well into a circle) | `src/assets/images/portrait.jpg` | JPG, sRGB, **square**, at least 800×800 (1200×1200 ideal), under 2 MB. Astro produces the resized WebP versions. | **Blocks sign-off on Phase 2.** Building can continue with a labelled grey circle. |
| 2 | **Answers to Q1 and Q2** | Reply in chat | — | **Blocks Phase 1** |
| 3 | **Answers to Q7** (news items and months), plus Q12/Q13/Q15 | Reply in chat | — | Q12/13/15 can wait until the Phase 1 review. **Q7 blocks Phase 2.** |
| 4 | **Profile links to show**: confirm LinkedIn `https://www.linkedin.com/in/khanreza/`, Google Scholar `…user=DadaCmsAAAAJ`, GitHub `github.com/ledengary`; add Hugging Face (`huggingface.co/ledengary`?), ORCID, Semantic Scholar, DBLP, X/Bluesky if you want them; the **HAAIL lab URL** if one exists | Reply in chat (I'll write `src/data/profile.yaml`) | URLs | Needed in Phase 2. Missing ones can be added later. |
| 5 | **Which email to publish** (`khanreza@msu.edu`, as on the resume?) | Reply in chat | — | Phase 2 |
| 6 | **Answers to Q3, Q4, Q5**, plus full author lists for the papers the resume shortens to "et al.", especially the 2026 ones (Calibrated Triage, Financial VLMs, the three ASTRO/IJROBP'26 papers). For older applied papers I can reuse the author lists on your current site. | Reply in chat, or a list in `docs/inputs/authors.txt` | Plain text, one paper per block | Phase 3. It can render "et al." until then. |
| 7 | **Optional one-line summaries** for the applied papers (the resume gives titles only) | Reply in chat or `docs/inputs/summaries.txt` | Plain text | Can come later |
| 8 | **Talks list** if Q10 = yes: title, event, date, city, type (oral/spotlight/poster/invited), and links (video, slides) for the 5 ASTRO, 2 AAPM, BHI'23, and Henry Ford symposium talks | `docs/inputs/talks.txt` or chat | Plain text | Phase 4. It can come later. |
| 9 | **BibTeX** if Q20 = yes | `docs/inputs/publications.bib` | One `.bib` file | Can come later |
| 10 | **CV for download**: confirm that `resume/Reza Khan Mohammadi Resume.pdf` is the version to publish, or provide another | I'll copy it to `public/resume.pdf` | PDF, under 5 MB | Phase 5 |
| 11 | **Favicon**: none needed; I'll propose a simple "RK" monogram in petrol unless you have one | Optional: `public/favicon.svg` | SVG, square | Can come later |
| 12 | **Institution logos** for Education entries (MSU, University of Guilan), only if you want his greyscale-logo look | `src/assets/images/logos/msu.svg`, `…/guilan.svg` | SVG preferred; otherwise PNG with a transparent background, at least 200px tall | Can come later |
| 13 | **GitHub**: the repo name and visibility, and either run `gh auth login` in this terminal (`! gh auth login`) or create the empty repo yourself | — | — | **Blocks Phase 6** |
| 14 | **GoDaddy DNS**: you'll make the record changes (I'll give exact values), or confirm I should walk you through them. Also: access to your Framer project to detach the domain at cutover. | — | — | **Blocks Phase 7** |
