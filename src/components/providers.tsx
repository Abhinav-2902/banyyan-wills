"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <NextThemesProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        forcedTheme="light"
        disableTransitionOnChange
      >
        {children}
        <Toaster />
      </NextThemesProvider>
    </SessionProvider>
  );
}
