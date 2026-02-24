/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                serif: ['Playfair Display', 'Georgia', 'serif'],
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            colors: {
                gold: {
                    50: '#fffbeb',
                    100: '#fef3c7',
                    200: '#fde68a',
                    300: '#fcd34d',
                    400: '#fbbf24',
                    500: '#d4a843',
                    600: '#b8923a',
                    700: '#9c7a2f',
                    800: '#7a5f23',
                    900: '#5c4516',
                },
                champagne: '#e8d5a3',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'slide-up': 'slideUp 0.4s ease-out',
                'shimmer': 'shimmer 2s infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
            },
            backgroundImage: {
                'gold-gradient': 'linear-gradient(135deg, #d4a843 0%, #e8d5a3 50%, #d4a843 100%)',
                'card-gradient': 'linear-gradient(145deg, rgba(39,39,42,0.8) 0%, rgba(24,24,27,0.9) 100%)',
            },
            boxShadow: {
                'gold-glow': '0 0 20px rgba(212,168,67,0.15)',
                'card-hover': '0 20px 60px rgba(0,0,0,0.5)',
            },
        },
    },
    plugins: [],
};
