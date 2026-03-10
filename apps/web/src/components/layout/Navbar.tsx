"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Leaf, Menu, X, User, LogOut, ChevronDown, Zap } from "lucide-react";
import { cn } from "@agri-scan/shared";
import { useAuth } from "../../hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const userMenuRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { name: "Trang chủ", path: "/" },
    { name: "Giới thiệu", path: "/about" },
    { name: "Từ điển cây", path: "/encyclopedia" },
    { name: "Cộng đồng", path: "/community" },
  ];

  // Scroll detection for shadow effect
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    router.push("/");
  };

  const isActive = (path: string) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-md shadow-gray-200/60 border-b border-gray-100"
          : "bg-white/80 backdrop-blur-sm border-b border-gray-100/60",
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white shadow-md shadow-primary/30">
              <Leaf size={20} />
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900 leading-none tracking-tight">
                Agri-Scan AI
              </h1>
              <span className="text-[10px] text-primary font-semibold tracking-widest uppercase">
                Bác sĩ cây trồng
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className={cn(
                  "relative px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive(item.path)
                    ? "text-primary bg-primary/8"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
                )}
              >
                {item.name}
                {isActive(item.path) && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                )}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            {/* CTA Scan button */}
            <Link
              href="/scan"
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200",
                isActive("/scan")
                  ? "bg-primary text-white shadow-md shadow-primary/30"
                  : "bg-primary/10 text-primary hover:bg-primary hover:text-white hover:shadow-md hover:shadow-primary/30",
              )}
            >
              <Zap size={15} />
              Chẩn đoán AI
            </Link>

            {/* Divider */}
            <div className="w-px h-5 bg-gray-200 mx-1" />

            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-full hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200 focus:outline-none"
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-primary border-2
                    ${user.plan === 'VIP' ? 'border-amber-400 bg-amber-50' : user.plan === 'PREMIUM' ? 'border-purple-400 bg-purple-50' : 'bg-primary/10 border-transparent'}"
                    style={{
                      borderColor:
                        user.plan === "VIP"
                          ? "#fbbf24"
                          : user.plan === "PREMIUM"
                            ? "#a855f7"
                            : "transparent",
                      backgroundColor:
                        user.plan === "VIP"
                          ? "#fffbeb"
                          : user.plan === "PREMIUM"
                            ? "#faf5ff"
                            : undefined,
                    }}
                  >
                    <User size={15} />
                  </div>
                  <span className="text-sm font-medium text-gray-700 max-w-30 truncate">
                    {user.fullName}
                  </span>
                  <ChevronDown
                    size={13}
                    className={cn(
                      "text-gray-400 transition-transform duration-200",
                      isUserMenuOpen && "rotate-180",
                    )}
                  />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2.5 border-b border-gray-50">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {user.fullName}
                      </p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">
                        {user.email}
                      </p>
                    </div>
                    <div className="py-1">
                      <Link
                        href="/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                      >
                        <User size={15} />
                        Hồ sơ của tôi
                      </Link>
                    </div>
                    <div className="border-t border-gray-50 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors text-left"
                      >
                        <LogOut size={15} />
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 bg-primary text-white rounded-full text-sm font-semibold hover:bg-primary-dark transition-all shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/30"
              >
                Đăng nhập
              </Link>
            )}
          </div>

          {/* Mobile: scan shortcut + hamburger */}
          <div className="lg:hidden flex items-center gap-2">
            <Link
              href="/scan"
              className="flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-semibold hover:bg-primary hover:text-white transition-all"
            >
              <Zap size={14} />
              <span className="hidden xs:inline">Chẩn đoán</span>
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "lg:hidden overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "max-h-125 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="bg-white border-t border-gray-100 shadow-lg px-4 pt-3 pb-5">
          <div className="space-y-0.5 mb-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className={cn(
                  "flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                  isActive(item.path)
                    ? "text-primary bg-primary/8 font-semibold"
                    : "text-gray-700 hover:text-primary hover:bg-gray-50",
                )}
              >
                {isActive(item.path) && (
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2.5 shrink-0" />
                )}
                {item.name}
              </Link>
            ))}
            <Link
              href="/scan"
              className={cn(
                "flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-colors",
                isActive("/scan")
                  ? "text-primary bg-primary/8"
                  : "text-gray-700 hover:text-primary hover:bg-gray-50",
              )}
            >
              <Zap size={15} className="text-primary" />
              Chẩn đoán AI
            </Link>
          </div>

          <div className="border-t border-gray-100 pt-4 space-y-2">
            {user ? (
              <>
                <Link
                  href="/profile"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <User size={15} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {user.fullName}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {user.email}
                    </p>
                  </div>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <LogOut size={16} />
                  Đăng xuất
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="block w-full px-4 py-3 bg-primary text-white rounded-xl font-semibold text-center text-sm shadow-md shadow-primary/25"
              >
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
