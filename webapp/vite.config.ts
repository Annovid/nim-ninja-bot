import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/nim-ninja-bot/",
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});
