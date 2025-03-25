import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'node:path'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@components":  path.resolve(__dirname, "src/components"),
      "@stores": path.resolve(__dirname, "src/stores"),
      "@": path.resolve(__dirname, "src"),
      "@services": path.resolve(__dirname, "src/services"),
    },
  },
  define:{
    global: "window"
  }
})
