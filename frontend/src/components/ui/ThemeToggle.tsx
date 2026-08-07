"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/lib/theme";
import { springSnappy } from "@/lib/animations";

interface ThemeToggleProps {
  /** Show a compact version (just the toggle or icon, no text label) */
  compact?: boolean;
  /** Show as icon-only (sun/moon) instead of a slide toggle */
  iconOnly?: boolean;
  /** Additional class names */
  className?: string;
}

// Sun and moon glyphs. Both are always rendered and crossfaded through CSS
// opacity, so the toggle is never in an "empty / hidden icon" state — even
// mid-switch or before hydration. The glyphs use `currentColor` and inherit
// their color from the parent: inside the knob they pick up --toggle-icon
// (tuned for contrast against --toggle-active), while icon-only usage inherits
// the button's text color so the icon is always visible against the page
// background in BOTH themes.
function SunIcon({
  size = 18,
  strokeWidth = 2,
  className = "",
}: {
  size?: number;
  strokeWidth?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="5" />
      <g stroke="currentColor">
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </g>
    </svg>
  );
}

function MoonIcon({
  size = 18,
  strokeWidth = 2,
  className = "",
}: {
  size?: number;
  strokeWidth?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export function ThemeToggle({ compact = false, iconOnly = false, className = "" }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  if (iconOnly) {
    return (
      <div className="relative group">
        <motion.button
          type="button"
          onClick={toggleTheme}
          whileHover={{ scale: 1.1, rotate: 15 }}
          whileTap={{ scale: 0.9, rotate: -15 }}
          transition={springSnappy}
          className={`relative flex items-center justify-center w-9 h-9 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] hover:border-[var(--border-hover)] active:bg-[var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--text-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)] transition-colors ${className}`}
          aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
        >
          <SunIcon
            size={18}
            className={`absolute inset-0 m-auto transition-opacity duration-200 ${
              isDark ? "opacity-100" : "opacity-0"
            }`}
          />
          <MoonIcon
            size={18}
            className={`absolute inset-0 m-auto transition-opacity duration-200 ${
              isDark ? "opacity-0" : "opacity-100"
            }`}
          />
        </motion.button>

        {/* Tooltip: mirrors the aria-label for sighted users. It sits below the
            chip so the sticky nav's top edge never clips it, and as a sibling
            of the button so the hover-rotate transform doesn't skew it. It's
            hidden from the a11y tree because the button's aria-label already
            announces the target theme. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-full left-1/2 mt-2 -translate-x-1/2 whitespace-nowrap rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] px-2 py-1 text-[10px] font-medium text-[var(--text-secondary)] opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
        >
          Switch to {isDark ? "Light" : "Dark"} theme
        </span>
      </div>
    );
  }

  // Knob travel: track width - 3px left padding - 3px right padding - knob width
  // We compute it here so both the class and animate prop stay in sync.
  const knobSize = compact ? 14 : 18;
  const trackWidth = compact ? 36 : 44;
  const padding = 3;
  const knobTravel = trackWidth - padding * 2 - knobSize;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      onClick={toggleTheme}
      className={`group flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm transition-colors ${
        compact
          ? "justify-center w-10 h-10 hover:bg-[var(--bg-hover)]"
          : "w-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
      } ${className}`}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
    >
      {/* Label */}
      {!compact && (
        <span className="text-xs font-medium tracking-wide uppercase">
          Change theme
        </span>
      )}

      {/* Slide Toggle — larger track with proper padding */}
      <div
        className={`relative rounded-full transition-colors duration-250 border border-[var(--border)] overflow-hidden ${
          compact ? "w-9 h-5" : "w-11 h-6 ml-auto"
        }`}
        style={{
          backgroundColor: "var(--toggle-bg)",
        }}
      >
        <motion.div
          transition={springSnappy}
          className={`absolute top-[3px] left-[3px] rounded-full border border-[var(--border)] shadow-sm flex items-center justify-center ${
            compact ? "w-[14px] h-[14px]" : "w-[18px] h-[18px]"
          }`}
          animate={{
            x: isDark ? knobTravel : 0,
          }}
          style={{
            // --toggle-icon is tuned to contrast against the knob color
            // (--toggle-active) in both themes.
            color: "var(--toggle-icon)",
            backgroundColor: "var(--toggle-active)",
          }}
        >
          {/* Sun / moon icons, always rendered — crossfade instead of remounting */}
          <SunIcon
            size={compact ? 10 : 12}
            strokeWidth={1.5}
            className={`absolute inset-0 m-auto transition-opacity duration-200 ${
              isDark ? "opacity-100" : "opacity-0"
            }`}
          />
          <MoonIcon
            size={compact ? 10 : 12}
            strokeWidth={1.5}
            className={`absolute inset-0 m-auto transition-opacity duration-200 ${
              isDark ? "opacity-0" : "opacity-100"
            }`}
          />
        </motion.div>
      </div>

      {/* Theme indicator text */}
      {!compact && (
        <span className="text-xs font-mono text-[var(--text-muted)] min-w-[3.5rem] text-right">
          {isDark ? "Dark" : "Light"}
        </span>
      )}
    </button>
  );
}
