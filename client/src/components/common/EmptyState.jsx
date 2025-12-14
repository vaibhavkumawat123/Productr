import React from "react";
import { Grid2x2Plus } from "lucide-react";

const EmptyState = ({ title, subtitle, buttonText, onClick }) => {
  return (
    <div className="flex flex-col items-center text-center max-w-md">
      {/* ICON */}
      <div className="mb-6">
        <Grid2x2Plus size={94} className="text-blue-700" strokeWidth={1.5} />
      </div>

      {/* TITLE */}
      <h3 className="text-base font-semibold text-gray-800 mb-2">{title}</h3>

      {/* SUBTITLE */}
      <p className="text-sm text-gray-400 mb-6 leading-relaxed">{subtitle}</p>

      {/* BUTTON (optional) */}
      {buttonText && onClick && (
        <button
          onClick={onClick}
          className="px-8 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
