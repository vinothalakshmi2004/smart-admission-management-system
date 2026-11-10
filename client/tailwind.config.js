// import forms from '@tailwindcss/forms';
// import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],

    theme: {
        container: {
            center: true,
            padding: "1rem",
            screens: {
                sm: "640px",
                md: "768px",
                lg: "1024px",
                xl: "1280px",
            },
        },

        extend: {
            colors: {
                primary: "#991b1b",     // Tailwind red-800
                secondary: "#7f1d1d",   // Tailwind red-900
                accent: "#FFD700",      // Gold
                neutralLight: "#fef2f2", // Tailwind red-50
                darkRed: "#450a0a",     // Tailwind red-950
                darkGray: "#1A1A1A",
            },

            fontFamily: {
                sans: ["Inter", "sans-serif"],
                serif: ["Merriweather", "serif"],
            },

            animation: {
                "fade-in": "fadeIn 0.6s ease-in-out",
                "fade-in-up": "fadeInUp 0.8s ease-out",
                "slide-in": "slideIn 0.5s ease-out",
            },

            keyframes: {
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                fadeInUp: {
                    "0%": {
                        opacity: "0",
                        transform: "translate3d(0, 40px, 0)",
                    },
                    "100%": {
                        opacity: "1",
                        transform: "translate3d(0, 0, 0)",
                    },
                },
                slideIn: {
                    "0%": { transform: "translateX(-20px)", opacity: "0" },
                    "100%": { transform: "translateX(0)", opacity: "1" },
                },
            },

            boxShadow: {
                soft: "0 10px 25px rgba(0,0,0,0.08)",
                card: "0 4px 12px rgba(0,0,0,0.1)",
            },

            borderRadius: {
                xl: "1rem",
                "2xl": "1.5rem",
            },
        },
    },

    plugins: [
        // forms,
        // typography,
    ],
};
