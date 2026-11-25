# Document Studio → Square exports (post-cleanup)

Owner HQ → Document Studio remains a **PDF authoring tool**, not a store. All checkout, price, order, shipping and file-delivery operations are managed externally in Square.

- Pick a state or territory, then select one of six document types: blank planning template, self-guided planning workbook, printed planning workbook, complete blank planner, personalised planner owner master, or spiral-bound planner owner master.
- Generate A4 print and/or fillable PDF proofs, inspect all pages, verify current state requirements, then download the relevant reviewed ZIP for Square.
- Do **not** publish a personalised or printed **owner production master** as an automatically delivered final product. Personalised orders require the buyer's details and a separate secure fulfilment process.
- For other activity sheets and workbooks, use the expandable worksheet layout generator in Document Studio.
- Square item listings, live prices, discounts, order records and shipping are **not** accessible or updated by this tool.
- The 48 product options are templates (six per eight Australian jurisdictions), **not** Side-Quest in-app catalogue records.
- Legacy orders and downloads have been retired; there are no in-app historical shop purchases to support.
- Database migrations are immutable, and no new migrations are required for this source cleanup.
- Jurisdiction summaries were last reviewed on 14 October 2026; independently confirm current official requirements before publishing.

Tests: `worker/test/homeEducationPdfQuality.test.mjs`, `worker/test/studioProductPdf.test.mjs`, `worker/test/documentStudioCatalog.test.mjs`. Visual PDF proof workflow remains for the full state and edition matrix.
