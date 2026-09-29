import React from 'react';
import { useAuth } from '../context/AuthContext';
import { navigate } from '../lib/utils';

interface ProtectedRouteProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
    requiredRole?: string | string[];
}

export default function ProtectedRoute({ children, fallback, requiredRole }: ProtectedRouteProps) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            fallback || (
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
                </div>
            )
        );
    }

    if (!user) {
        navigate('/login');
        return null;
    }

    if (requiredRole) {
        const allowed = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
        if (!allowed.includes(user.role)) {
            return (
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Access Denied</h2>
                    <p className="text-slate-500 mb-4">You don't have permission to access this page.</p>
                    <button onClick={() => navigate('/dashboard')} className="btn-secondary px-6 py-2 rounded-full text-sm font-bold">
                        Go to Dashboard
                    </button>
                </div>
            );
        }
    }

    return <>{children}</>;
}

