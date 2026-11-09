import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import { Editor, Products, Switch } from "./HqShop";
import { adminApi } from "../../../lib/adminApi";

jest.mock("../../../lib/adminApi", () => ({ adminApi: { get: jest.fn(), post: jest.fn(), put: jest.fn(), del: jest.fn() }, errorText: (e) => e.message }));
jest.mock("../../../lib/api", () => ({ api: { get: jest.fn() } }));
jest.mock("sonner", () => ({ toast: { success: jest.fn(), error: jest.fn() } }));
jest.mock("react-router-dom", () => ({ Link: ({ children }) => <span>{children}</span> }));
const mockAdmin = { data: null, reload: jest.fn() };
jest.mock("./useAdmin", () => ({ useAdmin: () => mockAdmin }));
global.IS_REACT_ACT_ENVIRONMENT = true;

const META = {
  departments: [{ id: "science", label: "Science" }], statuses: ["draft", "in_stock"], status_labels: { draft: "Draft", in_stock: "In stock" },
  stages: ["launch_now"], stage_labels: { launch_now: "Launch Now" },
  fulfilment_labels: { physical: "Physical Stock", made_to_order: "Made to Order", digital: "Digital Download" },
};
const PRODUCT = { id: "p1", title: "Volcano kit", department: "science", status: "in_stock", stage: "launch_now", fulfilment: "made_to_order", price_cents: 4500, tags: [], personalisation: [], variants: [], bundle_items: [], addons: [], gift_months: [], images: 0, missing: [] };
let root, box;
const $ = (s) => box.querySelector(s);
const click = async (el) => act(async () => el.dispatchEvent(new MouseEvent("click", { bubbles: true })));
const save = () => [...box.querySelectorAll("button")].find((b) => b.textContent === "Save");
const render = async (product = PRODUCT) => act(async () => root.render(<Editor product={product} meta={META} all={[]} onClose={jest.fn()} onSaved={jest.fn()} />));
beforeEach(() => { adminApi.put.mockReset().mockResolvedValue({ ok: true }); box = document.createElement("div"); document.body.appendChild(box); root = createRoot(box); });
afterEach(async () => { await act(async () => root.unmount()); box.remove(); });

test("every product can be switched to digital only, and back to its physical kind", async () => {
  await render();
  expect($('[data-testid="hq-shop-format-physical"]').checked).toBe(true);
  await click($('[data-testid="hq-shop-format-digital"]'));
  expect($('[data-testid="hq-shop-file"]')).not.toBeNull();
  await click(save());
  expect(adminApi.put).toHaveBeenLastCalledWith("/shop/products/p1", expect.objectContaining({ fulfilment: "digital", digital_cents: null }));
  // Back to physical restores the kind it had (made to order), not a generic one.
  await click($('[data-testid="hq-shop-format-physical"]'));
  await click(save());
  expect(adminApi.put).toHaveBeenLastCalledWith("/shop/products/p1", expect.objectContaining({ fulfilment: "made_to_order", digital_cents: null }));
});

test("physical + digital sells a download at its own price alongside the physical product", async () => {
  await render();
  await click($('[data-testid="hq-shop-format-both"]'));
  const price = $('[data-testid="hq-shop-digital-price"]');
  await act(async () => { Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set.call(price, "9"); price.dispatchEvent(new Event("input", { bubbles: true })); });
  expect($('[data-testid="hq-shop-digital-file"]')).not.toBeNull();
  await click(save());
  expect(adminApi.put).toHaveBeenLastCalledWith("/shop/products/p1", expect.objectContaining({ fulfilment: "made_to_order", digital_cents: 900 }));
});

test("the in-shop switch says plainly whether a product is in the shop and toggles it", async () => {
  const onChange = jest.fn();
  await act(async () => root.render(<Switch on label="Volcano kit" onChange={onChange} testid="sw" />));
  const sw = $('[data-testid="sw"]');
  expect(sw.getAttribute("role")).toBe("switch");
  expect(sw.getAttribute("aria-checked")).toBe("true");
  expect(sw.textContent).toBe("On");
  expect(sw.getAttribute("aria-label")).toBe("Volcano kit: in the shop");
  await click(sw);
  expect(onChange).toHaveBeenCalledTimes(1);
  await act(async () => root.render(<Switch on={false} label="Volcano kit" onChange={onChange} testid="sw" />));
  expect($('[data-testid="sw"]').textContent).toBe("Off");
});

test("products table: select all, and the in-shop switch sits right after Stage", async () => {
  const row = (n, visible) => ({ ...PRODUCT, id: `p${n}`, slug: `p${n}`, title: `Thing ${n}`, visible, missing: [], variants: [], tags: [], profit: null, interest: 0 });
  mockAdmin.data = { ...META, products: [row(1, true), row(2, false), row(3, true)] };
  adminApi.post.mockReset().mockResolvedValue({ ok: true });
  await act(async () => root.render(<Products />));
  const heads = [...box.querySelectorAll("thead th")].map((th) => th.textContent);
  expect(heads.slice(1, 4)).toEqual(["Product", "Stage", "In shop"]);
  await click($('[data-testid="hq-shop-select-all"]'));
  expect(box.textContent).toContain("3 selected");
  expect([...box.querySelectorAll('tbody input[type="checkbox"]')].every((c) => c.checked)).toBe(true);
  await click($('[data-testid="hq-shop-select-all"]'));
  expect(box.textContent).not.toContain("selected");
  await click($('[data-testid="hq-shop-toggle-p2"]'));
  expect(adminApi.post).toHaveBeenCalledWith("/shop/products/bulk", { ids: ["p2"], visible: true });
});

test("selected products can be deleted together after confirming", async () => {
  const row = (n) => ({ ...PRODUCT, id: `p${n}`, slug: `p${n}`, title: `Thing ${n}`, visible: true, missing: [], variants: [], tags: [], profit: null, interest: 0 });
  mockAdmin.data = { ...META, products: [row(1), row(2)] };
  adminApi.post.mockReset().mockResolvedValue({ ok: true, deleted: 2 });
  window.confirm = jest.fn(() => true);
  await act(async () => root.render(<Products />));
  await click($('[data-testid="hq-shop-select-all"]'));
  await click($('[data-testid="hq-shop-bulk-delete"]'));
  expect(window.confirm).toHaveBeenCalledWith(expect.stringContaining("Delete 2 products"));
  expect(adminApi.post).toHaveBeenCalledWith("/shop/products/bulk-delete", { ids: ["p1", "p2"] });
});

test("the product editor shows Delete next to Save", async () => {
  await render();
  expect($('[data-testid="hq-shop-delete"]').textContent).toBe("Delete product");
});
