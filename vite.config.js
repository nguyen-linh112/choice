import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' để web chạy được khi đem lên hosting tĩnh (kể cả thư mục con)
export default defineConfig({
  plugins: [react()],
  base: './',
})
