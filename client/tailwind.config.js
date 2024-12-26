module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
        "3xl": "1600px",
        "4xl": "1920px",
      },

      boxShadow: {
        airbnb: "rgba(0, 0, 0, 0.15) 0px 2px 8px",
      },

      animation: {
        zigzag: 'zigzag 15s infinite ease-in-out',
      },
      keyframes: {
        zigzag: {
          '0%': { transform: 'translateY(0) translateX(0)' },
          '25%': { transform: 'translateY(-30px) translateX(30px)' }, // Up-Right
          '50%': { transform: 'translateY(30px) translateX(-30px)' }, // Down-Left
          '75%': { transform: 'translateY(-30px) translateX(-30px)' }, // Up-Left
          '100%': { transform: 'translateY(0) translateX(0)' }, // Return to Start
        },
      },

    

  
      colors: {
        primary: "#058373",
        orange: "#ff7d20",
        secondary: "#FAFAFA",
        accent: "#7a7a7a",
        green: "#04ba32",
        black: "#292929",
        blue: "#3DBCE0",

        info: {
          headline: "#2563EB",
          body: "#EFF6FF",
        },

        button: {
          light: "#F2F3F7",
          DEFAULT: "#058373",
          hover: "#017565",
          dark: "#292929",
          orange: "#FF8F78",
          yellow: "#CBB64D",
          lightGreen: "#02ccb2",
          red: "#C13C3C",
          purple: "#7963CD",
         
        },

        box: {
          DEFAULT: "#2F2F2F",
          light: "#F2F3F7",
        },

        theme: {
          light: "#e4e4e7",
          white: "#ffffff",
          black: "#000000",
          dark: "#161616",
          bgDark: "#202020",
          bgGray: "#F2F3F7",
        },
      },
    },
  },
  plugins: [],
};
