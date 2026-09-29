
import React, { useState, useEffect, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/toast";
import { navigate } from "@/lib/utils";
import { getRoleDashboard } from "@/lib/routes";

export default function LoginPage() {
    const { login, user, loading: authLoading } = useAuth();
    const { toast } = useToast();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // Redirect if already logged in (only after auth check completes)
    useEffect(() => {
        if (!authLoading && user) {
            const params = new URLSearchParams(window.location.search);
            const returnTo = params.get('returnTo');
            navigate(returnTo || getRoleDashboard(user.role));
        }
    }, [authLoading, user]);

    // Show a quick spinner while checking auth, not a blank screen
    if (authLoading) {
        return (
            <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-secondary"></div>
            </div>
        );
    }

    if (user) return null; // Already redirecting

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const u = await login(email, password);
            const params = new URLSearchParams(window.location.search);
            const returnTo = params.get('returnTo');
            navigate(returnTo || getRoleDashboard(u.role));
        } catch (err) {
            toast(err instanceof Error ? err.message : 'Login failed. Please check your credentials.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2 text-center">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 ">Welcome back</h1>
                <p className="text-sm text-slate-500 ">Enter your credentials to access your account</p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        placeholder="name@example.com"
                        type="email"
                        required
                        value={email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <button
                            type="button"
                            className="text-xs text-secondary hover:underline"
                            onClick={async () => {
                                const resetEmail = prompt('Enter your email address:');
                                if (resetEmail) {
                                    const { supabase } = await import('@/lib/supabase');
                                    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
                                        redirectTo: `${window.location.origin}/login`,
                                    });
                                    if (error) {
                                        toast(error.message, 'error');
                                    } else {
                                        toast('If that email exists, a reset link has been sent.', 'success');
                                    }
                                }
                            }}
                        >
                            Forgot password?
                        </button>
                    </div>
                    <Input
                        id="password"
                        type="password"
                        required
                        value={password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    />
                </div>
                <Button className="w-full btn-secondary" type="submit" disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign In'}
                </Button>
            </form>

            <div className="text-center text-sm text-slate-500 ">
                Don&apos;t have an account?{" "}
                <a href="/register" className="text-secondary font-semibold hover:underline">
                    Sign up
                </a>
            </div>
        </div>
    );
}
