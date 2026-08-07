"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  FileText,
  BookOpen,
  Info,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

const navItems = [
  { label: "Analyze", icon: FileText, href: "/analyze" },
  { label: "Documentation", icon: BookOpen, href: "/docs" },
  { label: "About", icon: Info, href: "/about" },
  { label: "GitHub", icon: GithubIcon, href: "https://github.com/sujalsubedi06/ResumeIQ" },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 border-r border-[var(--border)] bg-[var(--bg-primary)] p-6 flex-col justify-between min-h-screen select-none shrink-0 transition-[colors,background-color,border-color]">
        <SidebarContent pathname={pathname} />
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={onMobileClose}
          />
          <aside className="relative w-72 bg-[var(--bg-primary)] border-r border-[var(--border)] p-6 flex flex-col justify-between min-h-screen z-10 transition-[colors,background-color,border-color]">
            <div className="flex justify-end mb-4">
              <button
                onClick={onMobileClose}
                className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <SidebarContent pathname={pathname} onNavigate={onMobileClose} />
          </aside>
        </div>
      )}
    </>
  );
}

function SidebarContent({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <div className="space-y-8 flex-1 flex flex-col">
      <Logo size="md" />

      <nav className="space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/analyze"
              ? pathname === "/analyze"
              : pathname.startsWith(item.href);
          const isExternal = item.href.startsWith("http");

          if (isExternal) {
            return (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </a>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={onNavigate}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="mt-auto pt-6 border-t border-[var(--border)] space-y-3">
        {/* Theme Toggle with slide bar */}
        <ThemeToggle />

        {/* Portfolio Link */}
        <a
          href="https://sujalsubedi.name.np"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Portfolio</span>
        </a>

        {/* Status & Version */}
        <div className="px-3.5 pt-2 space-y-2">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400/40" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="text-xs text-[var(--text-muted)]">All systems operational</span>
          </div>
          <p className="text-[10px] text-[var(--text-muted-strong)] font-mono">v1.0.0 • MIT License</p>
        </div>
      </div>
    </div>
  );
}

export function MobileHeader({
  onMenuOpen,
}: {
  onMenuOpen: () => void;
}) {
  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 flex items-center justify-between px-4 h-14 border-b border-[var(--border)] bg-[var(--bg-primary)]/90 backdrop-blur-md z-40 transition-[colors,background-color,border-color]">
      <Logo size="sm" />
      <button
        onClick={onMenuOpen}
        className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors rounded-lg hover:bg-[var(--bg-hover)]"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>
    </header>
  );
}

