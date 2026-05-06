import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api': {
        target: 'https://preca.admin.central.cloud',
        changeOrigin: true,
        secure: true,
        headers: {
          // Ayuda a que el backend piense que la petición viene del dominio real
          Origin: 'https://preca.admin.central.cloud',
          Referer: 'https://preca.admin.central.cloud',
        },
      }
    },
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));