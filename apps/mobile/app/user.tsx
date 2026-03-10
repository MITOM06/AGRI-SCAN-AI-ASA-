import React, { useState, useRef, useEffect } from "react";
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
import * as SecureStore from "expo-secure-store";
import {
  ArrowRight,
  Leaf,
  ShieldCheck,
  Activity,
  Sprout,
  Users,
  Search,
  X,
  User as UserIcon,
  Settings,
  LogOut,
} from "lucide-react-native";

const { width } = Dimensions.get("window");

export default function UserHomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userData, setUserData] = useState<{
    fullName?: string;
    email?: string;
    plan?: string;
  } | null>(null);

  const slideAnim = useRef(new Animated.Value(width)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        let userStr = null;
        if (Platform.OS === "web") {
          userStr = localStorage.getItem("user");
        } else {
          userStr = await SecureStore.getItemAsync("user");
        }

        if (userStr) {
          setUserData(JSON.parse(userStr));
        }
      } catch (error) {
        console.error("Lỗi khi load thông tin User:", error);
      }
    };

    fetchUserData();
  }, []);

  const getInitials = (name?: string) => {
    if (!name) return "U";
    const words = name.trim().split(" ");
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    return (
      words[0].charAt(0) + words[words.length - 1].charAt(0)
    ).toUpperCase();
  };

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
    ]).start(() => setIsMenuOpen(false));
  };

  const handleNavigate = (path: string) => {
    closeMenu();
    setTimeout(() => {
      router.push(path as any);
    }, 300);
  };

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
      closeMenu();
      setTimeout(() => {
        router.replace("/auth/login");
      }, 300);
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
    }
  };

  // Logic Màu Viền Avatar Dựa Trên Gói
  const currentPlanStr = userData?.plan || "FREE";
  const planColor =
    currentPlanStr === "VIP" || currentPlanStr === "PRO"
      ? "#eab308"
      : currentPlanStr === "PLUS" || currentPlanStr === "PREMIUM"
        ? "#8b5cf6"
        : "#d1d5db"; // Xám cho Free

  // 🔥 GẮN THÊM ĐƯỜNG DẪN ROUTE VÀO MẢNG FEATURES
  const features = [
    {
      icon: <ShieldCheck size={28} color="#2563eb" />,
      title: "AI Diagnosis",
      description:
        "Nhận diện bệnh cây qua ảnh chụp tức thời với độ chính xác cao.",
      colorBg: "#eff6ff",
      route: "/scan",
    },
    {
      icon: <Sprout size={28} color="#16a34a" />,
      title: "Smart Treatment",
      description:
        "Đưa ra phác đồ điều trị chi tiết, ưu tiên giải pháp sinh học.",
      colorBg: "#f0fdf4",
      route: "/community", // Tạm trỏ về trang Coming Soon
    },
    {
      icon: <Users size={28} color="#ea580c" />,
      title: "Community Knowledge",
      description: "Thư viện mở về kỹ thuật canh tác và cộng đồng chuyên gia.",
      colorBg: "#fff7ed",
      route: "/community",
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />

      {/* --- 1. Navbar Đã Đăng Nhập --- */}
      <View
        style={[styles.navbar, { paddingTop: Math.max(insets.top, 10) + 10 }]}
      >
        <View style={styles.logoWrapper}>
          <View style={styles.logoIconBox}>
            <Leaf size={18} color="#fff" />
          </View>
          <Text style={styles.logoTitle}>Agri-Scan</Text>
        </View>

        <TouchableOpacity
          onPress={openMenu}
          style={styles.avatarBtnNavbar}
          activeOpacity={0.8}
        >
          {/* Avatar Nhỏ Có Viền */}
          <View style={[styles.avatarRingSmall, { borderColor: planColor }]}>
            <View style={styles.avatarCircleSmall}>
              <Text style={styles.avatarTextSmall}>
                {getInitials(userData?.fullName)}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* --- 2. Menu Trượt Ngang --- */}
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
                <Text style={styles.menuTitle}>Tài khoản</Text>
                <TouchableOpacity onPress={closeMenu} style={styles.closeBtn}>
                  <X size={26} color="#374151" />
                </TouchableOpacity>
              </View>

              <View style={styles.userInfoSection}>
                {/* Avatar Lớn Có Viền */}
                <View
                  style={[styles.avatarRingLarge, { borderColor: planColor }]}
                >
                  <View style={styles.avatarCircleLarge}>
                    <Text style={styles.avatarTextLarge}>
                      {getInitials(userData?.fullName)}
                    </Text>
                  </View>
                </View>
                <View style={styles.userDetails}>
                  <Text style={styles.userName} numberOfLines={1}>
                    {userData?.fullName || "Người Dùng"}
                  </Text>
                  <Text style={styles.userEmail} numberOfLines={1}>
                    {userData?.email || "Đang tải email..."}
                  </Text>
                </View>
              </View>

              <ScrollView
                style={styles.menuLinks}
                showsVerticalScrollIndicator={false}
              >
                <TouchableOpacity style={styles.menuItem} onPress={closeMenu}>
                  <Text style={styles.menuItemText}>Trang chủ</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleNavigate("/scan")}
                >
                  <Text style={styles.menuItemText}>Chẩn đoán AI</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleNavigate("/treeDic")}
                >
                  <Text style={styles.menuItemText}>Từ điển cây</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleNavigate("/community")}
                >
                  <Text style={styles.menuItemText}>Cộng đồng</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleNavigate("/about")}
                >
                  <Text style={styles.menuItemText}>Về chúng tôi</Text>
                </TouchableOpacity>

                <View style={styles.divider} />

                <TouchableOpacity
                  style={styles.menuItemWithIcon}
                  onPress={() => handleNavigate("/profile")}
                >
                  <UserIcon size={20} color="#4b5563" />
                  <Text style={styles.menuItemTextIcon}>Hồ sơ của tôi</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.menuItemWithIcon}
                  onPress={closeMenu}
                >
                  <Settings size={20} color="#4b5563" />
                  <Text style={styles.menuItemTextIcon}>Cài đặt</Text>
                </TouchableOpacity>
              </ScrollView>

              <View
                style={[
                  styles.menuFooter,
                  { paddingBottom: insets.bottom || 24 },
                ]}
              >
                <TouchableOpacity
                  style={styles.menuLogoutBtn}
                  onPress={handleLogout}
                >
                  <LogOut size={20} color="#ef4444" />
                  <Text style={styles.menuLogoutText}>Đăng xuất</Text>
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
            <Text style={styles.greenTitle}>Cây Trồng{"\n"}</Text>Thông Minh
          </Text>

          <Text style={styles.description}>
            Chẩn đoán bệnh cây trồng tức thì bằng AI. Nhận phác đồ điều trị khoa
            học và lộ trình chăm sóc bền vững.
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
            <TouchableOpacity
              style={styles.secondaryBtn}
              activeOpacity={0.6}
              onPress={() => router.push("/about")}
            >
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
              Hệ thống tích hợp đa tính năng giúp bạn quản lý vườn cây khoa học.
            </Text>
          </View>

          <View style={styles.featuresList}>
            {/* 🔥 ĐÃ BIẾN CÁC KHỐI NÀY THÀNH NÚT BẤM CHUYỂN TRANG */}
            {features.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.featureCard}
                activeOpacity={0.7}
                onPress={() => router.push(item.route as any)}
              >
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
              </TouchableOpacity>
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
  navbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: "#fafaf9",
  },
  logoWrapper: { flexDirection: "row", alignItems: "center", gap: 8 },
  logoIconBox: { backgroundColor: "#2e7d32", padding: 6, borderRadius: 8 },
  logoTitle: { fontSize: 20, fontWeight: "800", color: "#111827" },

  avatarBtnNavbar: { padding: 4 },
  avatarRingSmall: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  avatarCircleSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#dc2626",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarTextSmall: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    letterSpacing: 1,
  },

  modalContainer: { flex: 1, flexDirection: "row" },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  drawer: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: width * 0.75,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: -5, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
  },
  menuContent: { flex: 1 },
  menuHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  menuTitle: { fontSize: 16, fontWeight: "600", color: "#111827" },
  closeBtn: { padding: 4 },

  userInfoSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    backgroundColor: "#fafaf9",
  },
  avatarRingLarge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    marginRight: 12,
  },
  avatarCircleLarge: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#dc2626",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarTextLarge: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  userDetails: { flex: 1, paddingRight: 10 },
  userName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 2,
  },
  userEmail: { fontSize: 13, color: "#6b7280" },

  menuLinks: { flex: 1, paddingHorizontal: 24, paddingTop: 10 },
  menuItem: {
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#f9fafb",
  },
  menuItemText: { fontSize: 16, color: "#374151", fontWeight: "600" },
  divider: { height: 1, backgroundColor: "#f3f4f6", marginVertical: 10 },
  menuItemWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    gap: 12,
  },
  menuItemTextIcon: { fontSize: 16, color: "#4b5563", fontWeight: "500" },
  menuFooter: {
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
    paddingTop: 20,
  },
  menuLogoutBtn: {
    flexDirection: "row",
    backgroundColor: "#fef2f2",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  menuLogoutText: { color: "#ef4444", fontSize: 15, fontWeight: "bold" },

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
