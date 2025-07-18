module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        "pulse-slow": {
          '0%, 100%': {
            transform: 'translateX(-100%)',
          },
          '50%': {
            transform: 'translateX(100%)',
          },
        },
        shine: {
          '0%': { transform: 'translateX(-100%)' },
          '50%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
      animation: {
        "pulse-slow": "pulse-slow 3s ease-in-out infinite",
        shine: "shine 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
}
