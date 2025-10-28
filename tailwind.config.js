/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        // AVMOTO Tuning Brand Colors
        avmoto: {
          blue: '#00A8E8',
          'blue-light': '#33BFEE',
          'blue-dark': '#0088BB',
          'blue-hover': '#0096D6',
          gray: '#3D3D3D',
          'gray-light': '#5A5A5A',
          'gray-dark': '#2A2A2A',
        },
      },
    },
  },
  plugins: [],
}

