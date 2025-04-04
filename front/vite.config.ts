import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		TanStackRouterVite({ target: "react", autoCodeSplitting: true }),
		react(),
		tailwindcss(),
		VitePWA({
			registerType: "autoUpdate",
			devOptions: {
				enabled: true,
			},
			manifest: {
				name: "Solva",
				short_name: "Solva",
				description: "A React PWA built with Vite",
				theme_color: "#ffffff",
				background_color: "#ffffff",
				display: "standalone",
				icons: [
					{
						src: "/pwa-icon-192x192.png",
						sizes: "192x192",
						type: "image/png",
					},
					{
						src: "/pwa-icon-512x512.png",
						sizes: "512x512",
						type: "image/png",
					},
				],
			},
		}),
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
