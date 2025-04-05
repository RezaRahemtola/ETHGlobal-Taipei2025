import { AvatarUpload } from "../ui/avatar";
import { Button } from "../ui/button";
import { PlusCircleIcon } from "lucide-react";

type DashboardHeaderProps = {
	username: string | null;
	balance: number;
	setActiveView: (view: string) => void;
};

export const DashboardHeader = ({ username, balance, setActiveView }: DashboardHeaderProps) => {
	return (
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
	);
};
