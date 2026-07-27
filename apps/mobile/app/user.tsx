import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
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
  Sprout,
  X,
  User as UserIcon,
  Settings,
  LogOut,
  Bell,
  CloudSun,
  BookOpen,
  ShoppingCart,
  Store,
  ShieldAlert,
  MessageSquare,
  Library,
} from "lucide-react-native";

import { styles } from "../styles/user.styles";
const { width } = Dimensions.get("window");

export default function UserHomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userData, setUserData] = useState<{
    fullName?: string;
    email?: string;
    plan?: string;
    role?: string;
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
        if (userStr) setUserData(JSON.parse(userStr));
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
        router.replace("/auth/login" as any);
      }, 300);
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
    }
  };

  const currentPlanStr = userData?.plan || "FREE";
  const planColor =
    currentPlanStr === "VIP" || currentPlanStr === "PRO"
      ? "#eab308"
      : currentPlanStr === "PLUS" || currentPlanStr === "PREMIUM"
        ? "#8b5cf6"
        : "#d1d5db";

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
      icon: <Library size={28} color="#0ea5e9" />,
      title: "Từ điển cây",
      description:
        "Tra cứu thông tin chi tiết về các loại bệnh và cách phòng trừ.",
      colorBg: "#e0f2fe",
      route: "/tree-dictionary", // 🔥 ĐÃ SỬA: Khớp với tên file tree-dictionary.tsx
    },
    {
      icon: <CloudSun size={28} color="#06b6d4" />,
      title: "Agri-Weather",
      description:
        "Dự báo thời tiết chuyên sâu và khuyến nghị chăm sóc theo ngày.",
      colorBg: "#ecfeff",
      route: "/weather",
    },
    {
      icon: <ShoppingCart size={28} color="#f59e0b" />,
      title: "Agri-Shop",
      description:
        "Chợ vật tư nông nghiệp, phân bón và thuốc sinh học chính hãng.",
      colorBg: "#fef3c7",
      route: "/shop",
    },
    {
      icon: <Store size={28} color="#db2777" />,
      title: "Gian hàng của tôi",
      description: "Đăng bán nông sản, vật tư và quản lý đơn khách đặt.",
      colorBg: "#fce7f3",
      route: "/my-shop",
    },
    {
      icon: <Sprout size={28} color="#8b5cf6" />,
      title: "My Garden",
      description: "Quản lý danh sách cây trồng và theo dõi lịch chăm sóc.",
      colorBg: "#f3e8ff",
      route: "/my-garden",
    },
    {
      icon: <BookOpen size={28} color="#10b981" />,
      title: "Farming Tips",
      description:
        "Cẩm nang kiến thức, bí quyết bón phân và chăm sóc cây trồng.",
      colorBg: "#ecfdf5",
      route: "/tips",
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />

      <View
        style={[styles.navbar, { paddingTop: Math.max(insets.top, 10) + 10 }]}
      >
        <View style={styles.logoWrapper}>
          <View style={styles.logoIconBox}>
            <Leaf size={18} color="#fff" />
          </View>
          <Text style={styles.logoTitle}>Agri-Scan</Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={() => router.push("/notification" as any)}
            style={styles.bellBtn}
          >
            <Bell size={24} color="#374151" />
            <View style={styles.bellDot} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={openMenu}
            style={styles.avatarBtnNavbar}
            activeOpacity={0.8}
          >
            <View style={[styles.avatarRingSmall, { borderColor: planColor }]}>
              <View style={styles.avatarCircleSmall}>
                <Text style={styles.avatarTextSmall}>
                  {getInitials(userData?.fullName)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>

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
                {userData?.role === "ADMIN" && (
                  <TouchableOpacity
                    style={styles.adminMenuItem}
                    onPress={() => handleNavigate("/admin")}
                  >
                    <ShieldAlert size={20} color="#dc2626" />
                    <Text style={styles.adminMenuText}>Quản trị Hệ thống</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.menuItem} onPress={closeMenu}>
                  <Text style={styles.menuItemText}>Trang chủ</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleNavigate("/scan")}
                >
                  <Text style={styles.menuItemText}>Chẩn đoán AI</Text>
                </TouchableOpacity>

                {/* 🔥 ĐÃ SỬA: Trỏ về /tree-dictionary */}
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleNavigate("/tree-dictionary")}
                >
                  <Text style={styles.menuItemText}>Từ điển cây</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleNavigate("/shop")}
                >
                  <Text style={styles.menuItemText}>Cửa hàng vật tư (Mua)</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleNavigate("/my-shop")}
                >
                  <Text style={[styles.menuItemText, { color: "#db2777" }]}>
                    Gian hàng của tôi (Bán)
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleNavigate("/my-garden")}
                >
                  <Text style={styles.menuItemText}>Vườn của tôi</Text>
                </TouchableOpacity>

                <View style={styles.divider} />
                <TouchableOpacity
                  style={styles.menuItemWithIcon}
                  onPress={() => handleNavigate("/feedback")}
                >
                  <MessageSquare size={20} color="#4b5563" />
                  <Text style={styles.menuItemTextIcon}>
                    Gửi phản hồi & Hỗ trợ
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.menuItemWithIcon}
                  onPress={() => handleNavigate("/profile")}
                >
                  <UserIcon size={20} color="#4b5563" />
                  <Text style={styles.menuItemTextIcon}>Hồ sơ của tôi</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.menuItemWithIcon}
                  onPress={() => handleNavigate("/setting")}
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
              onPress={() => router.push("/scan" as any)}
            >
              <Text style={styles.primaryBtnText}>Chẩn đoán ngay</Text>
              <ArrowRight size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.featuresSection}>
          <View style={styles.featuresHeader}>
            <Text style={styles.featuresEyebrow}>HỆ SINH THÁI TÍNH NĂNG</Text>
            <Text style={styles.featuresTitle}>
              Công nghệ tiên phong{"\n"}cho nông nghiệp bền vững
            </Text>
          </View>
          <View style={styles.featuresList}>
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
                <View style={{ flex: 1 }}>
                  <Text style={styles.featureItemTitle}>{item.title}</Text>
                  <Text style={styles.featureItemDesc}>{item.description}</Text>
                </View>
                <ArrowRight size={20} color="#d1d5db" />
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
