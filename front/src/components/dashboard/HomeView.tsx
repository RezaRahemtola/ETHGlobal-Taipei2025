import { Transaction } from "@/stores/account";
import { Card, CardContent } from "../ui/card";
import { SendMoney } from "../SendMoney";
import { TransactionHistory } from "../TransactionHistory";
import { SendIcon, ArrowDownIcon, HistoryIcon } from "lucide-react";
import { QuickDesktopButton } from "./QuickDesktopButton";

type HomeViewProps = { 
  setActiveView: (view: string) => void; 
  transactions: Transaction[];
};

export const HomeView = ({ 
  setActiveView, 
  transactions 
}: HomeViewProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="lg:col-span-1">
        <Card className="border-0 shadow-md overflow-hidden">
          <CardContent className="p-5">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-3 gap-4">
              <QuickDesktopButton
                icon={<SendIcon className="h-5 w-5" />}
                label="Send Money"
                onClick={() => setActiveView("send")}
                color="bg-indigo-100 text-indigo-600"
              />
              <QuickDesktopButton
                icon={<ArrowDownIcon className="h-5 w-5" />}
                label="Receive"
                onClick={() => setActiveView("receive")}
                color="bg-emerald-100 text-emerald-600"
              />
              <QuickDesktopButton
                icon={<HistoryIcon className="h-5 w-5" />}
                label="History"
                onClick={() => setActiveView("history")}
                color="bg-violet-100 text-violet-600"
              />
            </div>
          </CardContent>
        </Card>

        <div className="mt-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Send Money</h3>
          <SendMoney />
        </div>
      </div>
      <div className="lg:col-span-1">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Activity</h3>
        <TransactionHistory />
      </div>
    </div>
  );
};