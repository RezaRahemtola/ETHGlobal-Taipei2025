self.addEventListener("install", (_event) => {
	console.log("Service Worker installing.");
});

self.addEventListener("activate", (_event) => {
	console.log("Service Worker activated.");
});

self.addEventListener("fetch", (event) => {
	console.log("Fetching:", (event as FetchEvent).request.url);
});
