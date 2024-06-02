import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    extend: {},
    screens: {
      'xs': '360px',
      ...defaultTheme.screens,
    }
  },
  plugins: [],
};