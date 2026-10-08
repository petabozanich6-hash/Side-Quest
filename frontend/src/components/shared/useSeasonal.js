import { useCallback, useEffect, useState } from "react";
import { api } from "../../lib/api";

const EVT = "seasonal-changed";
export const notifySeasonal = () => window.dispatchEvent(new Event(EVT));

export async function setWornPrizes(packs) {
  await api.put("/seasonal/worn", { packs });
  notifySeasonal();
}

export default function useSeasonal() {
  const [data, setData] = useState({ packs: [], keepsakes: [] });
  const load = useCallback(() => {
    api.get("/seasonal/active")
      .then(r => setData({ packs: r.data?.packs || [], keepsakes: r.data?.keepsakes || [] }))
      .catch(() => setData({ packs: [], keepsakes: [] }));
  }, []);
  useEffect(() => {
    load();
    window.addEventListener(EVT, load);
    return () => window.removeEventListener(EVT, load);
  }, [load]);
  return data;
}
