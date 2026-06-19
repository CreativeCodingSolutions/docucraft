import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DocuCraft — Auto-Generate PR Descriptions from GitHub Diffs",
  description:
    "DocuCraft automatically generates structured PR descriptions from your GitHub pull request diffs. Zero config, no API keys needed for template mode. Free and open source.",
  keywords: [
    "auto generate PR description github action",
    "github action pr description generator",
    "automatic pull request description",
    "pr description generator",
    "github actions documentation",
    "docucraft",
  ],
  openGraph: {
    title: "DocuCraft — Auto-Generate PR Descriptions from GitHub Diffs",
    description:
      "Auto-generate structured PR descriptions from git diffs. Zero config, no API keys. Free and open source GitHub Action.",
    url: "https://creativecodingsolutions.github.io/docucraft/",
    siteName: "DocuCraft",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DocuCraft — Auto PR Descriptions",
    description:
      "Auto-generate structured PR descriptions from git diffs. Zero config, no API keys needed.",
  },
  robots: {
    index: true,
    follow: true,
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
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "DocuCraft",
              applicationCategory: "DeveloperApplication",
              operatingSystem: "Linux, macOS, Windows",
              description:
                "Automatically generates structured PR descriptions from GitHub pull request diffs. Zero config, no API keys needed for template mode.",
              url: "https://creativecodingsolutions.github.io/docucraft/",
              author: {
                "@type": "Organization",
                name: "CreativeCodingSolutions",
              },
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-background font-sans">
        <ThemeProvider defaultTheme="system" storageKey="docucraft-theme">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
