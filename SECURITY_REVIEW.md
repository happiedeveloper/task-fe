# Initial security review and modernization plan

Scope: frontend and backend in this repository. This is an initial static review of files on the `master` baseline, not a penetration test or deployment certification.

## Immediate security actions

- [ ] Rotate every credential that has ever been committed in tracked environment files or source code. Treat exposed credentials as compromised, even after removal from the latest commit.
- [ ] Remove tracked `.env` files from the working branch and add safe `.env.example` templates with placeholder values only.
- [ ] Review Git history and repository forks/clones for exposed secrets; rotate first, then consider history rewriting as a separately coordinated cleanup.
- [ ] Replace the hard-coded administrator email/password in the frontend. Admin access must be verified by a trusted backend/auth provider; hiding routes or UI is not authorization.
- [ ] Remove hard-coded admin query keys and SMTP credentials from frontend/backend source. Use server-side environment configuration and authenticated sessions.
- [ ] Review public access to booking records, uploaded payment proofs, guest information and sensitive health-related guest fields. Restrict access by authenticated role and least privilege.
- [ ] Review Supabase Row Level Security policies, storage policies, and exposed publishable configuration. A publishable client key is not a secret; policies must enforce access.
- [ ] Verify Razorpay payment flow end-to-end: create orders server-side using server-calculated prices, verify provider signatures server-side, and transition booking state only after verified payment.

## Initial findings from static inspection

### Critical / high priority
1. Tracked environment files are present at `frontend/.env` and `backend/.env`. Do not publish their contents in review output. Rotate any real credentials they contain.
2. `backend/routes/bookingRoutes.js` contains an SMTP application credential in source code. Rotate it immediately and move mail configuration to server-side environment variables.
3. `frontend/src/pages/AdminLogin.tsx` contains a hard-coded admin credential check. The frontend redirects on a match but does not establish a trusted authenticated session.
4. `frontend/src/pages/Admin.tsx` embeds an admin key in requests to the backend. Query-string credentials can leak through logs, browser history and monitoring systems.
5. Admin API routes authorize using a shared query parameter compared to `ADMIN_SECRET`; replace with authenticated, role-checked middleware and avoid query-string secrets.
6. `GET /api/booking/:id` returns a booking without visible authorization checks in the route. Booking contains personal contact details and guest health-related details; enforce ownership/authorization and minimize returned fields.
7. `POST /api/verify-payment` currently accepts a booking ID and returns success after dispatching a confirmation email. No payment signature verification is performed in the inspected route. The Razorpay client is commented out. Do not treat this endpoint as proof of payment.
8. `POST /api/create-order` accepts client-supplied destination and total amount and saves a booking. Recalculate prices and validate service, dates, quantities and availability on the server.

### Additional hardening
- Express currently uses unrestricted `cors()`; use an explicit allowlist of trusted origins.
- Add Helmet/security headers, request/body size limits, request validation, structured safe errors, rate limiting, and production-safe logging.
- Multer currently relies on client-provided MIME type starting with `image/`. Validate extension, signature/magic bytes, size, generated filename and storage access; do not serve private payment proofs from a public static directory.
- Validate MongoDB IDs and request schemas; avoid returning raw database error messages.
- Add authentication, authorization, audit logging and tests around every admin mutation.
- Avoid mutating React state objects directly in the admin dashboard; use immutable state updates.
- Configure security headers and SPA routing rules in the deployment platform, with CSP tested against required assets and integrations.
- Run dependency and lockfile audits for both frontend and backend before upgrading packages.

## Architecture snapshot

- Frontend: React 18 + TypeScript + Vite, React Router, Tailwind CSS, Radix/shadcn-style UI components, Framer Motion, Supabase client.
- Backend: Express 5, Mongoose/MongoDB, Multer uploads, Nodemailer, Razorpay dependency.
- Existing frontend test scripts use Vitest; backend package currently has no real test script.
- Existing app routes include home, booking, admin login/dashboard, terms, payment, contact and about.

## Planned delivery sequence

1. Secure credentials and environment handling; inspect historical exposures and deployment configuration.
2. Establish backend auth and role-based authorization, payment verification, booking privacy, upload controls and validation.
3. Establish 2026 design tokens and reusable frontend patterns.
4. Redesign public landing, activity discovery/details, booking, payment and admin experience without changing business rules blindly.
5. Add tests, accessibility checks, responsive checks and CI security/dependency checks.
6. Validate on a preview deployment before opening a PR to the original repository.

## Constraints

- Keep all work on `feat/2026-ui-security-modernization`.
- Do not push to or modify the original owner's repository.
- Do not copy real credentials into issues, docs, commits or test fixtures.
- Do not claim the application is secure until the relevant tests and deployment checks pass.

## Modernization changes on `feat/2026-ui-security-modernization`

- Admin login uses Supabase Auth. Backend requests validate bearer access tokens against the configured Supabase project and allow administrators only through trusted `app_metadata.role=admin` or the server-side `SUPABASE_ADMIN_USER_IDS` allowlist. User-editable metadata is ignored.
- Booking details and proof submission require a random per-booking capability token; only its SHA-256 digest is stored. Admin APIs and private screenshot reads require administrator authentication. Uploads are size-limited and checked against PNG/JPEG/WebP/GIF signatures, stored under generated names, and are no longer served as public static files.
- Booking amounts are calculated on the server from the allowed destination rates and guest count. Admin updates accept only a status field, request bodies are bounded, and CORS uses the configured origin allowlist.
- `/api/verify-payment` is admin-only and refuses confirmation emails until a booking has status `paid`. The manual UPI proof flow does not verify a provider transaction or automatically set `paid`; configure a real webhook or manual verification workflow before treating a booking as paid.

## Required deployment actions and remaining risks

- Rotate the SMTP application password previously committed in `backend/routes/bookingRoutes.js`; treat it as compromised and revoke the old credential. Revoke the former `ADMIN_SECRET`, reset the hard-coded administrator password anywhere it was reused, and rotate any real credentials from the previously tracked `.env` files. Configure `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_FROM`, `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_ADMIN_USER_IDS`, `CORS_ORIGINS`, `MONGO_URI`, and a private upload storage path in the deployment environment. Keep secrets out of Vite variables.
- Assign trusted administrator IDs through Supabase server-managed app metadata or the server allowlist. A valid Supabase user without either assignment is intentionally denied.
- Existing bookings created before this change have no booking capability token; their payment details cannot be read or changed through the new public booking endpoints. Establish an authenticated admin-only remediation process.
- Local filesystem upload storage may be ephemeral on the deployment host. Configure durable private storage and backups before relying on payment proof retention.
- Razorpay order creation/signature verification remains unimplemented; the manual payment workflow needs a trusted payment review step. Review the static service rates against the business pricing source before release.
- Create the Vercel project from the GitHub repository before setting deployment variables. Set its Root Directory to `frontend`, build command to `npm run build`, and output directory to `dist` (also recorded in `frontend/vercel.json`). Add `VITE_API_BASE_URL=https://task-fe-75yw.onrender.com`, `VITE_SUPABASE_URL`, and `VITE_SUPABASE_PUBLISHABLE_KEY` for Production and the desired Preview environments. After the first deployment assigns the project URL, set that exact Vercel origin in the backend's deployed `CORS_ORIGINS` setting; add only preview hostnames you trust. The Express API remains a separate service; Vercel configuration alone does not migrate it.

