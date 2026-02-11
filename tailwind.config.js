import defaultTheme from 'tailwindcss/defaultTheme'

console.log("✅ Tailwind config chargé !")

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-geist-sans)', ...defaultTheme.fontFamily.sans],
                mono: ['var(--font-geist-mono)', ...defaultTheme.fontFamily.mono],
            },
        },
    },
    plugins: [],
}
