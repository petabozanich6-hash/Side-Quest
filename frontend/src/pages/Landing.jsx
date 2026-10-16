import React from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { isKidsDevice, isKidsHost, isStandalone } from "../lib/pwa";
import { Fern, Branch, Leaf, Flower, Pet } from "../components/shared/Botanical";
import InstallApp from "../components/shared/InstallApp";
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
  const { user, loading } = useAuth();
  // Opened from the home-screen icon while signed in: go straight to the quests or the Parent Hub (works offline too).
  const fromApp = isStandalone() || new URLSearchParams(window.location.search).get("source") === "app";
  // Opened as an app: wait until we know who is signed in (offline this comes from the device) before choosing a page.
  if (fromApp && loading) return <div className="min-h-screen grid place-items-center text-stone-500">Loading…</div>;
  if (fromApp && user) return <Navigate to={user.role === "child" ? "/child" : "/parent"} replace />;
  // The parent app (Side-Quest) opens to the parent sign-in; SQ Kids opens to the child sign-in (below).
  if (fromApp && !user && !isKidsDevice() && !isKidsHost()) return <Navigate to="/login" replace />;
  // A child's own device (the kids' app): straight to their quests, or to the child sign-in.
  if (isKidsDevice()) return <Navigate to={user?.role === "child" ? "/child" : "/child-login"} replace />;
  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Decorative botanicals */}
      <Fern className="absolute -left-10 top-24" size={160} color="#6B8A5B"/>
      <Branch className="absolute right-0 top-12 rotate-12" size={220} color="#4A5D3A"/>
      <Flower className="absolute left-1/2 top-40" size={30} color="#D4857A"/>
      <Leaf className="absolute right-20 bottom-32" size={80} color="#C8893B"/>

      <header className="relative z-10">
        <div className="mx-auto max-w-7xl flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between px-5 sm:px-6 py-5">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl grid place-items-center" style={{backgroundColor:"#1F3B2D"}}><Compass className="text-cream" size={22} style={{color:"#F5EFE0"}}/></div>
            <div>
              <div className="font-display text-xl font-bold" style={{color:"#1F3B2D"}}>Side-Quest</div>
              <div className="text-[10px] uppercase tracking-widest text-stone-500 font-semibold -mt-0.5">Learning</div>
            </div>
          </div>
          <nav className="flex w-full sm:w-auto flex-wrap items-center gap-2 sm:gap-4" aria-label="Main navigation">
            <Link to="/child-login" className="rounded-full px-3 sm:px-5 py-2.5 text-sm font-bold hover:translate-y-[-1px] transition shadow-sm" data-testid="nav-child-login" style={{backgroundColor:"#C77B5B", color:"#FFF9EE"}}>Student sign in</Link>
            <Link to="/login" className="text-sm font-semibold text-stone-700 hover:text-moss" data-testid="nav-login" style={{color:"#52473A"}}>Parent sign in</Link>
            <Link to="/register" className="rounded-full px-3 sm:px-5 py-2.5 text-sm font-semibold hover:translate-y-[-1px] transition shadow-sm" style={{backgroundColor:"#1F3B2D", color:"#F5EFE0"}} data-testid="nav-register">Start free preview</Link>
            <InstallApp variant="nav" />
          </nav>
        </div>
      </header>

      <section className="relative z-10 mx-auto max-w-7xl px-6 pt-10 pb-16 grid lg:grid-cols-5 gap-10 items-center">
        <div className="lg:col-span-3">
          <span className="inline-flex max-w-full items-center gap-2 rounded-full px-3 sm:px-4 py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wide sm:tracking-widest" style={{backgroundColor:"#E8E2D1", color:"#4A5D3A"}}>
            <Sparkles size={13}/> Made for homeschool families across Australia
          </span>
          <h1 className="mt-6 font-display font-bold tracking-tight leading-[1.02]" style={{color:"#1F3B2D"}}>
            <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl">Less time planning.</span>
            <span className="block text-4xl sm:text-5xl md:text-5xl lg:text-6xl italic mt-2" style={{color:"#4A5D3A"}}>More time learning together.</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed max-w-2xl" style={{color:"#52473A"}}>
            Homeschooling has plenty of wonderful moments — and plenty to organise. Side-Quest brings lesson planning, your children's learning and progress records into one friendly place.
            With Family Membership, the AI Lesson Builder drafts teaching, examples, activities and questions from your topic — so you can review and adapt a starting point instead of planning from a blank page. Children get their own learning space, with a <span className="font-script text-xl" style={{color:"#C77B5B"}}>pocket pet companion</span> along for the adventure.
          </p>

          <div className="mt-8 grid sm:grid-cols-2 gap-4 max-w-2xl" data-testid="who-is-here">
            <div className="rounded-3xl p-5 shadow-md" style={{backgroundColor:"#1F3B2D", color:"#F5EFE0"}} data-testid="cta-parent-card">
              <div className="flex items-center gap-3">
                <div className="shrink-0 h-[52px] w-[52px] rounded-2xl grid place-items-center" style={{backgroundColor:"#F5EFE0", color:"#1F3B2D"}}><Users size={26}/></div>
                <div className="font-display text-2xl font-bold leading-tight">I'm a parent</div>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                <Link to="/register" className="rounded-full px-5 py-2 text-sm font-bold hover:translate-y-[-1px] transition" style={{backgroundColor:"#F5EFE0", color:"#1F3B2D"}} data-testid="cta-parent-login">Start free preview</Link>
                <Link to="/login" className="text-sm font-bold underline underline-offset-4 hover:opacity-80" style={{color:"#D4A574"}} data-testid="cta-start">Already a member? Sign in</Link>
              </div>
            </div>
            <Link to="/child-login" className="group rounded-3xl p-5 flex items-center gap-4 shadow-md hover:translate-y-[-2px] transition focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300" style={{backgroundColor:"#C77B5B", color:"#FFF9EE"}} data-testid="cta-child" aria-label="I'm a student. Sign in with your username and PIN">
              <div className="shrink-0 rounded-2xl p-1.5" style={{backgroundColor:"#FFF9EE"}}><Pet species="fox" size={64}/></div>
              <div className="min-w-0">
                <div className="font-display text-2xl font-bold leading-tight">I'm a student</div>
                <div className="mt-1 text-sm font-semibold flex items-center gap-1.5">Start your quest <ArrowRight size={16} className="transition group-hover:translate-x-1"/></div>
              </div>
            </Link>
          </div>

          <p className="mt-5 text-xs font-semibold" style={{color:"#4A5D3A"}}>Start with seven days free, no card or automatic charge. Your preview includes one child, two lessons and two active assignments.</p>
          <p className="mt-7 text-xs leading-relaxed max-w-xl" style={{color:"#7A6E5D"}}>
            Made for home-educating families across Australia. You'll find official curriculum,
            registration and record-keeping resources for your state or territory in the Curriculum hub.
            You remain responsible for checking local requirements; Side-Quest supports your teaching, not replaces it.
          </p>
        </div>
        <div className="lg:col-span-2 relative">
          <div className="paper-card p-6 relative">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-stone-500">Year 8 · Science</div>
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
              <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">Learning goal</div>
              <div className="font-mono text-xs" style={{color:"#1F3B2D"}}>Design and explain a fair investigation</div>
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
          <div className="font-script text-3xl mb-1" style={{color:"#C77B5B"}}>A little less juggling, a lot more learning</div>
          <h2 className="font-display text-3xl md:text-4xl font-bold" style={{color:"#1F3B2D"}}>Plan. Teach. <span className="hand-underline">Record.</span></h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          <Feature icon={Users} title="Your family, one home base" desc="Set up child profiles, plan their learning and keep each child’s work organised privately in your family account." tint="#4A5D3A"/>
          <Feature icon={Sparkles} title="AI Lesson Builder" desc="Have a topic in mind? Let Side-Quest draft the explanations, examples, activities and questions. You check and adjust the lesson instead of starting from a blank page. Included with Family Membership." tint="#C77B5B"/>
          <Feature icon={Camera} title="Evidence Backpack" desc="Gather the work you’ve reviewed, everyday learning notes and progress records in one place. Print or export a portfolio when you need to show the learning journey." tint="#6B8A5B"/>
          <Feature icon={CalendarDays} title="A plan you can actually change" desc="Use the family calendar to organise lessons, outings and everyday plans. Change the schedule when life changes — because it will." tint="#C8893B"/>
          <Feature icon={BookOpen} title="Progress and learning records" desc="See completed work, review progress and organise evidence for your family's learning journey. Find your state's official curriculum and registration resources in the Curriculum hub." tint="#4A5D3A"/>
          <Feature icon={Printer} title="Online or hands-on" desc="Children can work through lessons on screen. Print a lesson or record hands-on learning when you want to step away from the screen." tint="#D4A574"/>
          <Feature icon={ShieldCheck} title="Private by design" desc="No public profiles. Each child only sees their own work. Family data stays isolated." tint="#6B8A5B"/>
          <Feature icon={Compass} title="A little bit of magic" desc="Children earn XP and grow their pocket pets as they learn. Families can also opt into seasonal surprises — a little fun along the way." tint="#C77B5B"/>
          <div className="mt-6 paper-card p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4" data-testid="homepage-homeschool-compass">
            <div className="flex items-start gap-4">
              <div className="shrink-0 h-11 w-11 rounded-xl grid place-items-center" style={{backgroundColor:"#E8E2D1", color:"#1F3B2D"}}><Compass size={22} aria-hidden="true"/></div>
              <div>
                <h3 className="font-display text-xl font-bold" style={{color:"#1F3B2D"}}>Meet your Homeschooling Compass</h3>
                <p className="mt-1 text-sm leading-relaxed text-stone-600 max-w-3xl">
                  Lost in the registration paperwork maze? Find step-by-step guidance and official links for your state or territory, plus a place to track each child's registration status and renewal dates.
                </p>
                <p className="mt-1 text-xs text-stone-500">Side-Quest helps you organise the journey; applications and approvals remain with the relevant government authority.</p>
              </div>
            </div>
            <Link to="/register" className="inline-flex items-center justify-center gap-2 shrink-0 rounded-full px-5 py-2.5 text-sm font-bold hover:opacity-90 transition" style={{backgroundColor:"#1F3B2D", color:"#F5EFE0"}} data-testid="homepage-compass-cta">
              Explore Side-Quest <ArrowRight size={16}/>
            </Link>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6 pb-16">
        <div className="text-center mb-8">
          <h2 className="font-display text-3xl md:text-4xl font-bold" style={{color:"#1F3B2D"}}>How your family's Side-Quest works</h2>
          <p className="mt-3 text-stone-600 max-w-2xl mx-auto">One shared adventure, with the right tools for parents and children.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          <div className="paper-card p-6">
            <span className="text-xs font-bold uppercase tracking-wider" style={{color:"#4A5D3A"}}>For parents</span>
            <h3 className="font-display text-xl font-bold mt-2" style={{color:"#1F3B2D"}}>Plan and prepare, without starting from zero</h3>
            <p className="text-sm text-stone-600 leading-relaxed mt-3">Your dashboard brings lessons, assignments, calendar plans and work waiting for review into view. Build a lesson yourself, or let AI create a first draft for you to check.</p>
          </div>
          <div className="paper-card p-6">
            <span className="text-xs font-bold uppercase tracking-wider" style={{color:"#4A5D3A"}}>For children</span>
            <h3 className="font-display text-xl font-bold mt-2" style={{color:"#1F3B2D"}}>Their own place to learn</h3>
            <p className="text-sm text-stone-600 leading-relaxed mt-3">Children sign in to a separate, family-private dashboard to find assignments, work through lessons, submit answers and grow their pocket pet as they learn.</p>
          </div>
          <div className="paper-card p-6">
            <span className="text-xs font-bold uppercase tracking-wider" style={{color:"#4A5D3A"}}>For the journey</span>
            <h3 className="font-display text-xl font-bold mt-2" style={{color:"#1F3B2D"}}>Keep the little wins, too</h3>
            <p className="text-sm text-stone-600 leading-relaxed mt-3">The Evidence Backpack gathers parent-approved work and notes from real-life learning. Review progress, track outcomes where supported, and export records for your portfolio.</p>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-6xl px-5 sm:px-6 py-14" aria-labelledby="membership-heading">
        <div className="text-center mb-8">
          <span className="font-script text-2xl" style={{color:"#C77B5B"}}>One family, one membership</span>
          <h2 id="membership-heading" className="font-display text-3xl md:text-4xl font-bold mt-2" style={{color:"#1F3B2D"}}>Pick a rhythm that suits your family</h2>
          <p className="text-sm text-stone-600 mt-3 max-w-2xl mx-auto">Every paid option includes the same Family Membership features. No per-child or per-subject charges. Prices in Australian dollars.</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {[
            { label: "Weekly", price: "$3", every: "per week" },
            { label: "Fortnightly", price: "$6", every: "every 2 weeks" },
            { label: "Monthly", price: "$13", every: "per month" },
            { label: "Yearly", price: "$130", every: "per year" },
          ].map((option) => (
            <div key={option.label} className="paper-card p-4 sm:p-6 text-center">
              <h3 className="font-display text-lg font-semibold" style={{color:"#1F3B2D"}}>{option.label}</h3>
              <p className="font-display text-3xl sm:text-4xl font-bold mt-3" style={{color:"#1F3B2D"}}>{option.price}</p>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">AUD {option.every}</p>
            </div>
          ))}
        </div>
        <p className="mt-5 text-center text-sm text-stone-600">Start with a 7-day, card-free preview. Family Membership supports up to 20 child profiles and includes AI lesson drafting with fair-use limits. All four billing options include the same features; cancel any time and paid access normally continues through the current billing period.</p>
        <div className="mt-6 flex justify-center"><Link to="/register" className="rounded-full px-6 py-3 font-semibold text-sm shadow-sm" style={{backgroundColor:"#1F3B2D", color:"#F5EFE0"}}>Start your free preview</Link></div>
      </section>

      <section className="relative z-10 mx-auto max-w-5xl px-6 py-16">
        <div className="paper-card-dark p-6 sm:p-10 relative overflow-hidden" style={{backgroundColor:"#1F3B2D"}}>
          <Fern className="absolute -right-4 -bottom-4" size={200} color="#6B8A5B"/>
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <Pet species="owl" size={160}/>
            <div>
              <div className="font-script text-3xl" style={{color:"#D4A574"}}>Meet your learning companion</div>
              <h3 className="font-display text-3xl md:text-4xl font-bold mt-1" style={{color:"#F5EFE0"}}>A pocket pet that grows with every lesson.</h3>
              <p className="mt-3 text-sm md:text-base leading-relaxed max-w-xl" style={{color:"#E8E2D1"}}>
                Children choose a goblin, dragon, fox, owl or turtle, and watch it grow from an egg.
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
        <p>Side-Quest Learning · Built for homeschool families across Australia.</p>
        <p className="mt-1 font-script text-base" style={{color:"#C77B5B"}}>Made with care for homeschool families.</p>
      </footer>
    </div>
  );
}

const Dot = ({ c }) => <span className="h-2 w-2 rounded-full" style={{backgroundColor: c}}/>;
