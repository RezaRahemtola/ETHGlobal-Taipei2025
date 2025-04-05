import { useState } from "react";
import { Transaction, useAccountStore } from "@/stores/account";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { ArrowRightIcon, BanknoteIcon, SendIcon, UserIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { useQueryState } from "nuqs";

export const SendMoney = () => {
	const [recipient, setRecipient] = useQueryState("recipient", { defaultValue: "" });
	const [amount, setAmount] = useQueryState("amount", { defaultValue: "" });
	const [isSending, setIsSending] = useState(false);
	const isMobile = useIsMobile();

	const { balance, transactions } = useAccountStore();

	const handleSend = () => {
		const numAmount = parseFloat(amount);

		// Validate input
		if (!recipient.trim()) {
			toast.error("Recipient required", { description: "Please enter a recipient" });
			return;
		}

		if (isNaN(numAmount) || numAmount <= 0) {
			toast.error("Invalid amount", { description: "Please enter a valid amount" });
			return;
		}

		if (numAmount > balance) {
			toast.error("Insufficient funds", { description: "Your balance is too low for this transaction" });
			return;
		}

		// Simulate sending money
		setIsSending(true);

		setTimeout(() => {
			// Create a new transaction
			const newTransaction: Transaction = {
				id: Date.now().toString(),
				amount: numAmount,
				recipient,
				recipientAddress:
					"0x" +
					Array(40)
						.fill(0)
						.map(() => Math.floor(Math.random() * 16).toString(16))
						.join(""),
				date: new Date(),
				status: "pending",
				type: "sent",
			};

			// Add to transactions list
			useAccountStore.setState({
				transactions: [newTransaction, ...transactions],
				balance: balance - numAmount,
			});

			// Show success message
			toast.success("Money sent!", {
				description: `$${numAmount.toFixed(2)} sent to ${recipient}`,
			});

			// Reset form
			setRecipient("");
			setAmount("");
			setIsSending(false);

			// Simulate transaction completion after delay
			setTimeout(() => {
				const updatedTransactions = [...useAccountStore.getState().transactions];
				const idx = updatedTransactions.findIndex((t) => t.id === newTransaction.id);

				if (idx !== -1) {
					updatedTransactions[idx] = {
						...updatedTransactions[idx],
						status: "completed",
					};

					useAccountStore.setState({
						transactions: updatedTransactions,
					});

					toast.success("Transaction completed", {
						description: `Your payment to ${recipient} has been confirmed`,
					});
				}
			}, 3000);
		}, 1500);
	};

	const formContent = (
		<>
			<div className="space-y-3">
				<Label htmlFor="recipient" className="flex items-center gap-2 text-base font-semibold">
					<UserIcon className="h-4 w-4 text-indigo-500" />
					Recipient
				</Label>
				<div className="relative">
					<Input
						id="recipient"
						placeholder="Enter name or username"
						value={recipient}
						onChange={(e) => setRecipient(e.target.value)}
						className="pl-10 h-12 border-slate-300 focus-visible:ring-indigo-500"
					/>
					<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
						<span className="text-slate-400">@</span>
					</div>
				</div>
			</div>

			<div className="space-y-3">
				<Label htmlFor="amount" className="flex items-center gap-2 text-base font-semibold">
					<BanknoteIcon className="h-4 w-4 text-indigo-500" />
					Amount
				</Label>
				<div className="relative">
					<Input
						id="amount"
						type="number"
						placeholder="0.00"
						className="pl-10 h-12 border-slate-300 focus-visible:ring-indigo-500"
						value={amount}
						onChange={(e) => setAmount(e.target.value)}
						min="0.01"
						step="0.01"
					/>
					<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
						<span className="text-slate-400">$</span>
					</div>
				</div>
				<div className="flex items-center justify-between">
					<p className="text-sm text-slate-500">
						Available: <span className="font-medium text-slate-700">${balance.toFixed(2)}</span>
					</p>
					<button
						type="button"
						className="text-sm text-indigo-600 font-medium hover:text-indigo-700"
						onClick={() => setAmount(balance.toString())}
					>
						Send Max
					</button>
				</div>
			</div>

			<div className="pt-2">
				<div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
					<p className="text-sm text-indigo-700">
						<span className="font-semibold">Tip:</span> Send money instantly with zero fees. Your recipient will get the
						funds in seconds!
					</p>
				</div>
			</div>
		</>
	);

	if (isMobile) {
		return (
			<div className="space-y-6">
				<div>
					<div className="flex items-center gap-2 text-2xl font-bold">
						<span className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
							<SendIcon className="h-4 w-4 text-indigo-600" />
						</span>
						Send Money
					</div>
					<div className="text-muted-foreground">Send money to anyone, anywhere</div>
				</div>

				<div className="space-y-6 p-0">{formContent}</div>

				<Button
					onClick={handleSend}
					disabled={isSending || !recipient || !amount}
					className="w-full h-12 font-medium text-base bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700"
				>
					{isSending ? (
						<span className="flex items-center gap-2">
							<div className="h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
							Processing Payment
						</span>
					) : (
						<span className="flex items-center gap-2">
							Send ${amount || "0.00"} to @{recipient || "recipient"}
							<ArrowRightIcon className="h-4 w-4" />
						</span>
					)}
				</Button>
			</div>
		);
	}

	return (
		<Card className="border-0 shadow-lg overflow-hidden">
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-2xl font-bold">
					<span className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
						<SendIcon className="h-4 w-4 text-indigo-600" />
					</span>
					Send Money
				</CardTitle>
				<CardDescription>Send money to anyone, anywhere</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6 p-6">{formContent}</CardContent>
			<CardFooter className="px-6 pb-6 pt-0">
				<Button
					onClick={handleSend}
					disabled={isSending || !recipient || !amount}
					className="w-full h-12 font-medium text-base bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700"
				>
					{isSending ? (
						<span className="flex items-center gap-2">
							<div className="h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
							Processing Payment
						</span>
					) : (
						<span className="flex items-center gap-2">
							Send ${amount || "0.00"} to @{recipient || "recipient"}
							<ArrowRightIcon className="h-4 w-4" />
						</span>
					)}
				</Button>
			</CardFooter>
		</Card>
	);
};
