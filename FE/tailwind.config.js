/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#FFFFFF',
        secondBg: '#f8f8f8',
        primary: '#1DA1F2',
        secondary: '#EEEEEE',
        accent: '#1f32d6',

        orange: '#ffae82',
        textBlack: '#3b3b3b',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },

      screens: {
        sm: '640px', // Small devices (landscape phones, 640px and up)
        md: '768px', // Medium devices (tablets, 768px and up)
        lg: '1024px', // Large devices (desktops, 1024px and up)
        xl: '1280px', // Extra large devices (large desktops, 1280px and up)
        '2xl': '1536px', // 2x large devices (larger desktops, 1536px and up)
      },
    },
  },
  plugins: [],
}
