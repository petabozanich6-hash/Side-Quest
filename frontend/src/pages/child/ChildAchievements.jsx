import React, { useEffect, useState, useCallback } from "react";
import { api } from "../../lib/api";
import { toast } from "sonner";
import AchievementWall from "../../components/shared/AchievementWall";

const BUTTON_STYLE = { backgroundColor: "#1F3B2D", color: "#F5EFE0" };

export default function ChildAchievements() {
  const [items, setItems] = useState(null);
  const [revealed, setRevealed] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(
    () =>
      api
        .get("/achievements")
        .then((result) => setItems(result.data.items || []))
        .catch(() => {
          setItems([]);
          toast.error("Could not load your achievements");
        }),
    []
  );

  useEffect(() => {
    load();
  }, [load]);

  if (items === null) {
    return <div className="text-stone-500">Loading…</div>;
  }

  const pending = items.filter((item) => !item.claimed);
  const current = pending[0];

  const openBox = async (box) => {
    setBusy(true);

    try {
      const { data } = await api.post(`/achievements/${current.id}/claim`, { box });
      setRevealed(data);
    } catch (error) {
      toast.error(error?.response?.data?.detail || "Could not open the box");
    } finally {
      setBusy(false);
    }
  };

  const next = () => {
    setRevealed(null);
    load();
  };

  return (
    <div className="space-y-6 animate-in" data-testid="child-achievements">
      <h1
        className="font-display text-3xl font-bold"
        style={{ color: "#1F3B2D" }}
      >
        My achievements
      </h1>

      {revealed ? (
        <div className="paper-card p-6 text-center" data-testid="box-reveal">
          <div className="text-5xl">{revealed.prize.emoji}</div>

          <h2
            className="font-display text-2xl font-bold mt-2"
            style={{ color: "#1F3B2D" }}
          >
            You found the {revealed.prize.name}!
          </h2>

          <p className="text-sm text-stone-700 mt-1">
            It has been saved for your pet. You will be able to dress your pet
            with it soon.
          </p>

          <div className="flex justify-center gap-3 mt-4">
            {revealed.boxes.map((box, i) => (
              <div
                key={box.id}
                className={`rounded-xl border p-3 text-sm ${
                  i === revealed.chosen_box ? "bg-amber-50 font-bold" : "opacity-50"
                }`}
                style={{ borderColor: "#D4C8A8" }}
              >
                <div className="text-2xl">{box.emoji}</div>
                {box.name}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={next}
            className="mt-5 rounded-full px-6 py-3 text-sm font-bold"
            style={BUTTON_STYLE}
          >
            Continue
          </button>
        </div>
      ) : (
        current && (
          <div
            className="paper-card p-6 text-center"
            style={{ backgroundColor: "#F0F4E8", borderColor: "#94A47F" }}
            data-testid="box-pick"
          >
            <div className="text-4xl">🎉</div>

            <h2
              className="font-display text-2xl font-bold mt-1"
              style={{ color: "#1F3B2D" }}
            >
              Congratulations! Quest complete
            </h2>

            <p className="text-sm text-stone-700 mt-1">
              Your grown-up accepted <strong>{current.lesson_title}</strong>.
              Pick one mystery box to open.
            </p>

            <div className="flex justify-center gap-4 mt-5">
              {[0, 1, 2].map((box) => (
                <button
                  key={box}
                  type="button"
                  disabled={busy}
                  onClick={() => openBox(box)}
                  className="rounded-2xl border-2 px-6 py-5 text-4xl bg-white hover:translate-y-[-3px] transition disabled:opacity-50"
                  style={{ borderColor: "#C77B5B" }}
                  aria-label={`Open mystery box ${box + 1}`}
                >
                  🎁
                </button>
              ))}
            </div>

            {pending.length > 1 && (
              <p className="text-xs text-stone-500 mt-3">
                {pending.length - 1} more {pending.length - 1 === 1 ? "box" : "boxes"} waiting after this one.
              </p>
            )}
          </div>
        )
      )}

      <section>
        <h2
          className="font-display text-xl font-bold mb-3"
          style={{ color: "#1F3B2D" }}
        >
          Achievement wall
        </h2>

        <AchievementWall items={items} />
      </section>
    </div>
  );
}
