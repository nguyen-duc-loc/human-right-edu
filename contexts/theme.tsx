"use client";

import dynamic from "next/dynamic";
import React from "react";

const NextThemesProvider = dynamic(
  async () => (await import("next-themes")).ThemeProvider,
  {
    ssr: false,
  }
);

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
