/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors';
const twElements = require('tw-elements/plugin.cjs');

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/tw-elements/dist/js/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          muted: colors.gray[50],
          subtle: colors.gray[100],
          DEFAULT: colors.white,
          emphasis: colors.gray[700],
        },
        border: {
          DEFAULT: colors.gray[200],
        },
        ring: {
          DEFAULT: colors.gray[200],
        },
        content: {
          subtle: colors.gray[400],
          DEFAULT: colors.gray[500],
          emphasis: colors.gray[700],
          strong: colors.gray[900],
          inverted: colors.white,
        },
      },
    },
  },
  plugins: [
    twElements, 
    require('@tailwindcss/forms'),
  ],
}
