import React, { useEffect, useState } from "react";
import { api } from "../../lib/api";

/** Announcement and maintenance notices set in Owner HQ. Plain text only; nothing shows when none is switched on. */
export default function PlatformNotices() {
  const [n, setN] = useState(null);
  useEffect(() => {
    let live = true;
    api.get("/platform/notices").then((r) => { if (live) setN(r.data); }).catch(() => {});
    return () => { live = false; };
  }, []);
  if (!n?.maintenance && !n?.announcement) return null;
  return (
    <div className="relative z-50">
      {n.maintenance && (
        <div role="status" data-testid="maintenance-notice" className="px-4 py-2 text-sm text-center font-semibold bg-amber-100 text-amber-900 border-b border-amber-200">
          {n.maintenance.message}
        </div>
      )}
      {n.announcement && (
        <div role="status" data-testid="announcement-notice"
          className={`px-4 py-2 text-sm text-center border-b ${n.announcement.tone === "warning" ? "bg-rose-50 text-rose-900 border-rose-200" : "bg-emerald-50 text-emerald-900 border-emerald-200"}`}>
          {n.announcement.message}
        </div>
      )}
    </div>
  );
}
