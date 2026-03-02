import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Platform,
  Modal,
  StatusBar,
  Animated,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  ArrowRight,
  Leaf,
  ShieldCheck,
  Activity,
  Sprout,
  Users,
  Search,
  Menu,
  X,
} from "lucide-react-native";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const slideAnim = useRef(new Animated.Value(width)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const openMenu = () => {
    setIsMenuOpen(true);
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeMenu = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: width,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsMenuOpen(false);
    });
  };

  const handleNavigate = (path: string) => {
    closeMenu();
    setTimeout(() => {
      router.push(path as any);
    }, 300);
  };

  const features = [
    {
      icon: <ShieldCheck size={28} color="#2563eb" />,
      title: "AI Diagnosis",
      description:
        "Nhận diện bệnh cây qua ảnh chụp tức thời với độ chính xác cao nhờ mô hình Computer Vision tiên tiến.",
      colorBg: "#eff6ff",
    },
    {
      icon: <Sprout size={28} color="#16a34a" />,
      title: "Smart Treatment",
      description:
        "Đưa ra phác đồ điều trị chi tiết, ưu tiên các giải pháp sinh học và thân thiện với môi trường.",
      colorBg: "#f0fdf4",
    },
    {
      icon: <Users size={28} color="#ea580c" />,
      title: "Community Knowledge",
      description:
        "Thư viện mở về kỹ thuật canh tác và cộng đồng chuyên gia hỗ trợ giải đáp thắc mắc.",
      colorBg: "#fff7ed",
    },
  ];

  return (
    // BỎ paddingTop ở Container đi để nội dung tràn lên mép trên cùng
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />

      {/* --- 1. Navbar Thu Gọn --- */}
      {/* Đưa paddingTop vào Navbar, lấy đúng chiều cao thanh trạng thái để đẩy nội dung xuống vừa đủ */}
      <View
        style={[
          styles.navbar,
          {
            paddingTop:
              Platform.OS === "ios" || Platform.OS === "android"
                ? StatusBar.currentHeight
                : Math.max(insets.top, 20),
          },
        ]}
      >
        <View style={styles.logoWrapper}>
          <View style={styles.logoIconBox}>
            <Leaf size={18} color="#fff" />
          </View>
          <Text style={styles.logoTitle}>Agri-Scan</Text>
        </View>

        <TouchableOpacity onPress={openMenu} style={styles.menuBtn}>
          <Menu size={32} color="#374151" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      {/* --- 2. Menu Trượt Ngang (Animated) --- */}
      <Modal visible={isMenuOpen} transparent={true} animationType="none">
        <View style={styles.modalContainer}>
          <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
            <TouchableOpacity
              style={{ flex: 1 }}
              activeOpacity={1}
              onPress={closeMenu}
            />
          </Animated.View>

          <Animated.View
            style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}
          >
            <View
              style={[
                styles.menuContent,
                {
                  paddingTop:
                    Platform.OS === "android"
                      ? StatusBar.currentHeight
                      : Math.max(insets.top, 20),
                },
              ]}
            >
              <View style={styles.menuHeader}>
                <View style={styles.logoWrapper}>
                  <View style={styles.logoIconBox}>
                    <Leaf size={18} color="#fff" />
                  </View>
                  <Text style={styles.logoTitle}>Agri-Scan</Text>
                </View>
                <TouchableOpacity onPress={closeMenu} style={styles.closeBtn}>
                  <X size={28} color="#374151" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.menuLinks}>
                <TouchableOpacity style={styles.menuItem} onPress={closeMenu}>
                  <Text style={styles.menuItemText}>Trang chủ</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleNavigate("/scan")}
                >
                  <Text style={styles.menuItemText}>Chẩn đoán AI</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={closeMenu}>
                  <Text style={styles.menuItemText}>Từ điển cây</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={closeMenu}>
                  <Text style={styles.menuItemText}>Cộng đồng</Text>
                </TouchableOpacity>
              </ScrollView>

              <View
                style={[
                  styles.menuFooter,
                  { paddingBottom: insets.bottom || 24 },
                ]}
              >
                <TouchableOpacity style={styles.menuSearchBtn}>
                  <Search size={20} color="#4b5563" />
                  <Text style={styles.menuSearchText}>Tìm kiếm</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuLoginBtn}
                  onPress={() => handleNavigate("/auth/login")}
                >
                  <Text style={styles.menuLoginText}>Đăng nhập</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </View>
      </Modal>

      {/* --- 3. Nội dung chính --- */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
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

          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={styles.primaryBtn}
              activeOpacity={0.8}
              onPress={() => router.push("/scan")}
            >
              <Text style={styles.primaryBtnText}>Chẩn đoán ngay</Text>
              <ArrowRight size={18} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryBtn} activeOpacity={0.6}>
              <Text style={styles.secondaryBtnText}>Tìm hiểu thêm</Text>
            </TouchableOpacity>
          </View>

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

          <View style={styles.imageWrapper}>
            <ImageBackground
              source={{
                uri: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=600",
              }}
              style={styles.heroImage}
              imageStyle={{ borderRadius: 24 }}
            >
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

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2026 Agri-Scan AI. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fafaf9" },
  scrollContent: { paddingBottom: 100 },

  // Navbar Styles
  navbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 10, // Thay paddingVertical bằng paddingBottom vì paddingTop đã động
    backgroundColor: "#fafaf9",
  },
  logoWrapper: { flexDirection: "row", alignItems: "center", gap: 8 },
  logoIconBox: { backgroundColor: "#2e7d32", padding: 6, borderRadius: 8 },
  logoTitle: { fontSize: 20, fontWeight: "800", color: "#111827" },
  menuBtn: { padding: 4 },

  // --- Styles Menu Trượt (Animated Drawer) ---
  modalContainer: {
    flex: 1,
    flexDirection: "row",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  drawer: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: width * 0.75, // Chiếm 75% màn hình từ bên phải
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: -5, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
  },
  menuContent: {
    flex: 1,
  },
  menuHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  closeBtn: { padding: 4 },
  menuLinks: { flex: 1, paddingHorizontal: 24, paddingTop: 10 },
  menuItem: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f9fafb",
  },
  menuItemText: { fontSize: 16, color: "#374151", fontWeight: "600" },
  menuFooter: {
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
    paddingTop: 20,
  },
  menuSearchBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f4f6",
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 12,
    gap: 8,
  },
  menuSearchText: { fontSize: 15, color: "#4b5563", fontWeight: "500" },
  menuLoginBtn: {
    backgroundColor: "#2e7d32",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  menuLoginText: { color: "#fff", fontSize: 15, fontWeight: "bold" },

  // --- Hero Section Styles ---
  heroSection: {
    paddingHorizontal: 20,
    paddingTop: 10,
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
    marginBottom: 15,
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
    fontSize: 42,
    fontWeight: "900",
    color: "#111827",
    lineHeight: 48,
    letterSpacing: -1,
  },
  greenTitle: { color: "#16a34a" },
  description: {
    fontSize: 16,
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
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    elevation: 2,
  },
  primaryBtnText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  secondaryBtn: {
    backgroundColor: "#fff",
    paddingHorizontal: 22,
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
    marginBottom: 35,
  },
  statBox: { alignItems: "flex-start" },
  statNum: { fontSize: 26, fontWeight: "900", color: "#111827" },
  statLabel: { fontSize: 12, color: "#6b7280", marginTop: 2 },

  imageWrapper: { width: "100%", height: 260, marginBottom: 40 },
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

  featuresSection: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
    backgroundColor: "#fafaf9",
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

  footer: { paddingVertical: 20, alignItems: "center" },
  footerText: { fontSize: 12, color: "#9ca3af" },
});
