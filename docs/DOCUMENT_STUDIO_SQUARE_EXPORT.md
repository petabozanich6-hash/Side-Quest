# Side-Quest Document Studio: six-product Square publishing workflow

**What the owner intends:** Make each existing home education product in Owner HQ, download its correct PDF output, create a separate product listing on the owner's independently configured Square store, and use the owner's existing Square delivery arrangements for eligible **static digital** products. Document Studio does not log in to Square or create Square listings.

## What is actually configured in Side-Quest

The existing Side-Quest catalogue seeder defines **48 potential products**: six offers in each of eight states/territories, at these default base prices:

| Offer | Default AUD | Generation | Actual fulfilment |
| --- | ---: | --- | --- |
| Blank Home Education Planning Template | $4.99 | Standard planning workbook, printable + fillable PDFs | Static Square digital delivery after editorial approval |
| Guided Home Education Plan | $9.99 | Owner guidance/production master, with prompts and a guide | Requires buyer responses and individually completed guidance after purchase |
| Printed Home Education Planning Workbook | $14.99 | Standard A4 print master | Print, bind, post physical copies; check real costs and postage |
| Complete Planner & Diary, Blank PDF | $29.95 | Complete planning workbook, printable + fillable PDFs | Static Square digital delivery after editorial approval |
| Complete Planner & Diary, Personalised PDF | $39.95 | Complete personalised owner production master | Secure buyer intake, individual book preparation and delivery after purchase |
| Complete Planner & Diary, Spiral Bound | $69.95 | Complete print production master | Secure buyer intake, individual production, spiral binding, post |

These are **catalogue defaults, not verified prices in Square**. The new owner-only \`GET /api/admin/document-studio/square-production?year=3\` reads the actual Side-Quest product rows, saved prices, titles, statuses and attachment existence. It highlights missing/duplicate items; it does not invent Square storefront status. The raw product record is not altered by this read.

The existing Side-Quest family-price logic may add $1 or $2 per extra child. That pricing does **not** transfer to Square automatically; set up actual Square variants/charges if offering the same multi-child pricing. Likewise, **48 is a count of state-by-type product families, not every year-specific variant**. A Year 3 product cannot honestly be marketed as a complete K–12 package. Prepare separate year-specific items or verified Square variants and correctly match each actual file to the listing.

## How to make one product

1. In **Owner HQ > Document Studio**, select the state/territory and the **year or first-school-year level**.
2. Choose the **exact product type** from the six configured offers. Inspect the actual Side-Quest catalogue status and price; Square may differ.
3. For NSW Years 7–10, select two different additional learning areas. Those choices are included in the PDF and the suggested Square title and description. Verify the actual syllabuses separately.
4. Generate the PDF master(s) using the product-specific selector. **Blank digital products** return downloadable print and fillable customer editions. **Printed products** return a print-only master. **Guided/personalised products** return clearly marked OWNER production masters, NOT customer-complete products.
5. Open both proofs, test saved form values, print a real A4 sample, review page flow and source accuracy. Then use the review acknowledgement to download the correct ZIP. This records local progress **on that browser only**. It does not activate a product, mark a sale, collect payment, or change fulfilment.
6. Copy the suggested Square title and customer description (including the actual year and any electives), verify price, correct region, exact product type and the separate Square listing's delivery configuration.
7. For the **two blank digital products**, attach the reviewed customer ZIP to your existing automatic digital delivery. Make a test Square purchase and verify the email/download contains exactly those files.
8. For the **guided and personalised products**, first complete a separately tested private intake and individual PDF delivery process. Do **not** attach the generic owner master or a fictional sample as a supposedly personalised completed product. These are made-to-order services, not instant generic PDF sales.
9. For **printed and spiral-bound** products, proof real paper quality, production time, binding, packing, postage, Australian delivery costs and tracking. These are physical goods; do not represent them as automatic PDF delivery.
10. Review your final Square listing independently; Document Studio does not know whether a Square item is live, paused or missing.
11. In Document Studio, optionally paste the Square listing URL and record **I created this Square listing**. This is a **manual, browser-local note**, not a verification against Square. If you regenerate the files later, the local status warns that the recorded Square listing may need updating; the tool does not replace files on Square.

## Educational and PDF quality

The user-facing document generator uses independent state/territory guidance, official source references, curriculum and learning-area sections, individual learning planning prompts, evidence records and interactive AcroForm fields in fillable editions. This does not constitute an official form or a registration guarantee. Northern Territory official prescribed documents remain necessary where required; personalised parent information is never invented; NSW syllabus implementation and secondary course choices must be checked.

The existing jurisdiction information was last checked **2026-10-14** and is **not** certified current. Independent review against the latest official rules and actual education practice is required before sale, as in [HOME_EDUCATION_DOCUMENT_QUALITY.md](HOME_EDUCATION_DOCUMENT_QUALITY.md).

The **Document Studio PDF Proof** GitHub workflow generates representative 50-PDF print/fillable proofs across all eight jurisdictions and primary/secondary years. It checks A4 geometry, PDF text bounds, field overlaps, consistency and text/checkbox save-and-reopen. The new \`worker/test/documentSquareProduction.test.mjs\` additionally tests the 48 catalogue definitions and six output classifications. Automated tests are structural, not an independent editorial or legal approval.

### Limitations and safeguards

- The new static PDFs do not include original Ignis artwork or intricate professionally illustrated spreads. They need further design refinement if the intended price points are to be justified.
- A filled form can visually hide typed text when the entry exceeds its displayed field; test realistic long answers, reopening and printing in common PDF readers.
- Output is made for **one selected year / elective combination**; another age band or syllabus choice requires a separately generated version.
- Owner production masters for guided and personalised services are intentionally marked as such. The current Square export screen does **not** collect customer data or automatically prepare personalised books.
- The original Side-Quest shop routes and release controls are still present separately; no current Square Dashboard product, payment integration or automatic delivery has been modified by this workflow.
