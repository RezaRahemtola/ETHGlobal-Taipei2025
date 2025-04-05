import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Transaction, useAccountStore } from "@/stores/account";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";
import {
	ArrowRightIcon,
	BanknoteIcon,
	CheckCircle2Icon,
	CheckIcon,
	LoaderIcon,
	SendIcon,
	UserIcon,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { useQueryState } from "nuqs";
import { searchUsersUserSearchGet, UserSearchResult } from "@/apis/backend";
import { useDebounce } from "@/hooks/use-debounce";
import { TransactionButton } from "thirdweb/react";
import { getContract, prepareContractCall, resolveMethod } from "thirdweb";
import { thirdwebClient } from "@/config/thirdweb.ts";
import { polygon } from "thirdweb/chains";
import { USDC_CONTRACT_ADDRESS } from "@/config/polygon.ts";
import env from "@/config/env";

export const SendMoney = () => {
	const [recipient, setRecipient] = useQueryState("recipient", { defaultValue: "" });
	const [amount, setAmount] = useQueryState("amount", { defaultValue: "" });
	const [isSending, setIsSending] = useState(false);
	const [transactionStep, setTransactionStep] = useState<"input" | "approve" | "send" | "complete">("input");
	const [approveCompleted, setApproveCompleted] = useState(false);
	const [sendCompleted, setSendCompleted] = useState(false);
	const [receiverAddress, setReceiverAddress] = useState("");
	const isMobile = useIsMobile();

	// References for transaction buttons
	const approveButtonRef = useRef<HTMLButtonElement>(null);
	const sendButtonRef = useRef<HTMLButtonElement>(null);

	const { balance, transactions } = useAccountStore();

	// Auto-trigger the approve/send transaction when the step changes
	useEffect(() => {
		if (transactionStep === "approve" && approveButtonRef.current) {
			// Small delay to ensure the UI updates first
			setTimeout(() => {
				approveButtonRef.current?.click();
			}, 500);
		} else if (transactionStep === "send" && sendButtonRef.current) {
			// Small delay to ensure the UI updates first
			setTimeout(() => {
				sendButtonRef.current?.click();
			}, 500);
		}
	}, [transactionStep]);

	// Search functionality
	const [searchQuery, setSearchQuery] = useState(recipient);
	const debouncedSearchQuery = useDebounce(searchQuery, 300);
	const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
	const [isSearching, setIsSearching] = useState(false);
	const [showResults, setShowResults] = useState(false);
	const searchRef = useRef<HTMLDivElement>(null);

	// Clear search results when clicking outside
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
				setShowResults(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	// Search for users when searchQuery changes
	useEffect(() => {
		const searchUsers = async () => {
			if (!debouncedSearchQuery || debouncedSearchQuery.trim().length === 0) {
				setSearchResults([]);
				return;
			}

			setIsSearching(true);
			try {
				const response = await searchUsersUserSearchGet({
					query: {
						query: debouncedSearchQuery,
						limit: 5,
					},
				});

				if (response.data) {
					setSearchResults(response.data.users);
					setShowResults(true);
				}
			} catch (error) {
				console.error("Error searching for users:", error);
			} finally {
				setIsSearching(false);
			}
		};

		searchUsers();
	}, [debouncedSearchQuery]);

	// Update recipient state when search query changes
	const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setSearchQuery(value);
		setRecipient(value);
	};

	// Select a user from search results
	const handleSelectUser = (user: UserSearchResult) => {
		setRecipient(user.username);
		setSearchQuery(user.username);
		setReceiverAddress(user.address);
		setShowResults(false);
		console.log(`Selected user: ${user.username}, address: ${user.address}`);
	};

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

		// Check if we have the receiver address
		if (!receiverAddress) {
			toast.error("Recipient address not found", {
				description: "Please select a valid recipient from the search results",
			});
			return;
		}

		// Set the transaction step to approve
		setTransactionStep("approve");
	};

	// Handle transaction completion
	const handleTransactionComplete = () => {
		const numAmount = parseFloat(amount);

		// Create a new transaction record
		const newTransaction: Transaction = {
			id: Date.now().toString(),
			amount: numAmount,
			recipient,
			date: new Date(),
			status: "completed",
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

		// Reset form and states
		setRecipient("");
		setAmount("");
		setSearchQuery("");
		setIsSending(false);
		setTransactionStep("input");
		setApproveCompleted(false);
		setSendCompleted(false);
		setReceiverAddress("");
	};

	// Hidden transaction buttons (will be triggered programmatically)
	const hiddenTransactionButtons = (
		<div className="hidden">
			<TransactionButton
				/* @ts-expect-error ref */
				ref={approveButtonRef}
				className="w-full bg-indigo-600 hover:bg-indigo-700"
				transaction={() => {
					const contract = getContract({
						client: thirdwebClient,
						chain: polygon,
						address: USDC_CONTRACT_ADDRESS,
					});

					const amountBigInt = BigInt(parseFloat(amount) * 10 ** 6); // Convert to USDC decimals

					return prepareContractCall({
						contract,
						method: resolveMethod("approve"),
						params: [
							// spender
							env.PAYMENT_CONTRACT_ADDRESS,
							// quantity
							amountBigInt,
						],
					});
				}}
				onTransactionSent={(result) => {
					console.log("Approval Submitted:", result.transactionHash);
				}}
				onTransactionConfirmed={(receipt) => {
					console.log("Approval Confirmed:", receipt.transactionHash);
					setApproveCompleted(true);
					setTransactionStep("send");
				}}
				onError={(error) => {
					console.error("Approval Error:", error);
					toast.error("Approval failed", { description: "Please try again" });
					setTransactionStep("input");
				}}
			>
				Approve Transfer
			</TransactionButton>

			<TransactionButton
				/* @ts-expect-error ref */
				ref={sendButtonRef}
				className="w-full bg-indigo-600 hover:bg-indigo-700"
				transaction={() => {
					const contract = getContract({
						client: thirdwebClient,
						chain: polygon,
						address: env.PAYMENT_CONTRACT_ADDRESS,
					});

					const amountBigInt = BigInt(parseFloat(amount) * 10 ** 6); // Convert to USDC decimals

					return prepareContractCall({
						contract,
						method: resolveMethod("sendPayment"),
						params: [
							// amount
							amountBigInt,
							// receiver
							receiverAddress,
						],
					});
				}}
				onTransactionSent={(result) => {
					console.log("Payment Submitted:", result.transactionHash);
				}}
				onTransactionConfirmed={(receipt) => {
					console.log("Payment Confirmed:", receipt.transactionHash);
					setSendCompleted(true);
					setTransactionStep("complete");
					handleTransactionComplete();
				}}
				onError={(error) => {
					console.error("Payment Error:", error);
					toast.error("Payment failed", { description: "Please try again" });
					setTransactionStep("input");
				}}
			>
				Send Payment
			</TransactionButton>
		</div>
	);

	// Transaction progress visualization
	const renderTransactionProgress = () => {
		if (transactionStep === "approve" || transactionStep === "send") {
			return (
				<div className="my-4 p-4 border rounded-lg bg-indigo-50">
					{/* Approval step */}
					<div className="flex items-center justify-between mb-3">
						<div className="flex items-center gap-2">
							{transactionStep === "approve" && !approveCompleted ? (
								<LoaderIcon className="h-5 w-5 animate-spin text-indigo-600" />
							) : (
								<CheckCircle2Icon className="h-5 w-5 text-green-600" />
							)}
							<span className="font-medium">Approve Transfer</span>
						</div>
						{approveCompleted && <span className="text-sm text-green-600">Completed</span>}
					</div>

					{/* Send step - only show if approval is completed or we're on the send step */}
					{(transactionStep === "send" || approveCompleted) && (
						<>
							<div className="border-t border-indigo-100 my-3"></div>
							<div className="flex items-center justify-between mb-3">
								<div className="flex items-center gap-2">
									{transactionStep === "send" && !sendCompleted ? (
										<LoaderIcon className="h-5 w-5 animate-spin text-indigo-600" />
									) : sendCompleted ? (
										<CheckCircle2Icon className="h-5 w-5 text-green-600" />
									) : (
										<div className="h-5 w-5 rounded-full border-2 border-indigo-200"></div>
									)}
									<span className="font-medium">Send Payment</span>
								</div>
								{sendCompleted && <span className="text-sm text-green-600">Completed</span>}
							</div>
						</>
					)}

					<p className="text-sm text-slate-700 mt-3">
						{transactionStep === "approve"
							? `Approving $${amount} transfer...`
							: `Sending $${amount} to ${recipient}...`}
					</p>
				</div>
			);
		}

		return null;
	};

	// Recipient input with search results
	const recipientInput = (
		<div className="space-y-3">
			<Label htmlFor="recipient" className="flex items-center gap-2 text-base font-semibold">
				<UserIcon className="h-4 w-4 text-indigo-500" />
				Recipient
			</Label>

			<div className="relative" ref={searchRef}>
				<Input
					id="recipient"
					placeholder="Search username"
					value={searchQuery}
					onChange={handleSearchInputChange}
					onFocus={() => debouncedSearchQuery && setShowResults(true)}
					className="pl-10 h-12 border-slate-300 focus-visible:ring-indigo-500"
					disabled={transactionStep !== "input"}
				/>
				<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
					<span className="text-slate-400">@</span>
				</div>

				{/* Loading spinner */}
				{isSearching && (
					<div className="absolute inset-y-0 right-0 flex items-center pr-3">
						<div className="h-4 w-4 rounded-full border-2 border-t-transparent border-indigo-500 animate-spin"></div>
					</div>
				)}

				{/* Search results dropdown */}
				{showResults && searchResults.length > 0 && (
					<div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-slate-200 max-h-60 overflow-auto">
						{searchResults.map((user) => (
							<div
								key={user.username}
								className="flex items-center gap-2 p-3 hover:bg-slate-50 cursor-pointer"
								onClick={() => handleSelectUser(user)}
							>
								{user.avatar_url ? (
									<img src={user.avatar_url} alt={user.username} className="h-8 w-8 rounded-full object-cover" />
								) : (
									<div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center">
										<UserIcon className="h-4 w-4 text-indigo-600" />
									</div>
								)}
								<div className="flex-1">
									<p className="font-medium">{user.username}</p>
								</div>
								{user.username === searchQuery && <CheckIcon className="h-4 w-4 text-green-500" />}
							</div>
						))}
					</div>
				)}

				{/* No results message */}
				{showResults && debouncedSearchQuery && !isSearching && searchResults.length === 0 && (
					<div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-slate-200">
						<div className="p-3 text-center text-slate-500">
							<p>No users found.</p>
						</div>
					</div>
				)}
			</div>
		</div>
	);

	const formContent = (
		<>
			{recipientInput}

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
						disabled={transactionStep !== "input"}
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
						disabled={transactionStep !== "input"}
					>
						Send Max
					</button>
				</div>
			</div>

			{renderTransactionProgress()}
			{hiddenTransactionButtons}

			{transactionStep === "input" && (
				<div className="pt-2">
					<div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
						<p className="text-sm text-indigo-700">
							<span className="font-semibold">
								Funds are sent with zero fees. Your recipient will get the funds in seconds!
							</span>
						</p>
					</div>
				</div>
			)}
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

				{transactionStep === "input" && (
					<Button
						onClick={handleSend}
						disabled={isSending || !recipient || !amount}
						className="w-full h-12 font-medium text-base bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700"
					>
						<span className="flex items-center gap-2">
							Send ${amount || "0.00"} to @{recipient || "recipient"}
							<ArrowRightIcon className="h-4 w-4" />
						</span>
					</Button>
				)}
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
			{transactionStep === "input" && (
				<CardFooter className="px-6 pb-6 pt-0">
					<Button
						onClick={handleSend}
						disabled={isSending || !recipient || !amount}
						className="w-full h-12 font-medium text-base bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700"
					>
						<span className="flex items-center gap-2">
							Send ${amount || "0.00"} to @{recipient || "recipient"}
							<ArrowRightIcon className="h-4 w-4" />
						</span>
					</Button>
				</CardFooter>
			)}
		</Card>
	);
};
