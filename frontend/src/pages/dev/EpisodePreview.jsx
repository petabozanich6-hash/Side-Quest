import React from "react";
import { Link, useParams } from "react-router-dom";
import { EpisodePlayer } from "../../components/episode";
import { getTeachingEpisode, listTeachingEpisodes } from "../../episodes/registry";

/** Public local preview — no auth. Pilot QA surface only. */
export default function EpisodePreview() {
  const { seedKey } = useParams();
  const episode = getTeachingEpisode(seedKey) || listTeachingEpisodes()[0];
  const all = listTeachingEpisodes();

  if (!episode) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <h1 className="text-xl font-bold">No teaching episodes registered</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5EFE0] px-4 py-6">
      <div className="mx-auto max-w-3xl space-y-4">
        <header className="space-y-2">
          <p className="text-xs font-mono uppercase tracking-wide text-stone-500">
            Episode preview · Phase 2 pilot
          </p>
          <h1 className="font-display text-2xl font-bold text-[#1F3B2D]">{episode.title}</h1>
          <p className="text-sm text-stone-700">
            Seed <code>{episode.seed_key}</code> · Stage {episode.stage}. Sound defaults off.
          </p>
          <nav className="flex flex-wrap gap-2 text-sm">
            {all.map((ep) => (
              <Link
                key={ep.seed_key}
                to={`/dev/episode/${ep.seed_key}`}
                className="rounded-full bg-white px-3 py-1 border border-stone-300"
              >
                {ep.seed_key}
              </Link>
            ))}
            <Link to="/" className="rounded-full bg-stone-800 px-3 py-1 text-white">
              Home
            </Link>
          </nav>
        </header>
        <EpisodePlayer episode={episode} />
        <section className="rounded-xl border border-stone-300 bg-white p-4 text-sm text-stone-700">
          <h2 className="font-bold text-[#1F3B2D]">QA checklist</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Math distances and midpoint feedback match the choices</li>
            <li>Pause / Play / Back / Next / Restart work without forced sound</li>
            <li>Captions toggle; transcript details available</li>
            <li>Keyboard: Tab to controls and choices; Enter/Space activates</li>
            <li>prefers-reduced-motion disables decorative animation</li>
            <li>Narrow viewport keeps the number line and choices readable</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
