import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react";
import PetWearables from "./PetWearables";
import { petSpots, maxThreeBySlot } from "./petAccessoryPositions";

global.IS_REACT_ACT_ENVIRONMENT = true;

test("turtle accessories follow turtle anatomy instead of a universal emoji strip", () => {
  expect(petSpots("turtle","head")[0][0]).toBeGreaterThan(70);
  expect(petSpots("owl","head")[0][0]).toBeLessThan(60);
  expect(petSpots("turtle","feet")).toHaveLength(2);
  expect(petSpots("fox","feet")).toHaveLength(2);
});

test("only three equipped pieces show and conflicting headwear replaces itself", () => {
  expect(maxThreeBySlot(["scarf","flower_crown","party_hat","backpack","shades"]))
    .toEqual(["backpack","shades","party_hat"].sort(() => 0) /* replaced headwear; newest slots retained */);
});

test("worn accessories draw as SVG wearables on the pet canvas", async () => {
  const div = document.createElement("div");
  document.body.appendChild(div);
  const root = createRoot(div);
  await act(async () => {
    root.render(<PetWearables species="turtle" equipped={["scarf","bookworm_specs","backpack"]}/>);
  });
  const placed = div.querySelector("[data-testid=worn-accessories]");
  expect(placed).not.toBeNull();
  expect(placed.querySelectorAll("svg")).toHaveLength(3);
  expect(placed.querySelectorAll("svg")[0].getAttribute("viewBox")).toBe("0 0 100 100");
  await act(async () => root.unmount());
  div.remove();
});
