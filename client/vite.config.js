import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      '@monaco-editor/react': '@monaco-editor/react',
    },
  },
  optimizeDeps: {
    include: ['@monaco-editor/react']
  },
  build: {
    commonjsOptions: {
      include: [/@monaco-editor\/react/]
    }
  }
})
