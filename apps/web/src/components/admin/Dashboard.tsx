"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  DollarSign,
  Scan,
  MessageSquare,
  TrendingUp,
} from "lucide-react";
import { formatCurrencyVN as formatCurrency } from "@agri-scan/shared";
import { pageVariants } from "@/utils/animation";
import { adminApi, IDashboard, DATE_LOCALES } from "@agri-scan/shared";
import { useI18n } from "@/context/I18nContext";

const EMPTY_DASHBOARD: IDashboard = {
  users: {
    total: 0,
    newToday: 0,
    newThisMonth: 0,
    byPlan: { FREE: 0, PREMIUM: 0, VIP: 0 },
  },
  revenue: { total: 0, thisMonth: 0 },
  pendingFeedbacks: 0,
  totalScans: 0,
};

const iconColorMap = {
  blue: "bg-blue-50 text-blue-600",
  emerald: "bg-emerald-50 text-emerald-600",
  purple: "bg-purple-50 text-purple-600",
  amber: "bg-amber-50 text-amber-600",
} as const;

export default function Dashboard() {
  const { t, locale } = useI18n();
  const [dashboardData, setDashboardData] =
    useState<IDashboard>(EMPTY_DASHBOARD);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await adminApi.getDashboard();
        setDashboardData(data);
      } catch (err) {
        console.error("Load admin dashboard failed:", err);
        const message =
          (err as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || t("admin.dashboardLoadFailed");
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    void loadDashboard();
  }, []);

  if (loading) {
    return <div className="p-6">{t("admin.dashboardLoading")}</div>;
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-red-600">
          {error}
        </div>

        <motion.div
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="space-y-6"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-800">
              {t("admin.dashboardTitle")}
            </h2>
            <span className="text-sm text-slate-500 bg-white px-3 py-1 rounded-full shadow-sm border border-slate-100">
              {t("admin.dashboardUpdatedAt", {
                time: new Date().toLocaleTimeString(DATE_LOCALES[locale]),
              })}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: t("admin.cardTotalUsers"),
                value: dashboardData.users.total.toLocaleString(),
                icon: Users,
                color: "blue" as const,
                sub: t("admin.cardNewThisMonth", {
                  count: dashboardData.users.newThisMonth,
                }),
              },
              {
                title: t("admin.cardRevenueThisMonth"),
                value: formatCurrency(dashboardData.revenue.thisMonth),
                icon: DollarSign,
                color: "emerald" as const,
                sub: t("admin.cardRevenueTotal", {
                  amount: formatCurrency(dashboardData.revenue.total),
                }),
              },
              {
                title: t("admin.cardTotalScans"),
                value: dashboardData.totalScans.toLocaleString(),
                icon: Scan,
                color: "purple" as const,
                sub: t("admin.cardScansStable"),
              },
              {
                title: t("admin.cardPendingFeedback"),
                value: dashboardData.pendingFeedbacks.toLocaleString(),
                icon: MessageSquare,
                color: "amber" as const,
                sub: t("admin.cardNeedsReplySoon"),
              },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                whileHover={{
                  y: -4,
                  boxShadow:
                    "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                }}
                className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {stat.title}
                    </p>
                    <h3 className="text-2xl font-bold text-slate-900 mt-1">
                      {stat.value}
                    </h3>
                  </div>
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconColorMap[stat.color]}`}
                  >
                    <stat.icon size={24} />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  {idx === 0 ? (
                    <TrendingUp size={16} className="text-emerald-500 mr-1" />
                  ) : null}
                  <span
                    className={
                      idx === 0
                        ? "text-emerald-500 font-medium"
                        : "text-slate-500"
                    }
                  >
                    {stat.sub}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              whileHover={{
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)",
              }}
              className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100 transition-all duration-300"
            >
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Users size={20} className="text-emerald-600" />
                {t("admin.planRatio")}
              </h3>
              <div className="space-y-6">
                {[
                  {
                    label: t("admin.planFree"),
                    value: dashboardData.users.byPlan.FREE,
                    color: "bg-slate-300",
                    text: "text-slate-700",
                  },
                  {
                    label: t("admin.planPremium"),
                    value: dashboardData.users.byPlan.PREMIUM,
                    color: "bg-blue-500",
                    text: "text-blue-700",
                  },
                  {
                    label: t("admin.planVip"),
                    value: dashboardData.users.byPlan.VIP,
                    color: "bg-amber-500",
                    text: "text-amber-700",
                  },
                ].map((plan, idx) => (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div
                          className={`w-3 h-3 rounded-full ${plan.color} mr-3`}
                        />
                        <span className={`font-medium ${plan.text}`}>
                          {plan.label}
                        </span>
                      </div>
                      <span className="font-bold text-slate-800">
                        {plan.value.toLocaleString()}
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${
                            dashboardData.users.total
                              ? (plan.value / dashboardData.users.total) * 100
                              : 0
                          }%`,
                        }}
                        transition={{ duration: 1, delay: idx * 0.2 }}
                        className={`${plan.color} h-full rounded-full`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">
          {t("admin.dashboardTitle")}
        </h2>
        <span className="text-sm text-slate-500 bg-white px-3 py-1 rounded-full shadow-sm border border-slate-100">
          {t("admin.dashboardUpdatedAt", {
            time: new Date().toLocaleTimeString(DATE_LOCALES[locale]),
          })}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: t("admin.cardTotalUsers"),
            value: dashboardData.users.total.toLocaleString(),
            icon: Users,
            color: "blue" as const,
            sub: t("admin.cardNewThisMonth", {
              count: dashboardData.users.newThisMonth,
            }),
          },
          {
            title: t("admin.cardRevenueThisMonth"),
            value: formatCurrency(dashboardData.revenue.thisMonth),
            icon: DollarSign,
            color: "emerald" as const,
            sub: t("admin.cardRevenueTotal", {
              amount: formatCurrency(dashboardData.revenue.total),
            }),
          },
          {
            title: t("admin.cardTotalScans"),
            value: dashboardData.totalScans.toLocaleString(),
            icon: Scan,
            color: "purple" as const,
            sub: t("admin.cardScansStable"),
          },
          {
            title: t("admin.cardPendingFeedback"),
            value: dashboardData.pendingFeedbacks.toLocaleString(),
            icon: MessageSquare,
            color: "amber" as const,
            sub: t("admin.cardNeedsReplySoon"),
          },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            whileHover={{
              y: -4,
              boxShadow:
                "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
            }}
            className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {stat.title}
                </p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">
                  {stat.value}
                </h3>
              </div>
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconColorMap[stat.color]}`}
              >
                <stat.icon size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              {idx === 0 ? (
                <TrendingUp size={16} className="text-emerald-500 mr-1" />
              ) : null}
              <span
                className={
                  idx === 0 ? "text-emerald-500 font-medium" : "text-slate-500"
                }
              >
                {stat.sub}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          whileHover={{ boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)" }}
          className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100 transition-all duration-300"
        >
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Users size={20} className="text-emerald-600" />
            {t("admin.planRatio")}
          </h3>
          <div className="space-y-6">
            {[
              {
                label: t("admin.planFree"),
                value: dashboardData.users.byPlan.FREE,
                color: "bg-slate-300",
                text: "text-slate-700",
              },
              {
                label: t("admin.planPremium"),
                value: dashboardData.users.byPlan.PREMIUM,
                color: "bg-blue-500",
                text: "text-blue-700",
              },
              {
                label: t("admin.planVip"),
                value: dashboardData.users.byPlan.VIP,
                color: "bg-amber-500",
                text: "text-amber-700",
              },
            ].map((plan, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div
                      className={`w-3 h-3 rounded-full ${plan.color} mr-3`}
                    />
                    <span className={`font-medium ${plan.text}`}>
                      {plan.label}
                    </span>
                  </div>
                  <span className="font-bold text-slate-800">
                    {plan.value.toLocaleString()}
                  </span>
                </div>

                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${
                        dashboardData.users.total
                          ? (plan.value / dashboardData.users.total) * 100
                          : 0
                      }%`,
                    }}
                    transition={{ duration: 1, delay: idx * 0.2 }}
                    className={`${plan.color} h-full rounded-full`}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}