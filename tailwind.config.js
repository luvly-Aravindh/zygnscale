/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  corePlugins: { preflight: false },
  theme: {
    extend: {
      colors: {
        ink: '#212620', muted: '#626b60', paper: '#fffdf8', cream: '#f8f4e9',
        mint: '#eff6f0', green: '#3c796e', red: '#bb4024', gold: '#edb128',
        yellow: '#ffcf45', line: '#dce2d7',
      },
      maxWidth: { wrap: '1120px' },
      fontFamily: { sans: ['Arial', 'Helvetica', 'sans-serif'] },
    },
  },
  plugins: [],
};
