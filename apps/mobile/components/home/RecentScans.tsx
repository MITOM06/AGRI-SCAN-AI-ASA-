import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { ChevronRight, Clock } from "lucide-react-native";

const ScanItem = ({ plant, disease, time, status }: any) => (
  <TouchableOpacity style={styles.item}>
    <View style={styles.left}>
      <View
        style={[
          styles.statusDot,
          { backgroundColor: status === "Healthy" ? "#16a34a" : "#ef4444" },
        ]}
      />
      <View>
        <Text style={styles.plantName}>{plant}</Text>
        <Text style={styles.diseaseName}>{disease}</Text>
      </View>
    </View>
    <View style={styles.right}>
      <Clock size={12} color="#9ca3af" />
      <Text style={styles.timeText}>{time}</Text>
      <ChevronRight size={16} color="#d1d5db" />
    </View>
  </TouchableOpacity>
);

export const RecentScans = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Lịch sử quét gần đây</Text>
    <ScanItem
      plant="Cây Lúa"
      disease="Đạo ôn"
      time="2 giờ trước"
      status="Warning"
    />
    <ScanItem
      plant="Cà Phê"
      disease="Khoe mạnh"
      time="5 giờ trước"
      status="Healthy"
    />
    <ScanItem
      plant="Hồ Tiêu"
      disease="Tuyến trùng"
      time="Yesterday"
      status="Warning"
    />
  </View>
);

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, marginTop: 20 },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 15,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  left: { flexDirection: "row", alignItems: "center" },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 12 },
  plantName: { fontSize: 14, fontWeight: "600", color: "#111827" },
  diseaseName: { fontSize: 12, color: "#6b7280" },
  right: { flexDirection: "row", alignItems: "center" },
  timeText: { fontSize: 11, color: "#9ca3af", marginLeft: 4, marginRight: 4 },
});
