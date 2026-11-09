import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import ShopSection from "./ShopSection";

jest.mock("react-router-dom", () => ({ Link: ({ children, to }) => <a href={to}>{children}</a> }));
global.IS_REACT_ACT_ENVIRONMENT = true;

const product = (n, department, extra = {}) => ({
  id: `00000000-0000-0000-0000-00000000000${n}`, slug: `p${n}`, title: `Thing ${n}`, department, tags: [], images: 0,
  status: "in_stock", status_label: "In stock", price_cents: 1000 * n, variants: [], personalisation: [], addons: [],
  subscription: false, can_buy: true, fulfilment: "digital", postage_cents: 0, max_per_order: 5, gift_months: [], ...extra,
});
const SHOP = {
  open: true, can_buy: true,
  departments: [{ id: "arts", label: "Arts" }, { id: "gifts", label: "Gifts" }],
  books: [{ id: "b1", title: "Maths Quest Book", year_label: "Year 1", subject_label: "Mathematics", price_cents: 1995, look_pages: 0, printed: [] }],
  products: [1, 2, 3, 4, 5, 6].map((n) => product(n, "arts")).concat([product(7, "gifts", { title: "Dragon plush", status: "pre_order", status_label: "Pre-order" }),
    product(8, "gifts", { title: "Volcano kit", status: "coming_soon", status_label: "Coming soon", can_buy: false, fulfilment: "physical", digital_cents: 900 })]),
};
let root, box;
const $ = (sel) => box.querySelector(sel);
const click = async (el) => act(async () => el.dispatchEvent(new MouseEvent("click", { bubbles: true })));
const byText = (text) => [...box.querySelectorAll("button")].find((b) => b.textContent.includes(text));
beforeEach(async () => {
  localStorage.clear();
  global.fetch = jest.fn(async () => ({ ok: true, json: async () => SHOP }));
  box = document.createElement("div"); document.body.appendChild(box); root = createRoot(box);
  await act(async () => root.render(<ShopSection standalone />));
});
afterEach(async () => { await act(async () => root.unmount()); box.remove(); });

test("the cart is always reachable, shows a count, and confirms each addition", async () => {
  expect($('[data-testid="shop-cart-button"]').textContent).toContain("Cart");
  expect($('[data-testid="shop-cart-count"]')).toBeNull();
  const add = [...$('[data-testid="shop-book-b1"]').querySelectorAll("button")].find((x) => x.textContent === "Add");
  await click(add);
  expect($('[data-testid="shop-cart-count"]').textContent).toBe("1");
  expect($('[data-testid="shop-added"]').textContent).toContain("Maths Quest Book");
  await click(byText("View cart"));
  const cart = $('[data-testid="shop-cart"]');
  expect(cart.textContent).toContain("Maths Quest Book");
  expect(cart.textContent).toContain("$19.95");
  await click(cart.querySelector('[aria-label="Remove Maths Quest Book"]'));
  expect($('[data-testid="shop-cart"]').textContent).toContain("Your cart is empty");
});

test("Everything shows a short row per department with See all, and search narrows the shop", async () => {
  const arts = $('[data-testid="shop-group-arts"]');
  expect(arts.querySelectorAll('[data-testid^="shop-product-"]').length).toBe(4);
  await click(byText("See all 6"));
  expect($('[data-testid="shop-group-arts"]').querySelectorAll('[data-testid^="shop-product-"]').length).toBe(6);
  // Ordinary "In stock" items carry no badge; unusual states do.
  await click([...box.querySelectorAll('[role="tab"]')].find((t) => t.textContent === "Everything"));
  expect($('[data-testid="shop-product-p1"]').textContent).not.toContain("In stock");
  expect($('[data-testid="shop-product-p7"]').textContent).toContain("Pre-order");
  const search = $('input[type="search"]');
  await act(async () => { Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set.call(search, "plush"); search.dispatchEvent(new Event("input", { bubbles: true })); });
  expect(box.querySelectorAll('[data-testid^="shop-product-"]').length).toBe(1);
  expect($('[data-testid="shop-book-b1"]')).toBeNull();
});

test("a digital-only version can be added from the product, once, even when the physical product isn't for sale", async () => {
  await click($('[data-testid="shop-product-p8"]'));
  const option = $('[data-testid="shop-digital-option"]');
  expect(option.textContent).toContain("Digital version · $9.00");
  expect($('[data-testid="shop-product-add"]')).toBeNull();
  await click($('[data-testid="shop-add-digital"]'));
  await click($('[data-testid="shop-product-p8"]'));
  await click($('[data-testid="shop-add-digital"]'));
  expect($('[data-testid="shop-cart-count"]').textContent).toBe("1");
  await click($('[data-testid="shop-cart-button"]'));
  const cart = $('[data-testid="shop-cart"]');
  expect(cart.textContent).toContain("Volcano kit – digital version");
  expect(cart.textContent).not.toContain("postcode");
});

test("physical products carry an 'actual product may vary' note; downloads don't", async () => {
  expect(box.textContent).toContain("Actual products may vary from images");
  await click($('[data-testid="shop-product-p8"]'));
  expect($('[data-testid="shop-image-disclaimer"]').textContent).toBe("Actual product may vary from image.");
  await click(box.querySelector('[aria-label="Close"]'));
  await click($('[data-testid="shop-product-p1"]'));
  expect($('[data-testid="shop-image-disclaimer"]')).toBeNull();
});
