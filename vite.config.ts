import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar bibliotecas grandes em chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'chart-vendor': ['chart.js', 'react-chartjs-2', 'recharts'],
          'ui-vendor': ['framer-motion', '@radix-ui/react-accordion', '@radix-ui/react-dialog'],
          'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
        },
      },
    },
    // Otimizações adicionais
    minify: 'esbuild',
    // Aumentar limite de warning para chunks grandes
    chunkSizeWarningLimit: 600,
  },
  // Otimizações de assets
  assetsInlineLimit: 4096, // Apenas arquivos < 4kb serão inline
}));
