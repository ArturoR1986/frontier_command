# Developer/player review validation

Recorded 2026-09-11. This validates the research artifact, not the game.

- Report: `docs/DEVELOPER_AND_PLAYER_REVIEW.md`; 4,699 whitespace-separated body words before the source appendix.
- PDF: `output/pdf/rimworld-starcraft-development-review.pdf`; 13 pages, 67,779 bytes.
- PDF SHA-256: `fb391835f2401d46fa60e7ec1609113b0ea0ec46e5de670d0ef454bedbb9e01c`.
- Source inventory: 27 numbered records; all cited, all defined, and all original URLs present in PDF link annotations.
- Player sample: 14 named review records, four discussion sources; purposive English-language sample, not representative sentiment measurement. Two professional reviews supplement it.
- Generated with ReportLab through `scripts/build-research-report.py`; reopened and extracted all pages with pypdf.
- Rendered final PDF with Poppler at 90 dpi; visually inspected all 13 pages in paired page images. Tables, source notes, page transitions and citation separators are readable and unclipped.
- Nine revised Markdown documents passed local-link inspection (26 targets); whitespace inspection passed. Review-baseline remote commit: `2e1783f00167ef7429ea210a3d3ad60b38e6c8e1`.

No new reference-game play sessions, complete conference-video viewing, player recruitment, gameplay implementation, performance benchmark, or product acceptance test occurred in this documentary review. Proposed experiments are unexecuted. Dynamic review-page publication years remain unspecified where not displayed. Developer recollection, player opinion, analysis, and recommendations are distinguished in the report.

The PDF renderer may assign a new creation timestamp on regeneration, so the byte hash identifies this delivered artifact rather than promising byte-identical rebuilds.
