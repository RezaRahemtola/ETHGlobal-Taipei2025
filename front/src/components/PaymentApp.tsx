import { useAccountStore } from "@/stores/account";
import { AccountConnect } from "./AccountConnect";
import { RegisterUser } from "./RegisterUser";
import { Dashboard } from "./Dashboard";
import { Skeleton } from "./ui/skeleton";
import { ArrowDownIcon, CoinsIcon, SparklesIcon, WalletIcon } from "lucide-react";
import { smoothScrollTo } from "@/lib/utils";

export const PaymentApp = () => {
	const { account, isRegistered, isAuthenticating } = useAccountStore();

	// Not connected yet
	if (!account) {
		return (
			<div
				className={`min-h-[90vh] flex flex-col items-center justify-center p-4 text-center transition-all duration-1000 ease-out opacity-100 scale-100`}
			>
				<div className="mb-6 md:mb-8 relative z-10">
					<div className="inline-flex items-center justify-center h-20 w-20 md:h-28 md:w-28 rounded-full bg-gradient-to-br from-indigo-600 to-violet-700 mb-4 md:mb-8 shadow-xl shadow-indigo-500/20 relative overflow-hidden">
						<div className="absolute inset-0 bg-gradient-to-br from-indigo-400/20 to-purple-500/20 animate-pulse-slow"></div>
						<div className="relative">
							<WalletIcon className="h-10 w-10 md:h-14 md:w-14 text-white" />
							<SparklesIcon className="absolute -top-1 -right-1 h-4 w-4 md:h-6 md:w-6 text-yellow-300 animate-pulse-slow" />
						</div>
					</div>

					<h1 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-700 mb-3">
						Solva
					</h1>
					<div className="flex items-center justify-center mb-2 md:mb-3">
						<span className="h-px w-8 md:w-12 bg-gradient-to-r from-transparent to-indigo-300"></span>
						<CoinsIcon className="h-4 w-4 md:h-5 md:w-5 mx-2 text-indigo-400" />
						<span className="h-px w-8 md:w-12 bg-gradient-to-r from-indigo-300 to-transparent"></span>
					</div>
					<p className="text-slate-600 text-lg md:text-xl max-w-md leading-relaxed">
						Send money to anyone, instantly and without fees.
					</p>
				</div>

				<div className="group w-full">
					<AccountConnect />
				</div>

				{/* Floating arrow indicator with scroll functionality */}
				<button
					onClick={() => smoothScrollTo("about-section")}
					className="mt-8 mb-4 md:mt-12 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-300 rounded-full"
					aria-label="Scroll to learn more"
				>
					<ArrowDownIcon className="h-6 w-6 text-indigo-500" />
				</button>

				{/* Mobile-friendly instruction text */}
				<p className="text-xs text-slate-400">Scroll down to learn more</p>
			</div>
		);
	}

	// Authenticating
	if (isAuthenticating) {
		return (
			<div className="w-full max-w-md mx-auto p-4 space-y-6">
				<div className="text-center mb-4">
					<div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 mb-6 relative">
						{/* Multiple spinner layers for effect */}
						<div className="absolute inset-4 rounded-full border-4 border-indigo-300 border-t-transparent animate-spin"></div>
						<div className="absolute inset-2 rounded-full border-4 border-violet-400 border-b-transparent animate-spin animate-reverse"></div>
						<div className="h-10 w-10 rounded-full border-4 border-t-transparent border-indigo-600 animate-spin"></div>
					</div>

					<h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-700">
						Connecting...
					</h1>
					<p className="text-slate-500">Please wait while we authenticate your account</p>
				</div>

				<div className="space-y-4 relative overflow-hidden rounded-xl">
					<div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 animate-pulse"></div>
					<Skeleton className="h-[200px] w-full rounded-xl relative z-10" />
					<div className="space-y-2 relative z-10">
						<Skeleton className="h-4 w-1/2" />
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-3/4" />
					</div>
				</div>
			</div>
		);
	}

	// Connected but not registered
	if (!isRegistered) {
		return (
			<div className={`transition-all duration-700 ease-out opacity-100 translate-y-0`}>
				<RegisterUser />
			</div>
		);
	}

	// Fully authenticated and registered
	return (
		<div className={`transition-all duration-700 ease-out opacity-100 translate-y-0`}>
			<Dashboard />
		</div>
	);
};
