# Auth testing playbook for Side Quest Learning

- Parent Google OAuth: use Emergent-managed Google Auth. Flow:
  1. Click "Continue with Google" → redirect to `https://auth.emergentagent.com/?redirect=<origin>/auth/callback`
  2. Lands at `<origin>/auth/callback#session_id=XYZ`
  3. Frontend posts `session_id` to backend `/api/auth/session`
  4. Backend calls Emergent `/auth/v1/env/oauth/session-data` with `X-Session-ID` header, stores session_token in `user_sessions` collection with 7-day expiry, sets httpOnly cookie `session_token`
  5. Frontend calls `/api/auth/me` with `credentials: 'include'` and lands on `/parent`

- Parent email/password login: still supported via `/api/auth/login` (returns JWT; stored in localStorage as fallback for same-tab navigation)
- Child login: username + PIN via `/api/auth/child-login` (JWT only; children never use Google)
- Owner seed: `petabozanich6@gmail.com` password `SideQuest2026!` — matches user's own email so Google will link to same family on first Google sign-in.

Backend auth resolution order:
1. `session_token` cookie (Google OAuth)
2. `Authorization: Bearer <jwt>` header (email/password or child)

Test:
```
curl -s https://learning-quest-35.preview.emergentagent.com/api/auth/me -b "session_token=XYZ"
```
