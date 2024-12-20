import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
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
      colors: {
        "solaris-primary": "var(--solaris-primary)",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        dropProfile: "var(--background-drop-profile)",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
        spin2: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(-360deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "spin-2": "spin2 1.5s linear infinite",
      },
      gridTemplateColumns: {
        dashboard: "300px 1fr",
      },
      boxShadow: {
        input:
          "0px 1px 6px 0px rgba(0, 0, 0, 0.00), -4px 4px 5px 0px rgba(0, 0, 0, 0.01), 0px 5px 3px 0px rgba(0, 0, 0, 0.05), 0px 2px 2px 0px rgba(0, 0, 0, 0.09), 0px 1px 1px 0px rgba(0, 0, 0, 0.10);",
        pager:
          "0px 14px 4px 0px rgba(0, 0, 0, 0.00), 0px 9px 4px 0px rgba(0, 0, 0, 0.01), 0px 5px 3px 0px rgba(0, 0, 0, 0.05), 0px 2px 2px 0px rgba(0, 0, 0, 0.09), 0px 1px 1px 0px rgba(0, 0, 0, 0.10);",
      },
      fontSize: {
        "2xs": "0.625rem",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
