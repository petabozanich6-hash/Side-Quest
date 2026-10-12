import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { diffReward, rewardWorthShowing } from "./roomLogic";
import { AcornIcon } from "./Furniture";
import "./room.css";

const keyFor = (studentId) => `sq-reward:${studentId}`;

export function takeRewardDiff(studentId, next) {
  if (!studentId || typeof localStorage === "undefined") return { first: true, xp: 0, acorns: 0, levelUp: false, level: "" };
  let prev = null;
  try {
    prev = JSON.parse(localStorage.getItem(keyFor(studentId)) || "null");
  } catch {
    prev = null;
  }
  const diff = diffReward(prev, next);
  localStorage.setItem(keyFor(studentId), JSON.stringify({
    xp: Number(next.xp || 0),
    acorns: Number(next.acorns || 0),
    level: next.level || "",
  }));
  return diff;
}

export function RewardBanner({ diff }) {
  if (!rewardWorthShowing(diff)) return null;
  const bits = [];
  if (diff.xp >= 3) bits.push(`+${diff.xp} XP`);
  if (diff.acorns > 0) bits.push(`+${diff.acorns} acorns`);
  return (
    <div className="reward-banner" role="status" data-testid="reward-banner">
      <strong className="inline-flex items-center gap-2">{diff.acorns > 0 && <AcornIcon />} {bits.join(" · ")}</strong>
      {diff.levelUp && <span>Your companion is now a {diff.level}.</span>}
      <span className="text-xs opacity-80">From learning you have already finished.</span>
    </div>
  );
}

export default function RewardPulse({ studentId, pathname }) {
  const [diff, setDiff] = useState(null);
  useEffect(() => {
    if (!studentId || String(pathname || "").includes("/room")) return undefined;
    let stop = false;
    api.get("/pet/state").then((result) => {
      if (stop || result.data?.needs_pet) return;
      const next = {
        xp: result.data.xp,
        acorns: result.data.economy?.acorns || 0,
        level: result.data.level_name,
      };
      const found = takeRewardDiff(studentId, next);
      if (rewardWorthShowing(found)) setDiff(found);
    }).catch(() => {});
    return () => { stop = true; };
  }, [studentId, pathname]);

  useEffect(() => {
    if (!diff) return undefined;
    const timer = setTimeout(() => setDiff(null), 4200);
    return () => clearTimeout(timer);
  }, [diff]);

  return <RewardBanner diff={diff} />;
}
