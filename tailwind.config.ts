
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif'],
				display: ['Inter', 'system-ui', 'sans-serif'],
				serif: ['Crimson Text', 'Georgia', 'serif'],
				heading: ['Playfair Display', 'Georgia', 'serif']
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				report: {
					gold: 'hsl(var(--report-gold))',
					'gold-muted': 'hsl(var(--report-gold-muted))',
					navy: 'hsl(var(--report-navy))',
					'navy-deep': 'hsl(var(--report-navy-deep))',
					accent: 'hsl(var(--report-accent))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-out': {
					'0%': { opacity: '1', transform: 'translateY(0)' },
					'100%': { opacity: '0', transform: 'translateY(10px)' }
				},
				'slide-in-right': {
					'0%': { transform: 'translateX(20px)', opacity: '0' },
					'100%': { transform: 'translateX(0)', opacity: '1' }
				},
				'slide-in-left': {
					'0%': { transform: 'translateX(-20px)', opacity: '0' },
					'100%': { transform: 'translateX(0)', opacity: '1' }
				},
				'slide-in-up': {
					'0%': { transform: 'translateY(20px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				'slide-in-down': {
					'0%': { transform: 'translateY(-20px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				pulse: {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.5' }
				},
				float: {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'draw-line': {
					'0%': { 'stroke-dashoffset': '100%' },
					'100%': { 'stroke-dashoffset': '0%' }
				},
				'circuit-flow': {
					'0%': { 'stroke-dashoffset': '1000' },
					'100%': { 'stroke-dashoffset': '0' }
				},
				'london-float-1': {
					'0%, 100%': { transform: 'translateX(-100px) translateY(0px)' },
					'50%': { transform: 'translateX(100px) translateY(-50px)' }
				},
				'london-float-2': {
					'0%, 100%': { transform: 'translateX(100px) translateY(-30px)' },
					'50%': { transform: 'translateX(-80px) translateY(20px)' }
				},
				'london-float-3': {
					'0%, 100%': { transform: 'translateX(50px) translateY(-20px)' },
					'50%': { transform: 'translateX(-100px) translateY(-80px)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out forwards',
				'fade-out': 'fade-out 0.5s ease-out forwards',
				'slide-in-right': 'slide-in-right 0.5s ease-out forwards',
				'slide-in-left': 'slide-in-left 0.5s ease-out forwards',
				'slide-in-up': 'slide-in-up 0.5s ease-out forwards',
				'slide-in-down': 'slide-in-down 0.5s ease-out forwards',
				'pulse-slow': 'pulse 3s infinite',
				'float': 'float 3s ease-in-out infinite',
				'draw-line': 'draw-line 1.5s ease-in-out forwards',
				'circuit-flow': 'circuit-flow 3s linear infinite',
				'london-float-1': 'london-float-1 20s ease-in-out infinite',
				'london-float-2': 'london-float-2 25s ease-in-out infinite',
				'london-float-3': 'london-float-3 30s ease-in-out infinite'
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-blue-orange': 'linear-gradient(90deg, #252b70 0%, #0052b3 50%, #ff6c1f 100%)'
			},
			boxShadow: {
				'smooth': '0 4px 20px rgba(0, 0, 0, 0.05)',
				'smooth-lg': '0 10px 30px rgba(0, 0, 0, 0.07)',
				'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
			},
			backdropBlur: {
				'xs': '2px',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
