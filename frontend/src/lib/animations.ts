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
// PAGE TRANSITIONS
// ═══════════════════════════════════════════════════════════════

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

// ═══════════════════════════════════════════════════════════════
// SPECIAL EFFECTS
// ═══════════════════════════════════════════════════════════════

// Score counter animation
export const countUp = {
  initial: { opacity: 0, scale: 0.5 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 200, damping: 20 },
  },
};

// Progress bar fill with dramatic easing
export const progressFill = {
  initial: { scaleX: 0 },
  animate: (width: number) => ({
    scaleX: width,
    transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 },
  }),
};

// Pipeline step reveal
export const pipelineStep: Variants = {
  hidden: { opacity: 0, x: -20, scale: 0.95 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: springNatural,
  },
  completed: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: springSnappy,
  },
};

// Modal overlay
export const modalOverlay = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

// Modal content
export const modalContent = {
  initial: { opacity: 0, scale: 0.95, y: 10 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 400, damping: 30 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: { duration: 0.15 },
  },
};





// Text character stagger variant
export const charReveal: Variants = {
  hidden: { y: "100%", opacity: 0 },
  visible: (i: number) => ({
    y: "0%",
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
      delay: i * 0.03,
    },
  }),
};

// Gradient orb floating animation
export const orbFloat = (delay: number = 0) => ({
  x: [0, 30, -20, 0],
  y: [0, -40, 20, 0],
  scale: [1, 1.1, 0.95, 1],
  transition: {
    duration: 20,
    ease: [0.4, 0, 0.6, 1] as [number, number, number, number],
    repeat: Infinity,
    delay,
  },
});
