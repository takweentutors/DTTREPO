import React from "react";

type Tone = "light" | "dark";

const PALETTE: Record<Tone, { badge: string; rocket: string; window: string; flame: string; text: string }> = {
    // For light backgrounds: dark badge, cream rocket
    light: { badge: "#2f271f", rocket: "#fff9f1", window: "#2f271f", flame: "#bf7a45", text: "text-primary" },
    // For dark backgrounds: cream badge, dark rocket
    dark: { badge: "#fff9f1", rocket: "#2f271f", window: "#fff9f1", flame: "#bf7a45", text: "text-white" },
};

/** Circular rocket mark with three portholes. Source of truth for /logo.svg and /favicon.svg. */
export function LogoMark({ tone = "light", className = "h-9 w-9" }: { tone?: Tone; className?: string }) {
    const c = PALETTE[tone];
    return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false">
            <circle cx="32" cy="32" r="32" fill={c.badge} />
            <path d="M32 55 L27.5 46 H36.5 Z" fill={c.flame} />
            <path d="M24 35 L17 45 L24 44 Z M40 35 L47 45 L40 44 Z" fill={c.flame} />
            <path d="M32 7 C37 11 40 17 40 24 V46 H24 V24 C24 17 27 11 32 7 Z" fill={c.rocket} />
            <circle cx="32" cy="21" r="2.8" fill={c.window} />
            <circle cx="32" cy="29.5" r="2.8" fill={c.window} />
            <circle cx="32" cy="38" r="2.8" fill={c.window} />
        </svg>
    );
}

export function BrandLogo({
    tone = "light",
    markClassName = "h-9 w-9",
    textClassName = "text-lg",
    showWordmark = true,
}: {
    tone?: Tone;
    markClassName?: string;
    textClassName?: string;
    showWordmark?: boolean;
}) {
    return (
        <span className="inline-flex items-center gap-2.5">
            <LogoMark tone={tone} className={`${markClassName} shrink-0`} />
            {showWordmark ? (
                <span className={`font-heading font-bold tracking-tight whitespace-nowrap ${PALETTE[tone].text} ${textClassName}`}>
                    Let's Go Tutors
                </span>
            ) : (
                <span className="sr-only">Let's Go Tutors</span>
            )}
        </span>
    );
}
