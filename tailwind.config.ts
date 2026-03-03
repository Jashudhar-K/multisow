import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base backgrounds
        background: "var(--color-bg-base)",
        surface: "var(--color-bg-elevated)",
        elevated: "var(--color-bg-surface)",
        overlay: "var(--color-bg-overlay)",
        muted: "var(--color-bg-muted)",

        // Primary scale
        primary: {
          50: "var(--color-primary-50)",
          100: "var(--color-primary-100)",
          200: "var(--color-primary-200)",
          300: "var(--color-primary-300)",
          400: "var(--color-primary-400)",
          500: "var(--color-primary-500)",
          600: "var(--color-primary-600)",
          700: "var(--color-primary-700)",
          800: "var(--color-primary-800)",
          900: "var(--color-primary-900)",
          950: "var(--color-primary-950)",
          DEFAULT: "var(--color-primary-500)",
        },

        // Accent colors
        earth: {
          DEFAULT: "var(--color-earth)",
          light: "var(--color-earth-light)",
        },
        sky: {
          DEFAULT: "var(--color-sky)",
          light: "var(--color-sky-light)",
        },
        water: "var(--color-water)",
        sun: "var(--color-sun)",
        harvest: "var(--color-harvest)",

        // Semantic
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        error: "var(--color-error)",
        info: "var(--color-info)",

        // Strata layers
        canopy: "var(--color-canopy)",
        middle: "var(--color-middle)",
        understory: "var(--color-understory)",
        root: "var(--color-root)",

        // Text
        "text-primary": "var(--color-text-primary)",
        "text-secondary": "var(--color-text-secondary)",
        "text-muted": "var(--color-text-muted)",
        "text-disabled": "var(--color-text-disabled)",

        // Border
        "border-subtle": "var(--color-border-subtle)",
        "border-default": "var(--color-border-default)",
        "border-strong": "var(--color-border-strong)",
      },
      fontFamily: {
        display: "var(--font-display)",
        body: "var(--font-body)",
        mono: "var(--font-mono)",
      },
      fontSize: {
        xs: "var(--text-xs)",
        sm: "var(--text-sm)",
        base: "var(--text-base)",
        lg: "var(--text-lg)",
        xl: "var(--text-xl)",
        "2xl": "var(--text-2xl)",
        "3xl": "var(--text-3xl)",
        "4xl": "var(--text-4xl)",
        "5xl": "var(--text-5xl)",
        "6xl": "var(--text-6xl)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
        "3xl": "var(--radius-3xl)",
        "4xl": "var(--radius-4xl)",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
        "2xl": "var(--shadow-2xl)",
        inner: "var(--shadow-inner)",
        glow: "var(--glow-primary)",
        "glow-soft": "var(--glow-primary-soft)",
        "glow-earth": "var(--glow-earth)",
        "glow-sky": "var(--glow-sky)",
      },
      transitionDuration: {
        instant: "var(--duration-instant)",
        fast: "var(--duration-fast)",
        normal: "var(--duration-normal)",
        slow: "var(--duration-slow)",
        slower: "var(--duration-slower)",
        slowest: "var(--duration-slowest)",
      },
      transitionTimingFunction: {
        spring: "var(--ease-spring)",
        bounce: "var(--ease-bounce)",
      },
      zIndex: {
        dropdown: "var(--z-dropdown)",
        sticky: "var(--z-sticky)",
        fixed: "var(--z-fixed)",
        "modal-backdrop": "var(--z-modal-backdrop)",
        modal: "var(--z-modal)",
        popover: "var(--z-popover)",
        tooltip: "var(--z-tooltip)",
        toast: "var(--z-toast)",
        spotlight: "var(--z-spotlight)",
        max: "var(--z-max)",
      },
      animation: {
        spotlight: "spotlight 2s ease .75s 1 forwards",
        float: "float 3s ease-in-out infinite",
        "fade-in-up": "fade-in-up 0.3s ease-out forwards",
        "scale-in": "scale-in 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        "slide-in-left": "slide-in-left 0.3s ease-out forwards",
        "slide-in-right": "slide-in-right 0.3s ease-out forwards",
        shimmer: "shimmer 2s infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
      },
      keyframes: {
        spotlight: {
          "0%": {
            opacity: "0",
            transform: "translate(-72%, -62%) scale(0.5)",
          },
          "100%": {
            opacity: "1",
            transform: "translate(-50%, -40%) scale(1)",
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "slide-in-left": {
          from: { opacity: "0", transform: "translateX(-20px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(20px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(34, 197, 94, 0.4)" },
          "50%": { boxShadow: "0 0 20px 4px rgba(34, 197, 94, 0.2)" },
        },
      },
    },
  },
  plugins: [],
}

export default config
