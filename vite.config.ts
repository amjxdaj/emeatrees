import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  base: "/", // Ensures proper route handling in Vercel
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    outDir: "dist",
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // 🔥 Fixes 404 on direct page access
  esbuild: {
    jsxInject: "", // 🔥 Disable automatic React import
  },
}));
