# Side-Quest Document Studio: one flexible-year product per jurisdiction

**Current Square publishing decision:** Create one product of each type for each Australian state or territory, rather than separate Year 3 / Year 7 / other school-year listings. The PDF contains common pages and clearly identified **OPTIONAL** sections for the first year through Year 2, Years 3–6, Years 7–10 and Years 11–12. Parents can leave irrelevant pages blank, skip them on screen, or print selected page ranges. PDFs **do not** automatically hide or delete pages based on their answers.

Side-Quest's Owner HQ creates the PDFs. The seller separately lists the products in Square and uses Square's existing fulfilment/digital delivery setup. This workflow does **not** access Square Dashboard, publish listings, issue refunds or alter order data.

## The 48 final product families

There are **six product types × eight jurisdictions** (NSW, VIC, QLD, WA, SA, TAS, ACT and NT). The current default base prices in the Side-Quest catalogue are:

| Product | Default AUD | PDF generated for Square | Customer fulfilment |
| --- | ---: | --- | --- |
| Blank Home Education Planning Template | $4.99 | One flexible-year planning workbook, printable + fillable | Static digital download |
| **Self-Guided Home Education Workbook** | $9.99 | A *different*, structured guide with examples, step-by-step exercises, planning tables, plus printable + fillable editions | **Static digital download. No online wizard or family-specific preparation** |
| Printed Home Education Planning Workbook | $14.99 | One flexible-year printable master | Printed and shipped, not a PDF download |
| Complete Planner & Diary, Blank | $29.95 | One flexible-year complete planner, printable + fillable | Static digital download |
| Complete Planner & Diary, Personalised | $39.95 | Owner production master | Private customer information must still be collected and a personalised PDF prepared per family |
| Complete Planner & Diary, Spiral Bound | $69.95 | Owner print-production master | Individually prepared, printed, spiral-bound and shipped |

These are catalogue **defaults**, not live Square prices. The owner-only \`GET /api/admin/document-studio/square-production\` displays saved Side-Quest product records, prices and statuses to help identify differences. It cannot verify or alter Square product details.

There are **48 listing families**, without separate year-specific versions. Extra-child charges in Side-Quest do not transfer to Square unless explicitly configured there. Past purchases of an older online-guided product must remain accessible to those purchasers; new guided on-demand checkout via the legacy Side-Quest wizard is now blocked until there is a static file and appropriate release approval.

## Make and sell a product

1. Open **Owner HQ → Document Studio**, select a state/territory, then select one of the six existing document products. **There is no year picker.**
2. Generate that state's flexible-year document in the correct mode. Digital blank/self-guided products generate print + fillable PDFs. Print products generate a print master. Personalised products generate unmistakably labelled **OWNER PRODUCTION MASTERS**, never fake completed family plans.
3. Inspect the actual PDFs. Check the opening **How to use this flexible-year workbook** instructions; the common planning, curriculum overview, resource, timetable and evidence pages; and the optional early, primary, secondary and senior sections. The family records its own actual year/stage and skips irrelevant pages.
4. For NSW secondary schooling the **OPTIONAL Years 7–10** section allows families to enter their own two different additional learning areas and check their actual syllabus requirements. The product does not pre-select electives.
5. Test form text and checkboxes in a PDF reader, save, reopen and print a realistic A4 example. Review all pages for layout and verify current official educational requirements.
6. Use the review acknowledgement to download the customer-ready digital ZIP or owner production master as appropriate. A local browser note tracks what you have downloaded. It does not approve regulatory accuracy or contact Square.
7. Copy the prepared **year-neutral Square listing title and description**, verify its actual selling price and conditions, and create/adjust the listing in Square.
8. For **blank, self-guided and complete-blank digital** products, attach the reviewed customer ZIP using the established Square digital fulfilment flow and test that it arrives correctly.
9. For **personalised** products, use a separate, secure collection and completion process after purchase; do not send the blank/owner proof to customers as a purported final personalised document.
10. For **printed products**, verify paper, binding, production time, packing and actual shipping costs before accepting orders; the PDF master is not a physical delivery.
11. Optionally record the Square listing URL in Document Studio. This is browser-local and self-reported, **not** a direct Square integration. Regenerated files need to be manually updated on any existing Square listings.

## How the self-guided workbook works

The self-guided product is **offline and self-completed**. It contains explanation/example/your-turn exercises for learning about the learner; choosing goals; selecting real activities; listing real resources; choosing evidence and reviews; and putting these ideas together in a practical table. Examples are illustrative rather than statements about a real child. Families can print the workbook or type directly into its genuine fillable form fields. **No Side-Quest online guided session, consultation or personalised authoring is included.**

Keep the old buyer-specific online guided records and entitlements for historical purchases, but do not use the old online guided process for new Square orders.

## Jurisdiction and layout safety

These are **independent planning companions**, not government forms or registration guarantees. Source catalogue last checked **14 October 2026**. Specific current registration, syllabus/course patterns and prescribed documents must be verified separately for the relevant authority before publication or reuse. The NT official prescribed self-developed template may still be required, and a Side-Quest planning companion does not replace it. The optional senior sections do not purport to award or satisfy senior secondary certification.

PDF printing/reader behavior varies: some readers may not show or print overly long text beyond the box height. Do realistic long-answer tests. Different subject/stage pages are retained in the same document, rather than automatically removing nonapplicable pages.

The repository's **Document Studio PDF Proof** workflow checks 150 representative PDFs: old year-specific proofs for backwards compatibility plus 80 **all-year** product outputs (all eight jurisdictions × six types × relevant print/fillable formats). It checks A4, every page's text bounds, form geometry, unique fields, and text/checkbox save/reopen. The PDF audit and test passes confirm structural behavior, not independent legal/regulatory endorsement or live Square delivery.
