# Figure report (/research thumbnails)

- **PDFs:** in `papers/<id>.pdf`.
- **Candidates:** in `papers/candidates/<id>/`. That folder is git-ignored and never published.
- **Published figures:** the chosen figure is copied to `src/assets/papers/<id>.png`. Those are the only published images.
- **Rendering:** figures are rendered at 300 DPI and cropped to the figure, without the caption.
- **To swap a figure:** copy any candidate over `src/assets/papers/<id>.png`.

Selection rule:
1. Prefer an overview, pipeline or method diagram.
2. If a paper has no diagram, use its headline-results figure or main results table.
3. Avoid dense multi-panel plots.

## Batch 1

| id | PDF source | Figure chosen | Why | Candidates saved | Status |
|---|---|---|---|---|---|
| ccps-emnlp25 | https://aclanthology.org/2025.emnlp-main.530.pdf | Figure 1, page 4 | Overview of the method's three stages (perturbation, feature extraction, classification head). It explains CCPS at a glance. | `fig1-p4.png` (only figure in the main text) | done |
| rmcb-eacl26 | https://aclanthology.org/2026.eacl-long.78.pdf | Figure 1, page 7 | No method diagram. This is the headline-results figure: the calibration vs. discrimination trade-off across all methods. It stays readable as a shape at thumbnail size, which the table doesn't. | `fig1-p7.png`, `table2-p6.png` (main results table), `fig2-p8.png` (calibration curves, dense) | done |
| bicr-aacl26 | https://arxiv.org/pdf/2605.10893 (no ACL Anthology PDF yet) | Figure 1, panel A, page 2 | Panel A is the method diagram: real image vs. blank image, shared probe, ranking constraint. Panel B (results scatter) would shrink everything at 16:10. | `fig1A-method-p2.png`, `fig1-p2.png` (full figure, both panels), `fig2-p8.png` (reliability diagrams, dense) | done |

## Batch 2

| id | PDF source | Figure chosen | Why | Candidates saved | Status |
|---|---|---|---|---|---|
| vlm-confidence-attack | https://arxiv.org/pdf/2608.06571 | Figure 1, page 2 | Shows the attack itself: same answer, flipped confidence, on two example images. | `fig1-p2.png`, `fig2-p6.png` (decomposition diagram) | done |
| medvlm-confidence | https://arxiv.org/pdf/2606.15910 | Table I, page 4 | No figures in the main text; this is the core comparison of all nine estimators on three medical datasets. | `table1-p4.png` | done |
| finvlm-confidence | https://arxiv.org/pdf/2608.06532 | Figure 1, page 4 | No method diagram; the reliability diagrams across four financial conditions are the headline result and read as a shape at small size. | `fig1-p4.png`, `fig3-p7.png` (risk-coverage curves) | done |
| chart-review-astro26 | ASTRO 2026 abstract page: https://amportal.astro.org/sessions/pqa-03-22879/risk-controlled-selective-automation-of-oncology-chart-review-via-representational-stability-111554 (journal PDF blocked) | Table 1 (abstract page) | No figure. The table shows the result in one glance: cases automated by CCPS vs. deferred, with error among automated, per complexity tier. | `table1-astro.png` | done (table) |
| safe-clinical-astro26 | ASTRO 2026 abstract page: https://amportal.astro.org/sessions/ss-44-22869/teaching-language-models-safe-clinical-decision-making-risk-informed-training-to-reduce-catas-111089 | Table 1 (abstract page) | No figure. Per-model gains in risk-weighted accuracy and error severity from risk-informed training. ASTRO's page shows "?RWA" and "?Error Severity"; I restored the Δ in those two headers. | `table1-astro.png` | done (table) |
| ctcae-validation-astro26 | ASTRO 2026 abstract page: https://amportal.astro.org/sessions/pqa-06-22881/clinical-validation-of-a-privacy-preserving-llm-for-end-to-end-ctcae-toxicity-assessment-in-p-112161 | Table 1 (abstract page) | No figure. Extraction and grading F1 per adverse event, with the overall median. | `table1-astro.png` | done (table) |
| ctcae-grading-astro25 | ASTRO 2025 abstract page: https://am25.astro.org/sessions/pqa-09-21643/efficient-ctcae-grading-for-post-radiotherapy-toxicities-using-large-language-models-a-privac-108742 | Table 1 (abstract page) | No figure. Before vs. after instruction fine-tuning for Llama and Qwen across grades and metrics. | `table1-astro.png` | done (table) |
| hybrid-st-bhi25 | https://arxiv.org/pdf/2408.04775 (open version of the IEEE BHI paper) | Figure 1, page 3 | Diagram of the iterative student-teacher refinement loop. | `fig1-p3.png`, `fig2-p6.png` (performance curves) | done |
| toxicity-peft-aapm25 | not obtained: Medical Physics abstract with no DOI or open PDF; no AAPM program page found; the Henry Ford record is text only, with no table | none | | | PDF unavailable |
| localized-st-astro24 | not obtained: Elsevier blocks direct download, and the ASTRO 2024 meeting site (am24.astro.org) sits behind a Cloudflare bot check | none | Couldn't check for a table. | | PDF unavailable |
| prompt-refinement-iccr24 | https://arxiv.org/pdf/2402.04075 | Figure 1, page 1 | Schematic of the method: Mixtral student, GPT-4 teacher, prompt refinement loop. | `fig1-p1.png`, `fig2-p4.png` (accuracy per epoch) | done |
| toxicity-pipeline-aapm23 | not obtained (no page found anywhere) | none | | | PDF unavailable |
| nlp-guide-bjrai25 | https://arxiv.org/pdf/2311.02205 (open version; the OUP PDF refuses direct download) | Figure 2, page 10 | The paper's own framework for assessing NLP tools before clinical use. Figure 1 is a reproduction of Vaswani et al.'s transformer diagram, so it isn't used. | `fig2-p10.png`, `fig1-p5.png` | done |
| prose2poem-tallip23 | https://arxiv.org/pdf/2109.14934 | Figure 1, page 4 | Schema of the processing stages, from prose to final poem; readable at thumbnail size. Figure 2 (full pipeline) is tall and its text gets tiny. | `fig1-p4.png`, `fig2-p5.png` | done |
| pgst-nle | https://arxiv.org/pdf/2009.01040 | Figure 1, page 5 | The method's five stages with an example sentence. | `fig1-p5.png`, `fig5-p10.png` (token lattice) | done |
| coper-icwr21 | https://arxiv.org/pdf/2107.05722 | Figure 1, page 2 | Overall approach: ranking and query-adapted re-ranking. | `fig1-p2.png` | done |
| finance-graph-dataset | none (under review, no public version) | none | | | PDF unavailable |
| funding-tcss24 | https://arxiv.org/pdf/2401.00942 | Figure 4, page 8 | Shows the method: PubMed and SBIR topics mapped per year and compared. Figure 1 is a motivational timeline, very wide and thin. | `fig4-p8.png`, `fig1-p2.png` | done |
| mambanet-sncs24 | https://arxiv.org/pdf/2210.17060 | Figure 1, page 2 | Architecture overview. | `fig1-p2.png` | done |
| feature-imitation | https://arxiv.org/pdf/2309.12279 | Table 1, page 3 | No figures; this is the first main results table (Bitcoin price prediction). | `table1-p3.png` | done |
| fetal-sex | https://arxiv.org/pdf/2110.06131 | Figure 1, page 3 | The paper's only figure: phonocardiogram signals with separated noise. Tables 1 and 2 are dense. | `fig1-p3.png` | done |

## How the ASTRO tables were made

The published ASTRO abstracts have no figures, but their meeting pages show the abstract's Table 1 as an HTML table. I captured each one at 3x from that page, restyled in a plain neutral look (white, black rules top and bottom, one sans font) so all four match. The numbers and labels are unchanged, apart from the Δ noted above. Captions are left out.

## What I need from you

- **localized-st-astro24** (ASTRO 2024): open its ASTRO 2024 abstract page or IJROBP PDF in your browser and save it as `papers/posters/localized-st-astro24.pdf` (or send the poster). If it has a Table 1, I'll capture it the same way.
- **toxicity-peft-aapm25** and **toxicity-pipeline-aapm23** (AAPM): put the poster or abstract PDF at `papers/posters/<id>.pdf`.
- **finance-graph-dataset:** put the manuscript at `papers/finance-graph-dataset.pdf`. It stays local; `papers/` is never published.
- Alternatively, fetch the Elsevier PDFs through MSU library access.
