import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        porcelain: "#F8F5F0",
        linen: "#EEE7DD",
        ash: "#8D8881",
        graphite: "#302D2B",
        mauve: "#8F6AAE",
        plum: "#6F4A8E",
      },
      boxShadow: {
        glass: "0 24px 80px rgba(64, 55, 49, 0.14)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
