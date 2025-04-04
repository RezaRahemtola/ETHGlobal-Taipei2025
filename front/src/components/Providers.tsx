import { ReactNode } from "react";
import { ThirdwebProvider } from "thirdweb/react";
import { Toaster } from "./ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/react";

type ProvidersProps = {
	children: ReactNode;
};

// Create a client
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 5 * 60 * 1000, // 5 minutes
		},
	},
});

const Providers = ({ children }: ProvidersProps) => {
	return (
		<NuqsAdapter>
			<QueryClientProvider client={queryClient}>
				<ThirdwebProvider>{children}</ThirdwebProvider>
				<Toaster richColors />
			</QueryClientProvider>
		</NuqsAdapter>
	);
};

export default Providers;
