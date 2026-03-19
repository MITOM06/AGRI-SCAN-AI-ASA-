"use client";

import React, { useState } from "react";
import {
  Scan,
  TrendingUp,
  Users,
  DollarSign,
  MessageSquare,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardTab from "../../../components/admin/Dashboard";
import UsersTab from "../../../components/admin/Users";
import ReportsTab from "../../../components/admin/Reports";
import FeedbacksTab from "../../../components/admin/Feedbacks";
import { MOCK_DASHBOARD } from "../../../components/admin/mockData";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

type Tab = "dashboard" | "users" | "reports" | "feedbacks";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const { user, logout } = useAuth();
  const router = useRouter();

  const  handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row font-sans">
      <div className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-20">
        <h1 className="text-xl font-bold text-emerald-600 flex items-center gap-2">
          <Scan size={24} />
          AgriScan
        </h1>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="w-full md:w-64 bg-white border-r border-slate-200 flex-shrink-0 fixed md:sticky top-[73px] md:top-0 h-[calc(100vh-73px)] md:h-screen z-10 overflow-y-auto flex flex-col"
          >
            <div className="p-6 border-b border-slate-100 hidden md:block">
              <h1 className="text-2xl font-black text-emerald-600 flex items-center gap-2 tracking-tight">
                <Scan size={28} className="text-emerald-500" />
                AgriScan
              </h1>
              <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-widest ml-9">
                Admin Portal
              </p>
            </div>

            <nav className="p-4 space-y-2 flex-1">
              {[
                { id: "dashboard", icon: TrendingUp, label: "Tổng quan" },
                { id: "users", icon: Users, label: "Người dùng" },
                { id: "reports", icon: DollarSign, label: "Báo cáo" },
                {
                  id: "feedbacks",
                  icon: MessageSquare,
                  label: "Phản hồi",
                  badge: MOCK_DASHBOARD.pendingFeedbacks,
                },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as Tab);
                    if (window.innerWidth < 768) setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                    activeTab === item.id
                      ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                      : "text-slate-600 hover:bg-slate-50 hover:text-emerald-600"
                  }`}
                >
                  <item.icon
                    size={20}
                    className={activeTab === item.id ? "text-white" : "text-slate-400"}
                  />
                  {item.label}
                  {item.badge ? (
                    <span
                      className={`ml-auto text-xs font-black px-2 py-0.5 rounded-md ${
                        activeTab === item.id
                          ? "bg-white text-emerald-600"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              ))}
            </nav>

            <div className="p-4 border-t border-slate-100">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors"
              >
                <LogOut size={18} />
                Đăng xuất
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {activeTab === "dashboard" && <DashboardTab key="dashboard" />}
          {activeTab === "users" && <UsersTab key="users" />}
          {activeTab === "reports" && <ReportsTab key="reports" />}
          {activeTab === "feedbacks" && <FeedbacksTab key="feedbacks" />}
        </AnimatePresence>
      </main>
    </div>
  );
}