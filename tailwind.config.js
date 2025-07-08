/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./app/**/*.{js,ts,jsx,tsx}", // App router (Next.js 13+)
      "./components/**/*.{js,ts,jsx,tsx}",
      "./pages/**/*.{js,ts,jsx,tsx}", // Pages router (Next.js < 13)
    ],
    theme: {
        extend: {
            fontFamily: {
              sans: ["var(--font-roboto)", "sans-serif"], // Use Roboto globally
            },
          },
    },
    plugins: [],
  };