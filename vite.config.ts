// ================================
// 📁 vite.config.ts
// Compatible con Vite + React + TS sin errores de tipo
// ================================
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import history from "connect-history-api-fallback";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    {
      name: "spa-fallback",
      configureServer(server) {
        // ✅ Cast explícito para evitar conflictos de tipos
        server.middlewares.use(
          history({
            disableDotRule: true,
            htmlAcceptHeaders: ["text/html", "application/xhtml+xml"],
          }) as unknown as import("connect").NextHandleFunction
        );
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    port: 3000,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.js',
    server: {
      deps: {
        inline: ["react-router", "react-router-dom"],
      },
    },
  },
});
