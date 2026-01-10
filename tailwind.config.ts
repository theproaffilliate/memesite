import type { Config } from "tailwindcss";

export default {
  darkMode: "class",

  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx,mdx}",
    "./hooks/**/*.{ts,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        primary: "#0b0d15",
        surface: "#12121b",
        card: "#11121a",
        accent: "#1fb6ff",
        button: "#1ea7ff",
        text: "#e6eef8",
        muted: "#9aa6b2",
        pill: "#2b2f3a",
      },

      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },

      boxShadow: {
        soft: "0 8px 30px rgba(2,6,23,0.6)",
      },

      borderRadius: {
        xl: "14px",
      },
    },
  },
} satisfies Config;
