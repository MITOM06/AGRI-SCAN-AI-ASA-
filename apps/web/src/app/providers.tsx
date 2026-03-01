"use client";

/**
 * Providers - Wrap all context providers cho App
 */

import { ReactNode } from "react";
import { AuthProvider } from "@/hooks/useAuth";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return <AuthProvider>{children}</AuthProvider>;
}
