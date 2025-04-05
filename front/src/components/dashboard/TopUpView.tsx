import { PayEmbed } from "thirdweb/react";
import { thirdwebClient } from "@/config/thirdweb.ts";
import { polygon } from "thirdweb/chains";
import { USDC_CONTRACT_ADDRESS } from "@/config/polygon.ts";
import { useAccountStore } from "@/stores/account.ts";

export const TopUpView = () => {
	const account = useAccountStore((state) => state.account);

	return (
		<div className="max-w-md mx-auto">
			<h3 className="text-lg font-bold text-slate-800 mb-4">Top Up Your Balance</h3>
			<p className="text-sm text-slate-600 mb-4">
				Click on the amount to edit it. You will be able to pay in credit card or crypto.
			</p>
			<PayEmbed
				client={thirdwebClient}
				payOptions={{
					mode: "fund_wallet",
					purchaseData: {
						type: "topup",
						userAddress: account!.address,
					},
					prefillBuy: {
						chain: polygon,
						amount: "1",
						token: {
							name: "USDC",
							symbol: "USDC",
							address: USDC_CONTRACT_ADDRESS,
						},
						allowEdits: {
							amount: true,
							token: false,
							chain: false,
						},
					},
				}}
			/>
		</div>
	);
};
