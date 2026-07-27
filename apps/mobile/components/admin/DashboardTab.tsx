import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { Crown, ScanFace, Star, TrendingUp, Users } from "lucide-react-native";
import {
  formatCurrencyVN as formatCurrency,
  formatNumberVN as formatNumber,
} from "@agri-scan/shared";

import { styles } from "../../styles/admin.styles";
import { useT } from "../../context/I18nContext";

interface DashboardTabProps {
  loading: boolean;
  refreshing: boolean;
  data: any;
}

export function DashboardTab({ loading, refreshing, data }: DashboardTabProps) {
  const t = useT();
  return (
    <View style={styles.tabContent}>
      {loading && !refreshing ? (
        <ActivityIndicator
          size="large"
          color="#16a34a"
          style={{ marginTop: 50 }}
        />
      ) : data ? (
        <>
          <View style={styles.statsRow}>
            <View
              style={[
                styles.statCardMobile,
                { width: "100%", backgroundColor: "#1e293b" },
              ]}
            >
              <View style={styles.statCardHeader}>
                <Text style={[styles.statTitle, { color: "#94a3b8" }]}>
                  {t("admin.mTotalRevenue")}
                </Text>
                <View
                  style={[
                    styles.iconBox,
                    { backgroundColor: "rgba(255,255,255,0.1)" },
                  ]}
                >
                  <TrendingUp size={20} color="#38bdf8" />
                </View>
              </View>
              <Text style={[styles.statValue, { color: "#fff", fontSize: 32 }]}>
                {formatCurrency(data.revenue.total)}
              </Text>
              <Text style={[styles.statTrend, { color: "#4ade80" }]}>
                {t("admin.mRevenueThisMonth", {
                  amount: formatCurrency(data.revenue.thisMonth),
                })}
              </Text>
            </View>

            <View style={styles.halfCard}>
              <View style={styles.statCardHeader}>
                <Text style={styles.statTitle}>{t("admin.mUsers")}</Text>
                <Users size={18} color="#3b82f6" />
              </View>
              <Text style={styles.statValue}>
                {formatNumber(data.users.total)}
              </Text>
              <Text style={styles.statTrend}>
                {t("admin.mNewThisMonth", { count: data.users.newThisMonth })}
              </Text>
            </View>

            <View style={styles.halfCard}>
              <View style={styles.statCardHeader}>
                <Text style={styles.statTitle}>{t("admin.mAiScans")}</Text>
                <ScanFace size={18} color="#a855f7" />
              </View>
              <Text style={styles.statValue}>
                {formatNumber(data.totalScans)}
              </Text>
              <Text style={[styles.statTrend, { color: "#64748b" }]}>
                {t("admin.mAnalyzed")}
              </Text>
            </View>
          </View>

          <View style={styles.cardContainer}>
            <Text style={styles.cardTitle}>{t("admin.mPlanRatio")}</Text>

            <View style={styles.planItem}>
              <View style={styles.planLeft}>
                <View style={[styles.planIcon, { backgroundColor: "#f1f5f9" }]}>
                  <Users size={16} color="#475569" />
                </View>
                <Text style={styles.planText}>
                  {t("admin.mPlanFreeLabel")}
                </Text>
              </View>
              <Text style={styles.planValue}>
                {formatNumber(data.users.byPlan.FREE)}
              </Text>
            </View>

            <View style={styles.planItem}>
              <View style={styles.planLeft}>
                <View style={[styles.planIcon, { backgroundColor: "#dcfce3" }]}>
                  <Star size={16} color="#16a34a" />
                </View>
                <Text style={styles.planText}>{t("admin.planPremium")}</Text>
              </View>
              <Text style={styles.planValue}>
                {formatNumber(data.users.byPlan.PREMIUM)}
              </Text>
            </View>

            <View style={[styles.planItem, { borderBottomWidth: 0 }]}>
              <View style={styles.planLeft}>
                <View style={[styles.planIcon, { backgroundColor: "#fef3c7" }]}>
                  <Crown size={16} color="#d97706" />
                </View>
                <Text style={styles.planText}>{t("admin.planVip")}</Text>
              </View>
              <Text style={styles.planValue}>
                {formatNumber(data.users.byPlan.VIP)}
              </Text>
            </View>
          </View>
        </>
      ) : null}
    </View>
  );
}
