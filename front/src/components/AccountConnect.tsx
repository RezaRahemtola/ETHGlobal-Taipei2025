import { useAccountStore } from "@/stores/account";
import { useEffect } from "react";
import { ConnectEmbed, useActiveAccount, useActiveWallet } from "thirdweb/react";
import { thirdwebClient } from "@/config/thirdweb.ts";
import { polygon } from "thirdweb/chains";

export const AccountConnect = () => {
	const account = useActiveAccount();
	const wallet = useActiveWallet();
	const onAccountChange = useAccountStore((state) => state.onAccountChange);

	useEffect(() => {
		onAccountChange(account).then();
	}, [account, onAccountChange]);

	wallet?.subscribe("accountChanged", (account) => {
		onAccountChange(account).then();
	});

	return (
		<ConnectEmbed
			client={thirdwebClient}
			accountAbstraction={{ sponsorGas: true, chain: polygon }}
			className="mx-auto"
		/>
	);
};
