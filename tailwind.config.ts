import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        aws: {
          dark: "#0f1b29",      // AWS Dark Console Base BG
          container: "#162535", // AWS Dark Card BG
          border: "#2a3b4c",    // AWS Dark Border
          divider: "#1d2d3d",   // AWS Dark Divider
          textPrimary: "#eaeded", // AWS Dark Main Text
          textSecondary: "#aab7c4", // AWS Dark Muted Text
          orange: "#ff9900",    // AWS Primary Brand color
          orangeHover: "#ec7211",
          blue: "#00a1c9",      // AWS Telemetry Blue
          teal: "#00bfa5",      // Cost optimization Teal
          red: "#d13212",       // Alert Red
          green: "#037f0c",     // Success Green
          yellow: "#ffcc00",    // Warning Yellow
          // Light Mode Alternates
          lightBg: "#f2f3f3",
          lightContainer: "#ffffff",
          lightBorder: "#eaeded",
          lightTextPrimary: "#16191f",
          lightTextSecondary: "#5f6b7a"
        }
      },
      fontFamily: {
        aws: ["Amazon Ember", "Inter", "system-ui", "sans-serif"],
      }
    },
  },
  plugins: [],
};
export default config;
