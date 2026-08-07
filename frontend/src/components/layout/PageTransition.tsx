"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

// Tab order for direction-aware transitions
const tabOrder = ["/", "/analyze", "/docs", "/about"];

function getTabIndex(path: string): number {
  // Match the base path (e.g., /docs/something matches /docs)
  const base = tabOrder.find((t) => t !== "/" && path.startsWith(t));
  if (base) return tabOrder.indexOf(base);
  // Check if it's the homepage
  if (path === "/") return 0;
  // Default to a neutral index
  return -1;
}

const slideEase: [number, number, number, number] = [0.22, 1, 0.36, 1];
const slideDistance = 60;

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Track the previous pathname so direction-aware transitions can be computed
  // synchronously during render. Kept in state (not a ref) because refs must
  // not be read during render; updated via React's documented "adjusting state
  // during render" pattern, so the committed render still sees the previous
  // pathname and can derive the correct slide direction.
  const [tracker, setTracker] = useState<{ prev: string | null; last: string }>({
    prev: null,
    last: pathname,
  });

  if (tracker.last !== pathname) {
    setTracker({ prev: tracker.last, last: pathname });
  }

  // Calculate direction synchronously.  During the first render prev is null
  // → direction=0, guaranteeing SSG/SSR output uses translateX(0).  On
  // subsequent navigations prev holds the previous page's pathname, so the
  // direction reflects the actual tab change.
  const currIdx = getTabIndex(pathname);
  const prevIdx = tracker.prev !== null ? getTabIndex(tracker.prev) : -1;
  const direction = (prevIdx !== -1 && currIdx !== -1 && currIdx !== prevIdx)
    ? (currIdx > prevIdx ? 1 : -1)
    : 0;

  return (
    // No AnimatePresence — it causes a blank gap between exit and enter.
    // Instead we rely on mount/unmount: the old page is visible until the
    // key flips, then the new page starts at initial and animates in.
    // This eliminates the flicker while keeping the smooth entrance.
    <motion.div
      key={pathname}
      initial={{ opacity: 0, x: direction * slideDistance, scale: 0.97 }}
      animate={{
        opacity: 1,
        x: 0,
        scale: 1,
        transition: { duration: 0.18, ease: slideEase },
      }}
    >
      {children}
    </motion.div>
  );
}
