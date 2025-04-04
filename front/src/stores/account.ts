import { create } from "zustand";
import { Account } from "thirdweb/wallets";
import {
	getAuthMessageAuthMessagePost,
	loginWithWalletAuthLoginPost,
	registerUserAuthRegisterPost,
	isRegisteredAuthIsRegisteredGet,
} from "@/apis/backend/sdk.gen";
import { toast } from "sonner";

type AccountStoreState = {
	account: Account | null;
	jwtToken: string | null;
	isAuthenticating: boolean;
	isRegistered: boolean;
	username: string | null;
	balance: number;
	transactions: Transaction[];

	onAccountChange: (newAccount: Account | undefined) => Promise<void>;
	onDisconnect: () => void;
	authenticate: (account: Account) => Promise<boolean>;
	checkRegistration: () => Promise<boolean>;
	registerUser: (username: string) => Promise<boolean>;
};

export type Transaction = {
	id: string;
	amount: number;
	recipient: string;
	recipientAddress: string;
	date: Date;
	status: "completed" | "pending" | "failed";
	type: "sent" | "received";
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
];

export const useAccountStore = create<AccountStoreState>((set, get) => ({
	account: null,
	jwtToken: null,
	isAuthenticating: false,
	isRegistered: false,
	username: null,
	balance: 100,
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
				}

				return registered;
			}

			return false;
		} catch (error) {
			console.error("Error checking registration status:", error);
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
		});
	},
}));
