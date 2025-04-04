import { createRootRoute } from "@tanstack/react-router";
import Providers from "@/components/Providers.tsx";
import { Layout } from "@/components/Layout";

export const Route = createRootRoute({
	component: RootLayout,
});

function RootLayout() {
	return (
		<Providers>
			<Layout />
		</Providers>
	);
}
