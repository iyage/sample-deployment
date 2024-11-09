const plugin = require("tailwindcss/plugin");

module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                "mvx-black": "#061130",
                "mvx-blue": "#142657",
                "mvx-light-blue": "#F4F5F7",
                "mvx-neutral": "#6B778C",
                "mvx-gray": "#6B778C",
                "carribean-green": "#16C6A4",
                "pacific-cyan": "#01B4D2",
                "gun-metal": "#142837",
                "tradeally-light-green": "#E4FCF6",
                "mvx-orange": "#FF6224",
                "landing-black": "#060B10",
                "toggle-off": "#6B778C",
                "toggle-on": "#16C6A4",
                "midnight-black": "#000918",
                "neutral-n": {
                    10: "#FAFBFC",
                    20: "#F4F5F7",
                    30: "#EBECF0",
                    40: "#DFE1E6",
                    200: "#6B778C",
                    300: "#8497B7",
                    600: "#344563",
                },
                "neutral-n2": {
                    20: "#F6F7FB",
                    30: "#EBF0F8",
                    40: "#E1E7F0",
                    200: "#A9B3C4",
                },
            },
            screens: {
                300: "300px",
                320: "320px",
                330: "330px",
                350: "350px",
                375: "375px",
                400: "400px",
                420: "420px",
                xs: "425px",
                475: "475px",
                520: "520px",
                580: "580px",
                700: "700px",
                800: "800px",
                820: "820px",
                900: "900px",
                950: "950px",
                1000: "1000px",
                1100: "1100px",
                1150: "1150px",
                1200: "1200px",
                1400: "1400px",
                1500: "1500px",
                1750: "1750px",
            },
            fontFamily: {
                satoshi: ["Satoshi", "sans-serif"],
                satoshiLight: ["Satoshi-light", "sans-serif"],
                satoshiMedium: ["Satoshi-medium", "sans-serif"],
                satoshiBold: ["Satoshi-bold", "sans-serif"],
                gilroyRegular: ["Gilroy-regular", "sans-serif"],
                gilroyMedium: ["Gilroy-medium", "sans-serif"],
                gilroySemibold: ["Gilroy-semibold", "sans-serif"],
                gilroyBold: ["Gilroy-bold", "sans-serif"],
                rocGrotesk: ["roc-grotesk", "sans-serif"],
                rocGroteskLight: ["rocGrotesk-light", "sans-serif"],
                rocGroteskRegular: ["rocGrotesk-regular", "sans-serif"],
                rocGroteskMedium: ["rocGrotesk-medium", "sans-serif"],
                rocGroteskBold: ["rocGrotesk-bold", "sans-serif"],
                inter: ["Inter", "sans-serif"],
            },
            boxShadow: {
                modalShadow:
                    "0px 20px 24px -4px rgba(16, 24, 40, 0.08), 0px 8px 8px -4px rgba(16, 24, 40, 0.03)",
                dropdownShadow: "0px 8px 24px -6px rgba(0, 0, 0, 0.16)",
                "custom-light": "0px 4px 32px rgba(0, 0, 0, 0.06), 0px 0px 4px rgba(0, 0, 0, 0.04)",
                quoteSidebarShadow:
                    "0px 6.92141px 6.92141px -3.4607px rgba(16, 24, 40, 0.03), 0px 17.30351px 20.76422px -3.4607px rgba(16, 24, 40, 0.08)",
                paymentCardShadow:
                    "0px 8px 8px -4px rgba(16, 24, 40, 0.03), 0px 0px 40px -4px rgba(16, 24, 40, 0.08)",
            },
            transitionProperty: {
                width: "width",
            },
            rotate: {
                40: "40deg",
            },
            corePlugins: {
                textTransform: true,
            },
            keyframes: {
                slideDownAndFade: {
                    from: { opacity: "0", transform: "translateY(-2px)" },
                    to: { opacity: "1", transform: "translateY(0)" },
                },
                slideLeftAndFade: {
                    from: { opacity: "0", transform: "translateX(2px)" },
                    to: { opacity: "1", transform: "translateX(0)" },
                },
                slideUpAndFade: {
                    from: { opacity: "0", transform: "translateY(2px)" },
                    to: { opacity: "1", transform: "translateY(0)" },
                },
                slideRightAndFade: {
                    from: { opacity: "0", transform: "translateX(-2px)" },
                    to: { opacity: "1", transform: "translateX(0)" },
                },
            },
            animation: {
                slideDownAndFade: "slideDownAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
                slideLeftAndFade: "slideLeftAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
                slideUpAndFade: "slideUpAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
                slideRightAndFade: "slideRightAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
            },
        },
    },
    plugins: [
        plugin(function ({ addUtilities, addComponents, e, prefix, config }) {
            // Add your custom styles here
        }),
    ],
};
