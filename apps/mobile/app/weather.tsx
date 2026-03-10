import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  CloudRain,
  Sun,
  Wind,
  Droplets,
  ThermometerSun,
  AlertCircle,
  MapPin,
} from "lucide-react-native";

export default function WeatherScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const weeklyForecast = [
    {
      day: "Thứ 2",
      icon: <CloudRain size={24} color="#3b82f6" />,
      temp: "24°C - 28°C",
      status: "Mưa dông",
    },
    {
      day: "Thứ 3",
      icon: <CloudRain size={24} color="#3b82f6" />,
      temp: "23°C - 27°C",
      status: "Mưa rào",
    },
    {
      day: "Thứ 4",
      icon: <Sun size={24} color="#f59e0b" />,
      temp: "26°C - 32°C",
      status: "Nắng đẹp",
    },
    {
      day: "Thứ 5",
      icon: <Sun size={24} color="#f59e0b" />,
      temp: "27°C - 34°C",
      status: "Nắng gắt",
    },
    {
      day: "Thứ 6",
      icon: <Wind size={24} color="#9ca3af" />,
      temp: "25°C - 30°C",
      status: "Nhiều mây",
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#374151" />
        </TouchableOpacity>
        <View style={styles.locationContainer}>
          <MapPin size={16} color="#16a34a" />
          <Text style={styles.headerTitle}>TP. Hồ Chí Minh</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Khối Thời tiết hiện tại */}
        <View style={styles.currentWeatherCard}>
          <Text style={styles.dateText}>Hôm nay, 15 Tháng 10</Text>
          <View style={styles.mainTempRow}>
            <CloudRain size={64} color="#3b82f6" />
            <Text style={styles.mainTemp}>26°</Text>
          </View>
          <Text style={styles.weatherStatus}>Mưa dông rải rác</Text>

          <View style={styles.weatherDetails}>
            <View style={styles.detailItem}>
              <Droplets size={20} color="#3b82f6" />
              <Text style={styles.detailValue}>85%</Text>
              <Text style={styles.detailLabel}>Độ ẩm</Text>
            </View>
            <View style={styles.detailItem}>
              <Wind size={20} color="#9ca3af" />
              <Text style={styles.detailValue}>12 km/h</Text>
              <Text style={styles.detailLabel}>Gió</Text>
            </View>
            <View style={styles.detailItem}>
              <ThermometerSun size={20} color="#f59e0b" />
              <Text style={styles.detailValue}>UV: 4</Text>
              <Text style={styles.detailLabel}>Chỉ số tia UV</Text>
            </View>
          </View>
        </View>

        {/* Lời khuyên AI */}
        <View style={styles.aiAdviceCard}>
          <View style={styles.aiAdviceHeader}>
            <AlertCircle size={20} color="#ca8a04" />
            <Text style={styles.aiAdviceTitle}>Lời khuyên từ Bác sĩ AI</Text>
          </View>
          <Text style={styles.aiAdviceText}>
            Độ ẩm đang rất cao {`(>80%)`}, đây là môi trường lý tưởng cho nấm
            bệnh phát triển. Khuyến nghị KHÔNG tưới nước vào chiều tối và nên
            phun thuốc phòng nấm sinh học.
          </Text>
        </View>

        {/* Dự báo 5 ngày tới */}
        <Text style={styles.sectionTitle}>Dự báo 5 ngày tới</Text>
        <View style={styles.forecastList}>
          {weeklyForecast.map((item, index) => (
            <View key={index} style={styles.forecastItem}>
              <Text style={styles.forecastDay}>{item.day}</Text>
              <View style={styles.forecastIconRow}>
                {item.icon}
                <Text style={styles.forecastStatus}>{item.status}</Text>
              </View>
              <Text style={styles.forecastTemp}>{item.temp}</Text>
            </View>
          ))}
        </View>
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
  locationContainer: { flexDirection: "row", alignItems: "center", gap: 6 },
  headerTitle: { fontSize: 16, fontWeight: "bold", color: "#111827" },
  scrollContent: { padding: 16, paddingBottom: 40 },

  currentWeatherCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 20,
  },
  dateText: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "600",
    marginBottom: 16,
  },
  mainTempRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 8,
  },
  mainTemp: { fontSize: 64, fontWeight: "900", color: "#111827" },
  weatherStatus: {
    fontSize: 18,
    color: "#374151",
    fontWeight: "600",
    marginBottom: 24,
  },
  weatherDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
    paddingTop: 20,
  },
  detailItem: { alignItems: "center" },
  detailValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 8,
    marginBottom: 2,
  },
  detailLabel: { fontSize: 12, color: "#6b7280" },

  aiAdviceCard: {
    backgroundColor: "#fef08a",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#fde047",
  },
  aiAdviceHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  aiAdviceTitle: { fontSize: 15, fontWeight: "bold", color: "#854d0e" },
  aiAdviceText: { fontSize: 14, color: "#713f12", lineHeight: 22 },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 12,
  },
  forecastList: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  forecastItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  forecastDay: { fontSize: 15, fontWeight: "600", color: "#374151", width: 60 },
  forecastIconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
    paddingLeft: 10,
  },
  forecastStatus: { fontSize: 14, color: "#6b7280" },
  forecastTemp: { fontSize: 15, fontWeight: "bold", color: "#111827" },
});
