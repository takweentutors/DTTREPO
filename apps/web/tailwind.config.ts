import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
        "./index.html",
        "./index.tsx",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./lib/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#2f271f",
                    foreground: "#fff9f1",
                },
                secondary: {
                    DEFAULT: "#bf7a45",
                    foreground: "#fff9f1",
                },
                accent: {
                    DEFAULT: "#85705a",
                    foreground: "#ffffff",
                },
                muted: {
                    DEFAULT: "#eee5d7",
                    foreground: "#6d6255",
                },
                background: "var(--background)",
                foreground: "var(--foreground)",
            },
            fontFamily: {
                sans: ["Source Sans 3", "sans-serif"],
                heading: ["Source Serif 4", "serif"],
            },
            borderRadius: {
                xl: "0.75rem",
                "2xl": "1rem",
            },
            boxShadow: {
                soft: '0 8px 24px -16px rgba(45, 32, 21, 0.45)',
                glow: '0 0 0 1px rgba(191, 122, 69, 0.18), 0 16px 28px -20px rgba(132, 84, 44, 0.42)',
                card: '0 10px 20px -16px rgba(45, 32, 21, 0.42)',
                'card-hover': '0 18px 32px -20px rgba(45, 32, 21, 0.5)',
            },
        },
    },
    plugins: [],
};
export default config;
