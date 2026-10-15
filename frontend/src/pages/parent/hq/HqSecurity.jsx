import React, { useState } from "react";
import { toast } from "sonner";
import { adminApi, enrolPasskey, errorText } from "../../../lib/adminApi";
import { Alert, Button, Card, fmtDate } from "./ui";
import { useAdmin } from "./useAdmin";

export default function HqSecurity() {
  const { data, error, reload } = useAdmin("/security/passkeys");
  const [label, setLabel] = useState("Backup passkey");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const run = async (fn, ok) => {
    setBusy(true); setMsg("");
    try { await fn(); toast.success(ok); reload(); } catch (e) { setMsg(errorText(e)); } finally { setBusy(false); }
  };
  return (
    <div className="grid gap-4 lg:grid-cols-2" data-testid="hq-security">
      <Card title="Your passkeys">
        {error && <Alert>{error}</Alert>}
        <ul className="space-y-2">
          {(data?.passkeys || []).map((p) => (
            <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 text-sm" data-testid="hq-passkey">
              <span><strong>{p.label}</strong><span className="block text-xs text-stone-500">Added {fmtDate(p.created_at)} · last used {fmtDate(p.last_used_at)}</span></span>
              <Button tone="plain" disabled={busy || data.passkeys.length < 2} onClick={() => run(() => adminApi.del(`/security/passkeys/${encodeURIComponent(p.id)}`), "Passkey removed")}>Remove</Button>
            </li>
          ))}
        </ul>
        <p className="text-xs text-stone-500 mt-3">Keep at least two passkeys (for example your phone and your laptop) so losing one device never locks you out. The last passkey can't be removed.</p>
      </Card>
      <Card title="Add another passkey">
        <label className="block text-sm font-semibold">Name
          <input value={label} onChange={(e) => setLabel(e.target.value)} maxLength={60} className="mt-1 w-full rounded-xl border border-stone-300 p-2 text-sm font-normal" />
        </label>
        <Button className="mt-3" disabled={busy} onClick={() => run(() => enrolPasskey({ label }), "Passkey added")} data-testid="hq-add-another">Add passkey</Button>
        {msg && <div className="mt-3"><Alert>{msg}</Alert></div>}
      </Card>
    </div>
  );
}
