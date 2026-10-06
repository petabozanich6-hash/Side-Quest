# Side Quest Learning — PRD

## Original Problem Statement
Build a comprehensive K-12 homeschool platform called "Side Quest Learning" with Parent Hub + Child Hub, NSW initial curriculum (K through Year 12 = Early Stage 1 to Stage 6), AI lesson generation, evidence portfolio with photo/audio/video, resource library with licence badges, calendar, curriculum audit, and seasonal "Side Quest" lesson generation. Must be a genuine one-stop-shop for homeschool families — not wishy-washy, not a thin wrapper around YouTube videos.

## User Choices
- AI: Claude Sonnet 5.5 via Emergent Universal Key
- Auth: JWT parent + child username/PIN + Emergent-managed Google OAuth for parents
- MVP scope: Foundation + Parent Hub + Child Hub + AI lesson gen + Evidence + Basic calendar
- File storage: Emergent Object Storage
- Design: Nature-inspired, earthy, cosy — Fraunces + Nunito + Caveat typography, forest/moss/clay/cream palette, botanical SVG decorations
- Pet companion: Yes, nature-themed (fox, owl, turtle, hedgehog, fawn, squirrel, rabbit, dragon)
- Free platform (no "start free" marketing); paid resources are opt-in later

## User Personas
1. **Homeschool Parent (Owner)** — plans, generates lessons, reviews evidence, approves resources, runs audits, prepares AP inspection documents.
2. **Student (Child)** — logs in with username/PIN, completes assigned lessons, submits typed/photo/audio/video work, tends to a learning companion pet.
3. **Future: Support Adult / Tutor** — scaffolded only.

## Architecture
- **Backend**: FastAPI + MongoDB (motor), JWT + Emergent Google OAuth with session cookies, bcrypt PINs, Claude Sonnet 5.5 via emergentintegrations, Emergent Object Storage for files.
- **Frontend**: React 19 + React Router 7 + Tailwind + Shadcn/UI + Sonner + Lucide + custom SVG botanicals and pet characters. Nature-inspired dual persona (Parent Hub, age-adaptive Child Hub).

## What's Been Implemented (Feb 2026)
### Backend
- Auth: register/login (JWT), Google OAuth session exchange (`/auth/session`), child PIN login, cookie-first resolution
- Family data isolation across every endpoint
- Students, Programs, Units, Lessons CRUD
- Assignments with status workflow
- Submissions + Parent Feedback (incl. outcome mappings, XP awards to pet)
- File upload/download via Emergent Object Storage with query-param auth
- Resources with licence badges + parent approval
- Calendar events, full CRUD
- NSW curriculum: 7 stages, learning areas by band, seeded sample outcomes
- AI Lesson Generator (Claude Sonnet 5.5) — now includes `suggested_resources` (library/ABC Education/Scootle hints, no fake URLs) and `follow_up_challenges` (apply/teach/create/measure/quiz/project)
- AI Side Quest Generator (seasonal/interest-themed)
- AI Evidence Analysis + Life Learning AI mapping (baking → math/science/English etc.)
- Life Evidence CRUD + AI outcome mapping + parent accept/reject per mapping
- Learning Plans: AP-inspection-ready documents, AI-drafted, interest-woven
- Reading Log: comprehensive NESA-friendly record with stats (unique books, minutes, pages, by type/mode)
- Curriculum Audit (issue scanner + coverage matrix with life-learning folded in)
- Pet Companion: species, levels (Egg→Legend), XP from submissions + feedback, AI-powered help in pet's voice
- Owner account seeded with user's email `petabozanich6@gmail.com`

### Frontend
- Nature-inspired aesthetic throughout: Fraunces serif + Nunito body + Caveat script, forest/moss/clay/cream palette, SVG botanical decorations (ferns, branches, leaves, flowers), paper textures, hand-drawn pet SVGs
- Landing with hero, feature grid, pet showcase, botanical decor — removed "Start free" CTA (free platform)
- Login + Register with Google button + email/password + nature art
- Child login with warm welcome + pet illustration
- Parent Hub navigation (12 pages): Dashboard, Children, Curriculum, Lessons, AI Planner, Side Quests, Learning Plans, Reading Log, Evidence, Life Learning, Resources, Calendar, Audit
- Child Hub: age-adaptive theming (Early/Primary/Secondary/Senior)
- Child Lesson experience: 12-step explicit teaching sequence + external resource suggestions + 3 follow-up challenges that unlock after submission
- Pet Companion component: visible on every child page, speech bubble, XP + happiness tracking, AI "ask my pet for a nudge" using Claude
- Pet Picker on first child login
- Portfolio with status + parent feedback

## Backlog
### P0
- PDF export for reports (print HTML works today)
- Programs/Units builder UI (backend ready; parent builds via lessons today)

### P1
- Google Calendar / ICS export integration
- Senior Secondary course plan UI depth
- Admin content review workflow
- Learning games / interactives catalog

### P2
- Support adult / tutor roles
- Multi-jurisdiction curriculum expansion (QLD, VIC, etc.)
- Contributor resource moderation queue UI
- Pet accessories/unlockable looks per level

## Credentials
See `/app/memory/test_credentials.md`.
