import React from "react";
import { Link } from "react-router-dom";
import { Fern, Branch, Leaf, Flower, Pet } from "../components/shared/Botanical";
import { Sparkles, BookOpen, Camera, CalendarDays, Printer, ShieldCheck, Users, Compass, ArrowRight } from "lucide-react";

const Feature = ({ icon: Icon, title, desc, tint = "#6B8A5B" }) => (
  <div className="paper-card p-6 relative overflow-hidden" data-testid={`feature-${title.replace(/\s+/g,'-').toLowerCase()}`}>
    <div className="h-11 w-11 rounded-2xl flex items-center justify-center mb-3" style={{backgroundColor: tint + "22", color: tint}}>
      <Icon size={20} />
    </div>
    <h3 className="font-display text-xl font-semibold leading-snug" style={{color:"#1F3B2D"}}>{title}</h3>
    <p className="mt-1.5 text-sm text-stone-600 leading-relaxed">{desc}</p>
  </div>
);

export default function Landing() {
  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Decorative botanicals */}
      <Fern className="absolute -left-10 top-24" size={160} color="#6B8A5B"/>
      <Branch className="absolute right-0 top-12 rotate-12" size={220} color="#4A5D3A"/>
      <Flower className="absolute left-1/2 top-40" size={30} color="#D4857A"/>
      <Leaf className="absolute right-20 bottom-32" size={80} color="#C8893B"/>

      <header className="relative z-10">
        <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl grid place-items-center" style={{backgroundColor:"#1F3B2D"}}><Compass className="text-cream" size={22} style={{color:"#F5EFE0"}}/></div>
            <div>
              <div className="font-display text-xl font-bold" style={{color:"#1F3B2D"}}>Side Quest</div>
              <div className="text-[10px] uppercase tracking-widest text-stone-500 font-semibold -mt-0.5">Learning</div>
            </div>
          </div>
          <nav className="flex items-center gap-3 sm:gap-4">
            <Link to="/child-login" className="rounded-full px-5 py-2.5 text-sm font-bold hover:translate-y-[-1px] transition shadow-sm" data-testid="nav-child-login" style={{backgroundColor:"#C77B5B", color:"#FFF9EE"}}>Student sign in</Link>
            <Link to="/login" className="hidden sm:inline text-sm font-semibold text-stone-700 hover:text-moss" data-testid="nav-login" style={{color:"#52473A"}}>Parent sign in</Link>
            <Link to="/register" className="rounded-full px-5 py-2.5 text-sm font-semibold hover:translate-y-[-1px] transition shadow-sm" style={{backgroundColor:"#1F3B2D", color:"#F5EFE0"}} data-testid="nav-register">Create a family</Link>
          </nav>
        </div>
      </header>

      <section className="relative z-10 mx-auto max-w-7xl px-6 pt-10 pb-16 grid lg:grid-cols-5 gap-10 items-center">
        <div className="lg:col-span-3">
          <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest" style={{backgroundColor:"#E8E2D1", color:"#4A5D3A"}}>
            <Sparkles size={13}/> NSW K · Years 1-12 · Homeschool
          </span>
          <h1 className="mt-6 font-display font-bold tracking-tight leading-[1.02]" style={{color:"#1F3B2D"}}>
            <span className="block text-5xl md:text-6xl lg:text-7xl">Grow curious minds.</span>
            <span className="block text-4xl md:text-5xl lg:text-6xl italic mt-2" style={{color:"#4A5D3A"}}>Keep the record.</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed max-w-2xl" style={{color:"#52473A"}}>
            A gentle, serious homeschool platform for your whole family — Kindergarten through Year 12.
            Parents plan with calm. Children learn with a <span className="font-script text-xl" style={{color:"#C77B5B"}}>pocket pet companion</span> who grows as they do.
          </p>

          <div className="mt-8 grid sm:grid-cols-2 gap-4 max-w-2xl" data-testid="who-is-here">
            <Link to="/child-login" className="group rounded-3xl p-5 flex items-center gap-4 shadow-md hover:translate-y-[-2px] transition focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300" style={{backgroundColor:"#C77B5B", color:"#FFF9EE"}} data-testid="cta-child" aria-label="I'm a student. Sign in with your username and PIN">
              <div className="shrink-0 rounded-2xl p-1.5" style={{backgroundColor:"#FFF9EE"}}><Pet species="fox" size={64}/></div>
              <div className="min-w-0">
                <div className="font-display text-2xl font-bold leading-tight">I'm a student</div>
                <div className="mt-1 text-sm font-semibold flex items-center gap-1.5">Start your quest <ArrowRight size={16} className="transition group-hover:translate-x-1"/></div>
              </div>
            </Link>

            <div className="rounded-3xl p-5 shadow-md" style={{backgroundColor:"#1F3B2D", color:"#F5EFE0"}} data-testid="cta-parent-card">
              <div className="flex items-center gap-3">
                <div className="shrink-0 h-[52px] w-[52px] rounded-2xl grid place-items-center" style={{backgroundColor:"#F5EFE0", color:"#1F3B2D"}}><Users size={26}/></div>
                <div className="font-display text-2xl font-bold leading-tight">I'm a parent</div>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                <Link to="/login" className="rounded-full px-5 py-2 text-sm font-bold hover:translate-y-[-1px] transition" style={{backgroundColor:"#F5EFE0", color:"#1F3B2D"}} data-testid="cta-parent-login">Sign in</Link>
                <Link to="/register" className="text-sm font-bold underline underline-offset-4 hover:opacity-80" style={{color:"#D4A574"}} data-testid="cta-start">Create a family</Link>
              </div>
            </div>
          </div>

          <p className="mt-5 text-xs font-semibold" style={{color:"#4A5D3A"}}>Free for homeschool families · Optional paid resources can be added later if parents want them.</p>
          <p className="mt-7 text-xs leading-relaxed max-w-xl" style={{color:"#7A6E5D"}}>
            A planning, teaching and record-keeping tool. Parents remain responsible for selecting an appropriate
            program and confirming alignment with current NESA requirements.
          </p>
        </div>
        <div className="lg:col-span-2 relative">
          <div className="paper-card p-6 relative">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-stone-500">S4 · Year 8 · Science</div>
                <div className="font-display text-lg font-bold" style={{color:"#1F3B2D"}}>Fair tests</div>
              </div>
              <span className="pill pill-in-progress">In progress</span>
            </div>
            <div className="space-y-2 text-sm" style={{color:"#52473A"}}>
              <div className="flex items-center gap-2"><Dot c="#6B8A5B"/>Learning intention set</div>
              <div className="flex items-center gap-2"><Dot c="#6B8A5B"/>Explicit teaching ready</div>
              <div className="flex items-center gap-2"><Dot c="#D4A574"/>Awaiting evidence</div>
              <div className="flex items-center gap-2"><Dot c="#D4C8A8"/>Parent review</div>
            </div>
            <div className="mt-5 rounded-xl p-3" style={{backgroundColor:"#F5EFE0", border:"1px dashed #D4C8A8"}}>
              <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">Linked outcome</div>
              <div className="font-mono text-xs" style={{color:"#1F3B2D"}}>SC4-WS-01 · Working Scientifically</div>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-4 paper-card p-3 flex items-center gap-2">
            <Pet species="fox" size={60}/>
            <div>
              <div className="font-script text-xl" style={{color:"#C77B5B"}}>Clover</div>
              <div className="text-[10px] uppercase tracking-wider font-bold text-stone-500">Youngling · 42 XP</div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-14">
        <div className="text-center mb-10">
          <div className="font-script text-3xl mb-1" style={{color:"#C77B5B"}}>Everything in one calm place</div>
          <h2 className="font-display text-3xl md:text-4xl font-bold" style={{color:"#1F3B2D"}}>Plan. Teach. <span className="hand-underline">Record.</span></h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          <Feature icon={Users} title="One family, every stage" desc="Add children from Kindergarten to Year 12. Different subject levels per child. Private by family." tint="#4A5D3A"/>
          <Feature icon={Sparkles} title="Ready-made lessons" desc="Stage-appropriate lessons with explicit teaching, success criteria, NESA outcome tags, and offline alternatives." tint="#C77B5B"/>
          <Feature icon={Camera} title="Evidence portfolio" desc="Typed answers, photos of paper work, scans, audio, video — stored privately for parent review." tint="#6B8A5B"/>
          <Feature icon={CalendarDays} title="Family calendar" desc="Month, week and day planning. Catch-up days, excursions, and co-ops." tint="#C8893B"/>
          <Feature icon={BookOpen} title="Curriculum audit" desc="Spot lessons without outcomes, missing evidence, unapproved resources and coverage gaps." tint="#4A5D3A"/>
          <Feature icon={Printer} title="Print & offline" desc="Every lesson prints beautifully. Complete on paper, upload a photo later." tint="#D4A574"/>
          <Feature icon={ShieldCheck} title="Private by design" desc="No public profiles. Each child only sees their own work. Family data stays isolated." tint="#6B8A5B"/>
          <Feature icon={Compass} title="Side Quests" desc="Seasonal, cultural and current-interest lessons mapped to genuine curriculum outcomes." tint="#C77B5B"/>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-5xl px-6 py-16">
        <div className="paper-card-dark p-10 relative overflow-hidden" style={{backgroundColor:"#1F3B2D"}}>
          <Fern className="absolute -right-4 -bottom-4" size={200} color="#6B8A5B"/>
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <Pet species="owl" size={160}/>
            <div>
              <div className="font-script text-3xl" style={{color:"#D4A574"}}>Meet your learning companion</div>
              <h3 className="font-display text-3xl md:text-4xl font-bold mt-1" style={{color:"#F5EFE0"}}>A pocket pet that grows with every lesson.</h3>
              <p className="mt-3 text-sm md:text-base leading-relaxed max-w-xl" style={{color:"#E8E2D1"}}>
                Children choose a fox, owl, turtle, hedgehog, fawn, squirrel, rabbit or dragon.
                Submit work to earn XP. Each level unlocks a new look. When they feel stuck, their companion
                offers kind, specific nudges — never the answer.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs" style={{color:"#D4A574"}}>
                <span className="font-mono">EGG → HATCHLING → YOUNGLING → COMPANION → HERO → LEGEND</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t py-10 text-center text-xs" style={{color:"#7A6E5D", borderColor:"#D4C8A8"}}>
        <p>Side Quest Learning · Supports NSW initial curriculum · Architecture ready for other jurisdictions.</p>
        <p className="mt-1 font-script text-base" style={{color:"#C77B5B"}}>Made with care for homeschool families.</p>
      </footer>
    </div>
  );
}

const Dot = ({ c }) => <span className="h-2 w-2 rounded-full" style={{backgroundColor: c}}/>;
