# Presentations: photo review (Phase A)

Source folder: `presentation pictures/` (project root). It is gitignored and never published.
Every output was converted to JPG, auto-oriented, sized to at most 2400px on the long edge, and
re-encoded with **no metadata** (no EXIF, GPS, ICC or XMP; checked with sharp after writing).

Capture dates come from each file's metadata and are shown in local time at the venue. GPS was
read only to help match events and does not appear in any output file.

## Matched photos

| Original | Output | Captured | Event | Kind | How identified | Suggested caption | Suggested alt text | Flags |
|---|---|---|---|---|---|---|---|---|
| IMG_9277.HEIC | src/assets/presentations/astro-2026/01.jpg | 2026-09-29 | ASTRO 2026 Annual Meeting, Boston | talk (oral) | Title slide reads "ASTRO 2026 … Thomas M. Menino Convention & Exhibition Center, Boston" and "Teaching Language Models Safe Clinical Decision-Making". GPS is in Boston. | Presenting our oral session at ASTRO 2026, Boston. | Reza at a podium beside a large screen showing the title slide "Teaching Language Models Safe Clinical Decision-Making", with the audience seen from behind. | — |
| IMG_4611.JPG | src/assets/presentations/astro-2026/02.jpg | 2026-09-28 | ASTRO 2026 Annual Meeting, Boston | poster (spotlight, digital poster session) | ASTRO 2026 badges and signage. Screen 30 shows session "PQA 03 – Digital Health Innovation and Informatics…", which lists "Risk-Controlled Selective Automation of Oncology… – Reza Khanmohammadi". No GPS. | With collaborators at our digital poster screen at ASTRO 2026, Boston. | Four people with conference badges stand beside a digital poster kiosk numbered 30 that lists the session's posters. | **3 other people clearly identifiable (full faces, main subjects)** |
| IMG_1122 2.HEIC | src/assets/presentations/bhi-2025/01.jpg | 2025-10-27 | IEEE BHI 2025, Atlanta | talk | Slide footer reads "BHI 2025 … Hybrid Student-Teacher Large Language Model Refinement for Cancer Toxicity Sympto…". GPS is Georgia Tech, Atlanta. | Presenting hybrid student-teacher LLM refinement at IEEE BHI 2025, Atlanta. | Reza in a suit gesturing toward a projected slide about dataset, models and a performance-cost ratio. | — |
| IMG_1145 2.jpg | src/assets/presentations/bhi-2025/02.jpg | 2025-10-30 (evening) | IEEE BHI 2025, Atlanta | talk (NextGen Scholar presentation) | Slide reads "BHI2025 NSF-EMBS-Google NextGen Scholar Application" with Reza's name. "IEEE BHI2025 Welcome" banner and a Georgia Tech podium. No GPS; it looks like a video frame (1928×1056). | Presenting as an NSF-EMBS-Google NextGen Scholar at IEEE BHI 2025, Atlanta. | Reza speaking into a microphone beside a screen showing his NextGen Scholar slide with NSF, IEEE EMBS and Google logos. A BHI 2025 welcome banner is at right. | Audience seen from behind; one face far away at right edge (not flagged as identifiable) |
| IMG_4821.HEIC | src/assets/presentations/precision-health-2025/01.jpg | 2025-10-31 | MSU and Henry Ford Health Precision Health Symposium | poster | Poster "Enhancing LLM Reliability in Precision Health: Calibrating Confidence by Probing Perturbed Representation Stability" (CCPS) with MSU and Henry Ford Health logos. Date matches Oct 2025 and GPS is in East Lansing. | Presenting our CCPS poster at the MSU and Henry Ford Health Precision Health Symposium. | Reza standing beside an easel poster titled "Enhancing LLM Reliability in Precision Health". | — |
| IMG_1157.HEIC | src/assets/presentations/precision-health-2025/02.jpg | 2025-10-31 | MSU and Henry Ford Health Precision Health Symposium | award (neither talk nor poster) | Certificate reads "Honorable Mention". Same day and same GPS as the CCPS poster photo. | Receiving an Honorable Mention at the MSU and Henry Ford Health Precision Health Symposium. | Reza holding up an Honorable Mention certificate next to a presenter, with another person at a podium in the background. | **2 other people clearly identifiable (the presenter handing the award; the person at the podium)** |
| IMG_7760 2.HEIC | src/assets/presentations/astro-2024/01.jpg | 2024-10-01 | ASTRO 2024 Annual Meeting, Washington DC | poster (digital) | The digital poster screen shows "A Novel Localized Student-Teacher LLM for Enhanced Toxicity Extraction in Radiation Oncology", with ASTRO 2024 branding. GPS is in Washington DC. The original was stored sideways; it's rotated upright here. | With our digital poster at ASTRO 2024, Washington DC. | Reza with arms crossed next to a digital poster screen titled "A Novel Localized Student-Teacher LLM for Enhanced Toxicity Extraction in Radiation Oncology". | Small background attendees only |

## Unsorted

These photos don't clearly match any event on the list, so I haven't assigned them. Tell me which
event each belongs to, or whether to drop it.

- **IMG_9121.HEIC → src/assets/presentations/unsorted/01.jpg** (2025-04-23, GPS East Lansing).
  - The poster is "Efficient CTCAE Grading for Post-Radiotherapy Toxicities using LLMs: A Privacy-Preserving Approach using Instruction Fine-Tuning". That is the ASTRO 2025 poster's content.
  - But the photo was taken in East Lansing in April 2025, not San Francisco in Sep–Oct 2025, so it isn't from ASTRO 2025.
  - It is probably a local MSU event, which isn't on the list.
  - Suggested caption, if you tell me the event: "Presenting our CTCAE grading poster at {event}."
  - Flags: none.
- **IMG_4162.HEIC → src/assets/presentations/unsorted/02.jpg** (2023-11-09, GPS East Lansing).
  - The poster is "Enhancing Information Extraction from EHRs: An Iterative Prompt Engineering Approach Using GPT-4 and Llama2" (MSU and Henry Ford Health), board 35, with Sparty.
  - It isn't ICAIF 2023: the location is East Lansing, not Brooklyn, and the topic differs.
  - It is likely an MSU or Henry Ford poster event in Nov 2023, which isn't on the list.
  - Flags: Sparty, the mascot costume (no identifiable person).

## No photos found for

- JPMorgan AI Research talk (Jan 2026)
- ASTRO 2025 (San Francisco)
- AAPM 2025
- ICCR 2024
- ACM ICAIF 2023
- IEEE BHI 2023
- AAPM 2023
- Henry Ford + MSU Cancer Research Symposium 2023
- EMNLP 2025
- EACL 2026

Some of these still get a card in Phase B from their YouTube video.

## Lead photo per event

- **ASTRO 2026:** astro-2026/01.jpg (oral talk, title slide readable, no identifiable faces).
- **IEEE BHI 2025:** bhi-2025/01.jpg (talk with the BHI 2025 slide footer). This card also gets the YouTube video Dq-Y-ybQOIs, so the video facade leads and the photos open from "Photos (2)".
- **Precision Health Symposium 2025:** precision-health-2025/01.jpg (CCPS poster, only you in frame).
- **ASTRO 2024:** astro-2024/01.jpg (the only photo).
