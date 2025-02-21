import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  envDir: "./",
  server: {
    host: true,
    port: 5173, // puerto por defecto
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
  define: {
    "process.env": {},
    "import.meta.env.VITE_API_URL": JSON.stringify(process.env.VITE_API_URL),
  },
});
