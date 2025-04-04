import { useAccountStore, Transaction } from "@/stores/account";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { ArrowDownIcon, ArrowUpIcon, CheckCircle2Icon, ClockIcon, XCircleIcon } from "lucide-react";

export const TransactionHistory = () => {
	const transactions = useAccountStore((state) => state.transactions);

	if (transactions.length === 0) {
		return (
			<Card className="border-0 shadow-lg overflow-hidden">
				<CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 pb-8">
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
						<p className="text-sm text-slate-400 mt-1">Send some money to get started</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="border-0 shadow-lg overflow-hidden">
			<CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100">
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
					{transactions.map((transaction) => (
						<TransactionItem key={transaction.id} transaction={transaction} />
					))}
				</div>
			</CardContent>
		</Card>
	);
};

const TransactionItem = ({ transaction }: { transaction: Transaction }) => {
	const { amount, recipient, date, status, type } = transaction;

	const statusConfig = {
		completed: {
			icon: <CheckCircle2Icon className="h-5 w-5 text-emerald-500" />,
			label: "Completed",
			bgColor: "bg-emerald-50",
			textColor: "text-emerald-700",
		},
		pending: {
			icon: <ClockIcon className="h-5 w-5 text-amber-500" />,
			label: "Pending",
			bgColor: "bg-amber-50",
			textColor: "text-amber-700",
		},
		failed: {
			icon: <XCircleIcon className="h-5 w-5 text-red-500" />,
			label: "Failed",
			bgColor: "bg-red-50",
			textColor: "text-red-700",
		},
	}[status];

	const typeConfig =
		type === "sent"
			? {
					icon: <ArrowUpIcon className="h-5 w-5 text-rose-500" />,
					bgColor: "bg-rose-50",
					textColor: "text-rose-500",
				}
			: {
					icon: <ArrowDownIcon className="h-5 w-5 text-emerald-500" />,
					bgColor: "bg-emerald-50",
					textColor: "text-emerald-500",
				};

	const formattedDate = new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}).format(date);

	return (
		<div className="flex items-center justify-between p-5 hover:bg-slate-50 transition-colors">
			<div className="flex items-center space-x-4">
				<div className={`${typeConfig.bgColor} rounded-full p-3`}>{typeConfig.icon}</div>
				<div>
					<p className="font-semibold text-slate-800">{type === "sent" ? `To ${recipient}` : `From ${recipient}`}</p>
					<div className="flex items-center gap-2 mt-1">
						<span className="text-sm text-slate-500">{formattedDate}</span>
						<span
							className={`text-xs px-2 py-0.5 rounded-full ${statusConfig.bgColor} ${statusConfig.textColor} font-medium inline-flex items-center gap-1`}
						>
							{statusConfig.icon}
							<span>{statusConfig.label}</span>
						</span>
					</div>
				</div>
			</div>

			<div className={`text-lg font-bold ${typeConfig.textColor}`}>
				{type === "sent" ? "-" : "+"}${amount.toFixed(2)}
			</div>
		</div>
	);
};
