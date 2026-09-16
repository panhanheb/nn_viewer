import type { Config } from 'tailwindcss'

export default <Config>{
  darkMode: 'class',
  content: [
    './app/**/*.{vue,js,ts,jsx,tsx}',
    './components/**/*.{vue,js,ts,jsx,tsx}',
    './pages/**/*.{vue,js,ts,jsx,tsx}',
    './app.vue'
  ],
  theme: {
    extend: {
      colors: {
        theme: {
          light: {
            bg: '#F8FAFC',
            panel: '#FFFFFF',
            text: '#0F172A',
            border: '#E2E8F0',
            hover: '#F1F5F9',
            muted: '#64748B',
            subtle: '#94A3B8'
          },
          dark: {
            bg: '#0B0F14',
            panel: '#111820',
            text: '#E5E7EB',
            border: '#26313D',
            hover: '#1B2430',
            muted: '#94A3B8',
            subtle: '#64748B'
          }
        },
        json: {
          key: '#A78BFA',
          keyLight: '#6D28D9',
          string: '#10B981',
          stringLight: '#059669',
          number: '#38BDF8',
          numberLight: '#0284C7',
          boolean: '#F59E0B',
          booleanLight: '#D97706',
          null: '#94A3B8',
          nullLight: '#64748B'
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'SF Mono', 'Consolas', 'Menlo', 'monospace']
      }
    }
  },
  plugins: []
}
