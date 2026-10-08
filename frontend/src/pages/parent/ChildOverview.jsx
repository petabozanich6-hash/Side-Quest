import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../lib/api";
import { toast } from "sonner";
import { ArrowLeft, Send, BookOpen, Camera, Heart } from "lucide-react";
import { Pet } from "../../components/shared/Botanical";

const EMOJIS = ["🙌", "⭐", "🌟", "💛", "🌱", "🎉", "✨", "💪", "🦊", "📚"];

export default function ChildOverview() {
  const { sid } = useParams();
  const nav = useNavigate();
  const [data, setData] = useState(null);
  const [msg, setMsg] = useState("");
  const [emoji, setEmoji] = useState("🙌");

  const load = () => api.get(`/students/${sid}/overview`).then(r => setData(r.data));
  useEffect(() => { load(); }, [sid]);

  const sendCheer = async () => {
    if (!msg.trim()) { toast.error("Add a short message"); return; }
    try {
      await api.post("/cheers", { student_id: sid, message: msg, emoji });
      toast.success(`High-five sent to ${data.student.name}`);
      setMsg(""); load();
    } catch { toast.error("Failed"); }
  };

  const togglePause = async () => {
    const paused = !!data.pet?.care_paused;
    try {
      await api.post(paused ? "/pet/care/resume" : "/pet/care/pause", { student_id: sid });
      toast.success(paused ? "Pet care resumed" : "Pet care paused. Their pet will be safe while you're away.");
      load();
    } catch { toast.error("Could not change pet care"); }
  };

  if (!data) return <div className="p-10 text-stone-500">Loading…</div>;
  const s = data.student;
  const petPaused = !!data.pet?.care_paused;

  return (
    <div className="p-8 lg:p-10 space-y-6" data-testid="child-overview">
      <button onClick={()=>nav("/parent/children")} className="text-sm font-bold flex items-center gap-1" style={{color:"#4A5D3A"}} data-testid="back-children"><ArrowLeft size={14}/> All children</button>

      <header className="paper-card p-6 flex items-start gap-6">
        {data.pet && <div className="shrink-0"><Pet species={data.pet.species} size={100}/></div>}
        <div className="flex-1">
          <h1 className="font-display text-3xl font-bold" style={{color:"#1F3B2D"}}>{s.name}</h1>
          <div className="text-sm text-stone-500 mt-0.5">{s.stage_name} · @{s.username}</div>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="pill pill-not-started">{s.band}</span>
            {s.year_level && <span className="pill pill-not-started">Year {s.year_level}</span>}
            {data.pet && <span className="pill pill-accepted">{data.pet.name} · {data.pet.level_name} · {data.pet.xp} XP</span>}
          </div>
        </div>
      </header>

      {data.pet && (
        <section className="paper-card p-6 flex flex-wrap items-center justify-between gap-4" data-testid="pet-care-panel">
          <div>
            <h2 className="font-display text-lg font-bold" style={{color:"#1F3B2D"}}>{data.pet.name}'s care</h2>
            <p className="text-xs text-stone-600 mt-1 max-w-md">
              {petPaused
                ? "Care is paused (sick day, holiday, etc). Hunger and mess timers are frozen until you resume."
                : "Pets need feeding and cleaning daily. Pause care for holidays or sick days so nothing gets neglected while you're away."}
            </p>
          </div>
          <button onClick={togglePause} className="rounded-full px-5 py-2 text-sm font-bold"
            style={{backgroundColor: petPaused ? "#C77B5B" : "#1F3B2D", color:"#F5EFE0"}} data-testid="toggle-pet-pause">
            {petPaused ? "Resume pet care" : "Pause pet care"}
          </button>
        </section>
      )}

      <section className="paper-card p-6" style={{backgroundColor:"#F0F4E8"}}>
        <div className="flex items-center gap-2 mb-3">
          <Heart size={18} style={{color:"#C77B5B"}}/>
          <h2 className="font-display text-lg font-bold" style={{color:"#1F3B2D"}}>Send a high-five</h2>
        </div>
        <p className="text-xs text-stone-600 mb-3">A warm note appears next to their pet's room. They'll see it next time they log in.</p>
        <div className="flex flex-wrap gap-1 mb-2">
          {EMOJIS.map(e => <button key={e} onClick={()=>setEmoji(e)} className={`h-9 w-9 rounded-full border-2 text-lg ${emoji === e ? "bg-white" : "bg-transparent"}`} style={{borderColor: emoji === e ? "#1F3B2D" : "#D4C8A8"}} data-testid={`emoji-${e}`}>{e}</button>)}
        </div>
        <div className="flex gap-2">
          <input value={msg} onChange={e=>setMsg(e.target.value)} maxLength={280} placeholder="You worked so hard on that today — I'm proud of you!" className="flex-1 rounded-xl border px-3 py-2 text-sm bg-white" style={{borderColor:"#D4C8A8"}} data-testid="cheer-msg"/>
          <button onClick={sendCheer} className="rounded-full px-5 py-2 text-sm font-bold flex items-center gap-1" style={{backgroundColor:"#1F3B2D", color:"#F5EFE0"}} data-testid="send-cheer"><Send size={14}/> Send</button>
        </div>
        {data.cheers.length > 0 && (
          <div className="mt-4 space-y-1 max-h-32 overflow-y-auto">
            {data.cheers.slice(0,5).map(c => (
              <div key={c.id} className="text-xs flex items-center gap-2 text-stone-700">
                <span className="text-base">{c.emoji}</span>
                <span className="flex-1 truncate">{c.message}</span>
                <span className="text-stone-400 shrink-0">{new Date(c.created_at).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="grid md:grid-cols-3 gap-4">
        <StatCard icon={BookOpen} label="Reading entries" value={data.reading_count} tint="#C8893B"/>
        <StatCard icon={Camera} label="Submissions" value={data.recent_submissions.length} tint="#4A5D3A"/>
        <StatCard icon={Heart} label="Assignments" value={data.assignments.length} tint="#C77B5B"/>
      </section>

      <section className="paper-card p-6">
        <h2 className="font-display text-xl font-bold mb-3" style={{color:"#1F3B2D"}}>Recent submissions</h2>
        {data.recent_submissions.length === 0 ? <p className="text-sm text-stone-500">Nothing submitted yet.</p> : (
          <div className="space-y-2">
            {data.recent_submissions.slice(0, 6).map(sub => (
              <div key={sub.id} className="rounded-xl border p-3 flex items-center justify-between" style={{borderColor:"#E8E2D1"}}>
                <div>
                  <div className="font-semibold text-sm">{sub.lesson?.title}</div>
                  <div className="text-xs text-stone-500">{new Date(sub.submitted_at).toLocaleString()}</div>
                </div>
                <span className={`pill pill-${(sub.status||"submitted").replace(/_/g,'-')}`}>{sub.status?.replace(/_/g,' ')}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {s.electives?.length > 0 && (
        <section className="paper-card p-6">
          <h2 className="font-display text-xl font-bold mb-3" style={{color:"#1F3B2D"}}>Course pattern</h2>
          <div className="grid md:grid-cols-2 gap-2">
            {s.electives.map((el, i) => (
              <div key={i} className="rounded-xl border p-3" style={{borderColor:"#E8E2D1"}}>
                <div className="font-semibold text-sm">{el.name}</div>
                <div className="text-xs text-stone-500">{el.learning_area}{el.units ? ` · ${el.units} units` : ""}</div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

const StatCard = ({ icon: Icon, label, value, tint }) => (
  <div className="paper-card p-5">
    <div className="h-10 w-10 rounded-xl grid place-items-center mb-2" style={{backgroundColor: tint+"22", color: tint}}><Icon size={18}/></div>
    <div className="text-xs font-bold uppercase tracking-widest text-stone-500">{label}</div>
    <div className="font-display text-3xl font-bold mt-1" style={{color:"#1F3B2D"}}>{value}</div>
  </div>
);
