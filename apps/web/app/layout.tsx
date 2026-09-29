
import React from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CookieConsent } from "@/components/CookieConsent";

export const metadata = {
    title: "Let's Go Tutors | Excellence in Education",
    description: "Personalised tuition for GCSE and A-Level success.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children?: React.ReactNode;
}>) {
    return (
        <div className="flex min-h-screen flex-col font-sans bg-background text-foreground selection:bg-secondary/20 selection:text-secondary transition-colors duration-300">
            <SiteHeader />
            <main className="flex-1 w-full">{children}</main>
            <SiteFooter />
            <CookieConsent />
        </div>
    );
}
