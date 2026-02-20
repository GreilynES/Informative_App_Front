import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import tailwindcss from "@tailwindcss/vite"
import path from "path"
import sitemap from "@axelrindle/vite-plugin-sitemap"

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    sitemap({
      baseUrl: "https://www.camaraganaderoshojancha.cloud",
      // ✅ aquí defines tus rutas
      pages: [
        { file: "index.html", route: "/" },
        // agrega las rutas reales de tu app:
        { file: "index.html", route: "/about-us" },
        { file: "index.html", route: "/services" },
        { file: "index.html", route: "/events" },
        { file: "index.html", route: "/faq" },
      ],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})