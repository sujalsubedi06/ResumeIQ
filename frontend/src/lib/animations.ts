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
// STAGGER CONTAINERS — Dramatic sequential reveals
// ═══════════════════════════════════════════════════════════════

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

export const staggerContainerSlow: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

export const staggerContainerDramatic: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
      when: "beforeChildren",
    },
  },
};

// ═══════════════════════════════════════════════════════════════
// ITEM VARIANTS — Stagger children
// ═══════════════════════════════════════════════════════════════

export const fadeUpItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 30 },
  },
};

export const fadeScaleItem: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  show: {
    opacity: 1,
    scale: 1,
    transition: springNatural,
  },
};

export const slideInFromLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  show: {
    opacity: 1,
    x: 0,
    transition: springNatural,
  },
};

export const slideInFromRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  show: {
    opacity: 1,
    x: 0,
    transition: springNatural,
  },
};

// ═══════════════════════════════════════════════════════════════
// SCROLL-TRIGGERED ANIMATIONS
// ═══════════════════════════════════════════════════════════════

export const scrollReveal = {
  initial: { opacity: 0, y: 40, scale: 0.98 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  viewport: { once: true, margin: "-80px" } as const,
  transition: { type: "spring" as const, stiffness: 200, damping: 25 },
};

export const scrollRevealLeft = {
  initial: { opacity: 0, x: -60 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: "-60px" } as const,
  transition: { type: "spring" as const, stiffness: 200, damping: 25 },
};

export const scrollRevealRight = {
  initial: { opacity: 0, x: 60 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: "-60px" } as const,
  transition: { type: "spring" as const, stiffness: 200, damping: 25 },
};

export const scrollRevealScale = {
  initial: { opacity: 0, scale: 0.9 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true, margin: "-60px" } as const,
  transition: { type: "spring" as const, stiffness: 200, damping: 25 },
};

// ═══════════════════════════════════════════════════════════════
// HOVER INTERACTIONS
// ═══════════════════════════════════════════════════════════════

export const hoverLift = {
  whileHover: { y: -6, transition: springSnappy },
  whileTap: { scale: 0.97, transition: springSnappy },
};

export const hoverScale = {
  whileHover: { scale: 1.03, transition: springSnappy },
  whileTap: { scale: 0.97, transition: springSnappy },
};

export const hoverGlow = {
  whileHover: {
    boxShadow: "0 0 20px rgba(242, 242, 240, 0.05)",
    transition: springNatural,
  },
};

// ═══════════════════════════════════════════════════════════════
