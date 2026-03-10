import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Plus,
  Droplet,
  Sun,
  Wind,
  Sprout,
  AlertCircle,
} from "lucide-react-native";

export default function MyGardenScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const myPlants = [
    {
      id: "1",
      name: "Cà chua giống Pháp",
      stage: "Ra hoa",
      health: "Tốt",
      waterNext: "Hôm nay",
      progress: 60,
      image:
        "https://images.unsplash.com/photo-1592841200221-a6898f307baa?q=80&w=400",
    },
    {
      id: "2",
      name: "Hoa hồng nhung",
      stage: "Phát triển rễ",
      health: "Cảnh báo nấm",
      waterNext: "Ngày mai",
      progress: 30,
      isWarning: true,
      image:
        "https://images.unsplash.com/photo-1559564484-e48b3e040ff4?q=80&w=400",
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Vườn của tôi</Text>
        <TouchableOpacity style={styles.addBtn}>
          <Plus size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Thống kê nhanh vườn */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>12</Text>
            <Text style={styles.summaryLabel}>Tổng số cây</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryValue, { color: "#16a34a" }]}>10</Text>
            <Text style={styles.summaryLabel}>Khỏe mạnh</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryValue, { color: "#ef4444" }]}>2</Text>
            <Text style={styles.summaryLabel}>Cần chú ý</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Cây đang theo dõi</Text>

        {/* Danh sách cây */}
        {myPlants.map((plant) => (
          <View key={plant.id} style={styles.plantCard}>
            <Image source={{ uri: plant.image }} style={styles.plantImg} />
            <View style={styles.plantInfo}>
              <View style={styles.plantTitleRow}>
                <Text style={styles.plantName}>{plant.name}</Text>
                {plant.isWarning && <AlertCircle size={18} color="#ef4444" />}
              </View>

              <Text style={styles.plantStage}>
                Giai đoạn:{" "}
                <Text style={{ fontWeight: "bold", color: "#374151" }}>
                  {plant.stage}
                </Text>
              </Text>

              {/* Thanh tiến độ */}
              <View style={styles.progressBg}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${plant.progress}%`,
                      backgroundColor: plant.isWarning ? "#f59e0b" : "#16a34a",
                    },
                  ]}
                />
              </View>

              {/* Nhiệm vụ chăm sóc */}
              <View style={styles.taskRow}>
                <View style={styles.taskBadge}>
                  <Droplet size={14} color="#3b82f6" />
                  <Text style={styles.taskText}>Tưới: {plant.waterNext}</Text>
                </View>
                <View
                  style={[styles.taskBadge, { backgroundColor: "#f0fdf4" }]}
                >
                  <Sprout size={14} color="#16a34a" />
                  <Text style={[styles.taskText, { color: "#16a34a" }]}>
                    {plant.health}
                  </Text>
                </View>
              </View>
            </View>
          </View>
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
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#16a34a",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: { padding: 16, paddingBottom: 40 },
  summaryCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    elevation: 2,
  },
  summaryItem: { flex: 1, alignItems: "center" },
  summaryValue: {
    fontSize: 24,
    fontWeight: "900",
    color: "#111827",
    marginBottom: 4,
  },
  summaryLabel: { fontSize: 12, color: "#6b7280" },
  summaryDivider: {
    width: 1,
    backgroundColor: "#e5e7eb",
    height: "80%",
    alignSelf: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 16,
  },
  plantCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    elevation: 2,
  },
  plantImg: { width: 90, height: 100, borderRadius: 12 },
  plantInfo: { flex: 1, marginLeft: 16, justifyContent: "center" },
  plantTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  plantName: { fontSize: 16, fontWeight: "700", color: "#111827", flex: 1 },
  plantStage: { fontSize: 13, color: "#6b7280", marginBottom: 8 },
  progressBg: {
    height: 6,
    backgroundColor: "#f3f4f6",
    borderRadius: 3,
    marginBottom: 12,
  },
  progressFill: { height: "100%", borderRadius: 3 },
  taskRow: { flexDirection: "row", gap: 8 },
  taskBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eff6ff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  taskText: { fontSize: 11, color: "#3b82f6", fontWeight: "600" },
});
