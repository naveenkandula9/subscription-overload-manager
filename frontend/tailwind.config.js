/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
        },
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(129, 140, 248, 0.2), 0 22px 60px rgba(79, 70, 229, 0.35)",
      },
      backgroundImage: {
        "hero-radial":
          "radial-gradient(circle at top, rgba(99, 102, 241, 0.22), transparent 40%), radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.18), transparent 30%)",
      },
    },
  },
  plugins: [],
};

