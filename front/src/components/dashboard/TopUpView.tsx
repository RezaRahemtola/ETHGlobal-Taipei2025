import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { PlusCircleIcon } from "lucide-react";
import { Card, CardContent } from "../ui/card";

type TopUpViewProps = {
	topUpAmount: number;
	setTopUpAmount: (amount: number) => void;
	handleTopUp: () => void;
};

export const TopUpView = ({ topUpAmount, setTopUpAmount, handleTopUp }: TopUpViewProps) => {
	return (
		<div className="max-w-md mx-auto">
			<h3 className="text-lg font-bold text-slate-800 mb-4">Top Up Your Balance</h3>
			<Card className="border-0 shadow-md overflow-hidden">
				<CardContent className="p-5">
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
											className="pl-8 text-lg h-10"
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
							variant="default"
							size="lg"
							className="w-full h-12 bg-indigo-600 hover:bg-indigo-700"
						>
							<PlusCircleIcon className="h-5 w-5" />
							Add Funds
						</Button>

						<p className="text-xs text-slate-500 text-center">This is a demo app. No real money will be charged.</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};
