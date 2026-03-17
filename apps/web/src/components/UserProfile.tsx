"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "next/navigation";
import {
  User,
  LogOut,
  Settings,
  Leaf,
  Zap,
  Star,
  Crown,
  Calendar,
} from "lucide-react";
import { motion } from "framer-motion";
import { scanApi } from "@agri-scan/shared";

type StatsState = {
  scanCount: number;
  chatCount: number;
  diseaseCount: number;
};

export function UserProfile() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [stats, setStats] = useState<StatsState>({
    scanCount: 0,
    chatCount: 0,
    diseaseCount: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoadingStats(false);
      return;
    }

    let isMounted = true;

    const loadStats = async () => {
      try {
        setLoadingStats(true);

        const [scans, chats] = await Promise.all([
          scanApi.getScanHistory(),
          scanApi.getChatHistory(),
        ]);

        const diseases = new Set(
          scans.flatMap((scan: any) =>
            scan.aiPredictions
              ?.map((prediction: any) => prediction?.diseaseId?.name)
              .filter(Boolean) ?? [],
          ),
        );

        if (!isMounted) return;

        setStats({
          scanCount: scans.length,
          chatCount: chats.length,
          diseaseCount: diseases.size,
        });
      } catch (error) {
        console.error("Load profile stats failed:", error);

        if (!isMounted) return;

        setStats({
          scanCount: 0,
          chatCount: 0,
          diseaseCount: 0,
        });
      } finally {
        if (isMounted) {
          setLoadingStats(false);
        }
      }
    };

    loadStats();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const planBadge = (() => {
    if (user?.plan === "PREMIUM") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold shadow-sm">
          <Star size={12} className="fill-current" />
          Premium
        </span>
      );
    }

    if (user?.plan === "VIP") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold shadow-sm">
          <Crown size={12} className="fill-current" />
          VIP
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-bold shadow-sm">
        <Zap size={12} className="fill-current" />
        Free
      </span>
    );
  })();

  const planIcon = (() => {
    if (user?.plan === "VIP") {
      return <Crown size={18} className="text-amber-500" />;
    }

    if (user?.plan === "PREMIUM") {
      return <Star size={18} className="text-purple-500" />;
    }

    return <Zap size={18} className="text-gray-500" />;
  })();

  const planText = (() => {
    if (user?.plan === "PREMIUM") return "Premium";
    if (user?.plan === "VIP") return "VIP";
    return "Free";
  })();

  const planTextColor =
    user?.plan === "VIP"
      ? "text-amber-600"
      : user?.plan === "PREMIUM"
        ? "text-purple-600"
        : "text-gray-700";

  if (!user) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <p>Vui lòng đăng nhập để xem trang này.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header Background */}
          <div className="h-24 bg-linear-to-r from-primary to-emerald-600 relative">
            <div className="absolute inset-0 opacity-20 pattern-grid-lg"></div>
          </div>

          <div className="px-8 pb-8">
            {/* Avatar & Basic Info */}
            <div className="relative flex flex-col sm:flex-row items-center sm:items-center -mt-12 mb-8 gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-white overflow-hidden">
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                    <User size={40} />
                  </div>
                </div>

                <button className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow-md border border-gray-100 text-gray-500 hover:text-primary transition-colors">
                  <Settings size={16} />
                </button>
              </div>

              <div className="text-center sm:text-left flex-1">
                <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                  <h1 className="text-3xl font-extrabold text-white drop-shadow-md">
                    {user.fullName}
                  </h1>
                  {planBadge}
                </div>
                <p className="text-gray-500 font-medium">{user.email}</p>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm"
              >
                <LogOut size={18} />
                Đăng xuất
              </button>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Stats / Sidebar */}
              <div className="space-y-6">
                {/* Plan Info Card */}
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    {planIcon}
                    Gói dịch vụ hiện tại
                  </h3>

                  <div className="mb-4">
                    <span className={`text-2xl font-bold ${planTextColor}`}>
                      {planText}
                    </span>

                    {user.planExpiresAt && (
                      <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1">
                        <Calendar size={14} />
                        Hết hạn:{" "}
                        {new Date(user.planExpiresAt).toLocaleDateString("vi-VN")}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => router.push("/upgrade")}
                    className="w-full py-2.5 bg-emerald-50 text-emerald-700 font-semibold rounded-lg hover:bg-emerald-100 transition-colors text-sm border border-emerald-200"
                  >
                    Nâng cấp gói
                  </button>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Leaf size={18} className="text-primary" />
                    Thống kê
                  </h3>

                  {loadingStats ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Cây đã quét</span>
                        <span className="font-bold text-gray-400">...</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Bệnh phát hiện</span>
                        <span className="font-bold text-gray-400">...</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Đoạn chat</span>
                        <span className="font-bold text-gray-400">...</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Cây đã quét</span>
                        <span className="font-bold text-gray-900">
                          {stats.scanCount}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Bệnh phát hiện
                        </span>
                        <span className="font-bold text-gray-900">
                          {stats.diseaseCount}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Đoạn chat</span>
                        <span className="font-bold text-gray-900">
                          {stats.chatCount}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Main Content Area */}
              <div className="md:col-span-2 space-y-6">
                <div className="bg-white border border-gray-100 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Hoạt động gần đây
                  </h3>

                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
                      >
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-primary shrink-0">
                          <Leaf size={24} />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            Chẩn đoán bệnh Đốm lá
                          </h4>
                          <p className="text-sm text-gray-500 mt-1">
                            Cây Cà chua • 2 giờ trước
                          </p>
                          <div className="mt-2 flex gap-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-md bg-red-50 text-red-700 text-xs font-medium">
                              Nguy cơ cao
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button className="w-full mt-4 py-2 text-sm text-primary font-medium hover:text-primary-dark transition-colors">
                    Xem tất cả hoạt động
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}