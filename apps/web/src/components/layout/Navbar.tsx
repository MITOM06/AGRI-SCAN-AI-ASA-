"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Leaf, Menu, X, User, LogOut, ChevronDown, Zap, ScanSearch, BookOpen, CloudSun } from "lucide-react";
import { cn } from "@agri-scan/shared";
import { useAuth } from "../../hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const toolsMenuRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { name: "Trang chủ", path: "/" },
    { name: "Giới thiệu", path: "/about" },
    { name: "Cộng đồng", path: "/community" },
  ];

  const toolItems = [
    { name: 'Chẩn đoán AI', path: '/scan', icon: ScanSearch, desc: 'Nhận diện bệnh cây trồng' },
    { name: 'Từ điển cây', path: '/encyclopedia', icon: BookOpen, desc: 'Tra cứu thông tin cây' },
    { name: 'Thời tiết', path: '/weather', icon: CloudSun, desc: 'Dự báo nông nghiệp' },
  ];

  const isToolActive = toolItems.some(item => pathname.startsWith(item.path));

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) setIsUserMenuOpen(false);
      if (toolsMenuRef.current && !toolsMenuRef.current.contains(event.target as Node)) setIsToolsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setIsToolsOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    router.push("/");
  };

  const isActive = (path: string) => path === "/" ? pathname === "/" : pathname.startsWith(path);

  return (
    <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-md shadow-gray-200/60 border-b border-gray-100"
          : "bg-white/80 backdrop-blur-sm border-b border-gray-100/60",
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center gap-6">
          
          {/* LOGO - GIỮ NGUYÊN GỐC */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white shadow-md shadow-primary/30">
              <Leaf size={20} />
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900 leading-none tracking-tight">Agri-Scan AI</h1>
              <span className="text-[10px] text-primary font-semibold tracking-widest uppercase">Bác sĩ cây trồng</span>
            </div>
          </Link>

          {/* CHỈ CHỈNH SỬA PHẦN NÀY: NAVIGATION GIỮA */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className={cn(
                  "relative flex items-center h-10 px-4 rounded-xl text-sm font-bold transition-all duration-200",
                  isActive(item.path)
                    ? "text-primary bg-primary/10"
                    : "text-gray-600 hover:text-primary hover:bg-gray-50",
                )}
              >
                {item.name}
                {isActive(item.path) && (
                  <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </Link>
            ))}

            {/* Dropdown Tiện ích - Đồng bộ độ cao h-10 và màu chữ */}
            <div className="relative" ref={toolsMenuRef}>
              <button
                onClick={() => setIsToolsOpen(!isToolsOpen)}
                className={cn(
                  "relative flex items-center h-10 px-4 rounded-xl text-sm font-bold transition-all duration-200 gap-1.5 cursor-pointer",
                  isToolActive || isToolsOpen 
                    ? "text-primary bg-primary/10" 
                    : "text-gray-600 hover:text-primary hover:bg-gray-50",
                )}
              >
                Tiện ích
                <ChevronDown size={14} className={cn("transition-transform duration-300", isToolsOpen && "rotate-180")} />
                {isToolActive && !isToolsOpen && (
                  <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary " />
                )}
              </button>

              <AnimatePresence>
                {isToolsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50"
                  >
                    <div className="flex flex-col gap-1">
                      {toolItems.map((item) => (
                        <Link
                          key={item.name}
                          href={item.path}
                          className={cn(
                            "flex items-center gap-3.5 p-3 rounded-xl transition-all",
                            pathname === item.path ? "bg-primary/5" : "hover:bg-gray-50"
                          )}
                        >
                          <div className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                            pathname === item.path ? "bg-primary text-white" : "bg-gray-100 text-gray-500"
                          )}>
                            <item.icon size={20} />
                          </div>
                          <div className="text-left flex flex-col">
                            <div className={cn("text-sm font-bold", pathname === item.path ? "text-primary" : "text-gray-900")}>
                              {item.name}
                            </div>
                            <p className="text-[11px] text-gray-500 font-medium leading-tight mt-1">{item.desc}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ACTIONS - GIỮ NGUYÊN GỐC */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
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

            <div className="w-px h-5 bg-gray-200 mx-1" />

            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-full hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200 focus:outline-none"
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-primary border-2 shadow-sm"
                    style={{
                      borderColor: user.plan === "VIP" ? "#fbbf24" : user.plan === "PREMIUM" ? "#a855f7" : "transparent",
                      backgroundColor: user.plan === "VIP" ? "#fffbeb" : user.plan === "PREMIUM" ? "#faf5ff" : undefined,
                    }}
                  >
                    <User size={15} />
                  </div>
                  <span className="text-sm font-medium text-gray-700 max-w-30 truncate">{user.fullName}</span>
                  <ChevronDown size={13} className={cn("text-gray-400 transition-transform duration-200", isUserMenuOpen && "rotate-180")} />
                </button>
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

          {/* MOBILE - GIỮ NGUYÊN GỐC */}
          <div className="lg:hidden flex items-center gap-2">
            <Link href="/scan" className="flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-semibold hover:bg-primary hover:text-white transition-all">
              <Zap size={14} />
              <span className="hidden xs:inline">Chẩn đoán</span>
            </Link>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors">
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}