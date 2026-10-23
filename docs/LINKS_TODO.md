# Links to do

Links or details that could not be verified are left out of the site and listed here.

## News (`src/data/news.yaml`)

Checked 2026-10-21: every link resolved to the right page.

- **2026-09, "Vision-language models that know when they're guessing" (BICR), [Paper].**
  It points at arXiv (https://arxiv.org/abs/2605.10893) because the ACL Anthology has no
  AACL-IJCNLP 2026 volume yet (aclanthology.org/events/aacl-2026/ returns 404). Swap in the
  Anthology page once it is published.

## Research (`src/data/publications.yaml`)

Checked 2026-10-21.

- **bicr-aacl26: no ACL Anthology page yet.** Same as above: the main link is the arXiv entry.
  Add `paper:` with the Anthology URL once it exists.
- **toxicity-pipeline-aapm23: no page and no author list.** "A Novel Learning Approach for Training
  Transformer-Based Natural Language Processing Pipeline to Extract Toxicity Symptoms in Prostate
  Cancer Patients after Definitive Radiotherapy" (AAPM 2023) wasn't found in Crossref, Medical
  Physics, Henry Ford Health's repository, your old site, or the resume. It shows as
  "Reza Khanmohammadi et al." with no links. Send the co-authors and a link (Medical Physics
  abstract page or DOI) if you have them.
- **toxicity-pipeline-aapm25: no DOI found.** The Medical Physics 52(10) abstract has no DOI in
  Crossref, so the Paper link goes to Henry Ford Health's repository record for it
  (https://scholarlycommons.henryford.com/radiationoncology_mtgabstracts/385), which also gave the
  author list. Replace it with the Wiley page if you have one.
- **finance-graph-dataset: no paper page.** Under review with no links; the authors come from the
  old site and are shown as initials there.

## About (`src/data/about/*.yaml`)

Checked 2026-10-21. These links are left out of the page until they can be verified:

- **Experience › University of Guilan:** Guilan NLP Group → https://nlp.guilan.ac.ir/people doesn't resolve (no DNS for nlp.guilan.ac.ir).
- **Beyond Research › FISU Most Active Student Ambassador:** Profile → http://fisustudentambassadors.net/alumni/tproduct/271020961-704277651461-iran doesn't resolve (the domain is gone).
- **Honors › Top Cancer Control Abstract Award:** the "Watch the talk" video (https://www.youtube.com/watch?v=8ma7UzopwKQ&t=205s) is live and kept, but its YouTube title is "Iterative Prompt Refinement for Radiation Oncology Symptom Extraction". Worth confirming it's the symposium talk.
