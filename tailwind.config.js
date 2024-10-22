import flowbite from 'flowbite-react/tailwind';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    flowbite.content()
  ],
  theme: {
    extend: {},
    colors: {
      'primary': '#162B40',
      'secondary': '#000000',
      'tertiary': '#f9f9fa',
      'body-primary': '#23497C',
      'body-secondary': '#ffffff',
    }
  },
  plugins: [flowbite.plugin()],
}

