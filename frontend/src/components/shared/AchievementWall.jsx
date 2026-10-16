import React from "react";

const formatDate = (iso) => {
  try {
    return new Date(iso).toLocaleDateString("en-AU", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  } catch {
    return "";
  }
};

export default function AchievementWall({ items = [], emptyText }) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-stone-600">
        {emptyText || "No certificates yet. Finish a lesson and get it accepted to earn your first one."}
      </p>
    );
  }

  return (
    <div
      className="achievement-wall grid sm:grid-cols-2 lg:grid-cols-3 gap-4 print:block select-none"
      onContextMenu={(event) => event.preventDefault()}
      data-testid="achievement-wall"
    >
      <style>{`@media print {
  @page { size: A4 portrait; margin: 14mm; }
  .achievement-wall { display: block !important; }
  .achievement-wall .paper-card { break-inside: avoid-page; page-break-inside: avoid; width: 100%; min-height: 120mm; margin: 0 0 12mm; padding: 18mm 12mm; border: 2px solid #1F3B2D !important; border-radius: 12px; background: #fff !important; box-shadow: none !important; }
  .achievement-wall .paper-card:after { content: "SIDE-QUEST LEARNING • Every achievement is part of the adventure"; display: block; margin-top: 20mm; padding-top: 6mm; border-top: 1px solid #D4C8A8; color: #4A5D3A; font-size: 11px; }
}`}</style>

      {items.map((item) => (
        <div
          key={item.id}
          className="paper-card p-5 text-center border-2"
          style={{ borderColor: item.level === "demonstrated" ? "#C77B5B" : "#94A47F" }}
        >
          <div className="text-3xl">{item.level === "demonstrated" ? "🏆" : "📜"}</div>

          <div className="text-[10px] font-mono uppercase tracking-widest text-stone-500 mt-1">
            Certificate of achievement
          </div>

          <div
            className="font-display text-lg font-bold mt-2"
            style={{ color: "#1F3B2D" }}
          >
            {item.lesson_title}
          </div>

          <div className="text-sm mt-1">awarded to</div>

          <div className="font-script text-2xl" style={{ color: "#C77B5B" }}>
            {item.student_name}
          </div>

          <div className="text-xs text-stone-600 mt-2">
            {[item.learning_area, item.stage].filter(Boolean).join(" · ")}
          </div>

          {item.level === "demonstrated" && (
            <div className="text-xs font-bold mt-1" style={{ color: "#C77B5B" }}>
              Demonstrated mastery
            </div>
          )}

          <div className="text-xs font-mono text-stone-500 mt-2">
            {formatDate(item.awarded_at)}
          </div>

          {item.prize && (
            <div className="text-xs mt-2">
              Prize: {item.prize.emoji} {item.prize.name}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
