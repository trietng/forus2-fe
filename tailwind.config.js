import { heroui } from '@heroui/react';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      'forus-primary': '#162B40',
      'forus-secondary': '#ffc107',
      'forus-tertiary': '#f9f9fa',
      'forus-body-primary': '#23497C',
      'forus-body-secondary': '#1D76C6',
    }
  },
  darkMode: "class",
  plugins: [heroui({
    addCommonColors: true,
    themes: {
      light: {
        colors: {
          secondary: {
            DEFAULT: '#ffc107',
            foreground: '#ffffff',
          },
        }
      },
      // ignore dark theme
    }
  })],
}

