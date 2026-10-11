// DRAFT COPY - review (ideally with a lawyer) before launch.
export const CONTACT_EMAIL = "hello@example.com"; // TODO: replace with real support address
export const PRIVACY_EMAIL = "privacy@example.com"; // TODO: replace with real privacy contact
export const LAST_UPDATED = "11 October 2026";

export const GROUPS = [
  { id: "legal", title: "Legal", blurb: "The rules and the fine print, in plain language." },
  { id: "support", title: "Support", blurb: "Help when you need a hand." },
  { id: "privacy", title: "Account & privacy requests", blurb: "You are in control of your family's information." },
  { id: "trust", title: "Trust", blurb: "How Side Quest looks after your family's data." },
];

export const PAGES = {
  "privacy-policy": {
    group: "legal", title: "Privacy Policy", public: true,
    summary: "What we collect, why, who sees it, and your rights.",
    sections: [
      { h: "What we collect", p: "Parent account details (name, email), child profiles you create (first name, year level, learning progress, evidence you upload, reading log entries) and basic technical data needed to run the service." },
      { h: "Why we collect it", p: "To run your family's learning hub, track progress against learning outcomes, and keep the service secure. We do not sell personal information." },
      { h: "Children's information", p: "Child profiles are created and managed by a parent or guardian. We collect only what is needed for learning features and keep child-facing screens free of advertising." },
      { h: "AI features", p: "Some features may send short prompts to an AI service to generate hints or lesson ideas. See the AI Use page for detail." },
      { h: "Who we share it with", p: "Only the service providers we need to operate Side Quest (hosting, storage, email, AI). See Third-Party Services." },
      { h: "Overseas storage", p: "Some providers may store or process data outside Australia. TODO: confirm regions and list them here." },
      { h: "Your rights", p: "You can ask to access, correct or delete your information at any time using the Account & privacy requests pages." },
      { h: "Complaints", p: "If you are unhappy with how we handled your information, contact us first. You can also complain to the Office of the Australian Information Commissioner (oaic.gov.au)." },
    ],
  },
  "terms": {
    group: "legal", title: "Terms of Use", public: true,
    summary: "The agreement between you and Side Quest.",
    sections: [
      { h: "Who can use Side Quest", p: "Accounts are for parents and guardians. Children use the service under the supervision of the parent who created their profile." },
      { h: "Your content", p: "You own what you upload (photos, notes, evidence). You give us permission to store and display it to you and your children so the service works." },
      { h: "Acceptable use", p: "Do not upload unlawful, harmful or other people's private content, and do not attempt to break or overload the service." },
      { h: "Availability", p: "We aim to keep Side Quest running but cannot guarantee uninterrupted access. Features may change." },
      { h: "Ending your account", p: "You can delete your account at any time. We may suspend accounts that breach these terms." },
      { h: "Australian Consumer Law", p: "Nothing here limits rights you have under the Australian Consumer Law. TODO: legal review of liability wording." },
    ],
  },
  "disclaimer": {
    group: "legal", title: "Educational Disclaimer", public: true,
    summary: "Side Quest supports home learning. It does not replace your responsibilities.",
    sections: [
      { h: "Not an education authority", p: "Side Quest is a planning and record-keeping tool. It is not a registered school or an approving body." },
      { h: "Check your requirements", p: "Home education requirements differ between states and territories. You are responsible for meeting the requirements that apply to your family and for checking outcome mappings against official curriculum documents." },
      { h: "Parent supervision", p: "Parents and guardians remain responsible for supervising children and reviewing any generated content before use." },
    ],
  },
  "ai-use": {
    group: "legal", title: "AI Use & Limitations", public: true,
    summary: "Where AI helps, and where a parent stays in charge.",
    sections: [
      { h: "Where AI may be used", p: "Short hints when a child is stuck, suggested links between life-learning activities and learning outcomes, and draft lesson ideas for parents to review." },
      { h: "What AI does not do", p: "AI does not make decisions about your child, grade their work, or publish anything without a parent seeing it." },
      { h: "Accuracy", p: "AI can make mistakes. Always review suggestions before relying on them, especially curriculum outcome matches." },
      { h: "Data sent to AI", p: "We aim to send only the minimum text needed for a task and not to include identifying details. TODO: confirm exactly what is sent once AI features are built." },
    ],
  },
  "contact": {
    group: "support", title: "Contact Us", contact: "general",
    summary: "Questions, feedback or ideas. We'd love to hear from you.",
    sections: [
      { h: "Email", p: "Send us a message and we'll reply as soon as we can. TODO: add expected response time." },
    ],
  },
  "help": {
    group: "support", title: "Help & FAQ",
    summary: "Quick answers to common questions.",
    sections: [
      { h: "How do I add a child?", p: "Go to Children in the sidebar and choose to add a new child profile." },
      { h: "How does my child log in?", p: "Children use the child login page with the details you set up for them." },
      { h: "Where do I see progress?", p: "The Dashboard and each child's overview show progress, evidence and reading." },
      { h: "Can I delete everything?", p: "Yes. Use Delete account from the Account & privacy requests page or the sidebar." },
      { h: "TODO", p: "Add more FAQs as real questions come in." },
    ],
  },
  "report-problem": {
    group: "support", title: "Report a Problem", contact: "problem",
    summary: "Something broken or not right? Tell us.",
    sections: [
      { h: "What to include", p: "What you were doing, what you expected, what happened, and the device or browser you used. Please do not include children's full names or sensitive details." },
    ],
  },
  "request-access": {
    group: "privacy", title: "Request Your Data", contact: "access",
    summary: "Ask for a copy of the information we hold about your family.",
    sections: [
      { h: "How it works", p: "Send a request from your account email. We will confirm your identity and respond within a reasonable time. TODO: confirm response timeframe (aim for 30 days or less)." },
    ],
  },
  "request-correction": {
    group: "privacy", title: "Request a Correction", contact: "correction",
    summary: "Tell us if something we hold is wrong or out of date.",
    sections: [
      { h: "Quick fixes", p: "You can edit most details yourself in Children and your account. Use this request for anything you can't change directly." },
    ],
  },
  "privacy-complaint": {
    group: "privacy", title: "Privacy Complaint", contact: "complaint",
    summary: "Concerned about how your information was handled?",
    sections: [
      { h: "Contact us first", p: "Tell us what happened and we will investigate and reply in writing." },
      { h: "Still not resolved?", p: "You can complain to the Office of the Australian Information Commissioner at oaic.gov.au." },
    ],
  },
  "data-handling": {
    group: "trust", title: "How We Handle Data", public: true,
    summary: "The short version of how your family's information is treated.",
    sections: [
      { h: "Minimal by design", p: "We collect what the learning features need and no more." },
      { h: "Parent controlled", p: "Parents create child profiles and can delete them or the whole account." },
      { h: "No ads, no selling", p: "We do not sell personal information or show advertising to children." },
      { h: "Security", p: "Data is transmitted over HTTPS and access to accounts is protected by login. TODO: add specifics once confirmed." },
    ],
  },
  "third-parties": {
    group: "trust", title: "Third-Party Services", public: true,
    summary: "The providers that help us run Side Quest.",
    sections: [
      { h: "Hosting & infrastructure", p: "Cloudflare (hosting, edge network, and AI/storage services where used)." },
      { h: "Sign-in", p: "TODO: list authentication provider(s) in use." },
      { h: "Email", p: "TODO: list email provider if used." },
      { h: "Analytics", p: "TODO: state whether any analytics are used." },
    ],
  },
  "safety": {
    group: "trust", title: "Safety Overview", public: true,
    summary: "How we keep Side Quest a safe space for children.",
    sections: [
      { h: "Parent in charge", p: "Children can only reach content within their own profile, set up and managed by a parent." },
      { h: "No open chat", p: "Side Quest has no public profiles and no messaging between users. TODO: keep this accurate as features change." },
      { h: "Reporting", p: "If something concerns you, use Report a Problem and we will look into it promptly." },
    ],
  },
};
