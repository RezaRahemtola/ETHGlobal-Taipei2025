import { create } from "zustand";
import { Account } from "thirdweb/wallets";
import { getAuthMessageAuthMessagePost, loginWithWalletAuthLoginPost } from "@/apis/backend/sdk.gen";
import { toast } from "sonner";

type AccountStoreState = {
	account: Account | null;
	jwtToken: string | null;
	isAuthenticating: boolean;

	onAccountChange: (newAccount: Account | undefined) => Promise<void>;
	onDisconnect: () => void;
	authenticate: (account: Account) => Promise<boolean>;
};

export const useAccountStore = create<AccountStoreState>((set, get) => ({
	account: null,
	jwtToken: null,
	isAuthenticating: false,

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
		set({ isAuthenticating: false });

		if (!authSuccess) {
			set({ account: null });
			return;
		}

		set({ account: newAccount });
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
	onDisconnect: () => {
		set({
			account: null,
			jwtToken: null,
		});
	},
}));
