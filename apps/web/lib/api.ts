import { supabase } from './supabase';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

interface FetchOptions extends Omit<RequestInit, 'body'> {
    body?: unknown;
}

export async function api<T = unknown>(
    path: string,
    options: FetchOptions = {}
): Promise<T> {
    const { body, headers, ...rest } = options;

    // Manually get the latest session from Supabase
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    const baseHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    };

    if (token) {
        baseHeaders['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}${path}`, {
        // No longer relying strictly on cookies for auth, but still send cookies for
        // things like rate limit tracking or non-auth cookies if any exist.
        credentials: 'omit',
        headers: {
            ...baseHeaders,
            ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        ...rest,
    });

    if (res.status === 401) {
        // Token is invalid/missing. Supabase handles its own refresh transparently
        // when getSession() is called. If that failed, the user is genuinely logged out.
        // Include returnTo so they come back to where they were
        const returnTo = encodeURIComponent(window.location.pathname + window.location.search);
        window.location.href = `/login?returnTo=${returnTo}`;

        throw new ApiError(401, 'Session expired or unauthorized');
    }

    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Request failed' }));
        throw new ApiError(res.status, err.error || 'Request failed');
    }

    return res.json();
}

export class ApiError extends Error {
    status: number;
    constructor(status: number, message: string) {
        super(message);
        this.status = status;
    }
}
