import type { Variants, Transition } from "framer-motion";

// ═══════════════════════════════════════════════════════════════
// SPRING PHYSICS — Tuned for different interaction types
// ═══════════════════════════════════════════════════════════════

export const springSnappy = {
  type: "spring" as const,
  stiffness: 400,
  damping: 25,
};

export const springNatural = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
};

export const springBouncy = {
  type: "spring" as const,
  stiffness: 500,
  damping: 15,
};



// ═══════════════════════════════════════════════════════════════
// EASING CURVES — Premium feel
// ═══════════════════════════════════════════════════════════════

export const easeOutExpo: Transition = {
  duration: 0.5,
  ease: [0.16, 1, 0.3, 1],
};

export const easeOutCubic: Transition = {
  duration: 0.4,
  ease: [0.33, 1, 0.68, 1],
};



// ═══════════════════════════════════════════════════════════════
