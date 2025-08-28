import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // 👈 now @ points to /src
    },
  },
  server: {
    host: '192.168.15.104', // your local network IP
    port: 5000,              // desired port
    // strictPort: true,        // fail if port is already in use
  },
})
