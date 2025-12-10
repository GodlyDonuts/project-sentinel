/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'sentinel-black': '#050505', // The "Void"
                'sentinel-dark': '#001510',  // Deep Jungle
                'sentinel-green': '#00ff41', // Matrix Green
                'sentinel-red': '#ff003c',   // Cyberpunk Red
                'sentinel-card': 'rgba(20, 20, 20, 0.6)', // Glassmorphism base
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['Rajdhani', 'monospace'], // For data/HUD
                display: ['Orbitron', 'sans-serif'], // For headers
            },
            boxShadow: {
                'neon-green': '0 0 10px rgba(0, 255, 65, 0.5), 0 0 20px rgba(0, 255, 65, 0.3)',
                'neon-red': '0 0 10px rgba(255, 0, 60, 0.5), 0 0 20px rgba(255, 0, 60, 0.3)',
                'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'spin-slow': 'spin 3s linear infinite',
                spotlight: "spotlight 2s ease .75s 1 forwards",
                shimmer: "shimmer 2s linear infinite",
                "meteor-effect": "meteor 5s linear infinite",
            },
            keyframes: {
                spotlight: {
                    "0%": { opacity: 0, transform: "translate(-72%, -62%) scale(0.5)" },
                    "100%": { opacity: 1, transform: "translate(-50%, -40%) scale(1)" },
                },
                shimmer: {
                    from: { backgroundPosition: "0 0" },
                    to: { backgroundPosition: "-200% 0" },
                },
                meteor: {
                    "0%": { transform: "rotate(215deg) translateX(0)", opacity: 1 },
                    "70%": { opacity: 1 },
                    "100%": { transform: "rotate(215deg) translateX(-500px)", opacity: 0 },
                },
            },
            backgroundImage: {
                'grid-pattern': "linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)",
            }
        },
    },
    plugins: [],
}