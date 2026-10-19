import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ArrowRight, Award, BookOpen, FolderOpen, Search, Sparkles, ScrollText } from "lucide-react";

const places = [
  { path: "/child/reading", title: "My Reading", desc: "Tell your grown-up about the books you've read", icon: BookOpen, color: "#EAF7F4" },
  { path: "/child/word-hoard", title: "Word Hoard", desc: "Practice spelling and tame tricky words", icon: ScrollText, color: "#F1ECFD" },
  { path: "/child/achievements", title: "Achievements", desc: "See your badges and claim any surprises", icon: Award, color: "#FFF5D9" },
  { path: "/child/portfolio", title: "My Portfolio", desc: "Look back at your work and grown-up feedback", icon: FolderOpen, color: "#EAF6FE" },
  { path: "/child/archive", title: "Finished Quests", desc: "Revisit the quests you've completed", icon: Sparkles, color: "#EAF5E6" },
  { path: "/child/search", title: "Search", desc: "Find something in Side-Quest", icon: Search, color: "#F5EEE3" },
];

export default function ChildStuff() {
  const { user } = useAuth();
  const younger = user?.theme === "early" || user?.theme === "primary";
  return (
    <div className="space-y-5 animate-in" data-testid="child-stuff">
      <header className="space-y-1">
        <h1 className={"font-display font-extrabold text-[#1F3B2D] " + (younger ? "text-4xl" : "text-3xl")}>My Stuff</h1>
        <p className="text-stone-600">Your books, rewards and adventures are all here.</p>
      </header>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {places.map((place) => {
          const Icon = place.icon;
          return (
            <Link key={place.path} to={place.path} className="group flex min-h-36 flex-col rounded-3xl border-2 border-[#D4C8A8] p-5 transition hover:-translate-y-0.5 hover:shadow-md" style={{ backgroundColor: place.color }}>
              <div className="flex items-start justify-between">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/80 text-[#1F3B2D]"><Icon size={25} /></div>
                <ArrowRight size={20} className="text-[#4A5D3A] transition group-hover:translate-x-1" />
              </div>
              <h2 className="mt-3 font-display text-xl font-bold text-[#1F3B2D]">{place.title}</h2>
              <p className="mt-1 text-sm text-stone-600">{place.desc}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
