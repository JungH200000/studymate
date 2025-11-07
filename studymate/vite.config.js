import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // 외부 접근 허용
    proxy: {
      '/api': {
        target: 'http://192.168.123.178:3000',
        changeOrigin: true,
      }
    }
  }
})
