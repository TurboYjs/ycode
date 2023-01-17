/** @type {import('tailwindcss').Config} */

module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{html,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui'), require('@tailwindcss/typography')],
};
