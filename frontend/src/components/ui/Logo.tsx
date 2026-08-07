import React from "react";
import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  href?: string;
}

const sizeStyles = {
  sm: "text-sm gap-2",
  md: "text-base gap-2.5",
  lg: "text-lg gap-3",
};

const iconSizes = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
};

function LogoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 8h8M8 12h5M8 16h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="17" cy="17" r="4" fill="currentColor" opacity="0.2" />
      <path d="M16 17l0.75 0.75L18.5 16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Logo({ size = "md", className = "", href = "/" }: LogoProps) {
  return (
    <Link
      href={href}
      className={`flex items-center font-semibold tracking-tight text-[var(--text-primary)] hover:opacity-80 transition-opacity ${sizeStyles[size]} ${className}`}
    >
      <LogoIcon className={iconSizes[size]} />
      <span className="font-[family-name:var(--font-space-grotesk)]">ResumeIQ</span>
    </Link>
  );
}
