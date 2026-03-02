import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  ArrowRight,
  Leaf,
  ShieldCheck,
  Activity,
  Sprout,
  Users,
  Search,
} from "lucide-react-native";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();

  const features = [
    {
      icon: <ShieldCheck size={28} color="#2563eb" />,
      title: "AI Diagnosis",
      description:
        "Nhận diện bệnh cây qua ảnh chụp tức thời với độ chính xác cao nhờ mô hình Computer Vision tiên tiến.",
      colorBg: "#eff6ff", // blue-50
    },
    {
      icon: <Sprout size={28} color="#16a34a" />,
      title: "Smart Treatment",
      description:
        "Đưa ra phác đồ điều trị chi tiết, ưu tiên các giải pháp sinh học và thân thiện với môi trường.",
      colorBg: "#f0fdf4", // green-50
    },
    {
      icon: <Users size={28} color="#ea580c" />,
      title: "Community Knowledge",
      description:
        "Thư viện mở về kỹ thuật canh tác và cộng đồng chuyên gia hỗ trợ giải đáp thắc mắc.",
      colorBg: "#fff7ed", // orange-50
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* --- 1. Navbar (Chuyển thể từ Web) --- */}
      <View style={styles.navbar}>
        <View style={styles.logoWrapper}>
          <View style={styles.logoIconBox}>
            <Leaf size={16} color="#fff" />
          </View>
          <View>
            <Text style={styles.logoTitle}>Agri-Scan AI</Text>
            <Text style={styles.logoSubtitle}>BÁC SĨ CÂY TRỒNG</Text>
          </View>
        </View>

        <View style={styles.navRight}>
          <TouchableOpacity style={styles.searchBtn}>
            <Search size={20} color="#4b5563" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => router.push("/auth/login")}
          >
            <Text style={styles.loginBtnText}>Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* --- 2. Hero Section --- */}
        <View style={styles.heroSection}>
          <View style={styles.badgeWeb}>
            <View style={styles.dot} />
            <Text style={styles.badgeText}>AI Innovation Contest 2026</Text>
          </View>

          <Text style={styles.mainTitle}>
            Bác Sĩ{"\n"}
            <Text style={styles.greenTitle}>Cây Trồng{"\n"}</Text>
            Thông Minh
          </Text>

          <Text style={styles.description}>
            Chẩn đoán bệnh cây trồng tức thì bằng AI. Nhận phác đồ điều trị khoa
            học và lộ trình chăm sóc bền vững chỉ với một lần quét.
          </Text>

          {/* Cặp nút bấm giống Web */}
          <View style={styles.buttonGroup}>
            <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.8}>
              <Text style={styles.primaryBtnText}>Chẩn đoán ngay</Text>
              <ArrowRight size={18} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryBtn} activeOpacity={0.6}>
              <Text style={styles.secondaryBtnText}>Tìm hiểu thêm</Text>
            </TouchableOpacity>
          </View>

          {/* Cụm Thống Kê */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>98%</Text>
              <Text style={styles.statLabel}>Độ chính xác</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>2s</Text>
              <Text style={styles.statLabel}>Thời gian xử lý</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>500+</Text>
              <Text style={styles.statLabel}>Loại bệnh</Text>
            </View>
          </View>

          {/* Image & Floating Cards (Mô phỏng y hệt Web) */}
          <View style={styles.imageWrapper}>
            <ImageBackground
              source={{
                uri: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=600",
              }}
              style={styles.heroImage}
              imageStyle={{ borderRadius: 24 }}
            >
              {/* Floating Card 1: Đã bảo vệ (Góc trên phải) */}
              <View style={[styles.floatingCard, styles.floatTopRight]}>
                <View
                  style={[styles.floatIconBox, { backgroundColor: "#dcfce3" }]}
                >
                  <ShieldCheck size={16} color="#16a34a" />
                </View>
                <View>
                  <Text style={styles.floatLabel}>Trạng thái</Text>
                  <Text style={styles.floatTitle}>Đã bảo vệ</Text>
                </View>
              </View>

              {/* Floating Card 2: Phân tích AI (Góc dưới trái) */}
              <View style={[styles.floatingCard, styles.floatBottomLeft]}>
                <View
                  style={[styles.floatIconBox, { backgroundColor: "#fef08a" }]}
                >
                  <Activity size={18} color="#ca8a04" />
                </View>
                <View>
                  <Text style={styles.floatTitle}>Phân tích AI</Text>
                  <Text style={styles.floatLabel}>Đang xử lý dữ liệu...</Text>
                </View>
              </View>
            </ImageBackground>
          </View>
        </View>

        {/* --- 3. Features Section (Giải pháp toàn diện) --- */}
        <View style={styles.featuresSection}>
          <View style={styles.featuresHeader}>
            <Text style={styles.featuresEyebrow}>GIẢI PHÁP TOÀN DIỆN</Text>
            <Text style={styles.featuresTitle}>
              Công nghệ tiên phong{"\n"}cho nông nghiệp bền vững
            </Text>
            <Text style={styles.featuresDesc}>
              Hệ thống tích hợp đa tính năng giúp bạn quản lý vườn cây một cách
              khoa học và hiệu quả nhất.
            </Text>
          </View>

          <View style={styles.featuresList}>
            {features.map((item, index) => (
              <View key={index} style={styles.featureCard}>
                <View
                  style={[
                    styles.featureIconBox,
                    { backgroundColor: item.colorBg },
                  ]}
                >
                  {item.icon}
                </View>
                <Text style={styles.featureItemTitle}>{item.title}</Text>
                <Text style={styles.featureItemDesc}>{item.description}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Footer cơ bản */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2026 Agri-Scan AI. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fafaf9" }, // Trùng màu nền ngả vàng xanh nhẹ của Web
  scrollContent: { paddingBottom: 100 },

  // Navbar Styles
  navbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#fafaf9",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  logoWrapper: { flexDirection: "row", alignItems: "center", gap: 8 },
  logoIconBox: { backgroundColor: "#16a34a", padding: 6, borderRadius: 8 },
  logoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    lineHeight: 20,
  },
  logoSubtitle: {
    fontSize: 9,
    fontWeight: "600",
    color: "#6b7280",
    letterSpacing: 0.5,
  },
  navRight: { flexDirection: "row", alignItems: "center", gap: 15 },
  searchBtn: { padding: 4 },
  loginBtn: {
    backgroundColor: "#16a34a",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  loginBtnText: { color: "#fff", fontSize: 13, fontWeight: "600" },

  // Hero Section
  heroSection: {
    paddingHorizontal: 20,
    paddingTop: 30,
    alignItems: "flex-start",
  },
  badgeWeb: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0fdf4",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#dcfce3",
    marginBottom: 20,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#16a34a",
    marginRight: 8,
  },
  badgeText: { fontSize: 12, color: "#16a34a", fontWeight: "600" },
  mainTitle: {
    fontSize: 40,
    fontWeight: "800",
    color: "#111827",
    lineHeight: 46,
    letterSpacing: -1,
  },
  greenTitle: { color: "#16a34a" },
  description: {
    fontSize: 15,
    color: "#4b5563",
    lineHeight: 24,
    marginTop: 15,
    marginBottom: 25,
  },

  buttonGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 30,
  },
  primaryBtn: {
    backgroundColor: "#16a34a",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  primaryBtnText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  secondaryBtn: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  secondaryBtnText: { color: "#374151", fontWeight: "600", fontSize: 15 },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingRight: 20,
    marginBottom: 40,
  },
  statBox: { alignItems: "flex-start" },
  statNum: { fontSize: 26, fontWeight: "900", color: "#111827" },
  statLabel: { fontSize: 12, color: "#6b7280", marginTop: 2 },

  // Image & Floating Cards
  imageWrapper: { width: "100%", height: 280, marginBottom: 40 },
  heroImage: { width: "100%", height: "100%" },
  floatingCard: {
    position: "absolute",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    padding: 10,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  floatTopRight: { top: -15, right: -10 },
  floatBottomLeft: { bottom: -15, left: -10 },
  floatIconBox: { padding: 6, borderRadius: 8 },
  floatTitle: { fontSize: 13, fontWeight: "700", color: "#111827" },
  floatLabel: { fontSize: 10, color: "#6b7280" },

  // Features Section
  featuresSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    backgroundColor: "#fff",
    borderRadius: 30,
  },
  featuresHeader: { alignItems: "center", marginBottom: 30 },
  featuresEyebrow: {
    color: "#16a34a",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 8,
  },
  featuresTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
    lineHeight: 32,
    marginBottom: 12,
  },
  featuresDesc: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  featuresList: { gap: 16 },
  featureCard: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#f3f4f6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  featureIconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  featureItemTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  featureItemDesc: { fontSize: 14, color: "#4b5563", lineHeight: 22 },

  footer: { paddingVertical: 30, alignItems: "center" },
  footerText: { fontSize: 12, color: "#9ca3af" },
});
