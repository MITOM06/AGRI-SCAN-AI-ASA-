"use client";

import React from "react";
import Link from "next/link";
import { Leaf, Menu, X, Search, User } from "lucide-react";
import { useState } from "react";
import { cn } from "@agri-scan/shared";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Trang chủ", path: "/" },
    { name: "Chẩn đoán AI", path: "/scan" },
    { name: "Từ điển cây", path: "/encyclopedia" },
    { name: "Cộng đồng", path: "/community" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 sm:h-16 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-lg sm:rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/30">
              <Leaf size={20} className="sm:size-6" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 leading-none">
                Agri-Scan AI
              </h1>
              <span className="text-xs text-primary font-medium tracking-wider">
                BÁC SĨ CÂY TRỒNG
              </span>
            </div>
            <div className="block sm:hidden">
              <h1 className="text-lg font-bold text-gray-900 leading-none">
                Agri-Scan
              </h1>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className="text-gray-600 hover:text-primary font-medium transition-colors text-sm"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <button className="p-2 text-gray-500 hover:text-primary transition-colors">
              <Search size={20} />
            </button>
            <button className="px-4 py-2 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary-dark transition-colors shadow-md shadow-primary/20">
              Đăng nhập
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-600 hover:text-primary transition-colors touch-manipulation"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-b border-gray-100 absolute w-full shadow-lg">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className="block px-4 py-4 rounded-xl text-base font-medium text-gray-700 hover:text-primary hover:bg-green-50 transition-colors touch-manipulation"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-gray-100 mt-4 space-y-3">
              <button className="w-full px-4 py-3 bg-gray-100 text-gray-600 rounded-xl font-medium text-center flex items-center justify-center gap-2 touch-manipulation">
                <Search size={18} />
                Tìm kiếm
              </button>
              <button className="w-full px-4 py-3 bg-primary text-white rounded-xl font-medium text-center touch-manipulation">
                Đăng nhập
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
