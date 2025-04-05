import { useAccountStore } from "@/stores/account";
import { SendMoney } from "./SendMoney";
import { TransactionHistory } from "./TransactionHistory";
import { useMemo, useState } from "react";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { useQueryState } from "nuqs";
import { toast } from "sonner";

import {
	DashboardHeader,
	DashboardNavigation,
	HomeView,
	MobileHomeView,
	ReceiveView,
	TopUpView,
} from "./dashboard/index";

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

				{activeView === "receive" && <ReceiveView username={username} url={url} isMobile={true} />}

				{activeView === "history" && (
					<div className="p-4">
						<TransactionHistory />
					</div>
				)}

				{activeView === "topup" && (
					<div className="p-4">
						<TopUpView topUpAmount={topUpAmount} setTopUpAmount={setTopUpAmount} handleTopUp={handleTopUp} />
					</div>
				)}
			</div>
		);
	}

	// Desktop layout with tabs-like UI
	return (
		<div className="w-full max-w-5xl mx-auto p-4 space-y-6">
			{/* Header with greeting and balance */}
			<DashboardHeader username={username} balance={balance} setActiveView={setActiveView} />

			{/* Desktop navigation */}
			<DashboardNavigation activeView={activeView} setActiveView={setActiveView} />

			{/* Content based on selected tab */}
			<div className="bg-white rounded-xl shadow-md p-6 mb-6">
				{activeView === "home" && <HomeView setActiveView={setActiveView} />}

				{activeView === "send" && (
					<div>
						<h3 className="text-xl font-bold text-slate-800 mb-6">Send Money</h3>
						<SendMoney />
					</div>
				)}

				{activeView === "receive" && <ReceiveView username={username} url={url} />}

				{activeView === "topup" && (
					<TopUpView topUpAmount={topUpAmount} setTopUpAmount={setTopUpAmount} handleTopUp={handleTopUp} />
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
