import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { Calendar } from "lucide-react-native";
import { formatCurrencyVN as formatCurrency } from "@agri-scan/shared";

import { styles } from "../../styles/admin.styles";
import { useT } from "../../context/I18nContext";

interface ReportTabProps {
  loading: boolean;
  refreshing: boolean;
  data: any;
}

export function ReportTab({ loading, refreshing, data }: ReportTabProps) {
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
          <View style={styles.reportSummaryCard}>
            <Text style={styles.reportSummaryTitle}>
              {t("admin.mYearSummary")}
            </Text>
            <View style={styles.reportRow}>
              <View>
                <Text style={styles.reportLabel}>
                  {t("admin.mTotalRevenue")}
                </Text>
                <Text style={styles.reportBigValue}>
                  {formatCurrency(data.summary.totalRevenue)}
                </Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={styles.reportLabel}>
                  {t("admin.mTransactions")}
                </Text>
                <Text style={styles.reportBigValue}>
                  {data.summary.totalTransactions}
                </Text>
              </View>
            </View>
          </View>

          <Text style={styles.sectionHeading}>
            {t("admin.mMonthlyDetail")}
          </Text>

          {data.data.map((item: any, idx: number) => (
            <View key={idx} style={styles.monthCard}>
              <View style={styles.monthHeader}>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <Calendar size={18} color="#64748b" />
                  <Text style={styles.monthText}>
                    {t("admin.mMonthN", { n: item._id })}
                  </Text>
                </View>
                <View style={styles.revenueBadge}>
                  <Text style={styles.revenueBadgeText}>
                    {formatCurrency(item.totalRevenue)}
                  </Text>
                </View>
              </View>
              <View style={styles.monthDetails}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>
                    {t("admin.mTransactionCount")}
                  </Text>
                  <Text style={styles.detailValue}>
                    {item.totalTransactions}
                  </Text>
                </View>
                {item.byPlan.map((plan: any, i: number) => (
                  <View key={i} style={styles.detailItem}>
                    <Text style={styles.detailLabel}>
                      {t("admin.mPlanNamed", { plan: plan.plan })}
                    </Text>
                    <Text style={styles.detailValue}>
                      {formatCurrency(plan.revenue)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </>
      ) : null}
    </View>
  );
}
