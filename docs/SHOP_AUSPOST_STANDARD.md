# Side-Quest: Australia Post standard checkout

- **Origin postcode:** 2340 (Tamworth area). The Worker uses `AUSPOST_FROM_POSTCODE` when supplied; otherwise defaults to `2340`.
- **Service:** Australia Post domestic **Standard Parcel Post ONLY** (`AUS_PARCEL_REGULAR`). No Express Post option is implemented.
- **API key:** The owner's existing Cloudflare Worker secret `AUSPOST_PAC_API_KEY` is sent as the private `AUTH-KEY` header to the Australia Post PAC endpoint. Never put it in frontend source, repository, screenshots or tickets.
- PAC returns **published retail rates**, not individual MyPost Business contract/discount rates. The owner creates labels and lodges parcels through MyPost Business separately.
- Customers select their delivery postcode in the cart before Square checkout. Standard postage is quoted from the server and verified again immediately before the Square link is created. Square then collects the shipping address. The backend flags any mismatched/missing destination postcode on a paid order for manual address review, rather than treating it as ready to post.
- **Owner HQ > Shop > Products** has four new fields for each physical product: packed weight in grams, length/width/height in whole centimetres, measured **including packaging**. Until measured, those fields can remain blank and the product stays a draft. A physical order with missing measurements fails closed with an informative message.
- Combined orders are conservatively modelled as stacked individual packed units, with largest footprint, summed heights and actual combined weight. Orders beyond Parcel Post size/weight limits are not given a guessed quote; contact the owner for a manual shipping arrangement.
- The shop deliberately separates **made-to-order preparation and weekly dispatch** from transit time. Never promise next-day delivery or Express Post while stock is not ready.
- **Digital-only orders:** no postage, and no postcode required. Existing PDF/ZIP downloads are unaffected.
- Legacy product `postage_cents` values are preserved in the database for history, but not used to set the price of new ordinary physical shop checkouts.
- This is **not** automatic MyPost Business label creation, parcel pickup or negotiated-rate integration.

## Before opening physical product sales

1. Verify that the PAC secret is configured on the **deployed** Cloudflare Worker (not only a preview environment).
2. In Owner HQ, measure and fill all four shipping fields for each sellable physical product. Do not guess when sourcing is incomplete.
3. In a test/Square sandbox shop, quote multiple NSW and interstate destinations with one and several products, compare against the Australia Post calculator, and confirm the Square amount includes postage exactly once.
4. Check both a matching Square shipping postcode and a changed one; mismatches must remain in **Check shipping address** until manually resolved.
5. Confirm your real packaging choice and label cost. Square payment processing on the postage portion and packing supplies remain your expense; advertised PAC retail rates may provide some buffer over MyPost Business paid rates, but this is not guaranteed.

Source: https://developers.auspost.com.au/apis/pac/tutorial/domestic-parcel

## Shop launch (9 Nov 2026)

On the first request after deploy, the Worker runs a one-time launch step (`applyLaunch` in `worker/src/shopCatalog.ts`, prices in `worker/src/data/shopLaunchPrices.ts`):

- Every untouched draft becomes a visible, buyable listing at a starting price (physical: **Made to Order**, digital: **In Stock**), moved to **Launch Now**. Change any price in **Owner HQ → Shop → Products**.
- **Held back as drafts:** Printed Quest Books, the Educational books range, and any product whose title or description mentions workbooks. Publish those yourself when they're finished.
- Physical listings show "Posted in our weekly dispatch. Shipping times may vary." Monthly boxes and letter clubs: order by the 8th, posted around the 15th; a one-off box costs $10 more than a month (letters $3 more).
- Packed weights and sizes are conservative estimates so Australia Post can quote. Re-measure real parcels when stock is in hand.
- The public shop switch (`features.shopOpen`) is turned on.
- Only empty fields are filled; anything you already entered, and any product you already published, hid or discontinued, is left alone. It never runs twice.
