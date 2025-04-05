import { ReactNode } from "react";

type QuickActionButtonProps = {
  icon: ReactNode;
  label: string;
  color: string;
  onClick: () => void;
};

export const QuickActionButton = ({
  icon,
  label,
  color,
  onClick,
}: QuickActionButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center py-5 hover:bg-slate-50 active:bg-slate-100 transition-colors"
    >
      <div className={`${color} p-3 rounded-full mb-2`}>{icon}</div>
      <span className="text-sm font-medium text-slate-800">{label}</span>
    </button>
  );
};