import React from "react";
import CartoonEpisode from "./CartoonEpisode";
import { EpisodePlayer } from "../episode";

// Shows a lesson visual. A visual is an object:
//   { svg: "<svg ...>...</svg>", alt: "text description", caption: "short caption" }
// or { src: "https://...", alt: "...", caption: "..." } for a picture file
// or { episode: { title, scenes: [...] } } for cartoon dialogue (legacy)
// or { episode: { format: "teaching", scenes: [{ beats: [...] }] } } for teaching episodes
// The svg text comes from our own lesson files, never from users.
export default function QuestVisual({ visual }) {
  if (visual && visual.episode) {
    if (visual.episode.format === "teaching") {
      return <EpisodePlayer episode={visual.episode} />;
    }
    return <CartoonEpisode episode={visual.episode} />;
  }

  if (!visual || (!visual.svg && !visual.src)) return null;

  return (
    <figure
      className="my-3 rounded-xl border bg-white p-3"
      style={{ borderColor: "#D4C8A8" }}
      data-testid="lesson-visual"
    >
      {visual.svg ? (
        <div
          role="img"
          aria-label={visual.alt || visual.caption || "Diagram"}
          className="mx-auto w-full max-w-xl [&_svg]:w-full [&_svg]:h-auto"
          dangerouslySetInnerHTML={{ __html: visual.svg }}
        />
      ) : (
        <img
          src={visual.src}
          alt={visual.alt || visual.caption || ""}
          className="mx-auto max-h-80 w-auto max-w-full"
        />
      )}

      {visual.caption && (
        <figcaption className="mt-2 text-center text-sm italic text-stone-700">
          {visual.caption}
        </figcaption>
      )}
    </figure>
  );
}
