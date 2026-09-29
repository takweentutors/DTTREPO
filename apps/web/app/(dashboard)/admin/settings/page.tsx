import React from 'react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import { Settings, Shield, Bell } from 'lucide-react';

export default function AdminSettingsPage() {
    return (
        <div className="space-y-6">
            <AdminPageHeader title="Settings" subtitle="Platform configuration" />

            <div className="grid gap-6 max-w-2xl">
                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                            <Settings className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900">Platform</h3>
                            <p className="text-sm text-slate-500">General platform settings</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between py-2 border-b border-slate-50">
                            <span className="text-sm text-slate-600">Platform Name</span>
                            <span className="text-sm font-medium text-slate-900">Let's Go Tutors</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-slate-50">
                            <span className="text-sm text-slate-600">Contact Email</span>
                            <span className="text-sm font-medium text-slate-900">support@letsgotutors.com</span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <span className="text-sm text-slate-600">Default Timezone</span>
                            <span className="text-sm font-medium text-slate-900">Europe/London</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                            <Shield className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900">Security</h3>
                            <p className="text-sm text-slate-500">Authentication and access control</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between py-2 border-b border-slate-50">
                            <span className="text-sm text-slate-600">Auth Provider</span>
                            <span className="text-sm font-medium text-slate-900">Supabase</span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <span className="text-sm text-slate-600">Role-Based Access</span>
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold">Enabled</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                            <Bell className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900">Notifications</h3>
                            <p className="text-sm text-slate-500">Email and alert preferences</p>
                        </div>
                    </div>
                    <p className="text-sm text-slate-400">Notification settings coming soon.</p>
                </div>
            </div>
        </div>
    );
}
