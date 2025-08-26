import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    host: '192.168.15.104', // your local network IP
    port: 5000,              // desired port
    // strictPort: true,        // fail if port is already in use
  },
})
