import { Transaction, useAccountStore } from "@/stores/account";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { ArrowDownIcon, ArrowLeftIcon, ArrowUpIcon, ClockIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { useMemo } from "react";

export const TransactionHistory = () => {
	const transactions = useAccountStore((state) => state.transactions);
	// Sort transactions by date (most recent first)
	const sortedTransactions = useMemo(
		() => [...transactions].sort((a, b) => b.date.getTime() - a.date.getTime()),
		[transactions],
	);
	const isMobile = useIsMobile();

	if (transactions.length === 0) {
		return isMobile ? (
			<div className="space-y-4">
				<div className="pb-2">
					<div className="flex items-center gap-2 text-2xl font-bold">
						<span className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
							<ClockIcon className="h-4 w-4 text-indigo-600" />
						</span>
						Transaction History
					</div>
					<div className="text-muted-foreground">Your recent transactions will appear here</div>
				</div>
				<div className="text-center py-8 text-muted-foreground">
					<div className="bg-slate-50 p-6 rounded-xl inline-flex flex-col items-center">
						<div className="rounded-full bg-slate-100 p-4 mb-4">
							<ClockIcon className="h-8 w-8 text-slate-400" />
						</div>
						<p className="font-medium text-slate-600">No transactions yet</p>
						<p className="text-sm text-slate-400 mt-1">Deposit some money to get started</p>
					</div>
				</div>
			</div>
		) : (
			<Card className="border-0 shadow-lg overflow-hidden">
				<CardHeader className="pb-8">
					<CardTitle className="flex items-center gap-2 text-2xl font-bold">
						<span className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
							<ClockIcon className="h-4 w-4 text-indigo-600" />
						</span>
						Transaction History
					</CardTitle>
					<CardDescription>Your recent transactions will appear here</CardDescription>
				</CardHeader>
				<CardContent className="text-center py-12 text-muted-foreground">
					<div className="bg-slate-50 p-8 rounded-xl inline-flex flex-col items-center">
						<div className="rounded-full bg-slate-100 p-4 mb-4">
							<ClockIcon className="h-8 w-8 text-slate-400" />
						</div>
						<p className="font-medium text-slate-600">No transactions yet</p>
						<p className="text-sm text-slate-400 mt-1">Deposit some money to get started</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	return isMobile ? (
		<div className="space-y-4">
			<div className="pb-2">
				<div className="flex items-center gap-2 text-2xl font-bold">
					<span className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
						<ClockIcon className="h-4 w-4 text-indigo-600" />
					</span>
					Transaction History
				</div>
				<div className="text-muted-foreground">Your recent transactions</div>
			</div>
			<div className="rounded-lg overflow-hidden bg-white shadow-sm">
				<div className="divide-y">
					{sortedTransactions.map((transaction) => (
						<TransactionItem key={transaction.id} transaction={transaction} />
					))}
				</div>
			</div>
		</div>
	) : (
		<Card className="border-0 shadow-lg overflow-hidden">
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-2xl font-bold">
					<span className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
						<ClockIcon className="h-4 w-4 text-indigo-600" />
					</span>
					Transaction History
				</CardTitle>
				<CardDescription>Your recent transactions</CardDescription>
			</CardHeader>
			<CardContent className="p-0">
				<div className="divide-y">
					{sortedTransactions.map((transaction) => (
						<TransactionItem key={transaction.id} transaction={transaction} />
					))}
				</div>
			</CardContent>
		</Card>
	);
};

const TransactionItem = ({ transaction }: { transaction: Transaction }) => {
	const { amount, recipient, date, type } = transaction;

	const typeConfig = {
		sent: {
			icon: <ArrowUpIcon className="h-5 w-5 text-rose-500" />,
			bgColor: "bg-rose-50",
			textColor: "text-rose-500",
		},
		received: {
			icon: <ArrowDownIcon className="h-5 w-5 text-emerald-500" />,
			bgColor: "bg-emerald-50",
			textColor: "text-emerald-500",
		},
		topup: {
			icon: <ArrowLeftIcon className="h-5 w-5 text-blue-500" />,
			bgColor: "bg-blue-50",
			textColor: "text-blue-500",
		},
	}[type];

	const formattedDate = new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}).format(new Date(date.getTime() + 8 * 60 * 60 * 1000)); // TODO: fix quick & dirty timezone

	return (
		<div className="flex items-center justify-between p-5 hover:bg-slate-50 transition-colors">
			<div className="flex items-center space-x-4">
				<div className={`${typeConfig.bgColor} rounded-full p-3`}>{typeConfig.icon}</div>
				<div>
					<p className="font-semibold text-slate-800">
						{type === "sent" ? `To ${recipient}` : type === "received" ? `From ${recipient}` : `Top Up`}
					</p>
					<div className="flex items-center gap-2 mt-1">
						<span className="text-sm text-slate-500">{formattedDate}</span>
					</div>
				</div>
			</div>

			<div className={`text-lg font-bold ${typeConfig.textColor}`}>
				{type === "sent" ? "-" : "+"}${amount.toFixed(2)}
			</div>
		</div>
	);
};
