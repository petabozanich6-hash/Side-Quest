import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, HelpCircle, Mail, ShieldCheck } from "lucide-react";

// Public copy: keep preview and membership limits aligned with the Plan page.
const questions = [
  {
    question: "What actually is Side-Quest?",
    answer: "A home-learning hub for planning lessons, organising a calendar, keeping learning evidence and following your children's progress. Parents review and assign work; children have their own separate sign-in and quest space."
  },
  {
    question: "Can families outside Australia use it?",
    answer: "Yes. Choose Other when signing up. You can plan lessons and manage family-defined learning goals, but we don't provide curriculum outcomes, registration requirements or compliance advice for other countries. Australian families can select their state or territory for jurisdiction-specific resources and available outcome tools."
  },
  {
    question: "Does Side-Quest register my child or approve a curriculum?",
    answer: "No. Homeschooling Compass helps Australian families organise their steps and find official links. You remain responsible for registration, teaching choices and record-keeping requirements. Not every subject or outcome is covered yet, so check current guidance with your education authority."
  },
  {
    question: "What's included in the seven-day preview?",
    answer: "No card and no automatic charge. You can try one child profile, two manually made lessons, two active assignments, a basic learning plan, limited records and one generated lesson draft per family. That generated lesson is a one-time opportunity, not one per child."
  },
  {
    question: "Do lessons use AI? Who checks them?",
    answer: "Lesson drafting and some optional suggestions use AI. They are starting points, not an automatic teacher or a guarantee of accuracy. You can also build lessons yourself. Parents review drafts, choose what to assign and assess their children's work."
  },
  {
    question: "How does a child complete a lesson?",
    answer: "A parent creates or reviews a lesson and assigns it to a child. The child signs in with their own username and PIN, completes the activities and submits their work. The parent can then review it and keep the learning evidence."
  },
  {
    question: "What are the Printable Vault and Dragon's Library?",
    answer: "Family Membership includes access to the Printable Vault's illustrated activities. Dragon's Library offers reading ideas and links to legitimate, often free or low-cost sources; it doesn't upload or share copies of copyrighted books."
  },
  {
    question: "What happens when my preview ends?",
    answer: "Nothing is charged automatically. Your saved records remain viewable, and existing assigned work can still be finished and reviewed. Creating new lessons, assignments and other paid learning records requires a membership."
  },
  {
    question: "How much is membership, and can I cancel?",
    answer: "Family Membership costs A$3 weekly, A$6 fortnightly, A$13 monthly or A$130 yearly. Every payment schedule unlocks the same features, subject to fair-use limits. It's per family, not per child. You can manage or cancel billing from Your plan in the Parent Hub. Overseas families should check their currency conversion."
  },
  {
    question: "Where can I get help or report a problem?",
    answer: "Signed-in parents can use Ideas & Feedback in the Parent Hub to send a private message and receive a reply there. If you can't sign in or need account help, email support@sidequestlearning.app."
  }
];

export default function PublicHelpFaq() {
  return (
    <section id="help-faq" aria-labelledby="public-help-title" className="relative z-10 mx-auto max-w-6xl px-5 sm:px-6 py-14 scroll-mt-6" data-testid="public-help-faq">
      <div className="text-center max-w-3xl mx-auto">
        <div className="font-script text-3xl" style={{color:"#C77B5B"}}>No riddles required</div>
        <h2 id="public-help-title" className="font-display text-3xl md:text-4xl font-bold mt-2" style={{color:"#1F3B2D"}}>Help &amp; frequently asked questions</h2>
        <p className="mt-3 text-stone-600 leading-relaxed">The useful bits before you set off: what Side-Quest does, how the preview works and where to find help. No account needed to read this.</p>
      </div>
      <div className="mt-9 grid md:grid-cols-2 gap-3 items-start">
        {questions.map(({question,answer}) => (
          <details key={question} className="paper-card group p-4 sm:p-5" data-testid="public-faq-question">
            <summary className="cursor-pointer font-display font-bold text-base pr-5 marker:text-emerald-800" style={{color:"#1F3B2D"}}>{question}</summary>
            <p className="mt-3 text-sm text-stone-700 leading-relaxed">{answer}</p>
          </details>
        ))}
      </div>
      <div className="mt-8 paper-card p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5" data-testid="public-help-contact">
        <div className="flex items-start gap-3">
          <HelpCircle size={26} className="mt-0.5 shrink-0" color="#4A5D3A" aria-hidden="true"/>
          <div>
            <h3 className="font-display font-bold text-xl" style={{color:"#1F3B2D"}}>Still have a question?</h3>
            <p className="text-sm text-stone-600 mt-1">Need help signing in? Email us. Already part of the quest? Use the private feedback tool inside your Parent Hub.</p>
            <div className="flex flex-wrap items-center gap-3 mt-3 text-xs font-semibold text-stone-600">
              <span className="inline-flex items-center gap-1"><ShieldCheck size={14}/> Parents stay in charge</span>
              <span className="inline-flex items-center gap-1"><BookOpen size={14}/> No account required to browse help</span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          <a href="mailto:support@sidequestlearning.app" className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold border border-emerald-900 text-emerald-950" data-testid="public-help-email"><Mail size={16}/> Email support</a>
          <Link to="/login" className="inline-flex items-center rounded-full px-4 py-2.5 text-sm font-bold" style={{backgroundColor:"#1F3B2D",color:"#F5EFE0"}}>Parent sign in</Link>
        </div>
      </div>
    </section>
  );
}
