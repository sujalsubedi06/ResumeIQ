"use client";

import React from "react";
import { motion } from "framer-motion";
import { springNatural } from "@/lib/animations";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = "", hover = false }: CardProps) {
  if (hover) {
    return (
      <motion.div
        whileHover={{ y: -4, transition: springNatural }}
        className={`bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-6 hover:border-[var(--border-hover)] transition-colors ${className}`}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div
      className={`bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-6 ${className}`}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className = "" }: CardHeaderProps) {
  return (
    <div className={`space-y-1.5 ${className}`}>{children}</div>
  );
}

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function CardTitle({ children, className = "" }: CardTitleProps) {
  return (
    <h3 className={`text-base font-semibold text-[var(--text-primary)] ${className}`}>
      {children}
    </h3>
  );
}

interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export function CardDescription({ children, className = "" }: CardDescriptionProps) {
  return (
    <p className={`text-sm text-[var(--text-secondary)] ${className}`}>{children}</p>
  );
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className = "" }: CardContentProps) {
  return <div className={className}>{children}</div>;
}
