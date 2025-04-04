import { useAccountStore } from "@/stores/account";
import { AccountConnect } from "./AccountConnect";
import { RegisterUser } from "./RegisterUser";
import { Dashboard } from "./Dashboard";
import { Skeleton } from "./ui/skeleton";
import { WalletIcon } from "lucide-react";

export const PaymentApp = () => {
  const { account, isRegistered, isAuthenticating } = useAccountStore();
  
  // Not connected yet
  if (!account) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-gradient-to-br from-indigo-600 to-violet-700 mb-6">
            <WalletIcon className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-700 mb-2">Solva</h1>
          <p className="text-slate-600 text-lg max-w-md">Send money to anyone, instantly and without fees.</p>
        </div>
        
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-8 rounded-2xl shadow-lg w-full max-w-md border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Connect your wallet</h2>
          <div className="p-4 bg-white rounded-xl shadow-sm">
            <AccountConnect />
          </div>
          <p className="mt-6 text-sm text-slate-500">Secure connection powered by blockchain technology</p>
        </div>
      </div>
    );
  }
  
  // Authenticating
  if (isAuthenticating) {
    return (
      <div className="w-full max-w-md mx-auto p-4 space-y-6">
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 mb-4">
            <div className="h-8 w-8 rounded-full border-4 border-t-transparent border-indigo-600 animate-spin"></div>
          </div>
          <h1 className="text-2xl font-bold">Connecting...</h1>
          <p className="text-slate-500">Please wait while we authenticate your account</p>
        </div>
        
        <div className="space-y-4">
          <Skeleton className="h-[200px] w-full rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    );
  }
  
  // Connected but not registered
  if (!isRegistered) {
    return <RegisterUser />;
  }
  
  // Fully authenticated and registered
  return <Dashboard />;
};