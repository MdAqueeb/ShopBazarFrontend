import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Tailwind CSS v3 is handled by PostCSS via postcss.config.js — no Vite plugin needed.
export default defineConfig({
  plugins: [react()],
})
