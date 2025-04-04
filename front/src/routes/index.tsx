import { createFileRoute } from "@tanstack/react-router";
import { AccountConnect } from "@/components/AccountConnect.tsx";

export const Route = createFileRoute("/")({
	component: Index,
});

function Index() {
	return (
		<div className="p-2">
			<h3>Welcome Home!</h3>
			<AccountConnect />
		</div>
	);
}
