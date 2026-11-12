/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          50: '#FDFBF7',
          100: '#FBF7F0',
          200: '#F3EDE2',
          300: '#E8DEC8',
          400: '#D5C4A1',
          500: '#B8A078',
        },
        sage: {
          50: '#F2F7F4',
          100: '#E3EDE7',
          200: '#C7DCcf',
          500: '#2E7D5B',
          600: '#246549',
          700: '#1B4D38',
        },
        terracotta: {
          50: '#FCF5F2',
          100: '#F9EAE4',
          500: '#D35D38',
          600: '#B64A27',
        },
        indigo: {
          50: '#F4F5FB',
          100: '#E7E9F7',
          500: '#4F5BD5',
          600: '#3D49BD',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Newsreader', 'Georgia', 'serif'],
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)',
        'warm': '0 4px 20px -2px rgba(120, 100, 80, 0.08)',
        'card': '0 1px 3px rgba(0,0,0,0.05), 0 10px 25px -5px rgba(0,0,0,0.03)',
      }
    },
  },
  plugins: [],
}
