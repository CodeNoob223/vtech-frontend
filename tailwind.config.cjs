/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.tsx",
    "./src/components/**/*.tsx",
    "./src/routes/**/*.tsx"
  ],
  theme: {
    extend: {
      spacing: {
        "35px": "35px",
        "1.25": "4.25px",
        "1.75": "7px",
        "0.6": "2.5px",
        "0.75": "3px",
        "15": "60px",
        "17": "68px",
        "21": "88px",
        "25": "104px",
        "n64": "-256px",
        "100": "400px"
      },
      minHeight: {
        '1/2': '50%',
        "675px": "675px"
      },
      gridTemplateColumns: {
        // Simple 16 column grid
        '16': 'repeat(16, minmax(0, 1fr))',
        "smallCard": "max-content 75%",
        // Complex site-specific column configuration
        'footer': '200px minmax(900px, 1fr) 100px',
        "banner": "570px 510px" 
      },
      gridTemplateRows: {
        "banner": "36px auto" 
      },
      screens: {
        "sm": "480px",
        "1.5xl": "1455px"
      }
    },
  },
  plugins: [],
}
