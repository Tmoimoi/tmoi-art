import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // 暗色策展风配色
        ink: "#0a0a0a", // 深空黑（底色）
        "ink-soft": "#121212",
        paper: "#f5f2ec", // 暖白（文字）
        "paper-dim": "#9a958c",
        accent: "#ff5a1f", // 霓虹橙（强调）
        "accent-soft": "#ff7a47",
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', "Georgia", "serif"],
        sans: ['"Noto Sans SC"', "system-ui", "sans-serif"],
      },
      letterSpacing: {
        widest2: "0.28em",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        grain: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "10%": { transform: "translate(-5%, -5%)" },
          "30%": { transform: "translate(3%, -8%)" },
          "50%": { transform: "translate(-4%, 6%)" },
          "70%": { transform: "translate(6%, 3%)" },
          "90%": { transform: "translate(-3%, 4%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.8s ease forwards",
        grain: "grain 8s steps(6) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
