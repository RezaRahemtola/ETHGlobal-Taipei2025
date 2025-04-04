import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { client as backendClient } from "@/apis/backend/client.gen";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import env from "@/config/env.ts";

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

if ("serviceWorker" in navigator) {
	window.addEventListener("load", () => {
		navigator.serviceWorker
			.register("/sw.js")
			.then((registration) => {
				console.log("Service Worker registered:", registration);
			})
			.catch((error) => {
				console.log("Service Worker registration failed:", error);
			});
	});
}

backendClient.setConfig({
	baseURL: env.BACKEND_API_URL,
	withCredentials: true, // Enable sending cookies in cross-origin requests
});

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<StrictMode>
			<RouterProvider router={router} />
		</StrictMode>,
	);
}
