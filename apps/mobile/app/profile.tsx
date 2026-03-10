import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store"; // BẮT BUỘC IMPORT ĐỂ LẤY DATA
import {
  ArrowLeft,
  LogOut,
  Leaf,
  Activity,
  Settings,
} from "lucide-react-native";

// 🔥 IMPORT GỌI API LẤY LỊCH SỬ
import { scanApi } from "@agri-scan/shared";

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // STATE LƯU THÔNG TIN USER
  const [userData, setUserData] = useState<{
    fullName?: string;
    name?: string;
    email?: string;
  } | null>(null);

  // STATE LƯU THỐNG KÊ VÀ HOẠT ĐỘNG THẬT
  const [stats, setStats] = useState({
    totalScans: 0,
    diseasesDetected: 0,
    contributions: 0,
  });
  const [activities, setActivities] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  // LẤY DỮ LIỆU TỪ BỘ NHỚ & LỊCH SỬ QUÉT
  useEffect(() => {
    const fetchUserDataAndHistory = async () => {
      try {
        // 1. Lấy thông tin User
        let userStr = null;
        if (Platform.OS === "web") {
          userStr = localStorage.getItem("user");
        } else {
          userStr = await SecureStore.getItemAsync("user");
        }

        if (userStr) {
          setUserData(JSON.parse(userStr));
        }

        // 2. Lấy dữ liệu lịch sử quét thật từ API
        const scanItems = await scanApi.getScanHistory();

        if (scanItems && scanItems.length > 0) {
          const uniqueDiseases = new Set();
          let contributionsCount = 0;

          // Tính toán thống kê từ toàn bộ lịch sử
          scanItems.forEach((s: any) => {
            const diseaseName =
              s.aiPredictions?.[0]?.diseaseId?.name ||
              s.topPrediction?.diseaseName;

            if (diseaseName && diseaseName !== "Không xác định") {
              uniqueDiseases.add(diseaseName);
            }

            // Nếu user đã feedback đúng sai (isAccurate khác null) thì cộng 1 đóng góp
            if (s.isAccurate !== null && s.isAccurate !== undefined) {
              contributionsCount++;
            }
          });

          setStats({
            totalScans: scanItems.length,
            diseasesDetected: uniqueDiseases.size,
            contributions: contributionsCount,
          });

          // Lấy 5 hoạt động gần nhất để hiển thị
          const recentActivities = scanItems.slice(0, 5).map((s: any) => {
            const diseaseName =
              s.aiPredictions?.[0]?.diseaseId?.name ||
              s.topPrediction?.diseaseName ||
              "Chưa xác định rõ";

            const confidence =
              s.aiPredictions?.[0]?.confidence ||
              s.topPrediction?.confidence ||
              0;

            const scannedAt = new Date(
              s.scannedAt ?? s.createdAt ?? s.updatedAt ?? Date.now(),
            );

            // Format ngày giờ: DD/MM/YYYY HH:MM
            const timeString = `${scannedAt.toLocaleDateString("vi-VN")} - ${scannedAt.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}`;

            return {
              id: s._id || s.id || Math.random().toString(),
              title: `Chẩn đoán: ${diseaseName}`,
              desc: `Quét lúc ${timeString}`,
              // Nếu độ tin cậy > 80% thì báo Nguy cơ cao, ngược lại là Cần theo dõi
              status: confidence > 0.8 ? "Nguy cơ cao" : "Cần theo dõi",
              isHighRisk: confidence > 0.8,
            };
          });

          setActivities(recentActivities);
        }
      } catch (error) {
        console.error("Lỗi khi load thông tin Profile:", error);
      } finally {
        setIsLoadingHistory(false);
      }
    };
    fetchUserDataAndHistory();
  }, []);

  // HÀM TẠO CHỮ CÁI AVATAR
  const getInitials = (name?: string) => {
    if (!name) return "U";
    const words = name.trim().split(" ");
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    return (
      words[0].charAt(0) + words[words.length - 1].charAt(0)
    ).toUpperCase();
  };

  // ĐĂNG XUẤT
  const handleLogout = async () => {
    try {
      if (Platform.OS === "web") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
      } else {
        await SecureStore.deleteItemAsync("accessToken");
        await SecureStore.deleteItemAsync("refreshToken");
        await SecureStore.deleteItemAsync("user");
      }
      router.replace("/auth/login");
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
    }
  };

  // Dữ liệu mảng động cho Thống kê
  const dynamicStats = [
    { id: 1, label: "Cây đã quét", value: stats.totalScans.toString() },
    {
      id: 2,
      label: "Bệnh phát hiện",
      value: stats.diseasesDetected.toString(),
    },
    { id: 3, label: "Đóng góp", value: stats.contributions.toString() },
  ];

  // Lấy tên hiển thị
  const displayName = userData?.fullName || userData?.name || "Người Dùng";

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Nút Back nổi lên trên */}
      <View style={[styles.headerNav, { top: Math.max(insets.top, 20) }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hồ sơ của tôi</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Bìa màu xanh lá */}
        <View style={[styles.coverBg, { paddingTop: insets.top }]} />

        <View style={styles.contentContainer}>
          {/* --- 1. Thẻ Thông Tin User & Đăng Xuất --- */}
          <View style={styles.card}>
            <View style={styles.profileHeader}>
              <View style={styles.avatarWrapper}>
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarText}>
                    {getInitials(displayName)}
                  </Text>
                </View>
                <TouchableOpacity style={styles.settingsBadge}>
                  <Settings size={12} color="#4b5563" />
                </TouchableOpacity>
              </View>

              <View style={styles.userInfo}>
                <Text style={styles.userName} numberOfLines={1}>
                  {displayName}
                </Text>
                <Text style={styles.userEmail} numberOfLines={1}>
                  {userData?.email || "Đang tải email..."}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <LogOut size={18} color="#ef4444" />
              <Text style={styles.logoutText}>Đăng xuất</Text>
            </TouchableOpacity>
          </View>

          {/* --- 2. Bảng Thống Kê (Dữ liệu thật) --- */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Activity size={18} color="#16a34a" />
              <Text style={styles.cardTitle}>Thống kê cá nhân</Text>
            </View>

            <View style={styles.statsRow}>
              {dynamicStats.map((stat, index) => (
                <View key={stat.id} style={styles.statItem}>
                  {isLoadingHistory ? (
                    <ActivityIndicator
                      size="small"
                      color="#16a34a"
                      style={{ marginBottom: 4 }}
                    />
                  ) : (
                    <Text style={styles.statValue}>{stat.value}</Text>
                  )}
                  <Text style={styles.statLabel}>{stat.label}</Text>
                  {/* Đường kẻ dọc phân cách (trừ item cuối) */}
                  {index < dynamicStats.length - 1 && (
                    <View style={styles.statDivider} />
                  )}
                </View>
              ))}
            </View>
          </View>

          {/* --- 3. Hoạt Động Gần Đây (Dữ liệu thật) --- */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Hoạt động gần đây</Text>
            </View>

            <View style={styles.activityList}>
              {isLoadingHistory ? (
                <ActivityIndicator
                  size="small"
                  color="#16a34a"
                  style={{ marginVertical: 20 }}
                />
              ) : activities.length === 0 ? (
                <Text style={styles.emptyText}>Chưa có lịch sử quét nào.</Text>
              ) : (
                activities.map((activity, index) => (
                  <View
                    key={activity.id}
                    style={[
                      styles.activityItem,
                      index === activities.length - 1 && {
                        borderBottomWidth: 0,
                      },
                    ]}
                  >
                    <View style={styles.activityIconBox}>
                      <Leaf size={20} color="#16a34a" />
                    </View>
                    <View style={styles.activityInfo}>
                      <Text style={styles.activityTitle}>{activity.title}</Text>
                      <Text style={styles.activityDesc}>{activity.desc}</Text>

                      <View
                        style={[
                          styles.statusBadge,
                          activity.isHighRisk
                            ? styles.statusHighRiskBg
                            : styles.statusNormalBg,
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusText,
                            activity.isHighRisk
                              ? styles.statusHighRiskText
                              : styles.statusNormalText,
                          ]}
                        >
                          {activity.status}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))
              )}
            </View>

            {activities.length > 0 && (
              <TouchableOpacity
                style={styles.viewAllBtn}
                onPress={() => router.push("/scan")} // Chuyển về màn hình quét để xem toàn bộ ở Sidebar
              >
                <Text style={styles.viewAllText}>Xem tất cả trong lịch sử</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f4f6" },

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
    backgroundColor: "#16a34a",
    height: 180,
    width: "100%",
  },

  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    marginTop: -40,
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
    elevation: 3,
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
    backgroundColor: "#dc2626",
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
    backgroundColor: "#dcfce3",
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
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  // 🔥 ĐÃ THÊM CLASS BỊ THIẾU VÀO ĐÂY:
  statusText: {
    fontSize: 11,
    fontWeight: "600",
  },

  // Style cho Nguy cơ cao
  statusHighRiskBg: { backgroundColor: "#fee2e2" },
  statusHighRiskText: { color: "#ef4444" },
  // Style cho Cần theo dõi (Bình thường)
  statusNormalBg: { backgroundColor: "#fef9c3" },
  statusNormalText: { color: "#ca8a04" },

  emptyText: {
    textAlign: "center",
    color: "#9ca3af",
    fontStyle: "italic",
    paddingVertical: 10,
  },

  viewAllBtn: {
    alignItems: "center",
    marginTop: 16,
    paddingVertical: 8,
  },
  viewAllText: { color: "#059669", fontSize: 14, fontWeight: "600" },
});
