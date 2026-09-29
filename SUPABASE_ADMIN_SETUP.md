# Supabase Admin Setup & Configuration

This document provides the complete SQL and configuration required to securely instantiate the admin dashboard foundation natively within Supabase, avoiding the split-brain Prisma dependency for analytics.

## 1. Profiles Table Extension & Role Policy

If `profiles` doesn't strictly enforce `admin` enumeration yet, run this:

```sql
-- Ensure the ENUM supports 'admin' (if omitted in previous iterations)
ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'admin';
ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'moderator';

-- Ensure `profiles` table is securely enforcing the role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## 2. Admin KPIs Materialised View

Aggregates ALL meaningful KPI data from across the schema into a single queryable metric layer for performance.

```sql
DROP MATERIALIZED VIEW IF EXISTS public.admin_kpis CASCADE;

CREATE MATERIALIZED VIEW public.admin_kpis AS
-- Revenue Metrics (from bookings)
SELECT 
    'total_all_time_revenue' AS kpi_name,
    COALESCE(SUM(split_part(plan_tier, '_', 2)::numeric), 0) AS kpi_value, -- Assumes tier parsing or equivalent
    'GBP' AS kpi_unit,
    'revenue' AS category,
    NOW() AS updated_at
FROM public.bookings

UNION ALL

-- User Metrics
SELECT 
    'total_active_students' AS kpi_name,
    COUNT(id)::numeric AS kpi_value,
    'users' AS kpi_unit,
    'users' AS category,
    NOW() AS updated_at
FROM public.student_profiles

UNION ALL

SELECT 
    'total_active_tutors' AS kpi_name,
    COUNT(id)::numeric AS kpi_value,
    'users' AS kpi_unit,
    'users' AS category,
    NOW() AS updated_at
FROM public.tutor_profiles
WHERE verification_status = 'VERIFIED'

UNION ALL

-- Engagement Metrics
SELECT 
    'total_sessions_completed' AS kpi_name,
    COUNT(id)::numeric AS kpi_value,
    'sessions' AS kpi_unit,
    'engagement' AS category,
    NOW() AS updated_at
FROM public.sessions
WHERE status = 'COMPLETED'

UNION ALL

SELECT 
    'total_messages_sent' AS kpi_name,
    COUNT(id)::numeric AS kpi_value,
    'messages' AS kpi_unit,
    'engagement' AS category,
    NOW() AS updated_at
FROM public.messages;

-- Create unique index to allow CONCURRENTLY refreshes later
CREATE UNIQUE INDEX idx_admin_kpis_name ON public.admin_kpis(kpi_name);
```

## 3. Admin Dashboard Summary View

Provides a daily snapshot structure joining the KPIs for the frontend UI.

```sql
CREATE OR REPLACE VIEW public.admin_dashboard_summary AS
SELECT 
    category,
    JSON_OBJECT_AGG(kpi_name, 
        json_build_object(
            'value', kpi_value,
            'unit', kpi_unit,
            'last_updated', updated_at
        )
    ) AS metrics
FROM public.admin_kpis
GROUP BY category;
```

## 4. Row Level Security (RLS) Policies

We must protect the KPIs so that only validated `admin` roles can query them. Since RLS cannot directly apply to regular views mapping to a mat-view, we wrap it in an access policy function.

```sql
-- Secure the base tables further if needed
ALTER MATERIALIZED VIEW public.admin_kpis OWNER TO postgres;

-- Explicitly revoke public access
REVOKE ALL ON public.admin_kpis FROM public;
REVOKE ALL ON public.admin_dashboard_summary FROM public;

-- Grant access ONLY to authenticated users
GRANT SELECT ON public.admin_kpis TO authenticated;
GRANT SELECT ON public.admin_dashboard_summary TO authenticated;

-- Use a security barrier view or explicit RLS on a proxy table if preferred. 
-- Alternatively, wrap the select in an RPC:
CREATE OR REPLACE FUNCTION public.get_admin_dashboard()
RETURNS SETOF public.admin_dashboard_summary
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Verify admin status
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Access Denied: Requires Admin Role';
    END IF;

    RETURN QUERY SELECT * FROM public.admin_dashboard_summary;
END;
$$;
```

## 5. Initial Admin Account Insertion

Run this snippet in the Supabase SQL Editor. 
*Note: Ensure the UUID matches the user ID generated when you sign-up via the Auth UI.*

```sql
-- Then:
INSERT INTO public.profiles (id, email, name, role, created_at, updated_at)
VALUES (
    '<SUPABASE_USER_UUID>', 
    'admin@letsgotutors.com',
    'System Admin',
    'admin', 
    now(),
    now()
) 
ON CONFLICT (id) DO UPDATE 
SET role = 'admin', updated_at = now();
```

## 6. Edge Function: Refresh KPIs

Create the file `/supabase/functions/refresh-kpis/index.ts`. This can be triggered via `pg_cron` or a Supabase scheduled webhook.

```typescript
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    // SECURITY: Validate authorization header using a cron secret
    const authHeader = req.headers.get('Authorization')
    if (authHeader !== `Bearer ${Deno.env.get('CRON_SECRET')}`) {
      return new Response('Unauthorized', { status: 401 })
    }

    // Connect via Service Role securely bypassing RLS
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Call an RPC function that executes the REFRESH MATERIALIZED VIEW
    const { error } = await supabaseClient.rpc('refresh_admin_kpis')

    if (error) throw error

    return new Response(JSON.stringify({ success: true, timestamp: new Date() }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
```

*Required RPC for the function above (Run in SQL Editor):*
```sql
CREATE OR REPLACE FUNCTION public.refresh_admin_kpis()
RETURNS void AS $$
BEGIN
  -- Requires Postgres extension pg_cron or Service Role executing this
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.admin_kpis;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## 7. Environment Variables Required

To support the full Admin lifecycle, ensure the following are present in `.env.local` and your CI/CD provider:

- `VITE_SUPABASE_URL`: Standard Public URL.
- `VITE_SUPABASE_ANON_KEY`: Standard Public Anon Key.
- `SUPABASE_SERVICE_ROLE_KEY`: Required exclusively for Edge Functions / Backend API to bypass RLS for administrative mutating scripts natively. Do not expose this to the frontend.
- `CRON_SECRET`: A secure randomly-generated string (e.g. `openssl rand -base64 32`) verifying the edge-function is called securely chronologically by Supabase hooks, rather than external bad actors.
