import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true,
                secure: false,
            },
            // Assuming short links are accessed via backend directly usually, 
            // but if we need to test redirects via frontend dev server:
            // '/s': 'http://localhost:3000' 
        }
    }
})
