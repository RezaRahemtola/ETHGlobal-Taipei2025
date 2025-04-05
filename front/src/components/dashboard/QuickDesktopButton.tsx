import { ReactNode } from "react";

type QuickDesktopButtonProps = {
  icon: ReactNode;
  label: string;
  color: string;
  onClick: () => void;
};

export const QuickDesktopButton = ({
  icon,
  label,
  color,
  onClick,
}: QuickDesktopButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="border border-slate-200 rounded-lg p-4 flex flex-col items-center gap-2 hover:shadow-md hover:border-indigo-100 transition-all cursor-pointer"
    >
      <div className={`${color} p-3 rounded-full`}>{icon}</div>
      <span className="text-sm font-medium text-slate-800">{label}</span>
    </button>
  );
};