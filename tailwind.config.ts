
import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "#0F172A",
        foreground: "#F8FAFC",
        primary: {
          DEFAULT: "#FFD93D",
          foreground: "#1A1A1A",
        },
        secondary: {
          DEFAULT: "#334155",
          foreground: "#F8FAFC",
        },
        accent: {
          DEFAULT: "#FFD93D",
          foreground: "#1A1A1A",
        },
        muted: {
          DEFAULT: "#1E293B",
          foreground: "#94A3B8",
        },
        // Young kids specific colors
        "kid-purple": {
          light: "#E5DEFF",
          DEFAULT: "#9b87f5",
          dark: "#7E69AB",
        },
        "kid-yellow": {
          light: "#FEF7CD",
          DEFAULT: "#FFD93D",
          dark: "#FEC6A1",
        },
        "kid-blue": {
          light: "#D3E4FD",
          DEFAULT: "#64B5F6",
          dark: "#2196F3",
        },
        "kid-green": {
          light: "#F2FCE2",
          DEFAULT: "#81C784",
          dark: "#4CAF50",
        },
        "kid-pink": {
          light: "#FFDEE2",
          DEFAULT: "#F06292",
          dark: "#E91E63",
        }
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-out": {
          "0%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(10px)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        wobble: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(-5deg)" },
          "75%": { transform: "rotate(5deg)" },
        },
        "pulse-slow": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(0.95)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "fade-out": "fade-out 0.5s ease-out",
        float: "float 3s ease-in-out infinite",
        wobble: "wobble 1s ease-in-out infinite",
        "spin-slow": "spin 10s linear infinite",
        "ping-slow": "ping 2s cubic-bezier(0, 0, 0.2, 1) infinite",
        "pulse-slow": "pulse-slow 3s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
