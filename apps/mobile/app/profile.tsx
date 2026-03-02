import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  LogOut,
  Leaf,
  Activity,
  Settings,
} from "lucide-react-native";

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Dữ liệu giả lập (Mock Data) dựa theo hình ảnh Web của bạn
  const STATS = [
    { id: 1, label: "Cây đã quét", value: "12" },
    { id: 2, label: "Bệnh phát hiện", value: "5" },
    { id: 3, label: "Đóng góp", value: "3" },
  ];

  const ACTIVITIES = [
    {
      id: 1,
      title: "Chẩn đoán bệnh Đốm lá",
      desc: "Cây Cà chua • 2 giờ trước",
      status: "Nguy cơ cao",
    },
    {
      id: 2,
      title: "Chẩn đoán bệnh Đốm lá",
      desc: "Cây Cà chua • 2 giờ trước",
      status: "Nguy cơ cao",
    },
    {
      id: 3,
      title: "Chẩn đoán bệnh Đốm lá",
      desc: "Cây Cà chua • 2 giờ trước",
      status: "Nguy cơ cao",
    },
  ];

  const handleLogout = () => {
    // Xử lý logic xóa token/phiên đăng nhập tại đây
    router.replace("/auth/login");
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Nút Back nổi lên trên (Absolute) */}
      <View style={[styles.headerNav, { top: Math.max(insets.top, 20) }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hồ sơ của tôi</Text>
        <View style={{ width: 40 }} /> {/* Spacer để cân bằng layout */}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Bìa màu xanh lá (Cover Background) */}
        <View style={[styles.coverBg, { paddingTop: insets.top }]} />

        {/* Khung nội dung bị đẩy lên chồng lên bìa (Negative Margin) */}
        <View style={styles.contentContainer}>
          {/* --- 1. Thẻ Thông Tin User & Đăng Xuất --- */}
          <View style={styles.card}>
            <View style={styles.profileHeader}>
              <View style={styles.avatarWrapper}>
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarText}>CS</Text>
                </View>
                <TouchableOpacity style={styles.settingsBadge}>
                  <Settings size={12} color="#4b5563" />
                </TouchableOpacity>
              </View>

              <View style={styles.userInfo}>
                <Text style={styles.userName}>Châu Băng Sơn</Text>
                <Text style={styles.userEmail}>bangson.chau@gmail.com</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <LogOut size={18} color="#ef4444" />
              <Text style={styles.logoutText}>Đăng xuất</Text>
            </TouchableOpacity>
          </View>

          {/* --- 2. Bảng Thống Kê --- */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Activity size={18} color="#16a34a" />
              <Text style={styles.cardTitle}>Thống kê</Text>
            </View>

            <View style={styles.statsRow}>
              {STATS.map((stat, index) => (
                <View key={stat.id} style={styles.statItem}>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                  {/* Đường kẻ dọc phân cách (trừ item cuối) */}
                  {index < STATS.length - 1 && (
                    <View style={styles.statDivider} />
                  )}
                </View>
              ))}
            </View>
          </View>

          {/* --- 3. Hoạt Động Gần Đây --- */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Hoạt động gần đây</Text>
            </View>

            <View style={styles.activityList}>
              {ACTIVITIES.map((activity, index) => (
                <View
                  key={activity.id}
                  style={[
                    styles.activityItem,
                    index === ACTIVITIES.length - 1 && { borderBottomWidth: 0 }, // Bỏ viền cho dòng cuối
                  ]}
                >
                  <View style={styles.activityIconBox}>
                    <Leaf size={20} color="#16a34a" />
                  </View>
                  <View style={styles.activityInfo}>
                    <Text style={styles.activityTitle}>{activity.title}</Text>
                    <Text style={styles.activityDesc}>{activity.desc}</Text>
                    <View style={styles.statusBadge}>
                      <Text style={styles.statusText}>{activity.status}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            <TouchableOpacity style={styles.viewAllBtn}>
              <Text style={styles.viewAllText}>Xem tất cả hoạt động</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f4f6" }, // Màu nền xám nhạt như web

  // Navigation
  headerNav: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "600" },

  // Background Cover
  coverBg: {
    backgroundColor: "#16a34a", // Xanh lá
    height: 180, // Độ cao của phần màu xanh
    width: "100%",
  },

  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    marginTop: -40, // Kéo nội dung lên đè vào phần cover xanh lá (Negative margin)
  },

  // Card chung
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3, // Bóng cho Android
  },

  // 1. Profile Info
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarWrapper: { position: "relative" },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#dc2626", // Đỏ
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { color: "#fff", fontSize: 24, fontWeight: "bold" },
  settingsBadge: {
    position: "absolute",
    bottom: -4,
    right: -4,
    backgroundColor: "#fff",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    elevation: 2,
  },
  userInfo: { marginLeft: 16, flex: 1 },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  userEmail: { fontSize: 14, color: "#6b7280" },

  divider: { height: 1, backgroundColor: "#f3f4f6", marginVertical: 16 },

  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 8,
  },
  logoutText: { color: "#ef4444", fontSize: 16, fontWeight: "600" },

  // 2. Stats
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  cardTitle: { fontSize: 16, fontWeight: "bold", color: "#111827" },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 16,
  },
  statItem: { flex: 1, alignItems: "center", position: "relative" },
  statValue: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 4,
  },
  statLabel: { fontSize: 12, color: "#6b7280", textAlign: "center" },
  statDivider: {
    position: "absolute",
    right: 0,
    top: "10%",
    bottom: "10%",
    width: 1,
    backgroundColor: "#e5e7eb",
  },

  // 3. Activities
  activityList: { marginTop: 4 },
  activityItem: {
    flexDirection: "row",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  activityIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#dcfce3", // Xanh lá nhạt
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  activityInfo: { flex: 1 },
  activityTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  activityDesc: { fontSize: 13, color: "#6b7280", marginBottom: 8 },
  statusBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#fee2e2", // Nền đỏ siêu nhạt
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: { fontSize: 11, color: "#ef4444", fontWeight: "600" }, // Chữ đỏ

  viewAllBtn: {
    alignItems: "center",
    marginTop: 16,
    paddingVertical: 8,
  },
  viewAllText: { color: "#4b5563", fontSize: 14, fontWeight: "500" },
});
