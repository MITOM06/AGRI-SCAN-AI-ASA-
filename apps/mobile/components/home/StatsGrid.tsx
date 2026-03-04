import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Leaf,
} from "lucide-react-native";

const StatCard = ({ label, value, icon: Icon, color }: any) => (
  <View style={styles.card}>
    <View style={[styles.iconBox, { backgroundColor: color + "15" }]}>
      <Icon size={20} color={color} />
    </View>
    <Text style={styles.value}>{value}</Text>
    <Text style={styles.label}>{label}</Text>
  </View>
);

export const StatsGrid = () => (
  <View style={styles.grid}>
    <StatCard
      label="Tổng lượt quét"
      value="1,248"
      icon={Activity}
      color="#2563eb"
    />
    <StatCard
      label="Cảnh báo"
      value="03"
      icon={AlertTriangle}
      color="#ef4444"
    />
    <StatCard
      label="Khoe mạnh"
      value="92%"
      icon={CheckCircle}
      color="#16a34a"
    />
    <StatCard label="Cây trồng" value="12" icon={Leaf} color="#8b5cf6" />
  </View>
);

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  card: {
    width: "48%",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  value: { fontSize: 18, fontWeight: "bold", color: "#111827" },
  label: { fontSize: 12, color: "#6b7280" },
});
