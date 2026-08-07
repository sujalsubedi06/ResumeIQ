import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "error" | "info";
  className?: string;
}

const variantStyles = {
  default: "bg-[var(--bg-elevated)] border-[var(--border)] text-[var(--text-secondary)]",
  success: "bg-emerald-400/10 border-emerald-400/20 text-emerald-400",
  warning: "bg-yellow-400/10 border-yellow-400/20 text-yellow-400",
  error: "bg-red-400/10 border-red-400/20 text-red-400",
  info: "bg-blue-400/10 border-blue-400/20 text-blue-400",
};

export function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium border rounded-lg ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
