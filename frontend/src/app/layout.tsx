import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/lib/theme";
import { PageTransition } from "@/components/layout/PageTransition";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

// Theme the mobile browser chrome (address bar / status bar) to match the app.
// The media-query variants follow the same logic as the ThemeProvider + the
// inline FOUC-prevention script below.
export const viewport: Viewport = {
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

export const metadata: Metadata = {
  title: "ResumeIQ — Precision Resume Analysis",
  description:
    "Analyze your resume against ATS compatibility standards with engineering-level precision. Get structured feedback, skills analysis, and actionable recommendations.",
  keywords: ["resume", "ATS", "analysis", "resume review", "job application"],
  openGraph: {
    title: "ResumeIQ — Precision Resume Analysis",
    description:
      "Analyze your resume against ATS compatibility standards with engineering-level precision.",
    siteName: "ResumeIQ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ResumeIQ — Precision Resume Analysis",
    description:
      "Analyze your resume against ATS compatibility standards with engineering-level precision.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <PageTransition>{children}</PageTransition>
        </ThemeProvider>
      </body>
    </html>
  );
}
