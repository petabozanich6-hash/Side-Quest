import React from "react";
import SeasonalCard from "../../components/parent/SeasonalCard";

export default function SideQuestPage() {
  return (
    <div className="p-8 lg:p-10 space-y-6" data-testid="sidequest-page">
      <header>
        <h1 className="font-display text-3xl font-bold text-slate-900">Side Quests</h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl">Seasonal releases for your children's pet rooms. Switch on the holidays your family celebrates.</p>
      </header>

      <SeasonalCard />

      <div className="rounded-2xl border border-slate-200 bg-white p-5 text-xs text-slate-600 leading-relaxed max-w-2xl">
        <strong className="font-semibold text-slate-800">Inclusive:</strong> Religious or cultural observances are only included when you select them. No family is assumed to participate in any particular event.
      </div>
    </div>
  );
}
