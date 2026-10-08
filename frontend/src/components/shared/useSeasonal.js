import { useCallback, useEffect, useState } from "react";
import { api } from "../../lib/api";

const EVT = "seasonal-changed";
export const notifySeasonal = () => window.dispatchEvent(new Event(EVT));

export async function setWornPrizes(ids) {
  await api.put("/seasonal/worn", { ids });
  notifySeasonal();
}

export default function useSeasonal() {
  const [data, setData] = useState({ packs: [], keepsakes: [], maxWorn: 3 });
  const load = useCallback(() => {
    api.get("/seasonal/active")
      .then(r => setData({ packs: r.data?.packs || [], keepsakes: r.data?.keepsakes || [], maxWorn: r.data?.max_worn || 3 }))
      .catch(() => setData({ packs: [], keepsakes: [], maxWorn: 3 }));
  }, []);
  useEffect(() => {
    load();
    window.addEventListener(EVT, load);
    return () => window.removeEventListener(EVT, load);
  }, [load]);
  return data;
}
