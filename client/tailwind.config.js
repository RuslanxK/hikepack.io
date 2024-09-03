
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        "3xl": "1600px",
        "4xl": "1920px",
       
      },

      colors: {
        primary: "#fb923c",
        secondary: "#eef2ff",
        accent: "#FFC300",
        green: "#04ba32",

        info: {

            headline: "#2563EB",
            body: "#EFF6FF"
        },

        button: {
          light: "#eef2ff",
          DEFAULT: "#fb923c",
          hover: "#f97316",
          dark: "#292929",
        },


        box: {

            DEFAULT: "#2F2F2F",
        
        },

        theme: {
          light: "#e4e4e7",
          white: "#ffffff",
          black: "#000000",
          dark: "#161616",
          bgDark: "#202020",
          bgGray: "#fafafa"
          
        },
      },
    },
  },
  plugins: [],
};

