const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans]
      },
      colors: {
        'fern': '#52c393',
        'cobalt': '#3f6efa',
        'lemon': '#e9ec44',
        'moss-1': '#223022',
        'moss-2': '#667266',
        'moss-3': '#99a299',
        'moss-4': '#ccd2cc',
        'moss-5': '#dde2dd',
        'moss-6': '#eef2ee',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
