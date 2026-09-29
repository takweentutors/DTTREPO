/**
 * Centralized role-based route mapping.
 * Single source of truth for dashboard paths and sidebar links.
 */

export function getRoleDashboard(role: string): string {
    switch (role) {
        case 'PARENT': return '/parent-dashboard';
        case 'ADMIN': return '/admin';
        default: return '/dashboard'; // STUDENT, TUTOR share /dashboard (role-aware)
    }
}
