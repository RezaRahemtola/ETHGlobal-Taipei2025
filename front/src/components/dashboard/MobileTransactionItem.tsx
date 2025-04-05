import { Transaction } from "@/stores/account";
import { ArrowRightIcon } from "lucide-react";

type MobileTransactionItemProps = {
	transaction: Transaction;
};

export const MobileTransactionItem = ({ transaction }: MobileTransactionItemProps) => {
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
