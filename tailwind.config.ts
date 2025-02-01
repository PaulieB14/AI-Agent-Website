import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      screens: {
        // Custom screen sizes (optional)
        xs: "480px", // For extra small screens (e.g., mobile)
        sm: "640px", // Small screens (tablets)
        md: "768px", // Medium screens (larger tablets and some laptops)
        lg: "1024px", // Larger screens (desktops)
        xl: "1280px", // Extra large screens (big desktops)
      },
    },
  },
  plugins: [],
} satisfies Config;
