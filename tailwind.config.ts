import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // 线上美术馆 / 白盒风配色（令牌语义保持，值反转为浅色）
        ink: "#f6f3ec", // 画廊暖白（底色）
        "ink-soft": "#efebe1", // 浅卡
        paper: "#1b1813", // 近黑（文字）
        "paper-dim": "#6f6a60", // 灰调
        accent: "#b3402a", // 美术馆陶土红（强调）
        "accent-soft": "#c5533d",
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
