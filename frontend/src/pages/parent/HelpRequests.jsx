import React, { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { toast } from "sonner";
import { Compass } from "lucide-react";

const EMAIL_NOTE = {
  sent: "Email sent to you.",
  failed: "The email couldn't be sent. Check your email service settings.",
  not_configured: "Email isn't set up on the server yet, so no email was sent.",
  no_address: "No parent email address was found, so no email was sent.",
};

export default function HelpRequests({ students, onView }) {
  const [items, setItems] = useState([]);

  const load = () => api.get("/help-requests").then(r => setItems(Array.isArray(r.data) ? r.data : [])).catch(() => {});
  useEffect(() => {
    load();
    const t = setInterval(load, 60000);
    return () => clearInterval(t);
  }, []);

  const dismiss = async (id) => {
    try {
      await api.post(`/help-requests/${id}/resolve`);
      setItems(cur => cur.filter(x => x.id !== id));
      toast.success("Marked as sorted");
    } catch { toast.error("Couldn't update that"); }
  };

  if (!items.length) return null;

  return (
    <div className="space-y-3" data-testid="help-requests">
      {items.map(h => {
        const student = students.find(s => s.id === h.student_id);
        return (
          <div key={h.id} className="paper-card p-4 flex flex-wrap items-center gap-3" style={{borderLeft:"4px solid #C77B5B"}} data-testid={`help-${h.id}`}>
            <Compass size={22} style={{color:"#C77B5B"}} className="shrink-0"/>
            <div className="flex-1 min-w-[200px]">
              <div className="font-display text-base font-bold" style={{color:"#1F3B2D"}}>{h.name} has lost the key to their quest</div>
              <div className="text-xs text-stone-500">Asking for help getting back in · {new Date(h.created_at).toLocaleString()}</div>
              {h.email_status && <div className="text-xs text-stone-500 mt-0.5" data-testid={`help-email-${h.id}`}>{EMAIL_NOTE[h.email_status] || h.email_status}</div>}
            </div>
            {student && <button onClick={() => onView(student)} className="rounded-full px-4 py-2 text-xs font-bold" style={{backgroundColor:"#1F3B2D", color:"#F5EFE0"}} data-testid={`help-view-${h.id}`}>View login</button>}
            <button onClick={() => dismiss(h.id)} className="rounded-full px-4 py-2 text-xs font-bold border" style={{borderColor:"#D4C8A8", color:"#1F3B2D"}} data-testid={`help-dismiss-${h.id}`}>Dismiss</button>
          </div>
        );
      })}
    </div>
  );
}
