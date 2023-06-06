/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        roboto: ['"Roboto"', 'Sofia Sans']
      },
      colors: {
        light: {
          primary: '#ecf0f1',
          heading: '#000'
        },
        dark: {
          primary: '#262626',
          heading: '#FFFFFF'
        }
      }
    }
  },
  plugins: []
}
