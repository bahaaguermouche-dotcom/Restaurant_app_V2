/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#e65100',
                    light: '#ff7043',
                    dark: '#bf360c',
                },
                secondary: {
                    DEFAULT: '#ffab91',
                    light: '#ffd4c1',
                    dark: '#c97b63',
                },
                background: '#fff8f3',
            },
            fontFamily: {
                sans: ['Inter', 'Segoe UI', 'sans-serif'],
            },
            boxShadow: {
                'custom': '0 4px 20px rgba(0,0,0,0.1)',
                'custom-lg': '0 8px 30px rgba(0,0,0,0.15)',
            },
            borderRadius: {
                'custom': '15px',
            },
        },
    },
    plugins: [],
}
