import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { ArrowRightIcon, ArrowUpIcon, CoinsIcon, SendIcon, ShieldCheckIcon, SparklesIcon, ZapIcon } from "lucide-react";

export function About() {
	return (
		<div id="about-section" className="container mx-auto px-4 py-10 md:py-16 max-w-5xl">
			{/* Title section */}
			<div className="text-center mb-12 md:mb-16 transition-opacity duration-700">
				<div className="inline-flex items-center gap-2 mb-3">
					<span className="h-px w-8 md:w-12 bg-gradient-to-r from-transparent to-indigo-300"></span>
					<SparklesIcon className="h-5 w-5 md:h-6 md:w-6 text-indigo-500" />
					<span className="h-px w-8 md:w-12 bg-gradient-to-r from-indigo-300 to-transparent"></span>
				</div>
				<h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-5 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-700">
					About Solva
				</h1>
				<p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
					The easiest way to send money to anyone, anywhere.
				</p>
			</div>

			{/* Feature cards - modern design */}
			<div className={`grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-3 mb-16 md:mb-20 transition-opacity duration-700`}>
				<FeatureCard
					icon={<ZapIcon className="h-6 w-6 text-white" />}
					iconBg="bg-amber-500"
					title="Instant Transfers"
					description="Send money in seconds, not days. Our blockchain technology ensures your transfers happen at lightning speed."
				/>
				<FeatureCard
					icon={<ShieldCheckIcon className="h-6 w-6 text-white" />}
					iconBg="bg-emerald-500"
					title="Secure & Private"
					description="Your finances are protected with enterprise-grade security. We never share your information with third parties."
				/>
				<FeatureCard
					icon={<CoinsIcon className="h-6 w-6 text-white" />}
					iconBg="bg-blue-500"
					title="Zero Fees"
					description="Send money to friends and family without any hidden fees or charges. Keep more of your money where it belongs."
				/>
			</div>

			{/* Beautiful animated background section */}
			<div className={`mb-16 md:mb-20 transition-opacity duration-700`}>
				<div className="text-center mb-8">
					<h2 className="text-2xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
						Seamless Experience
					</h2>
					<p className="text-slate-600 max-w-2xl mx-auto md:text-lg">Beautiful, simple, and intuitive</p>
				</div>

				{/* Animated background container */}
				<div className="relative h-80 md:h-96 max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-xl">
					{/* Main gradient background with animation */}
					<div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 bg-[length:400%_400%] animate-gradient-shift"></div>

					{/* Animated geometric shapes */}
					<div className="absolute inset-0 overflow-hidden opacity-70">
						{/* Large circle */}
						<div className="absolute top-[10%] left-[20%] w-32 h-32 md:w-64 md:h-64 rounded-full bg-white opacity-20 blur-xl animate-float-slow"></div>

						{/* Small circles with different animations */}
						<div className="absolute bottom-[15%] right-[15%] w-16 h-16 md:w-24 md:h-24 rounded-full bg-white opacity-20 blur-lg animate-float-slow-reverse"></div>
						<div className="absolute top-[40%] right-[30%] w-12 h-12 md:w-16 md:h-16 rounded-full bg-white opacity-20 blur-md animate-pulse-slow"></div>

						{/* Abstract shapes */}
						<div className="absolute bottom-[30%] left-[25%] w-24 h-16 md:w-32 md:h-24 rounded-lg bg-white opacity-10 blur-lg rotate-45 animate-float-slow"></div>
						<div className="absolute top-[25%] right-[25%] w-16 h-24 md:w-20 md:h-32 rounded-lg bg-white opacity-10 blur-lg -rotate-12 animate-float-slow-reverse"></div>
					</div>

					{/* Moving particles */}
					<div className="absolute inset-0 overflow-hidden">
						{[...Array(12)].map((_, i) => (
							<div
								key={i}
								className="absolute w-2 h-2 md:w-3 md:h-3 rounded-full bg-white opacity-60"
								style={{
									top: `${Math.random() * 100}%`,
									left: `${Math.random() * 100}%`,
									animation: `float-slow ${10 + Math.random() * 20}s linear infinite`,
									animationDelay: `${Math.random() * 5}s`,
								}}
							></div>
						))}
					</div>

					{/* Central icon with glow */}
					<div className="absolute inset-0 flex items-center justify-center">
						<div className="relative">
							<div className="absolute -inset-4 bg-white opacity-20 rounded-full blur-md animate-pulse-slow"></div>
							<div className="relative z-10 w-16 h-16 md:w-20 md:h-20 bg-white bg-opacity-20 backdrop-blur-md rounded-full flex items-center justify-center border border-white border-opacity-30">
								<SendIcon className="h-8 w-8 md:h-10 md:w-10 text-white" />
							</div>
						</div>
					</div>

					{/* Light beam effect */}
					<div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white/20 to-transparent"></div>

					{/* Animated text */}
					<div className="absolute bottom-8 inset-x-0 text-center">
						<div className="text-white font-medium text-lg md:text-xl drop-shadow-md">
							Money transfers, <span className="text-white font-bold">reimagined</span>
						</div>
					</div>
				</div>

				{/* Tags below animation */}
				<div className="flex flex-wrap justify-center gap-3 md:gap-4 mt-8">
					<div className="flex items-center bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full text-sm font-medium">
						<ShieldCheckIcon className="h-4 w-4 mr-1.5" />
						Secure
					</div>
					<div className="flex items-center bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full text-sm font-medium">
						<ZapIcon className="h-4 w-4 mr-1.5" />
						Lightning Fast
					</div>
					<div className="flex items-center bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-sm font-medium">
						<CoinsIcon className="h-4 w-4 mr-1.5" />
						Zero Fees
					</div>
				</div>
			</div>

			{/* Call to action */}
			<div className={`text-center mb-12 transition-opacity duration-700`}>
				<h2 className="text-2xl md:text-3xl font-bold mb-5 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-700">
					Ready to get started?
				</h2>
				<a href="#" className="inline-flex items-center gap-2 relative group">
					<span className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg opacity-70 blur-sm transition-all duration-300 group-hover:opacity-100 group-hover:blur"></span>
					<span className="relative bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg shadow-lg transition-all duration-300 font-medium text-base md:text-lg flex items-center gap-2 group-hover:shadow-indigo-500/30 group-active:scale-95">
						Try Solva Now
						<ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
					</span>
				</a>
			</div>

			{/* Back to top button */}
			<div className="text-center">
				<button
					onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
					className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 transition-colors p-2 rounded-full hover:bg-indigo-50"
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
	iconBg,
	title,
	description,
}: Readonly<{
	icon: React.ReactNode;
	iconBg: string;
	title: string;
	description: string;
}>) {
	return (
		<Card className="h-full overflow-hidden border border-slate-200 shadow-md hover:shadow-lg transition-all duration-300 group">
			<CardContent className="p-6 md:p-8">
				<div
					className={`${iconBg} w-12 h-12 rounded-lg flex items-center justify-center mb-5 transform group-hover:scale-110 transition-transform duration-300`}
				>
					{icon}
				</div>
				<CardTitle className="text-xl md:text-2xl mb-3 text-slate-800 group-hover:text-indigo-600 transition-colors">
					{title}
				</CardTitle>
				<p className="text-slate-600 leading-relaxed">{description}</p>
			</CardContent>
		</Card>
	);
}
