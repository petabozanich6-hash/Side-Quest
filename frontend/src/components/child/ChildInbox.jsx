import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Heart } from "lucide-react";
import { useChildInbox } from "./useChildInbox";

export default function ChildInbox() {
  const { items } = useChildInbox();
  const { pathname } = useLocation();
  if (!items.length || pathname === "/child") return null;
  const hasRevision = items.some(i => i.kind === "revision");
  const text = hasRevision ? "Your pet has news: some work was sent back to try again" : items.length === 1 ? "Your pet has a message from your parent" : `Your pet has ${items.length} messages from your parent`;
  return (
    <div className="mx-auto max-w-6xl px-5 pt-4">
      <div className="flex flex-wrap items-center gap-3 rounded-2xl px-5 py-3" style={{backgroundColor:"#C77B5B", color:"#FBF7EC"}} role="alert" data-testid="child-inbox-bar">
        <Heart size={22} className="shrink-0"/>
        <div className="flex-1 min-w-[200px] font-display font-bold text-base">{text}</div>
        <Link to="/child" className="rounded-full px-5 py-2 text-sm font-bold" style={{backgroundColor:"#1F3B2D", color:"#F5EFE0"}} data-testid="child-inbox-open">Hear it</Link>
      </div>
    </div>
  );
}
