import { useAccountStore } from "@/stores/account";
import { TransactionHistory } from "./TransactionHistory";
import { SendMoney } from "./SendMoney";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export const Dashboard = () => {
	const { username, balance } = useAccountStore();

	return (
		<div className="w-full max-w-4xl mx-auto p-4 space-y-6">
			{/* Header with greeting and balance */}
			<div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-8 text-white rounded-lg">
				<div className="flex items-center gap-4 mb-8">
					<Avatar className="h-20 w-20 border-4 border-white/20 shadow-xl">
						<AvatarFallback className="text-2xl bg-indigo-800 font-bold">
							{username?.substring(0, 2).toUpperCase() ?? "UN"}
						</AvatarFallback>
					</Avatar>
					<div>
						<h2 className="text-3xl font-bold">Hello {username}!</h2>
					</div>
				</div>

				<div className="bg-white/10 p-6 rounded-xl backdrop-blur-md">
					<p className="text-white/70 font-medium mb-1">Available Balance</p>
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

			{/* Tabs for different actions */}
			<Tabs defaultValue="send" className="w-full">
				<TabsList className="grid w-full grid-cols-2 p-1 bg-muted/50 rounded-xl">
					<TabsTrigger
						value="send"
						className="rounded-lg py-3 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-md"
					>
						Send Money
					</TabsTrigger>
					<TabsTrigger
						value="history"
						className="rounded-lg py-3 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-md"
					>
						Transaction History
					</TabsTrigger>
				</TabsList>

				<TabsContent value="send" className="mt-6">
					<SendMoney />
				</TabsContent>

				<TabsContent value="history" className="mt-6">
					<TransactionHistory />
				</TabsContent>
			</Tabs>
		</div>
	);
};
