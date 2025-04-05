import { Transaction, useAccountStore } from "@/stores/account";
import { TransactionHistory } from "./TransactionHistory";
import { SendMoney } from "./SendMoney";
import { AvatarUpload } from "./ui/avatar";
import { ReactNode, useMemo, useState } from "react";
import { useIsMobile } from "@/hooks/use-is-mobile";
import {
	ArrowDownIcon,
	ArrowRightIcon,
	ClipboardCopyIcon,
	HistoryIcon,
	PlusCircleIcon,
	SendIcon,
	ShareIcon,
} from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { useQueryState } from "nuqs";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Input } from "./ui/input";

export const Dashboard = () => {
	const { username, balance, transactions, topUpBalance } = useAccountStore();
	const isMobile = useIsMobile();
	const [activeView, setActiveView] = useQueryState("view", { defaultValue: "home" });
	const [topUpAmount, setTopUpAmount] = useState(50);

	const handleTopUp = () => {
		if (topUpAmount <= 0) {
			toast.error("Please enter a valid amount");
			return;
		}
		topUpBalance(topUpAmount);
	};

	const url = useMemo(
		() =>
			`${window.location.protocol}//${window.location.hostname}${window.location.port ?? ""}?view=send&recipient=${username}`,
		[username],
	);

	// Mobile layout with different sections based on the active view
	if (isMobile) {
		return (
			<div className="w-full pb-16">
				{activeView === "home" && (
					<MobileHomeView
						username={username}
						balance={balance}
						transactions={transactions}
						onActionClick={setActiveView}
					/>
				)}

				{activeView === "send" && (
					<div className="p-4">
						<SendMoney />
					</div>
				)}

				{activeView === "receive" && (
					<div className="p-4">
						<div className="space-y-4">
							<h2 className="text-xl font-bold">Receive Money</h2>
							<p className="text-slate-600">Share this QR code to receive money</p>
							<div className="bg-slate-50 p-6 rounded-lg">
								<div className="text-center">
									<div className="p-3 bg-white rounded-lg mb-4 mx-auto inline-block shadow-sm">
										<QRCodeSVG value={url} size={150} bgColor={"#ffffff"} fgColor={"#000000"} level={"L"} />
									</div>

									<div className="flex gap-2">
										<Button
											className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
											onClick={() => {
												navigator.clipboard.writeText(url);
												toast.success("Payment link copied to clipboard", {
													description: "Share this link with anyone who wants to send you money",
												});
											}}
										>
											<ClipboardCopyIcon className="h-4 w-4 mr-2" />
											Copy Link
										</Button>
										<Button
											className="flex-1"
											variant="outline"
											onClick={() => {
												if (navigator.share) {
													navigator
														.share({
															title: "Send me money",
															text: `Send money to ${username}`,
															url: url,
														})
														.catch();
												} else {
													toast.error("Sharing not supported on this device");
												}
											}}
										>
											<ShareIcon className="h-4 w-4 mr-2" />
											Share Link
										</Button>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}

				{activeView === "history" && (
					<div className="p-4">
						<TransactionHistory />
					</div>
				)}
			</div>
		);
	}

	// Desktop layout with tabs-like UI
	return (
		<div className="w-full max-w-5xl mx-auto p-4 space-y-6">
			{/* Header with greeting and balance */}
			<div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-8 text-white rounded-xl shadow-xl">
				<div className="flex items-center gap-6 mb-8">
					<AvatarUpload className="h-20 w-20" />
					<div>
						<p className="text-white/70 text-lg">Welcome back,</p>
						<h2 className="text-3xl font-bold">{username}</h2>
					</div>
				</div>

				<div className="bg-white/10 p-6 rounded-xl backdrop-blur-md">
					<div className="flex justify-between items-center">
						<p className="text-white/70 font-medium mb-1">Available Balance</p>
						<Button
							size="sm"
							onClick={() => setActiveView("topup")}
							className="bg-green-500 hover:bg-green-600 text-white text-xs px-3"
						>
							<PlusCircleIcon className="h-3 w-3 mr-1" /> Top Up
						</Button>
					</div>
					<h1 className="text-5xl font-bold flex items-baseline">
						<span className="text-2xl mr-1">$</span>
						{balance.toFixed(2)}
					</h1>
					<div className="mt-4 bg-white/20 h-1 w-full rounded-full overflow-hidden">
						<div
							className="bg-emerald-400 h-full rounded-full"
							style={{ width: `${Math.min(balance / 10, 100)}%` }}
						></div>
					</div>
				</div>
			</div>

			{/* Desktop navigation */}
			<div className="flex bg-white rounded-xl overflow-hidden shadow-md">
				<button
					onClick={() => setActiveView("home")}
					className={`cursor-pointer flex-1 py-4 px-4 font-medium transition-colors ${
						activeView === "home"
							? "bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600"
							: "text-slate-600 hover:bg-slate-50"
					}`}
				>
					Dashboard
				</button>
				<button
					onClick={() => setActiveView("send")}
					className={`cursor-pointer flex-1 py-4 px-4 font-medium transition-colors ${
						activeView === "send"
							? "bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600"
							: "text-slate-600 hover:bg-slate-50"
					}`}
				>
					Send Money
				</button>
				<button
					onClick={() => setActiveView("receive")}
					className={`cursor-pointer flex-1 py-4 px-4 font-medium transition-colors ${
						activeView === "receive"
							? "bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600"
							: "text-slate-600 hover:bg-slate-50"
					}`}
				>
					Receive Money
				</button>
				<button
					onClick={() => setActiveView("topup")}
					className={`cursor-pointer flex-1 py-4 px-4 font-medium transition-colors ${
						activeView === "topup"
							? "bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600"
							: "text-slate-600 hover:bg-slate-50"
					}`}
				>
					Top Up
				</button>
				<button
					onClick={() => setActiveView("history")}
					className={`cursor-pointer flex-1 py-4 px-4 font-medium transition-colors ${
						activeView === "history"
							? "bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600"
							: "text-slate-600 hover:bg-slate-50"
					}`}
				>
					History
				</button>
			</div>

			{/* Content based on selected tab */}
			<div className="bg-white rounded-xl shadow-md p-6 mb-6">
				{activeView === "home" && (
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
						<div className="lg:col-span-1">
							<Card className="border-0 shadow-md overflow-hidden">
								<CardContent className="p-5">
									<h3 className="text-lg font-bold text-slate-800 mb-4">Quick Actions</h3>
									<div className="grid grid-cols-3 gap-4">
										<QuickDesktopButton
											icon={<SendIcon className="h-5 w-5" />}
											label="Send Money"
											onClick={() => setActiveView("send")}
											color="bg-indigo-100 text-indigo-600"
										/>
										<QuickDesktopButton
											icon={<ArrowDownIcon className="h-5 w-5" />}
											label="Receive"
											onClick={() => setActiveView("receive")}
											color="bg-emerald-100 text-emerald-600"
										/>
										<QuickDesktopButton
											icon={<HistoryIcon className="h-5 w-5" />}
											label="History"
											onClick={() => setActiveView("history")}
											color="bg-violet-100 text-violet-600"
										/>
									</div>
								</CardContent>
							</Card>

							<div className="mt-6">
								<h3 className="text-lg font-bold text-slate-800 mb-4">Send Money</h3>
								<SendMoney />
							</div>
						</div>
						<div className="lg:col-span-1">
							<h3 className="text-lg font-bold text-slate-800 mb-4">Recent Activity</h3>
							<TransactionHistory />
						</div>
					</div>
				)}

				{activeView === "send" && (
					<div>
						<h3 className="text-xl font-bold text-slate-800 mb-6">Send Money</h3>
						<SendMoney />
					</div>
				)}

				{activeView === "receive" && (
					<div className="max-w-md mx-auto">
						<h3 className="text-xl font-bold text-slate-800 mb-6">Receive Money</h3>
						<p className="text-slate-600 mb-6">Share this QR code to receive money</p>
						<div className="bg-slate-50 p-8 rounded-lg">
							<div className="text-center">
								<div className="p-4 bg-white rounded-lg mb-6 mx-auto inline-block shadow-md">
									<QRCodeSVG value={url} size={200} bgColor={"#ffffff"} fgColor={"#000000"} level={"L"} />
								</div>

								<div className="flex gap-2">
									<Button
										className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
										onClick={() => {
											navigator.clipboard.writeText(url);
											toast.success("Payment link copied to clipboard", {
												description: "Share this link with anyone who wants to send you money",
											});
										}}
									>
										<ClipboardCopyIcon className="h-4 w-4 mr-2" />
										Copy Link
									</Button>
									<Button
										className="flex-1 py-3"
										variant="outline"
										onClick={() => {
											if (navigator.share) {
												navigator
													.share({
														title: "Send me money",
														text: `Send money to ${username}`,
														url: url,
													})
													.catch((error) => toast.error("Sharing failed", { description: error.message }));
											} else {
												toast.error("Sharing not supported on this device");
											}
										}}
									>
										<ShareIcon className="h-4 w-4 mr-2" />
										Share Link
									</Button>
								</div>
							</div>
						</div>
					</div>
				)}

				{activeView === "topup" && (
					<div className="max-w-md mx-auto">
						<h3 className="text-xl font-bold text-slate-800 mb-6">Top Up Your Balance</h3>
						<div className="bg-slate-50 p-8 rounded-lg">
							<div className="space-y-6">
								<div>
									<p className="text-slate-600 mb-2">Enter amount to add</p>
									<div className="flex items-start gap-4">
										<div className="flex-1">
											<div className="relative">
												<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
													<span className="text-slate-500 text-lg">$</span>
												</div>
												<Input
													type="number"
													value={topUpAmount}
													onChange={(e) => setTopUpAmount(parseFloat(e.target.value) || 0)}
													className="pl-8 text-lg h-14"
													min="1"
													step="10"
												/>
											</div>
										</div>
									</div>
								</div>

								<div className="grid grid-cols-3 gap-3">
									{[50, 100, 250].map((amount) => (
										<Button
											key={amount}
											variant={topUpAmount === amount ? "default" : "outline"}
											className="py-3"
											onClick={() => setTopUpAmount(amount)}
										>
											${amount}
										</Button>
									))}
								</div>

								<Button
									onClick={handleTopUp}
									className="w-full py-6 text-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
								>
									<PlusCircleIcon className="h-5 w-5 mr-2" />
									Add Funds
								</Button>

								<p className="text-xs text-slate-500 text-center">This is a demo app. No real money will be charged.</p>
							</div>
						</div>
					</div>
				)}

				{activeView === "history" && (
					<div>
						<h3 className="text-xl font-bold text-slate-800 mb-6">Transaction History</h3>
						<TransactionHistory />
					</div>
				)}
			</div>
		</div>
	);
};

// Mobile home view with cards and quick actions
const MobileHomeView = ({
	username,
	balance,
	transactions,
	onActionClick,
}: {
	username: string | null;
	balance: number;
	transactions: Transaction[];
	onActionClick: (view: string) => void;
}) => {
	// Get the latest 3 transactions
	const recentTransactions = transactions.slice(0, 3);

	return (
		<div className="space-y-6 pb-4">
			{/* Header with balance */}
			<div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-5 pt-8 pb-16 text-white">
				<div className="flex items-center justify-between mb-4">
					<div className="flex items-center gap-3">
						<AvatarUpload className="h-12 w-12" />
						<div>
							<p className="text-white/80 text-sm">Welcome back</p>
							<h2 className="text-xl font-bold">{username}</h2>
						</div>
					</div>
				</div>

				<div className="mt-6">
					<p className="text-white/70 text-sm font-medium mb-1">Available Balance</p>
					<h1 className="text-4xl font-bold flex items-baseline">
						<span className="text-xl mr-1">$</span>
						{balance.toFixed(2)}
					</h1>
				</div>
			</div>

			{/* Quick Actions */}
			<div className="px-4 -mt-12 mb-6">
				<Card className="border-0 shadow-lg overflow-hidden">
					<CardContent className="p-0">
						<div className="grid grid-cols-2 divide-x">
							<QuickActionButton
								icon={<SendIcon className="h-5 w-5 text-indigo-600" />}
								label="Send"
								color="bg-indigo-50"
								onClick={() => onActionClick("send")}
							/>
							<QuickActionButton
								icon={<ArrowDownIcon className="h-5 w-5 text-emerald-600" />}
								label="Receive"
								color="bg-emerald-50"
								onClick={() => onActionClick("receive")}
							/>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Recent Activity Section */}
			<div className="px-4">
				<div className="flex items-center justify-between mb-4">
					<h3 className="text-lg font-bold text-slate-800">Recent Activity</h3>
					<button
						onClick={() => onActionClick("history")}
						className="text-sm text-indigo-600 font-medium flex items-center"
					>
						See All <ArrowRightIcon className="h-3 w-3 ml-1" />
					</button>
				</div>

				{recentTransactions.length > 0 ? (
					<Card className="border-0 shadow-md overflow-hidden">
						<CardContent className="p-0">
							<div className="divide-y">
								{recentTransactions.map((transaction) => (
									<MobileTransactionItem key={transaction.id} transaction={transaction} />
								))}
							</div>
						</CardContent>
					</Card>
				) : (
					<Card className="border-0 shadow-md overflow-hidden bg-slate-50 p-6 text-center">
						<div className="flex flex-col items-center">
							<div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
								<HistoryIcon className="h-6 w-6 text-slate-400" />
							</div>
							<p className="text-slate-600 font-medium">No transactions yet</p>
							<p className="text-sm text-slate-500 mt-1">Your activity will appear here</p>
						</div>
					</Card>
				)}
			</div>
		</div>
	);
};

// Mobile transaction item component (simplified version)
const MobileTransactionItem = ({ transaction }: { transaction: Transaction }) => {
	const { amount, recipient, date, type } = transaction;

	const typeConfig =
		type === "sent"
			? {
					icon: <ArrowRightIcon className="h-4 w-4 text-rose-500" />,
					bgColor: "bg-rose-50",
					textColor: "text-rose-500",
				}
			: {
					icon: <ArrowRightIcon className="h-4 w-4 text-emerald-500 rotate-180" />,
					bgColor: "bg-emerald-50",
					textColor: "text-emerald-500",
				};

	const formattedDate = new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
	}).format(date);

	return (
		<div className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
			<div className="flex items-center space-x-3">
				<div className={`${typeConfig.bgColor} rounded-full p-2`}>{typeConfig.icon}</div>
				<div>
					<p className="font-medium text-slate-800">{type === "sent" ? `To ${recipient}` : `From ${recipient}`}</p>
					<p className="text-xs text-slate-500">{formattedDate}</p>
				</div>
			</div>

			<div className={`text-sm font-bold ${typeConfig.textColor}`}>
				{type === "sent" ? "-" : "+"}${amount.toFixed(2)}
			</div>
		</div>
	);
};

// Quick action button component for mobile
const QuickActionButton = ({
	icon,
	label,
	color,
	onClick,
}: {
	icon: ReactNode;
	label: string;
	color: string;
	onClick: () => void;
}) => {
	return (
		<button
			onClick={onClick}
			className="flex flex-col items-center py-5 hover:bg-slate-50 active:bg-slate-100 transition-colors"
		>
			<div className={`${color} p-3 rounded-full mb-2`}>{icon}</div>
			<span className="text-sm font-medium text-slate-800">{label}</span>
		</button>
	);
};

// Quick action button component for desktop dashboard
const QuickDesktopButton = ({
	icon,
	label,
	color,
	onClick,
}: {
	icon: ReactNode;
	label: string;
	color: string;
	onClick: () => void;
}) => {
	return (
		<button
			onClick={onClick}
			className="border border-slate-200 rounded-lg p-4 flex flex-col items-center gap-2 hover:shadow-md hover:border-indigo-100 transition-all cursor-pointer"
		>
			<div className={`${color} p-3 rounded-full`}>{icon}</div>
			<span className="text-sm font-medium text-slate-800">{label}</span>
		</button>
	);
};
