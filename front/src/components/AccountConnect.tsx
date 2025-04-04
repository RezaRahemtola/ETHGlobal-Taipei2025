import { useAccountStore } from "@/stores/account";
import { useEffect } from "react";
import { ConnectEmbed, useActiveAccount, useActiveWallet } from "thirdweb/react";
import { thirdwebClient } from "@/config/thirdweb.ts";

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

	return <ConnectEmbed client={thirdwebClient} className="mx-auto" />;
};
