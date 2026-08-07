"use client";

import React from "react";
import { Logo } from "@/components/ui/Logo";
import { GitHubStar } from "@/components/ui/GitHubStar";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-primary)] transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <Logo size="sm" />
            <p className="text-sm text-[var(--text-muted)] max-w-sm leading-relaxed">
              Precision resume analysis platform. Understand how your resume
              performs against ATS compatibility standards before applying.
            </p>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold tracking-wider text-[var(--text-muted)] uppercase">
              Product
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="/analyze"
                  className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  Analyze Resume
                </a>
              </li>
              <li>
                <a
                  href="/docs"
                  className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  About
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold tracking-wider text-[var(--text-muted)] uppercase">
              Privacy
            </h4>
            <ul className="space-y-2.5">
              <li>
                <span className="text-sm text-[var(--text-muted)]">
                  Files are processed in-memory
                </span>
              </li>
              <li>
                <span className="text-sm text-[var(--text-muted)]">
                  No data is stored permanently
                </span>
              </li>
              <li>
                <span className="text-sm text-[var(--text-muted)]">
                  Deleted after analysis
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--text-muted)]">
            ResumeIQ — Engineering-level resume analysis
          </p>
          <div className="flex items-center gap-4">
            <GitHubStar variant="minimal" />
            <p className="text-xs text-[var(--text-muted)] font-mono">v1.0.0</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
