import { useState, useEffect } from "react";
import { User, Menu, X, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getRoleDashboard } from "@/lib/routes";
import { navigate } from "@/lib/utils";
import { BrandLogo } from "@/components/brand-logo";

export function SiteHeader() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { user, loading } = useAuth();
    const [pathname, setPathname] = useState("");

    useEffect(() => {
        setPathname(window.location.pathname);
    }, []);

    // Do not show the main site header on dashboard pages
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin') || pathname.startsWith('/tutor-dashboard') || pathname.startsWith('/parent-dashboard') || pathname.startsWith('/student')) {
        return null;
    }

    const navLinks = [
        { name: "Resources", href: "/resources" },
        { name: "Subjects", href: "/subjects" },
        { name: "About the LMS", href: "/about-the-lms" },
        { name: "Careers", href: "/careers" },
        { name: "Become a Tutor", href: "/become-a-tutor" },
        { name: "FAQ", href: "/faq" },
    ];

    return (
        <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 md:px-8 transition-all duration-300">
            <div className="w-full max-w-6xl rounded-2xl border border-[#d8ccbb]/95 bg-[#fbf6ed]/92 backdrop-blur-md shadow-[0_12px_30px_-22px_rgba(67,46,24,0.55)] px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between transition-all">

                {/* Logo Area */}
                <a href="/" className="flex items-center shrink-0 w-[200px] h-10">
                    <span className="transition-transform duration-300 hover:scale-[1.02]">
                        <BrandLogo markClassName="h-9 w-9" textClassName="text-base" />
                    </span>
                </a>

                {/* Desktop Nav - Centered */}
                <nav className="hidden lg:flex flex-1 justify-center gap-1 xl:gap-2 items-center">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            onClick={(e) => { e.preventDefault(); navigate(link.href); }}
                            className="text-sm font-semibold text-[#65584b] hover:text-primary transition-colors px-3 py-2 hover:bg-[#f1e7d8] rounded-lg whitespace-nowrap"
                        >
                            {link.name}
                        </a>
                    ))}
                </nav>

                {/* Auth + Hamburger */}
                <div className="flex items-center justify-end gap-2 sm:gap-3 w-[180px]">
                    {loading ? (
                        <div className="w-20 h-8 rounded-full bg-[#ede2d2] animate-pulse" />
                    ) : user ? (
                        <>
                            <a href={getRoleDashboard(user.role)} className="btn-primary text-xs sm:text-sm py-1.5 px-3 sm:px-4 no-underline rounded-full flex items-center shadow-sm">
                                <LayoutDashboard className="w-4 h-4 sm:mr-1.5" />
                                <span className="hidden sm:inline">Dashboard</span>
                            </a>
                        </>
                    ) : (
                        <>
                            <a href="/login" className="text-sm font-semibold text-[#65584b] hover:text-primary hidden sm:block px-3 py-2 rounded-lg hover:bg-[#f1e7d8] transition-colors whitespace-nowrap">
                                Log in
                            </a>
                            <a href="/register" className="btn-secondary text-xs sm:text-sm py-1.5 px-3 sm:px-4 no-underline rounded-full flex items-center shadow-sm whitespace-nowrap">
                                <User className="w-4 h-4 sm:mr-1.5" />
                                <span className="hidden sm:inline">Register</span>
                            </a>
                        </>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="lg:hidden p-2 rounded-lg text-[#65584b] hover:bg-[#f1e7d8] transition-colors ml-1"
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav Drawer - Animated dropdown */}
            <div className={`
                fixed top-20 left-4 right-4 bg-[#fbf6ed]/96 backdrop-blur-xl rounded-2xl border border-[#d8ccbb] shadow-[0_18px_36px_-24px_rgba(67,46,24,0.58)] lg:hidden
                transition-all duration-300 transform origin-top
                ${mobileOpen ? 'opacity-100 scale-100 translate-y-0 visible' : 'opacity-0 scale-95 -translate-y-4 invisible'}
            `}>
                <nav className="p-4 space-y-1">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            onClick={(e) => { e.preventDefault(); setMobileOpen(false); navigate(link.href); }}
                            className="block py-3 px-4 rounded-xl text-sm font-semibold text-[#5f5245] hover:bg-[#f1e7d8] hover:text-primary transition-all active:scale-[0.98]"
                        >
                            {link.name}
                        </a>
                    ))}
                    <div className="pt-3 mt-2 border-t border-[#dccfbd] px-4">
                        {loading ? null : user ? (
                            <a href={getRoleDashboard(user.role)} className="block py-3 text-sm font-semibold text-primary hover:text-secondary sm:hidden transition-colors">
                                Dashboard
                            </a>
                        ) : (
                            <a href="/login" className="block py-3 text-sm font-semibold text-[#65584b] hover:text-primary sm:hidden transition-colors">
                                Log in
                            </a>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );
}
