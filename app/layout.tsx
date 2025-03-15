import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import ProgressBarProvider from "@/contexts/progressbar";
import { ThemeProvider } from "@/contexts/theme";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s • Human Right Edu",
    default: "Human Right Edu",
  },
  description: "Human Right Edu",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${inter.variable} ${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <ProgressBarProvider>
            <main>{children}</main>
            <Toaster richColors />
          </ProgressBarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
