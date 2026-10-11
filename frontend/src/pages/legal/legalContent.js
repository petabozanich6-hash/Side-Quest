// DRAFT COPY - review before launch.
// Anything in [square brackets] or marked TODO must be filled in or confirmed.
export const CONTACT_EMAIL = "support@sidequestlearning.app";
export const PRIVACY_EMAIL = "support@sidequestlearning.app";
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
    summary: "What we collect, why, who sees it, how long we keep it, and your rights.",
    sections: [
      { h: "In short", items: [
        "Side Quest is a home learning hub built by a parent for their own children, and shared with other families.",
        "We collect only what is needed to run your family's account and learning features.",
        "We do not sell personal information and we do not show advertising to children.",
        "You can see, correct or delete your family's information at any time.",
      ] },
      { h: "Who we are", p: "Side Quest (sidequestlearning.app) is a personal project run by [your full name], a parent in Australia. It began as a tool for my own children. It is not a registered business or company. In this policy, \"Side Quest\", \"we\" and \"us\" mean the person running the project. You can contact us at support@sidequestlearning.app." },
      { h: "About this policy", p: "We handle personal information in line with the spirit of the Privacy Act 1988 (Cth) and the Australian Privacy Principles, even where the law may not strictly require it of a personal project. This policy applies to the Side Quest website and app, including the parent hub and the child area." },
      { h: "Information we collect from parents", items: [
        "Account details: your name, email address and sign-in details.",
        "Settings and preferences you choose in the parent hub.",
        "Records you create: lesson plans, learning plans, calendar entries, resources you save and notes.",
        "Messages you send to us by email or through the contact and request pages.",
      ] },
      { h: "Information we collect about children", items: [
        "Profile details a parent enters: first name or nickname, year level and avatar or pet choices.",
        "Learning information: lessons completed, progress against learning outcomes, achievements, reading log and word hoard entries.",
        "Evidence a parent uploads, such as photos or work samples, which may show a child or their work.",
        "Child login details set up by the parent so a child can enter their own area.",
      ] },
      { h: "Children's information", p: "Child profiles are created and managed by a parent or guardian, who is responsible for the information entered. The child area has no advertising, no public profiles and no open messaging. We encourage parents to use first names or nicknames only and to avoid uploading images or details that are not needed for learning." },
      { h: "Technical information", p: "When you use Side Quest, our hosting provider may automatically record technical data such as IP address, browser and device type, pages requested, error logs and the time of requests. We use this to keep the service running, secure and fast, and to fix problems." },
      { h: "How we collect information", items: [
        "Directly from you when you register, add a child, upload evidence or contact us.",
        "From your child's activity in the child area, such as completing a lesson.",
        "Automatically through our hosting and sign-in systems.",
        "From a sign-in provider if you choose to sign in with an external account. [TODO: confirm which sign-in methods are offered.]",
      ] },
      { h: "Why we use information", items: [
        "To create and run your account and your children's learning spaces.",
        "To show progress, build learning plans and keep records you can use for home education reporting.",
        "To provide features such as lessons, the reading log, life learning records and rewards.",
        "To provide help and support, and to respond to requests and complaints.",
        "To keep Side Quest secure, prevent misuse and fix faults.",
        "To meet our legal obligations.",
        "To improve the service using general, non-identifying usage patterns.",
      ] },
      { h: "We do not sell your information", p: "We do not sell or rent personal information, and we do not use children's information for advertising or marketing profiles. We will not use your information for an unrelated purpose unless you consent or the law allows it." },
      { h: "AI features", p: "Some features use an AI service to give short hints, suggest links between activities and learning outcomes, or draft lesson ideas. We aim to send only the text needed for the task and to leave out names and other identifying details. AI output is a suggestion only and a parent reviews it. See the AI Use page for more. [TODO: confirm exactly what is sent to the AI service once these features are live, and whether the provider keeps or trains on it.]" },
      { h: "Who we share information with", p: "We share information only with service providers who help run Side Quest, and only as needed for them to do that work." },
      { h: "Our service providers", items: [
        "Cloudflare: hosting, network security, and the database, file storage and any AI services that run on its platform.",
        "Sign-in provider: [TODO: name provider, or remove if none].",
        "Email: support@sidequestlearning.app is handled through [TODO: e.g. Cloudflare Email Routing and your own mailbox provider].",
        "Analytics: [TODO: name provider, or state that none is used].",
      ] },
      { h: "Other disclosures", p: "We may disclose information if required or authorised by law, to protect someone's safety, or to respond to a lawful request from a court or authority." },
      { h: "Overseas disclosure", p: "Cloudflare operates a global network, so information may be stored or processed outside Australia, including in the United States and other countries. We choose providers that publish security and privacy commitments. [TODO: if you have set a specific storage region, name it here.]" },
      { h: "Cookies and similar technology", p: "We use cookies or similar storage that are needed to keep you signed in and keep the service secure. [TODO: confirm whether any analytics or non-essential cookies are used. If so, describe them and how to opt out.]" },
      { h: "Storage and security", p: "We take reasonable steps to protect personal information from misuse, loss and unauthorised access. This includes encrypted connections (HTTPS), login protection for accounts, restricting access to the site, and monitoring logs for problems. No online service is completely secure, so please use a strong, unique password and keep it private." },
      { h: "How long we keep information", items: [
        "We keep account and child information while your account is active.",
        "When you delete a child profile or your account, we delete the related information, except where we must keep something by law. [TODO: state how long backups are kept, if any.]",
        "Technical and security logs are kept for a limited time and then deleted. [TODO: state period; Cloudflare log retention is limited by your plan.]",
        "Emails you send us are kept as long as needed to deal with your request.",
      ] },
      { h: "Data breaches", p: "If a data breach is likely to cause serious harm, we will act quickly to contain it and will tell affected families, and the Office of the Australian Information Commissioner where required." },
      { h: "Accessing and correcting your information", p: "You can ask to see the personal information we hold about you and your children, and ask us to correct anything that is wrong, incomplete or out of date. You can also edit most details yourself in the parent hub. Use the Request Your Data and Request a Correction pages, or email support@sidequestlearning.app. We will confirm your identity first and aim to respond within 30 days. There is no charge for making a request." },
      { h: "Deleting your information", p: "You can delete your account at any time from the Trust & Support page or the sidebar. This removes your account and your children's profiles and learning records." },
      { h: "Complaints", p: "If you are unhappy with how your information has been handled, email support@sidequestlearning.app and we will look into it and reply in writing. You may also contact the Office of the Australian Information Commissioner at oaic.gov.au." },
      { h: "Changes to this policy", p: "We may update this policy as Side Quest grows or the law changes. The date at the top shows when it was last updated. If we make an important change we will let families know through the app or by email." },
      { h: "Contact us", p: "Email: support@sidequestlearning.app" },
    ],
  },
  "terms": {
    group: "legal", title: "Terms of Use", public: true,
    summary: "The agreement between you and Side Quest.",
    sections: [
      { h: "What Side Quest is", p: "Side Quest is a personal project built by a parent for home learning. It is provided as is, and features may change or be removed." },
      { h: "Who can use Side Quest", p: "Accounts are for parents and guardians. Children use the service under the supervision of the parent who created their profile." },
      { h: "Your content", p: "You own what you upload (photos, notes, evidence). You give us permission to store and display it to you and your children so the service works." },
      { h: "Acceptable use", p: "Do not upload unlawful, harmful or other people's private content, and do not attempt to break or overload the service." },
      { h: "Availability", p: "We aim to keep Side Quest running but cannot guarantee uninterrupted access. Please keep your own copies of anything important." },
      { h: "Ending your account", p: "You can delete your account at any time. We may suspend accounts that breach these terms." },
      { h: "Australian Consumer Law", p: "Nothing here limits rights you have under the Australian Consumer Law. TODO: legal review of liability wording, especially if you ever charge for Side Quest." },
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
      { h: "Email", p: "Send a message to support@sidequestlearning.app and we'll reply as soon as we can. Side Quest is run by one parent, so replies may take a few days." },
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
      { h: "How it works", p: "Send a request from your account email. We will confirm your identity and aim to respond within 30 days." },
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
      { h: "Still not resolved?", p: "You may also contact the Office of the Australian Information Commissioner at oaic.gov.au." },
    ],
  },
  "data-handling": {
    group: "trust", title: "How We Handle Data", public: true,
    summary: "The short version of how your family's information is treated.",
    sections: [
      { h: "Minimal by design", p: "We collect what the learning features need and no more." },
      { h: "Parent controlled", p: "Parents create child profiles and can delete them or the whole account." },
      { h: "No ads, no selling", p: "We do not sell personal information or show advertising to children." },
      { h: "Security", p: "Data is transmitted over HTTPS, hosted on Cloudflare, and access to accounts is protected by login." },
    ],
  },
  "third-parties": {
    group: "trust", title: "Third-Party Services", public: true,
    summary: "The providers that help us run Side Quest.",
    sections: [
      { h: "Hosting & infrastructure", p: "Cloudflare (hosting, network, and database, storage and AI services where used)." },
      { h: "Sign-in", p: "TODO: list authentication provider(s) in use." },
      { h: "Email", p: "TODO: name the service handling support@sidequestlearning.app." },
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
