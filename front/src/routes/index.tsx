import { createFileRoute } from "@tanstack/react-router";
import { PaymentApp } from "@/components/PaymentApp";
import { useAccountStore } from "@/stores/account";
import { About } from "@/components/About";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-is-mobile";

export const Route = createFileRoute("/")({
	component: Index,
});

function Index() {
	const { account } = useAccountStore();
	const [loaded, setLoaded] = useState(false);
	const [reducedMotion, setReducedMotion] = useState(false);
	const isMobile = useIsMobile();

	useEffect(() => {
		// Check for reduced motion preference
		const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		setReducedMotion(prefersReducedMotion);

		// Create animation effect after initial render - delayed for better performance on mobile
		const timer = setTimeout(() => {
			setLoaded(true);
		}, 150);

		// Apply special optimization for mobile devices
		if (isMobile) {
			document.body.classList.add("mobile-device");
		}

		// Add scroll event listener to track scroll position for animations
		const handleScroll = () => {
			if (window.scrollY > 50) {
				document.body.classList.add("scrolled");
			} else {
				document.body.classList.remove("scrolled");
			}
		};

		window.addEventListener("scroll", handleScroll);

		return () => {
			clearTimeout(timer);
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	return (
		<div className="relative min-h-screen w-full overflow-x-hidden">
			{/* Animated background with optimizations for mobile */}
			<div className="fixed inset-0 opacity-20 z-0 overflow-hidden pointer-events-none">
				{/* Animated gradient background - simplified for mobile */}
				<div
					className={`absolute inset-0 bg-gradient-to-br from-indigo-500/30 via-purple-500/20 to-pink-500/30 ${
						reducedMotion ? "" : "animate-gradient-shift"
					}`}
				></div>

				{/* Decorative circles - fewer animations for mobile */}
				<div
					className={`absolute top-[10%] left-[10%] w-40 h-40 md:w-64 md:h-64 rounded-full bg-blue-500/20 blur-2xl md:blur-3xl ${
						reducedMotion ? "" : "animate-float-slow"
					}`}
					style={{ display: loaded ? "block" : "none" }}
				></div>
				<div
					className={`absolute bottom-[10%] right-[10%] w-56 h-56 md:w-80 md:h-80 rounded-full bg-violet-500/20 blur-2xl md:blur-3xl ${
						reducedMotion ? "" : "animate-float-slow-reverse"
					}`}
					style={{ display: loaded ? "block" : "none" }}
				></div>

				{/* Grid pattern - only on larger screens */}
				<div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMxLjIzIDAgMi4xOTgtMS4wODggMi0yLjkxNlYwaDJ2MTUuMDg0YzAgMy4wNTItMS41NzYgNC45MTYtNCA0LjkxNkgwdi0yaDM2eiIgZmlsbD0icmdiYSgxMzEsIDEzMSwgMTMxLCAwLjA1KSIvPjwvZz48L3N2Zz4=')] opacity-10 md:opacity-20 hidden md:block"></div>
			</div>

			{/* Content with fade-in animation - optimized for mobile */}
			<div
				className={`relative z-10 transition-opacity duration-700 py-4 md:py-8 ${loaded ? "opacity-100" : "opacity-0"}`}
			>
				{!account ? (
					<>
						<PaymentApp />
						<About />
					</>
				) : (
					<PaymentApp />
				)}
			</div>
		</div>
	);
}
