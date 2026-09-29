
import React, { useState, FormEvent, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/toast";
import { navigate } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";
import { getRoleDashboard } from "@/lib/routes";

function getPasswordStrength(pw: string): { label: string; color: string; width: string } {
    if (!pw) return { label: '', color: '', width: '0%' };
    let score = 0;
    if (pw.length >= 8) score++;
    if (pw.length >= 12) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (score <= 1) return { label: 'Weak', color: 'bg-red-500', width: '25%' };
    if (score <= 2) return { label: 'Fair', color: 'bg-amber-500', width: '50%' };
    if (score <= 3) return { label: 'Good', color: 'bg-blue-500', width: '75%' };
    return { label: 'Strong', color: 'bg-emerald-500', width: '100%' };
}

export default function RegisterPage() {
    const { register, user } = useAuth();
    const { toast } = useToast();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('STUDENT');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [formError, setFormError] = useState('');
    const [loading, setLoading] = useState(false);

    const strength = useMemo(() => getPasswordStrength(password), [password]);

    // Redirect if already logged in
    if (user) {
        navigate(getRoleDashboard(user.role));
        return null;
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setFormError('');

        if (password.length < 8) {
            setFormError('Password must be at least 8 characters');
            return;
        }

        if (password !== confirmPassword) {
            setFormError('Passwords do not match');
            return;
        }

        if (!acceptedTerms) {
            setFormError('You must accept the Terms of Service and Privacy Policy');
            return;
        }

        setLoading(true);
        try {
            const u = await register(name, email, password, role);
            toast('Account created successfully! Redirecting...', 'success');
            setTimeout(() => {
                navigate(getRoleDashboard(u.role));
            }, 1000);
        } catch (err) {
            if (err instanceof Error && err.message === 'CONFIRM_EMAIL') {
                toast('Account created! Please check your email to verify your address.', 'success');
                setTimeout(() => { navigate('/login'); }, 3000);
                return;
            }
            toast(err instanceof Error ? err.message : 'Registration failed. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Password requirement checks
    const checks = [
        { label: 'At least 8 characters', met: password.length >= 8 },
        { label: 'One uppercase letter', met: /[A-Z]/.test(password) },
        { label: 'One lowercase letter', met: /[a-z]/.test(password) },
        { label: 'One number', met: /[0-9]/.test(password) },
        { label: 'One special character', met: /[^A-Za-z0-9]/.test(password) },
        ...(confirmPassword ? [{ label: 'Passwords match', met: password === confirmPassword }] : []),
    ];

    return (
        <div className="space-y-6">
            <div className="space-y-2 text-center">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create an account</h1>
                <p className="text-sm text-slate-500">Start your journey with Let's Go Tutors</p>
            </div>

            {formError && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-200">
                    {formError}
                </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                    <Label htmlFor="name">Full name</Label>
                    <Input
                        id="name"
                        placeholder="John Doe"
                        required
                        value={name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                    />
                </div>

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
                    <Label htmlFor="role">I am a</Label>
                    <select
                        id="role"
                        className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="PARENT">Parent</option>
                        <option value="STUDENT">Student</option>
                        <option value="TUTOR">Tutor</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        required
                        minLength={8}
                        value={password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setPassword(e.target.value); setFormError(''); }}
                    />
                    {(password || confirmPassword) && (
                        <div className="space-y-2 pt-1">
                            <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                                <div className={`h-full rounded-full transition-all duration-300 ${strength.color}`} style={{ width: strength.width }} />
                            </div>
                            <p className="text-xs font-medium text-slate-500">{strength.label}</p>
                            <ul className="space-y-1">
                                {checks.map((check) => (
                                    <li key={check.label} className={`flex items-center gap-1.5 text-xs ${check.met ? 'text-emerald-600' : 'text-slate-400'}`}>
                                        <CheckCircle2 className={`w-3 h-3 ${check.met ? 'text-emerald-500' : 'text-slate-300'}`} />
                                        {check.label}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                        id="confirm-password"
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                    />
                </div>

                <div className="flex items-start gap-2">
                    <input
                        type="checkbox"
                        id="terms"
                        checked={acceptedTerms}
                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                        className="mt-1 h-4 w-4 rounded border-slate-300 text-secondary focus:ring-secondary"
                    />
                    <label htmlFor="terms" className="text-sm text-slate-500">
                        I agree to the{' '}
                        <a href="/terms" className="text-secondary hover:underline" target="_blank" rel="noopener noreferrer">Terms of Service</a>
                        {' '}and{' '}
                        <a href="/privacy-policy" className="text-secondary hover:underline" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
                    </label>
                </div>

                <Button className="w-full btn-secondary" type="submit" disabled={loading}>
                    {loading ? 'Creating account...' : 'Create Account'}
                </Button>
            </form>

            <div className="text-center text-sm text-slate-500">
                Already have an account?{" "}
                <a href="/login" className="text-secondary font-semibold hover:underline">
                    Log in
                </a>
            </div>
        </div>
    );
}
