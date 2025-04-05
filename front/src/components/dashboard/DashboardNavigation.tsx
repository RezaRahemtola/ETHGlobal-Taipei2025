type DashboardNavigationProps = { 
  activeView: string; 
  setActiveView: (view: string) => void;
};

export const DashboardNavigation = ({ 
  activeView, 
  setActiveView 
}: DashboardNavigationProps) => {
  const navItems = [
    { id: "home", label: "Dashboard" },
    { id: "send", label: "Send Money" },
    { id: "receive", label: "Receive Money" },
    { id: "topup", label: "Top Up" },
    { id: "history", label: "History" },
  ];

  return (
    <div className="flex bg-white rounded-xl overflow-hidden shadow-md">
      {navItems.map(item => (
        <button
          key={item.id}
          onClick={() => setActiveView(item.id)}
          className={`cursor-pointer flex-1 py-4 px-4 font-medium transition-colors ${
            activeView === item.id
              ? "bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};