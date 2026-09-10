import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0f172a",
          soft: "#1e293b",
          card: "#1a2744",
          elev: "#243556",
        },
        mint: {
          DEFAULT: "#22c55e",
          soft: "#4ade80",
        },
        star: {
          DEFAULT: "#fbbf24",
          soft: "#fde68a",
        },
        parchment: "#f5e6c8",
      },
      fontFamily: {
        display: ["var(--font-rounded)", "ui-rounded", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 24px rgba(34, 197, 94, 0.35)",
        card: "0 8px 32px rgba(0,0,0,0.35)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
};
export default config;
