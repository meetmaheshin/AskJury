/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Arena palette: purple is the brand, yellow is the accent/CTA.
        primary: {
          DEFAULT: '#9333EA',
          dark: '#7E22CE',
          light: '#A855F7',
          50: '#FAF5FF',
          100: '#F3E8FF',
          500: '#A855F7',
          600: '#9333EA',
          700: '#7E22CE',
        },
        secondary: {
          DEFAULT: '#FACC15',
          dark: '#EAB308',
          light: '#FDE047',
        },
        accent: {
          DEFAULT: '#FACC15',
          light: '#FDE047',
        },
        success: '#10B981',
        danger: '#EF4444',
        warning: '#F59E0B',
        'gray-bg': '#F5F5F5',
        'dark-bg': '#1A1A1A',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
        'card-hover': '0 4px 6px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12)',
        'button': '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
