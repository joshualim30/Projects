/** @type {import('tailwindcss').Config} */
const { nextui } = require("@nextui-org/react");

export default {
    darkMode: ["class"],
    content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
		"./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
	],
	theme: {
		extend: {
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			colors: {
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				'wave-blue': '#1A9BD7',
				'wave-orange': '#E87420',
				'wave-navy': '#0B1120',
			}
		}
	},
	plugins: [
		nextui({
			themes: {
				dark: {
					colors: {
						background: "#0B1120",
						foreground: "#F5F5F5",
						primary: {
							50: "#E6F4FB",
							100: "#CCE9F7",
							200: "#99D3EF",
							300: "#66BDE7",
							400: "#33A7DF",
							500: "#1A9BD7",
							600: "#157CAC",
							700: "#105D81",
							800: "#0A3E56",
							900: "#051F2B",
							DEFAULT: "#1A9BD7",
							foreground: "#FFFFFF",
						},
						secondary: {
							DEFAULT: "#E87420",
							foreground: "#FFFFFF",
						},
					},
				},
			},
		}),
		require("tailwindcss-animate")
	],
}
