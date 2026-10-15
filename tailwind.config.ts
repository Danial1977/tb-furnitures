import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FBF9F5',  // Warm ivory
          100: '#F5F0E6', // Soft oatmeal
          200: '#E8DEC8', // Sand
          300: '#D5C4A1', // Light oak
          400: '#B89F70', // Warm brass
          500: '#8C6D3F', // Classic walnut
          600: '#6E532B', // Deep walnut
          700: '#523C1B', // Dark timber
          800: '#3A2910', // Espresso
          900: '#231808', // Charcoal wood
        },
        sage: {
          50: '#F4F7F4',
          100: '#E3EBE3',
          500: '#5A755A', // Muted olive/sage accent
          700: '#3D523D',
          800: '#2C3B2C',
        },
        charcoal: {
          800: '#222222',
          900: '#171717',
          950: '#0F0F0F',
        }
      },
      fontFamily: {
        serif: ["'Cinzel'", "'Cormorant Garamond'", 'Georgia', 'serif'],
        sans: ["'Plus Jakarta Sans'", "'Inter'", 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
