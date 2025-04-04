import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRightIcon, ArrowUpIcon, CoinsIcon, ShieldCheckIcon, SparklesIcon, ZapIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function About() {
	const [visible, setVisible] = useState(false);
	const [activeIndex, setActiveIndex] = useState(0);
	const aboutRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		// Animate elements in sequence - improve performance for mobile
		const timer = setTimeout(() => {
			setVisible(true);
		}, 150);

		// Auto-cycle through steps - less intensive animation for mobile
		const interval = setInterval(() => {
			setActiveIndex((prev) => (prev + 1) % 3);
		}, 6000);

		// Set up intersection observer for animation on scroll
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						setVisible(true);
					}
				});
			},
			{ threshold: 0.1 },
		);

		if (aboutRef.current) {
			observer.observe(aboutRef.current);
		}

		return () => {
			clearTimeout(timer);
			clearInterval(interval);
			if (aboutRef.current) {
				observer.unobserve(aboutRef.current);
			}
		};
	}, []);

	return (
		<div id="about-section" ref={aboutRef} className="container mx-auto px-4 py-6 md:py-8 max-w-4xl">
			{/* Title section - simplified animation for mobile */}
			<div
				className={`text-center mb-6 md:mb-12 transition-opacity duration-700 ${visible ? "opacity-100" : "opacity-0"}`}
			>
				<div className="inline-flex items-center gap-2 mb-2">
					<span className="h-px w-6 md:w-8 bg-gradient-to-r from-transparent to-indigo-300"></span>
					<SparklesIcon className="h-4 w-4 md:h-5 md:w-5 text-indigo-500" />
					<span className="h-px w-6 md:w-8 bg-gradient-to-r from-indigo-300 to-transparent"></span>
				</div>
				<h1 className="text-2xl md:text-5xl font-bold mb-2 md:mb-3 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-700">
					About Solva
				</h1>
				<p className="text-base md:text-xl text-slate-600 max-w-2xl mx-auto">
					The easiest way to send money to anyone, anywhere.
				</p>
			</div>

			{/* Feature cards - mobile-optimized grid layout */}
			<div
				className={`grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-6 md:mb-16 transition-opacity duration-700 ${visible ? "opacity-100" : "opacity-0"}`}
			>
				<FeatureCard
					icon={<ZapIcon className="h-8 w-8 md:h-12 md:w-12 text-yellow-500" />}
					title="Instant Transfers"
					description="Send money in seconds, not days. Our blockchain technology ensures your money moves at the speed of light."
				/>
				<FeatureCard
					icon={<ShieldCheckIcon className="h-8 w-8 md:h-12 md:w-12 text-green-500" />}
					title="Secure & Private"
					description="Your financial data is protected by military-grade encryption. We never share your information with third parties."
				/>
				<FeatureCard
					icon={<CoinsIcon className="h-8 w-8 md:h-12 md:w-12 text-blue-500" />}
					title="Zero Fees"
					description="Send money to friends and family without any hidden fees or charges. Keep more of your money where it belongs."
				/>
			</div>

			{/* How it works section - simplified animations for mobile */}
			<div className={`mb-8 md:mb-16 transition-opacity duration-700 ${visible ? "opacity-100" : "opacity-0"}`}>
				<div className="relative">
					{/* Simplified animated border for mobile performance */}
					<div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl md:rounded-2xl blur opacity-50"></div>

					<Card className="relative border-0 shadow-lg md:shadow-xl overflow-hidden backdrop-blur-sm bg-white">
						<CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 md:p-6">
							<CardTitle className="text-xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
								How It Works
							</CardTitle>
							<CardDescription className="text-sm md:text-lg text-slate-600">
								Simple, secure, and fast money transfers
							</CardDescription>
						</CardHeader>
						<CardContent className="p-4 md:p-8">
							<ol className="space-y-4 md:space-y-8">
								{[0, 1, 2].map((index) => (
									<li key={index} className="flex gap-3 md:gap-6">
										<div
											className={`flex-shrink-0 flex items-center justify-center w-8 h-8 md:w-12 md:h-12 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold relative ${
												activeIndex === index ? "ring-2 ring-indigo-300 ring-offset-2" : ""
											}`}
										>
											{index + 1}
										</div>
										<div className="flex-1">
											<h3
												className={`font-semibold text-base md:text-xl text-slate-800 ${
													activeIndex === index ? "text-indigo-700" : ""
												}`}
											>
												{index === 0
													? "Connect Your Wallet"
													: index === 1
														? "Choose a Username"
														: "Send or Receive Money"}
											</h3>
											<p className="text-slate-600 mt-1 md:mt-2 leading-relaxed text-xs md:text-base">
												{index === 0
													? "Securely connect your crypto wallet to get started. Don't have one? We'll help you create one in seconds."
													: index === 1
														? "Pick a unique username that friends can use to send you money easily, without complicated addresses."
														: "Enter the amount and recipient's username, tap send. That's it! The money arrives in seconds."}
											</p>
										</div>
									</li>
								))}
							</ol>
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Call to action - mobile optimized */}
			<div className={`text-center mb-8 transition-opacity duration-700 ${visible ? "opacity-100" : "opacity-0"}`}>
				<h2 className="text-lg md:text-3xl font-bold mb-4 md:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-700">
					Ready to get started?
				</h2>
				<a href="#" className="inline-flex items-center gap-2 relative touch-manipulation">
					<span className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-md blur opacity-50"></span>
					<span className="relative bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 active:scale-95 text-white px-4 md:px-8 py-2 md:py-4 rounded-md transition-all font-medium text-sm md:text-lg flex items-center gap-2">
						Try Solva Now
						<ArrowRightIcon className="h-4 w-4 md:h-5 md:w-5 animate-pulse-slow" />
					</span>
				</a>
			</div>

			{/* Back to top button - mobile friendly */}
			<div className="text-center">
				<button
					onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
					className="inline-flex items-center gap-1 text-xs md:text-sm text-indigo-600 hover:text-indigo-800 transition-colors p-2 rounded-full hover:bg-indigo-50"
					aria-label="Back to top"
				>
					<ArrowUpIcon className="h-4 w-4" />
					<span>Back to top</span>
				</button>
			</div>
		</div>
	);
}

function FeatureCard({
	icon,
	title,
	description,
}: Readonly<{
	icon: React.ReactNode;
	title: string;
	description: string;
}>) {
	return (
		<Card className="h-full overflow-hidden border-0 shadow-md md:shadow-lg active:scale-[0.98] transition-all duration-200 touch-manipulation">
			<div className="h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
			<CardHeader className="pb-2 pt-4 px-4 md:px-6">
				<div className="mb-2">{icon}</div>
				<CardTitle className="text-lg md:text-2xl">{title}</CardTitle>
			</CardHeader>
			<CardContent className="px-4 md:px-6 pb-4 md:pb-6 text-xs md:text-base">
				<p className="text-slate-600">{description}</p>
			</CardContent>
		</Card>
	);
}
