import { create } from "zustand";
import { Account } from "thirdweb/wallets";
import { getBalance } from "thirdweb/extensions/erc20";
import {
	changeAvatarUserAvatarPost,
	getAuthMessageAuthMessagePost,
	getAvatarUserAvatarGet,
	isRegisteredAuthIsRegisteredGet,
	loginWithWalletAuthLoginPost,
	registerUserAuthRegisterPost,
} from "@/apis/backend/sdk.gen";
import { toast } from "sonner";
import { getContract } from "thirdweb";
import { thirdwebClient } from "@/config/thirdweb.ts";
import { polygon } from "thirdweb/chains";
import { USDC_CONTRACT_ADDRESS } from "@/config/polygon.ts";

type AccountStoreState = {
	account: Account | null;
	jwtToken: string | null;
	isAuthenticating: boolean;
	isRegistered: boolean;
	username: string | null;
	avatarUrl: string | null;
	balance: number;
	isLoadingBalance: boolean;
	transactions: Transaction[];

	onAccountChange: (newAccount: Account | undefined) => Promise<void>;
	onDisconnect: () => void;
	authenticate: (account: Account) => Promise<boolean>;
	checkRegistration: () => Promise<boolean>;
	registerUser: (username: string) => Promise<boolean>;
	fetchAvatar: () => Promise<void>;
	uploadAvatar: (file: File) => Promise<boolean>;
	fetchUSDCBalance: () => Promise<void>;
};

export type Transaction = {
	id: string;
	amount: number;
	recipient: string;
	recipientAddress: string;
	date: Date;
	status: "completed" | "pending" | "failed";
	type: "sent" | "received" | "topup";
};

// Mock transactions
const mockTransactions: Transaction[] = [
	{
		id: "1",
		amount: 25,
		recipient: "Alice",
		recipientAddress: "0x123...abc",
		date: new Date(Date.now() - 86400000 * 2), // 2 days ago
		status: "completed",
		type: "sent",
	},
	{
		id: "2",
		amount: 50,
		recipient: "Bob",
		recipientAddress: "0x456...def",
		date: new Date(Date.now() - 86400000), // 1 day ago
		status: "completed",
		type: "received",
	},
	{
		id: "3",
		amount: 15,
		recipient: "Charlie",
		recipientAddress: "0x789...ghi",
		date: new Date(),
		status: "pending",
		type: "sent",
	},
	{
		id: "4",
		amount: 100,
		recipient: "Wallet",
		recipientAddress: "self",
		date: new Date(Date.now() - 86400000 * 0.5), // 12 hours ago
		status: "completed",
		type: "topup",
	},
];

export const useAccountStore = create<AccountStoreState>((set, get) => ({
	account: null,
	jwtToken: null,
	isAuthenticating: false,
	isRegistered: false,
	username: null,
	avatarUrl: null,
	balance: 0,
	isLoadingBalance: false,
	transactions: [...mockTransactions],

	onAccountChange: async (newAccount: Account | undefined) => {
		const state = get();

		if (newAccount === undefined) {
			// Potential disconnection
			state.onDisconnect();
			return;
		}
		if (state.account !== null && state.account.address === newAccount.address) {
			// Account already connected with the same address
			return;
		}

		if (state.isAuthenticating) {
			// Prevent multiple simultaneous authentication attempts
			return;
		}

		// Authenticate with the API
		set({ isAuthenticating: true });
		const authSuccess = await state.authenticate(newAccount);

		if (!authSuccess) {
			set({ isAuthenticating: false, account: null });
			return;
		}

		// Check if user is registered - this will also set the username if it exists
		const isRegistered = await state.checkRegistration();
		set({
			isAuthenticating: false,
			account: newAccount,
			isRegistered,
		});

		// Fetch the USDC balance
		state.fetchUSDCBalance();
	},

	authenticate: async (account: Account): Promise<boolean> => {
		try {
			// Get the message to sign
			const messageResponse = await getAuthMessageAuthMessagePost({
				body: {
					address: account.address,
				},
			});

			if (!messageResponse.data) {
				toast.error("Authentication failed", {
					description: "Could not get message to sign",
				});
				return false;
			}

			const signature = await account.signMessage({ message: messageResponse.data.message });

			// Login with the signature
			const loginResponse = await loginWithWalletAuthLoginPost({
				body: {
					address: account.address,
					signature: signature,
				},
			});

			if (loginResponse.data?.access_token) {
				// Store the JWT token
				set({ jwtToken: loginResponse.data.access_token });
				return true;
			} else {
				toast.error("Authentication failed", {
					description: "Invalid response from server",
				});
				return false;
			}
		} catch (error) {
			console.error("Authentication error:", error);
			toast.error("Authentication failed", {
				description: error instanceof Error ? error.message : "Unknown error",
			});
			return false;
		}
	},

	checkRegistration: async (): Promise<boolean> => {
		const { jwtToken } = get();

		if (!jwtToken) {
			return false;
		}

		try {
			const response = await isRegisteredAuthIsRegisteredGet();

			if (response.data && typeof response.data === "object") {
				const { registered, username } = response.data;

				// If user is registered and has a username, update the username in the store
				if (registered && username) {
					set({ username });
					// Fetch avatar after setting username
					const state = get();
					state.fetchAvatar();
				}

				return registered;
			}

			return false;
		} catch (error) {
			console.error("Error checking registration status:", error);
			return false;
		}
	},

	fetchAvatar: async (): Promise<void> => {
		const { jwtToken } = get();

		if (!jwtToken) {
			return;
		}

		try {
			const response = await getAvatarUserAvatarGet({
				headers: {
					Authorization: `Bearer ${jwtToken}`,
				},
			});

			if (response.data) {
				set({ avatarUrl: response.data });
			}
		} catch (error) {
			console.error("Error fetching avatar:", error);
			// Don't show toast for avatar fetch failure - it's not critical
		}
	},

	uploadAvatar: async (file: File): Promise<boolean> => {
		const { jwtToken } = get();

		if (!jwtToken) {
			toast.error("Authentication required", {
				description: "Please connect your wallet first",
			});
			return false;
		}

		try {
			const response = await changeAvatarUserAvatarPost({
				body: {
					file,
				},
				headers: {
					Authorization: `Bearer ${jwtToken}`,
				},
			});

			if (response.status === 200 && response.data) {
				// Use the URL returned directly instead of fetching again
				set({ avatarUrl: response.data });
				toast.success("Avatar updated successfully");
				return true;
			} else {
				toast.error("Failed to update avatar");
				return false;
			}
		} catch (error) {
			console.error("Error uploading avatar:", error);
			toast.error("Avatar upload failed", {
				description: error instanceof Error ? error.message : "Unknown error",
			});
			return false;
		}
	},

	registerUser: async (username: string): Promise<boolean> => {
		const { jwtToken } = get();

		if (!jwtToken) {
			toast.error("Authentication required", {
				description: "Please connect your wallet first",
			});
			return false;
		}

		try {
			// Call the register endpoint
			const response = await registerUserAuthRegisterPost({
				body: {
					username,
				},
				headers: {
					Authorization: `Bearer ${jwtToken}`,
				},
			});

			if (response.data?.success) {
				// Successfully registered
				set({
					isRegistered: true,
					username,
				});
				toast.success("Registration successful", {
					description: `Welcome, ${username}!`,
				});
				return true;
			} else {
				toast.error("Registration failed", {
					description: "Could not register username",
				});
				return false;
			}
		} catch (error) {
			console.error("Registration error:", error);
			toast.error("Registration failed", {
				description: error instanceof Error ? error.message : "Unknown error",
			});
			return false;
		}
	},

	onDisconnect: () => {
		set({
			account: null,
			jwtToken: null,
			isRegistered: false,
			username: null,
			avatarUrl: null,
			balance: 0,
		});
	},

	fetchUSDCBalance: async () => {
		const { account } = get();

		if (!account) {
			return;
		}

		try {
			set({ isLoadingBalance: true });

			// Get the contract instance
			const contract = getContract({
				client: thirdwebClient,
				chain: polygon,
				address: USDC_CONTRACT_ADDRESS,
			});

			// Get the balance
			const balanceResult = await getBalance({
				contract,
				address: account.address,
			});

			// Convert from wei to dollars (USDC has 6 decimals)
			const balanceInDollars = parseFloat(balanceResult.displayValue);

			set({
				balance: balanceInDollars,
				isLoadingBalance: false,
			});
		} catch (error) {
			console.error("Error fetching USDC balance:", error);
			set({ isLoadingBalance: false });
			toast.error("Failed to fetch balance", {
				description: error instanceof Error ? error.message : "Unknown error",
			});
		}
	},
}));
