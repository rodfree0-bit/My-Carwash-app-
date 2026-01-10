/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./*.{js,ts,jsx,tsx}"
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                display: ['Manrope', 'sans-serif'],
            },
            colors: {
                primary: {
                    DEFAULT: '#0EA5E9', // Sky Blue 500 (Professional, not neon)
                    dark: '#0284C7',    // Sky Blue 600
                    light: '#38BDF8'    // Sky Blue 400
                },
                secondary: {
                    DEFAULT: '#64748B', // Slate 500
                },
                background: {
                    light: '#F8FAFC',   // Slate 50
                    dark: '#0F172A',    // Slate 900 (Deep elegant blue-black)
                },
                surface: {
                    dark: '#1E293B',    // Slate 800
                    light: '#ffffff'
                },
                success: '#10B981',     // Emerald 500
                error: '#EF4444',       // Red 500
                warning: '#F59E0B'      // Amber 500
            }
        }
    },
    plugins: [],
}
