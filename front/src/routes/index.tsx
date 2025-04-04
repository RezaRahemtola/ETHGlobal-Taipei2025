import { createFileRoute } from "@tanstack/react-router";
import { PaymentApp } from "@/components/PaymentApp";
import { useAccountStore } from "@/stores/account";
import { About } from "@/components/About";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { account } = useAccountStore();

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-background to-muted py-8">
      {!account ? (
        <>
          <PaymentApp />
          <About />
        </>
      ) : (
        <PaymentApp />
      )}
    </div>
  );
}