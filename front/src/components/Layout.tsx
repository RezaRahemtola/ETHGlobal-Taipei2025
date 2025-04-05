import { Link, Outlet } from "@tanstack/react-router";
import { useAccountStore } from "@/stores/account";
import { HistoryIcon, HomeIcon, LogOutIcon, SendIcon } from "lucide-react";
import { useActiveWallet, useDisconnect } from "thirdweb/react";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { useQueryState } from "nuqs";

export function Layout() {
	const { account, onDisconnect: onDisconnectStore, username } = useAccountStore();
	const { disconnect } = useDisconnect();
	const wallet = useActiveWallet();
	const isMobile = useIsMobile();
	const [scrolled, setScrolled] = useState(false);
	const [activeView, setActiveView] = useQueryState("view", { defaultValue: "home" });

	useEffect(() => {
		// Check scroll position for header styling
		const handleScroll = () => {
			setScrolled(window.scrollY > 10);
		};

		// Initial check
		handleScroll();

		// Add event listeners
		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, [isMobile]);

	// Handle bottom nav item click
	const handleNavClick = (view: string) => {
		setActiveView(view);
	};

	const onDisconnect = async () => {
		if (wallet) {
			disconnect(wallet);
		}
		onDisconnectStore();
	};

	return (
		<div className="flex flex-col min-h-screen bg-slate-50">
			{/* Header with scroll-based styling */}
			{account && !isMobile && (
				<header
					className={`sticky top-0 z-20 transition-all duration-300 ${
						scrolled ? "bg-white/90 shadow-md backdrop-blur-sm border-b" : "bg-transparent"
					}`}
				>
					<div className="container mx-auto px-4 h-14 md:h-16 flex items-center justify-between">
						<Link to="/" className="font-bold text-xl flex items-center gap-1">
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
								Solva
							</span>
						</Link>

						{/* Only show disconnect button on desktop */}
						<nav className="flex items-center gap-4">
							<button
								onClick={onDisconnect}
								className="text-sm flex items-center gap-1.5 py-2 px-3 rounded-full hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors"
							>
								<LogOutIcon className="h-4 w-4" />
								<span className="font-medium">Disconnect</span>
							</button>
						</nav>
					</div>
				</header>
			)}

			{/* Adjust padding when bottom nav is present */}
			<main className={`flex-1 ${account && isMobile ? "pb-20" : "py-2 md:py-6"}`}>
				<Outlet />
			</main>

			{/* Footer - hidden on mobile when connected (replaced by bottom nav) */}
			{(!account || !isMobile) && (
				<footer className="border-t py-4 md:py-8 text-center text-sm text-slate-500 bg-white">
					<div className="container mx-auto px-4">
						<p className="font-medium">© 2025 Solva. All rights reserved.</p>
						<p className="text-xs mt-1 flex items-center justify-center gap-1">
							<span>Powered by blockchain technology</span>
						</p>
					</div>
				</footer>
			)}

			{/* Mobile Bottom Navigation - only shown when connected, registered, and on mobile */}
			{isMobile && username !== null && (
				<nav className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t shadow-lg flex items-center justify-around h-16 px-1">
					<MobileNavItem
						icon={<HomeIcon className="h-5 w-5" />}
						label="Home"
						onClick={() => handleNavClick("home")}
						isActive={activeView === "home"}
					/>
					<MobileNavItem
						icon={<SendIcon className="h-5 w-5" />}
						label="Send"
						onClick={() => handleNavClick("send")}
						isActive={activeView === "send"}
					/>
					<MobileNavItem
						icon={<HistoryIcon className="h-5 w-5" />}
						label="History"
						onClick={() => handleNavClick("history")}
						isActive={activeView === "history"}
					/>
					<button
						onClick={onDisconnect}
						className="flex flex-col items-center justify-center w-full max-w-[4.5rem] py-1 px-1 touch-manipulation"
					>
						<div className="text-red-500 p-1.5 rounded-full">
							<LogOutIcon className="h-5 w-5" />
						</div>
						<span className="text-[10px] text-red-500 mt-0.5">Logout</span>
					</button>
				</nav>
			)}
		</div>
	);
}

// Mobile navigation item component
function MobileNavItem({
	icon,
	label,
	onClick,
	isActive,
}: Readonly<{
	icon: React.ReactNode;
	label: string;
	onClick: () => void;
	isActive: boolean;
}>) {
	return (
		<button
			onClick={onClick}
			className="flex flex-col items-center justify-center w-full max-w-[4.5rem] py-1 px-1 touch-manipulation"
		>
			<div className={`${isActive ? "bg-indigo-50 text-indigo-600" : "text-slate-600"} p-1.5 rounded-full`}>{icon}</div>
			<span className={`text-[10px] mt-0.5 ${isActive ? "text-indigo-600 font-medium" : "text-slate-600"}`}>
				{label}
			</span>
		</button>
	);
}
