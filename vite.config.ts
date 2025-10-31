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
          // Separate heavy chart libraries
          'charts': ['chart.js', 'react-chartjs-2'],
          // Separate PDF generation libraries
          'pdf-export': ['jspdf', 'html2canvas'],
          // Separate form libraries
          'forms': ['react-hook-form', '@hookform/resolvers', 'zod'],
          // Separate animation library
          'animations': ['framer-motion'],
          // Separate UI components
          'ui-radix': [
            '@radix-ui/react-progress',
            '@radix-ui/react-slider',
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-dialog',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-label',
          ],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
}));
