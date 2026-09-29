# Project TODO Lists

Re-verified against the code on 2026-09-29. Items from the earlier audit that are already fixed are listed at the bottom.

### 🔴 Before go-live (owner actions, not code)
- [ ] Rotate every secret that was in `apps/api/.env` — it was committed to a public repo (Stripe, Supabase service role, database password, Zoom, Gemini). The file is now untracked, but old commits still contain it.
- [ ] Confirm `supabase/rls_fix.sql` is applied in the Supabase project (tutor profile/subject policies must not be `USING (true)`).
- [ ] Set Supabase Auth Site URL + Redirect URLs to the production web domain.
- [ ] Create the Stripe webhook endpoint for the Railway API URL (see `DEPLOY.md`).

### 🟡 Soon after launch
- [ ] Failed-payment email in `apps/api/src/routes/stripe-webhook.ts` (`invoice.payment_failed` TODO).
- [ ] Content-Security-Policy for the web app (other security headers are set in `vercel.json` / `apps/web/public/serve.json`).
- [ ] Split the largest bundles (`subset-shared`, `flowchart-elk`, `percentages`) — build warns about >500 kB chunks.
- [ ] Consider removing `apps/api/.env` from git history (`git filter-repo`) or making the repo private.

### 🟢 Backlog
- [ ] Pagination (`take`/`cursor`) on admin and student list endpoints.
- [ ] Replace `declare const Stripe: any` in `StripeCheckoutPage.tsx` with `@stripe/stripe-js` types.
- [ ] Rationalise the Next.js-style `app/` folders inside the Vite app.

### ✅ Done
- Gemini key removed from the client bundle (served via `/api/ai`).
- Rate limit on `/api/checkout/*`; bcrypt/password max length 72.
- Stripe webhook creates/updates `Booking` rows.
- Zoom failure surfaces `zoomPending` to the frontend.
- Sign-out confirmation dialog; toast system.
- Roles are read from the database, not from user-editable Supabase `user_metadata` (privilege escalation fix).
- Hardcoded Stripe test key and admin password removed from scripts.
- Prisma migration for tutor applications / support tickets / `stripeCustomerId`.
- Railway configs for API and web; `DEPLOY.md`.
