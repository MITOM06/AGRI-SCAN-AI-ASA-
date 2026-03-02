"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { Navbar } from "@/components/layout/Navbar";

interface LayoutClientProps {
  children: ReactNode;
}

export function LayoutClient({ children }: LayoutClientProps) {
  const pathname = usePathname();
  const isScanner = pathname === "/scan";

  return (
    <div
      className={
        isScanner
          ? "min-h-screen bg-white font-sans"
          : "min-h-screen bg-gray-50 font-sans"
      }
    >
      <Navbar />
      <main>{children}</main>
      {!isScanner && (
        <footer className="bg-white border-t border-gray-100 py-12 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500">
            <p>© 2026 Agri-Scan AI. All rights reserved.</p>
            <p className="text-sm mt-2">
              Website & AI Innovation Contest 2026 - Foundation Track
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}
