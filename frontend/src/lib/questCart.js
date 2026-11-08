// The Quest Books cart lives in the browser. Prices are always worked out by the server (POST /quest-books/cart/quote).
import { useEffect, useState } from "react";

const KEY = "sq-quest-cart-v1";
const EVENT = "sq-quest-cart";

const same = (a, b) => a.book_id === b.book_id && a.tier === b.tier && (a.lesson_key || "") === (b.lesson_key || "");

export function getCart() {
  try {
    const v = JSON.parse(window.localStorage.getItem(KEY) || "[]");
    return Array.isArray(v) ? v.filter((x) => x && x.book_id && x.tier) : [];
  } catch { return []; }
}

function save(items) {
  try { window.localStorage.setItem(KEY, JSON.stringify(items.slice(0, 30))); } catch { /* storage unavailable: cart lasts for this page only */ }
  window.dispatchEvent(new Event(EVENT));
}

/** Adds an item. A pack for a book replaces that book and its single lessons already in the cart. */
export function addToCart(item) {
  let items = getCart().filter((x) => !same(x, item));
  if (item.tier === "plus") items = items.filter((x) => x.book_id !== item.book_id);
  if (item.tier !== "plus" && items.some((x) => x.book_id === item.book_id && x.tier === "plus")) return;
  save([...items, item]);
}
export function removeFromCart(item) { save(getCart().filter((x) => !same(x, item))); }
export function setCart(items) { save(items); }
export function clearCart() { save([]); }
export function inCart(items, item) { return items.some((x) => same(x, item) || (x.book_id === item.book_id && x.tier === "plus")); }

export function useCart() {
  const [items, setItems] = useState(getCart);
  useEffect(() => {
    const on = () => setItems(getCart());
    window.addEventListener(EVENT, on);
    window.addEventListener("storage", on);
    return () => { window.removeEventListener(EVENT, on); window.removeEventListener("storage", on); };
  }, []);
  return items;
}
