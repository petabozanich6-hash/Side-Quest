# Side Quest Learning — PRD

## Original Problem Statement
Build a comprehensive K–12 homeschool platform called "Side Quest Learning" with Parent Hub + Child Hub, NSW initial curriculum (ES1–S6), AI lesson generation, evidence portfolio with photo/audio/video, resource library with licence badges, calendar, curriculum audit, and seasonal "Side Quest" lesson generation.

## User Choices
- AI: Claude Sonnet 5.5 via Emergent Universal Key
- Auth: JWT parent + child username/PIN
- MVP scope: Foundation + Parent Hub + Child Hub + AI lesson gen + Evidence + Basic calendar
- File storage: Emergent Object Storage
- Design: Let design agent decide fully → navy/teal/cream calm palette with age-adaptive child themes

## User Personas
1. **Homeschool Parent (Owner)** — plans, generates lessons, reviews evidence, approves resources, runs audits.
2. **Student (Child)** — logs in with username/PIN, completes assigned lessons, submits typed/photo/audio/video work.
3. **Support Adult / Tutor** — future role (scaffold only).

## Architecture
- **Backend**: FastAPI + MongoDB (motor), JWT auth, bcrypt PINs, Claude Sonnet 5.5 via emergentintegrations, Emergent Object Storage for files.
- **Frontend**: React 19 + React Router 7 + Tailwind + Shadcn/UI + Sonner toasts + Lucide icons. Dual-persona layouts: Parent Hub (dense command centre) and Child Hub (age-adaptive themes: early/primary/secondary/senior).

## What's Been Implemented (2026-02)
### Backend
- JWT auth: `/auth/register`, `/auth/login`, `/auth/child-login`, `/auth/me`
- Family data isolation across every endpoint
- Students CRUD, Programs, Units, Lessons CRUD
- Assignments with status workflow (not_started → opened → in_progress → submitted → accepted/demonstrated)
- Submissions + Parent Feedback (incl. outcome mappings)
- File upload/download via Emergent Object Storage with query-param auth for `<img src>`
- Resources with licence badges + parent approval
- Calendar events (month/week/day), full CRUD
- NSW curriculum: 7 stages, learning areas by band, seeded sample outcomes
- AI Lesson Generator (Claude Sonnet 5.5) — strict JSON extraction + stage-appropriate scaffold
- AI Side Quest Generator (seasonal/interest-themed)
- AI Evidence Analysis (confidence levels, parent review required)
- Curriculum Audit (issue scanner + coverage matrix)
- Owner account seeded (`petabozanich6@gmail.com`)

### Frontend
- Landing page (hero + features)
- Parent/Child/Register auth pages
- Parent Hub: Dashboard, Children, Curriculum, Lessons (view/print/assign), AI Planner, Side Quest generator, Resources (with licence badges), Evidence review + AI analysis + feedback, Calendar (month grid + add events), Curriculum Audit
- Child Hub: age-adaptive theming (early/primary/secondary/senior), Today's quests dashboard, Lesson experience (13-step explicit teaching sequence, support banner, I'm Stuck helper, file upload, submission), Portfolio with feedback view

## Backlog
### P0
- Reports export (PDF/CSV) — endpoints scaffolded via audit; UI pending
- Programs/Units builder UI (backend ready)
- ICS calendar export

### P1
- Google Calendar integration
- Senior Secondary course plan UI depth
- Admin content review workflow
- Learning games catalog

### P2
- Support adult / tutor roles
- Multi-jurisdiction curriculum expansion
- Contributor resource moderation queue UI
