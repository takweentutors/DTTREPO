# Deploying Let's Go Tutors

Two services, one repo:

| Service | Folder     | Host                         | Config                  |
|---------|------------|------------------------------|-------------------------|
| API     | `apps/api` | Railway                      | `apps/api/railway.json` |
| Web     | `apps/web` | Railway (or Vercel)          | `apps/web/railway.json` (or root `vercel.json`) |

The database is the existing Supabase Postgres (or add a Railway Postgres and point `DATABASE_URL` at it).

## 1. API on Railway

1. Railway → **New Project → Deploy from GitHub repo** → pick this repo.
2. Service **Settings → Root Directory**: `apps/api`. Railway picks up `railway.json`:
   - build: `npm ci && npm run build` (runs `prisma generate`)
   - pre-deploy: `npm run db:deploy` (runs `prisma migrate deploy`)
   - start: `npm start` · health check: `/api/health`
3. **Variables** — every key from `apps/api/.env.example`. Minimum:
   `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`,
   `STRIPE_WEBHOOK_SECRET`, the `STRIPE_PRICE_*` ids, `GEMINI_API_KEY`,
   `CORS_ORIGIN` (web URL(s), comma-separated), `FRONTEND_URL` (web URL).
   Do not set `PORT` — Railway provides it.
4. **Settings → Networking → Generate Domain**. Note the URL, e.g. `https://lgt-api.up.railway.app`.
5. Stripe dashboard → Webhooks → endpoint `https://<api-domain>/api/checkout/webhook`; copy its signing secret into `STRIPE_WEBHOOK_SECRET`.

## 2. Web on Railway

1. In the same project: **New → GitHub Repo** → same repo, second service.
2. **Root Directory**: `apps/web`. Railway uses `railway.json` (build `vite build`, start `serve -s dist`).
3. **Variables** (build-time, public values only):
   - `VITE_API_URL` = `https://<api-domain>/api`
   - `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
4. Generate a domain (or add your custom domain), then put that URL into the API's `CORS_ORIGIN` and `FRONTEND_URL` and redeploy the API.

### Alternative: web on Vercel
Import the repo in Vercel with the root `vercel.json` (web only) and set the same three `VITE_*` variables.

## 3. Supabase

- Auth → URL Configuration: set **Site URL** and add the web domain to **Redirect URLs** (password reset links).
- SQL editor: make sure `supabase/rls_fix.sql` has been applied (tutor profile policies must not be `USING (true)`).

## 4. First admin

```bash
cd apps/api && ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='<strong password>' npx tsx --env-file=.env scripts/create-admin.ts
```

Admin rights come from the `User.role` column in the database only — the API ignores any `role` a user puts in their Supabase `user_metadata`.

## 5. Smoke test after deploy

- `GET https://<api-domain>/api/health` → `{"status":"ok"}`
- Register a student → log in → dashboard loads
- Stripe test checkout (card `4242 4242 4242 4242`) → booking appears in dashboard
- Non-admin visiting `/admin` is refused; admin account can open it
