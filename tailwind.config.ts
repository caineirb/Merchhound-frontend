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
        primary: 'var(--primary-color)',
        secondary: 'var(--secondary-color)',
        text: 'var(--text-color)',
        accent: 'var(--accent-color)',
        border: 'var(--border-color)',
        hover: 'var(--hover-color)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        selected: 'var(--selected-color)',
      },
    },
  },
  plugins: [],
};

export default config;