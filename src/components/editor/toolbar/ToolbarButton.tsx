import React from 'react';

interface ToolbarButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  active?: boolean;
  tooltip?: string;
}

export function ToolbarButton({
  onClick,
  icon,
  active = false,
  tooltip
}: ToolbarButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded hover:bg-gray-100 ${
        active ? 'bg-gray-100 text-blue-600' : 'text-gray-600'
      }`}
      title={tooltip}
    >
      {icon}
    </button>
  );
}
