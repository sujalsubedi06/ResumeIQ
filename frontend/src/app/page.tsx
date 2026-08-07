"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  FileText,
  Shield,
  BarChart3,
  Zap,
  CheckCircle2,
  Sparkles,
  Layout,
  Code,
  MoveRight,
  Menu,
  X,
  BookOpen,
  Info,
  ExternalLink,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import dynamic from "next/dynamic";

const GitHubStar = dynamic(
  () => import("@/components/ui/GitHubStar").then((m) => m.GitHubStar),
  {
    ssr: false,
    loading: () => (
      <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] text-sm">
        <div className="w-4 h-4" />
        <span className="w-24 h-4 bg-[var(--border)] rounded animate-pulse" />
      </div>
    ),
  }
);
import { Footer } from "@/components/layout/Footer";
import {
  staggerContainer,
  staggerContainerDramatic,
  fadeUpItem,
  springSnappy,
  springBouncy,
  orbFloat,
  charReveal,
} from "@/lib/animations";

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

const features = [
  {
    icon: Shield,
    title: "ATS Compatibility",
    description:
      "Evaluate how your resume performs against modern Applicant Tracking Systems with precise scoring.",
  },
  {
    icon: BarChart3,
    title: "Score Breakdown",
    description:
      "Understand exactly where your resume excels and where it needs improvement across multiple categories.",
  },
  {
    icon: Code,
    title: "Skills Analysis",
    description:
      "Detect technical and professional skills, identify gaps, and understand your skill coverage.",
  },
  {
    icon: Layout,
    title: "Section Detection",
    description:
      "Verify that critical resume sections are present and assess their quality.",
  },
  {
    icon: FileText,
    title: "Experience Review",
    description:
      "Evaluate experience quality with action verb analysis, impact scoring, and metrics detection.",
  },
  {
    icon: Zap,
    title: "Actionable Recommendations",
    description:
      "Receive prioritized, specific suggestions to improve your resume before your next application.",
  },
];

const steps = [
  { step: "01", title: "Upload", description: "Drop your PDF or DOCX resume" },
  { step: "02", title: "Analyze", description: "Engine evaluates 6 key areas" },
  { step: "03", title: "Improve", description: "Get clear, actionable feedback" },
];

function AnimatedText({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span className={`inline-flex flex-wrap overflow-hidden ${className}`}>
      {text.split(" ").map((word, wordIndex) => (
        <span key={wordIndex} className="inline-flex overflow-hidden mr-[0.3em]">
          {word.split("").map((char, charIndex) => {
            const globalIndex = Math.min(text.indexOf(word) + charIndex, 20);
            return (
              <motion.span
                key={charIndex}
                custom={globalIndex}
                variants={charReveal}
                initial="hidden"
                animate="visible"
                className="inline-block"
              >
                {char}
              </motion.span>
            );
          })}
        </span>
      ))}
    </span>
  );
}

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const orbY1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const orbY2 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.8], [1, 0.96]);

  // Close the mobile menu on Escape or when clicking outside the nav.
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    const handleClickOutside = (e: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("pointerdown", handleClickOutside);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("pointerdown", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col transition-colors">
      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="border-b border-[var(--border)] sticky top-0 z-50 bg-[var(--bg-primary)]/80 backdrop-blur-md transition-colors"
      >
        <div
          ref={navRef}
          className="relative max-w-6xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between"
        >
          <Logo size="sm" />
          <div className="flex items-center gap-2">
            {/* GitHub star — hidden on small screens to prevent nav overflow */}
            <div className="hidden sm:flex items-center gap-2">
              <GitHubStar variant="badge" />
              <div className="w-px h-5 bg-[var(--border)]" />
            </div>
            <ThemeToggle iconOnly />
            {/* Docs link — hidden on small screens to prevent nav overflow */}
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-px h-5 bg-[var(--border)]" />
              <Link href="/docs">
                <Button variant="ghost" size="sm">
                  Docs
                </Button>
              </Link>
            </div>
            <Link href="/analyze">
              <Button size="sm">
                <Sparkles className="w-4 h-4" />
                Analyze<span className="hidden sm:inline">&nbsp;Resume</span>
              </Button>
            </Link>
            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="sm:hidden flex items-center justify-center w-9 h-9 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] hover:border-[var(--border-hover)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--text-primary)] focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)]"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-menu"
              aria-haspopup="menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile dropdown menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                id="mobile-nav-menu"
                role="navigation"
                aria-label="Main menu"
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                className="absolute top-full left-0 right-0 sm:hidden mt-2 rounded-xl border border-[var(--border)] bg-[var(--bg-primary)]/95 backdrop-blur-lg shadow-xl max-h-[70vh] overflow-y-auto origin-top"
              >
                <div className="p-2 space-y-1">
                  <Link
                    href="/docs"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3.5 py-3 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
                  >
                    <BookOpen className="w-4 h-4" />
                    Documentation
                  </Link>
                  <Link
                    href="/about"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3.5 py-3 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
                  >
                    <Info className="w-4 h-4" />
                    About
                  </Link>
                  <div className="my-1 border-t border-[var(--border)]" />
                  <a
                    href="https://github.com/sujalsubedi06/ResumeIQ"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3.5 py-3 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
                  >
                    <GithubIcon className="w-4 h-4" />
                    GitHub
                    <ExternalLink className="w-3.5 h-3.5 ml-auto text-[var(--text-muted)]" />
                  </a>
                  <a
                    href="https://sujalsubedi.name.np"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3.5 py-3 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Portfolio
                    <ExternalLink className="w-3.5 h-3.5 ml-auto text-[var(--text-muted)]" />
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      {/* Hero Section with Animated Gradient Orbs */}
      <section ref={heroRef} className="relative overflow-hidden">
        {/* Animated Gradient Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={orbFloat(0)}
            className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-[0.04] will-change-transform"
            style={{
              background: "radial-gradient(circle, #F2F2F0 0%, transparent 70%)",
              y: orbY1,
            }}
          />
          <motion.div
            animate={orbFloat(2)}
            className="absolute top-20 right-0 w-[400px] h-[400px] rounded-full opacity-[0.03] will-change-transform"
            style={{
              background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)",
              y: orbY2,
            }}
          />
          <motion.div
            animate={orbFloat(4)}
            className="absolute -bottom-20 left-1/3 w-[350px] h-[350px] rounded-full opacity-[0.025] will-change-transform"
            style={{
              background: "radial-gradient(circle, #22c55e 0%, transparent 70%)",
            }}
          />
        </div>

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(242,242,240,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(242,242,240,0.1) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="relative max-w-6xl mx-auto px-4 sm:px-8 pt-20 pb-20 lg:pt-32 lg:pb-28"
        >
          <div className="max-w-3xl space-y-8">
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-xs text-[var(--text-secondary)] transition-colors"
              >
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring" as const, stiffness: 500, damping: 15, delay: 0.3 }}
                  className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                  style={{ boxShadow: "0 0 8px rgba(34,197,94,0.4)" }}
                />
                Free • No account required • No data stored
              </motion.div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.1] text-balance">
                <AnimatedText text="Analyze your resume" />
                <br />
                <span className="text-[var(--text-muted)]">
                  <AnimatedText text="with engineering precision" />
                </span>
              </h1>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="text-lg text-[var(--text-secondary)] leading-relaxed max-w-2xl"
            >
              ResumeIQ evaluates your resume structure, ATS compatibility, skills
              coverage, and content quality — then delivers clear, actionable
              improvement recommendations.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto"
            >
              <motion.div
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={springSnappy}
                className="w-full sm:w-auto"
              >
                <Link href="/analyze" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto">
                    <Sparkles className="w-4 h-4" />
                    Start Analysis
                    <MoveRight className="w-4 h-4" />
                  </Button>
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={springSnappy}
                className="w-full sm:w-auto"
              >
                <Link href="/docs" className="w-full sm:w-auto">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    Read Documentation
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="cv-auto border-t border-[var(--border)] bg-[var(--bg-surface)] transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center space-y-3 mb-16"
          >
            <h2 className="text-2xl font-semibold tracking-tight">
              How it works
            </h2>
            <p className="text-[var(--text-muted)] max-w-lg mx-auto">
              Three simple steps to understand your resume performance.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainerDramatic}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                variants={fadeUpItem}
                className="text-center space-y-4 relative group"
              >
                {/* Connecting line between steps with hover glow */}
                {index < steps.length - 1 && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute hidden md:block opacity-60 group-hover:opacity-100 transition-all duration-500"
                    style={{
                      left: 'calc(50% + 35px)',
                      top: '28px',
                      width: 'calc(100% - 70px)',
                      height: '1px',
                      background: 'linear-gradient(90deg, var(--border) 0%, var(--border) 100%)',
                      transformOrigin: 'left center',
                    }}
                    whileHover={{
                      height: '2px',
                      background: 'linear-gradient(90deg, var(--text-muted) 0%, var(--text-secondary) 50%, var(--text-muted) 100%)',
                      transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
                    }}
                  />
                )}

                <motion.div
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  transition={springBouncy}
                  className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] font-mono text-sm font-semibold text-[var(--text-secondary)] relative transition-colors z-10"
                >
                  {step.step}
                </motion.div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[var(--text-muted)]">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="cv-auto border-t border-[var(--border)] transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center space-y-3 mb-16"
          >
            <h2 className="text-2xl font-semibold tracking-tight">
              What we analyze
            </h2>
            <p className="text-[var(--text-muted)] max-w-lg mx-auto">
              Six key areas evaluated to give you a comprehensive understanding
              of your resume quality.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainerDramatic}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  variants={fadeUpItem}
                  whileHover={{ y: -6, transition: { type: "spring" as const, stiffness: 400, damping: 25 } }}
                  className="group bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-6 hover:border-[var(--border-hover)] transition-colors relative overflow-hidden"
                >
                  {/* Subtle hover glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-[radial-gradient(600px_circle_at_var(--mouse-x)_var(--mouse-y),rgba(242,242,240,0.02),transparent_40%)]" />
                  <div className="space-y-4 relative z-10">
                    <motion.div
                      whileHover={{ rotate: 8, scale: 1.15 }}
                      transition={springBouncy}
                      className="p-2.5 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg inline-flex"
                    >
                      <Icon className="w-5 h-5 text-[var(--text-secondary)]" />
                    </motion.div>
                    <div className="space-y-2">
                      <h3 className="text-base font-semibold text-[var(--text-primary)]">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Privacy Section */}
      <section className="cv-auto border-t border-[var(--border)] bg-[var(--bg-surface)] transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl mx-auto text-center space-y-6"
          >
            <motion.div
              whileHover={{ scale: 1.15, rotate: 12 }}
              transition={springBouncy}
              className="inline-flex items-center justify-center p-3 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl transition-colors"
            >
              <Shield className="w-6 h-6 text-[var(--text-secondary)]" />
            </motion.div>
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold tracking-tight">
                Your data stays private
              </h2>
              <p className="text-[var(--text-muted)] leading-relaxed">
                ResumeIQ processes your resume entirely in memory. Files are never
                stored, uploaded to external services, or retained after analysis.
                Upload, analyze, and leave — no traces left behind.
              </p>
            </div>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-sm text-[var(--text-muted)]"
            >
              {[
                "In-memory processing",
                "No database",
                "Instant deletion",
              ].map((text) => (
                <motion.div
                  key={text}
                  variants={fadeUpItem}
                  className="flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="cv-auto border-t border-[var(--border)] transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-20 text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-semibold tracking-tight">
              Ready to improve your resume?
            </h2>
            <p className="text-[var(--text-muted)] max-w-md mx-auto">
              Get a detailed analysis in seconds. No sign-up required.
            </p>
            <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }} transition={springSnappy}>
              <Link href="/analyze">
                <Button size="lg">
                  <Sparkles className="w-4 h-4" />
                  Analyze Your Resume
                  <MoveRight className="w-4 h-4" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>



      {/* Footer */}
      <Footer />
    </div>
  );
}
