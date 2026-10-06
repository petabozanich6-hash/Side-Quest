# Side Quest Learning — PRD

## Original Problem Statement
Build a comprehensive K-12 homeschool platform called "Side Quest Learning" with Parent Hub + Child Hub, NSW initial curriculum (K-12), AI lesson generation, evidence portfolio, resource library, calendar, curriculum audit, and seasonal "Side Quest" lesson generation. A genuine one-stop-shop for homeschool families.

## User Choices
- AI: Claude Sonnet 5.5 via Emergent Universal Key
- Auth: Emergent-managed Google OAuth + JWT email/password for parents; username/PIN for children
- File storage: Emergent Object Storage
- Design: Nature-inspired, Fraunces + Nunito + Caveat typography, forest/moss/clay/cream palette
- Pet companion: 8 species (fox, owl, turtle, hedgehog, fawn, squirrel, rabbit, dragon)

## Architecture
- **Backend**: FastAPI + MongoDB (motor async), JWT + Emergent Google OAuth session cookies, bcrypt PINs, Claude Sonnet 5.5 via emergentintegrations, Emergent Object Storage.
- **Frontend**: React 19 + React Router 7 + Tailwind + Shadcn/UI + Sonner + Lucide. Dual persona: Parent Hub, age-adaptive Child Hub.

## What's Been Implemented (Feb 2026)
### Backend
- Auth: email/password + Google OAuth + child PIN login, cookie-first resolution
- Family data isolation across all endpoints
- Students, Programs, Units, Lessons CRUD + lesson delete
- Assignments + status workflow
- Submissions + Parent Feedback (outcome mappings, XP to pet)
- File upload/download via Emergent Object Storage
- Resources with licence badges + parent approval
- Calendar events full CRUD **+ GET /api/calendar/ics ICS export** (route ordered before `/calendar/{eid}` to avoid shadowing)
- NSW curriculum: 7 stages, 137 outcomes seeded, NESA deep links, secondary/senior compulsory + elective patterns
- AI Lesson Generator (Claude Sonnet 5.5): outcome codes **constrained to seeded set**, `outcome_alignment`, real URLs from approved providers (ABC/BBC/Khan/Scootle/CSIRO/NSW DoE), `suggested_resources`, `follow_up_challenges`
- AI Side Quest Generator (seasonal/interest-themed)
- AI Evidence Analysis + Life Learning AI outcome mapping
- Life Evidence CRUD + parent accept/reject per mapping
- Learning Plans: AP-inspection-ready; **generate endpoint hardened** (tolerates minor AI JSON variance, synthesises defaults instead of 500)
- Reading Log + stats (NESA-friendly: unique books, minutes, pages, by type/mode)
- Curriculum Audit (coverage matrix + life-learning folded in)
- **Pet Companion**: species, levels (Egg→Legend), XP from submissions + feedback, feed/**play**/**customize**/help AI, happiness tracking
- **Cheers (parent-to-child high-fives)**: POST/GET/{cid}/seen; unseen cheers surface on `GET /api/dashboard/child.cheers`
- **Student Overview**: `GET /api/students/{sid}/overview` returns student, pet, assignments, recent_submissions, cheers, reading_count, life_evidence
- Owner account seeded (`petabozanich6@gmail.com`)

### Frontend
- Nature-inspired aesthetic, Fraunces + Nunito + Caveat, forest/moss/clay/cream, SVG botanicals, paper textures, hand-drawn pet SVGs
- Landing, Login/Register (Google + email), Child login
- Parent Hub (12 pages): Dashboard, Children + per-child Overview, Curriculum, Lessons, AI Planner, Side Quests, Learning Plans, Reading Log, Evidence, Life Learning, Resources, Calendar (with ICS export), Audit
- Child Hub age-adaptive theming (Early/Primary/Secondary/Senior)
- Child Lesson 12-step explicit teaching flow + external resources + 3 follow-up challenges
- Pet Companion component + Pet Room (feed/play/customize/decorate)
- Cheers banner on child dashboard; parent cheer-sending UI on Child Overview

## Latest Session Changes (Oct 2026)
- Added `POST/GET /api/cheers` + `POST /api/cheers/{cid}/seen`; child-side auto-mark-seen
- `GET /api/dashboard/child` now returns unseen `cheers` array
- Added `POST /api/pet/play` (+2 XP, +8 happiness) and `PUT /api/pet/customize` (name/background/accessories)
- Added `GET /api/students/{sid}/overview` for the parent per-child view
- Added `GET /api/calendar/ics` returning `text/calendar` with valid VCALENDAR body
- Hardened `POST /api/learning-plans/{pid}/generate` with key-variant normalisation + default fallbacks (no more 500 on minor AI shape drift)
- Fixed ChildHome lint: imported `Heart`, derived `unseen = data.cheers || []`

## Backlog
### P1
- Reward cheer with +5 XP (optional spec extension)
- Server-side validation: drop AI-returned `outcome_codes` not in the seeded set before persisting
- Fallback for `/ai/generate-lesson` on transient AI JSON issues (mirror learning-plan hardening)
- Programs/Units builder UI depth (backend ready)
- Reading Challenge certificate (goal + shareable certificate)
- Google Calendar one-click subscribe link

### P2
- `server.py` → modularise (auth, curriculum, lessons, pet, cheers, life_evidence, learning_plans, calendar)
- PDF export for Learning Plans & Portfolio
- Senior Secondary HSC course plan UI depth
- Multi-jurisdiction curriculum (QLD, VIC)
- Pet accessories/unlockables per level
- Support adult / tutor roles

## Credentials
See `/app/memory/test_credentials.md`.
