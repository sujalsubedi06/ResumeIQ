"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Shield,
  Code,
  Eye,
  Target,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Footer } from "@/components/layout/Footer";
import { MobileHeader, Sidebar, MobileNavBar } from "@/components/layout/Sidebar";
import {
  staggerContainer,
  fadeUpItem,
  scrollReveal,
  springSnappy,
  pageTransition,
} from "@/lib/animations";

const principles = [
  {
    icon: Eye,
    title: "Transparency",
    description:
      "Users should understand what was analyzed, why a score was given, and how improvements can be made. No hidden logic.",
  },
  {
    icon: Target,
    title: "Precision",
    description:
      "Recommendations are based on measurable resume characteristics, not vague suggestions or AI-generated content.",
  },
  {
    icon: Code,
    title: "Simplicity",
    description:
      "The product feels like a professional developer tool — focused, technical, and free from marketing-heavy patterns.",
  },
];

const techStack = [
  {
    category: "Frontend",
    items: ["Next.js 15", "TypeScript", "Tailwind CSS v4", "Lucide Icons"],
  },
  {
    category: "Backend",
    items: ["FastAPI", "Python 3", "PyMuPDF", "python-docx", "Pydantic v2"],
  },
  {
    category: "Architecture",
    items: [
      "Feature-based structure",
      "Clean Architecture",
      "Stateless processing",
      "In-memory only",
    ],
  },
];

export default function AboutPage() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors">
      <MobileHeader onMenuOpen={() => setMobileOpen(true)} />

      {/* h-dvh gives the app shell a definite height so main's overflow-y-auto
          becomes the real scroller (same fix as the docs page). The footer is
          inside main so it scrolls with the content instead of creating a
          second document-level scroll area below the fold. */}
      <div className="flex flex-col lg:flex-row h-dvh">
        <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

        <main className="flex-1 overflow-y-auto">
          <div className="px-4 pt-20 pb-8 lg:px-12 lg:pt-12 lg:pb-12">
            <motion.div
              initial="initial"
              animate="animate"
              variants={pageTransition}
              className="max-w-4xl mx-auto space-y-16"
            >
            {/* Header */}
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="text-3xl font-semibold tracking-tight"
              >
                About ResumeIQ
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="text-[var(--text-secondary)] text-lg leading-relaxed max-w-2xl"
              >
                ResumeIQ is a precision resume analysis platform designed to help
                candidates understand, measure, and improve their resume quality
                through structured ATS evaluation.
              </motion.p>
            </div>

            {/* Mission */}
            <motion.div {...scrollReveal} className="space-y-4">
              <h2 className="text-xl font-semibold tracking-tight">Mission</h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Help people create stronger professional identities by providing
                transparent, structured, and actionable resume analysis. A resume
                should not be judged by guesswork — candidates deserve clear
                feedback about what works, what fails, and what can improve.
              </p>
            </motion.div>

            {/* Principles */}
            <div className="space-y-6">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-xl font-semibold tracking-tight"
              >
                Principles
              </motion.h2>
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                className="grid grid-cols-1 md:grid-cols-3 gap-5"
              >
                {principles.map((principle) => {
                  const Icon = principle.icon;
                  return (
                    <motion.div key={principle.title} variants={fadeUpItem}>
                      <Card>
                        <div className="space-y-4">
                          <motion.div
                            whileHover={{ rotate: 5, scale: 1.1 }}
                            transition={springSnappy}
                            className="p-2.5 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg inline-flex"
                          >
                            <Icon className="w-5 h-5 text-[var(--text-secondary)]" />
                          </motion.div>
                          <div className="space-y-2">
                            <h3 className="text-base font-semibold text-[var(--text-primary)]">
                              {principle.title}
                            </h3>
                            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                              {principle.description}
                            </p>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>

            {/* What ResumeIQ Is Not */}
            <motion.div {...scrollReveal} className="space-y-4">
              <h2 className="text-xl font-semibold tracking-tight">
                What ResumeIQ is not
              </h2>
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              >
                {[
                  "An AI resume writer",
                  "A resume template marketplace",
                  "A career chatbot",
                  "A generic SaaS dashboard",
                  "A replacement for human judgment",
                  "A subscription-based service",
                ].map((item) => (
                  <motion.div
                    key={item}
                    variants={fadeUpItem}
                    className="flex items-center gap-3 p-3 bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg"
                  >
                    <span className="text-[var(--text-muted)]">✗</span>
                    <span className="text-sm text-[var(--text-secondary)]">{item}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Tech Stack */}
            <div className="space-y-6">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-xl font-semibold tracking-tight"
              >
                Tech Stack
              </motion.h2>
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                className="grid grid-cols-1 md:grid-cols-3 gap-5"
              >
                {techStack.map((stack) => (
                  <motion.div key={stack.category} variants={fadeUpItem}>
                    <Card>
                      <div className="space-y-4">
                        <h3 className="text-xs font-semibold tracking-wider text-[var(--text-muted)] uppercase">
                          {stack.category}
                        </h3>
                        <div className="space-y-2">
                          {stack.items.map((item) => (
                            <div
                              key={item}
                              className="flex items-center gap-2 text-sm text-[var(--text-secondary)]"
                            >
                              <span className="w-1 h-1 rounded-full bg-[var(--text-muted)]" />
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Privacy */}
            <motion.div
              {...scrollReveal}
              className="space-y-4 p-8 bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl"
            >
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={springSnappy}
                >
                  <Shield className="w-5 h-5 text-emerald-400" />
                </motion.div>
                <h2 className="text-xl font-semibold tracking-tight">
                  Privacy-First Design
                </h2>
              </div>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                ResumeIQ is intentionally stateless. The system does not store user
                information, resumes, or analysis history. Every file is processed
                in memory and discarded immediately after the analysis response is
                returned. No database. No tracking. No persistence.
              </p>
            </motion.div>

            {/* CTA */}
            <motion.div
              {...scrollReveal}
              className="text-center space-y-6 py-8"
            >
              <h2 className="text-2xl font-semibold tracking-tight">
                Try ResumeIQ
              </h2>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={springSnappy}>
                <Link href="/analyze">
                  <Button size="lg">
                    <Sparkles className="w-4 h-4" />
                    Analyze Your Resume
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
          </div>

          <Footer />

          {/* Clear the fixed mobile tab bar so it never covers the footer */}
          <div data-testid="about-mobile-spacer" className="h-[calc(4rem+env(safe-area-inset-bottom))] lg:hidden" aria-hidden="true" />
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <MobileNavBar />
    </div>
  );
}
