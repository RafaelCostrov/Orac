import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	server: {
		proxy: {
			"/api": {
				target: "http://192.168.15.3:8080",
				changeOrigin: true,
				rewrite: path => path.replace(/^\/api/, ""),
			},
		},
	},
});
