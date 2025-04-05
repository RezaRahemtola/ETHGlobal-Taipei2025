import { Transaction, useAccountStore } from "@/stores/account";
import { AvatarUpload } from "../ui/avatar";
import { Card, CardContent } from "../ui/card";
import { ArrowDownIcon, ArrowRightIcon, HistoryIcon, SendIcon } from "lucide-react";
import { QuickActionButton } from "./QuickActionButton";
import { MobileTransactionItem } from "./MobileTransactionItem";

type MobileHomeViewProps = {
	username: string | null;
	balance: number;
	transactions: Transaction[];
	onActionClick: (view: string) => void;
};

export const MobileHomeView = ({ username, balance, transactions, onActionClick }: MobileHomeViewProps) => {
	// Get the latest 3 transactions
	const recentTransactions = [...transactions].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 3);

	const isLoadingBalance = useAccountStore((state) => state.isLoadingBalance);

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
						{isLoadingBalance ? <span className="animate-pulse">...</span> : balance.toFixed(2)}
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
