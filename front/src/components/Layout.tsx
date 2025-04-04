import { Link, Outlet } from "@tanstack/react-router";
import { useAccountStore } from "@/stores/account";
import { LogOutIcon } from "lucide-react";
import { useActiveWallet, useDisconnect } from "thirdweb/react";

export function Layout() {
	const { account, onDisconnect: onDisconnectStore } = useAccountStore();
	const { disconnect } = useDisconnect();
	const wallet = useActiveWallet();

	const onDisconnect = async () => {
		if (wallet) {
			disconnect(wallet);
		}
		onDisconnectStore();
	};

	return (
		<div className="flex flex-col min-h-screen bg-slate-50">
			<header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur-sm shadow-sm">
				<div className="container mx-auto px-4 h-16 flex items-center justify-between">
					<Link to="/" className="font-bold text-xl flex items-center gap-1">
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Solva</span>
					</Link>

					<nav className="flex items-center gap-4">
						{account && (
							<button
								onClick={onDisconnect}
								className="text-sm flex items-center gap-1.5 py-2 px-3 rounded-full hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors"
							>
								<LogOutIcon className="h-4 w-4" />
								<span className="hidden sm:inline font-medium">Disconnect</span>
							</button>
						)}
					</nav>
				</div>
			</header>

			<main className="flex-1 py-6">
				<Outlet />
			</main>

			<footer className="border-t py-8 text-center text-sm text-slate-500 bg-white">
				<div className="container mx-auto px-4">
					<p className="font-medium">© 2025 Solva. All rights reserved.</p>
					<p className="text-xs mt-1 flex items-center justify-center gap-1">
						<span>Powered by blockchain technology</span>
					</p>
				</div>
			</footer>
		</div>
	);
}
