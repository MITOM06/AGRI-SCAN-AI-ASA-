import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Leaf,
  AlertTriangle,
  Zap,
  CheckCircle,
  Bell, // 🔥 ĐÃ THÊM IMPORT BELL Ở ĐÂY ĐỂ HẾT LỖI
} from "lucide-react-native";

import { useT } from "../context/I18nContext";

export default function NotificationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const t = useT();

  const notifications = [
    {
      id: "1",
      title: t("notifications.sample1Title"),
      desc: t("notifications.sample1Desc"),
      time: t("notifications.sample1Time"),
      type: "alert",
      isRead: false,
    },
    {
      id: "2",
      title: t("notifications.sample2Title"),
      desc: t("notifications.sample2Desc"),
      time: t("notifications.sample2Time"),
      type: "system",
      isRead: true,
    },
    {
      id: "3",
      title: t("notifications.sample3Title"),
      desc: t("notifications.sample3Desc"),
      time: t("notifications.sample3Time"),
      type: "success",
      isRead: true,
    },
    {
      id: "4",
      title: t("notifications.sample4Title"),
      desc: t("notifications.sample4Desc"),
      time: t("notifications.sample4Time"),
      type: "tip",
      isRead: true,
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case "alert":
        return <AlertTriangle size={20} color="#ef4444" />;
      case "system":
        return <Zap size={20} color="#3b82f6" />;
      case "success":
        return <CheckCircle size={20} color="#10b981" />;
      case "tip":
        return <Leaf size={20} color="#f59e0b" />;
      default:
        return <Bell size={20} color="#6b7280" />;
    }
  };

  const getIconBg = (type: string) => {
    switch (type) {
      case "alert":
        return "#fef2f2";
      case "system":
        return "#eff6ff";
      case "success":
        return "#ecfdf5";
      case "tip":
        return "#fffbeb";
      default:
        return "#f3f4f6";
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("notifications.title")}</Text>
        <TouchableOpacity>
          <Text style={styles.markAllRead}>
            {t("notifications.markAllRead")}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {notifications.map((noti) => (
          <TouchableOpacity
            key={noti.id}
            style={[styles.notiCard, !noti.isRead && styles.notiUnread]}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.iconBox,
                { backgroundColor: getIconBg(noti.type) },
              ]}
            >
              {getIcon(noti.type)}
            </View>
            <View style={styles.notiContent}>
              <View style={styles.titleRow}>
                <Text
                  style={[styles.notiTitle, !noti.isRead && styles.textBold]}
                >
                  {noti.title}
                </Text>
                {!noti.isRead && <View style={styles.unreadDot} />}
              </View>
              <Text style={styles.notiDesc} numberOfLines={2}>
                {noti.desc}
              </Text>
              <Text style={styles.notiTime}>{noti.time}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#111827" },
  markAllRead: { fontSize: 14, color: "#16a34a", fontWeight: "600" },
  scrollContent: { padding: 16, paddingBottom: 40 },
  notiCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#f3f4f6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  notiUnread: { backgroundColor: "#f0fdf4", borderColor: "#dcfce3" },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  notiContent: { flex: 1, justifyContent: "center" },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  notiTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1f2937",
    flex: 1,
    paddingRight: 10,
  },
  textBold: { fontWeight: "800", color: "#111827" },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#16a34a",
  },
  notiDesc: { fontSize: 13, color: "#6b7280", lineHeight: 20, marginBottom: 6 },
  notiTime: { fontSize: 11, color: "#9ca3af", fontWeight: "500" },
});
