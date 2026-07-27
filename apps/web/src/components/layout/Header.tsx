/**
 * Header Component - Navigation header cho website
 */

"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useT } from "@/context/I18nContext";
import { Button, LanguageSwitcher } from "@/components/common";
import { APP_NAME } from "@agri-scan/shared";

export function Header() {
  const t = useT();
  const { user, isAuthenticated, logout, isLoading } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">🌿</span>
            <span className="text-xl font-bold text-green-600">{APP_NAME}</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/scan"
              className="text-gray-600 hover:text-green-600 transition-colors"
            >
              {t("nav.scan")}
            </Link>
            <Link
              href="/plants"
              className="text-gray-600 hover:text-green-600 transition-colors"
            >
              {t("nav.plantDictionary")}
            </Link>
            <Link
              href="/diseases"
              className="text-gray-600 hover:text-green-600 transition-colors"
            >
              {t("nav.diseaseDictionary")}
            </Link>
            {isAuthenticated && (
              <Link
                href="/history"
                className="text-gray-600 hover:text-green-600 transition-colors"
              >
                {t("nav.history")}
              </Link>
            )}
          </nav>

          {/* Auth buttons */}
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            {isLoading ? (
              <div className="h-10 w-24 bg-gray-200 animate-pulse rounded-lg" />
            ) : isAuthenticated ? (
              <>
                <span className="text-sm text-gray-600">
                  {t("nav.greeting", { name: user?.fullName ?? "" })}
                </span>
                <Button variant="outline" size="sm" onClick={logout}>
                  {t("nav.logout")}
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    {t("nav.login")}
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="sm">
                    {t("nav.register")}
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
