import { useCallback, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { adminApi, errorCode, errorText } from "../../../lib/adminApi";

/** Loads an admin resource; if the passkey step-up has expired, the shell locks again. */
export function useAdmin(path, params) {
  const { relock } = useOutletContext() || {};
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const key = JSON.stringify(params ?? {});
  const load = useCallback(async () => {
    setLoading(true); setError("");
    try { setData(await adminApi.get(path, JSON.parse(key))); }
    catch (e) {
      if (errorCode(e) === "step_up_required" && relock) relock();
      setError(errorText(e, "Could not load this page. Please retry."));
    } finally { setLoading(false); }
  }, [path, key, relock]);
  useEffect(() => { load(); }, [load]);
  return { data, error, loading, reload: load, relock };
}
