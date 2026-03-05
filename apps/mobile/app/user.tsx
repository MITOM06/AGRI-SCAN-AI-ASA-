import React, { useState, useEffect, useCallback } from "react";
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Alert, ActivityIndicator, Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import {
  User, LogOut, Mail, Shield, Leaf, ChevronRight, Clock,
} from "lucide-react-native";

import { authApi } from "@agri-scan/shared";
import type { IUser } from "@agri-scan/shared";

// ── Helper đọc user từ đúng storage theo platform ───────────────────────────
async function getStoredUser(): Promise<IUser | null> {
  try {
    const raw = Platform.OS === "web"
      ? localStorage.getItem("user")
      : await SecureStore.getItemAsync("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

async function clearAllStorage() {
  if (Platform.OS === "web") {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  } else {
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
    await SecureStore.deleteItemAsync("user");
  }
}

// ── Role badge ───────────────────────────────────────────────────────────────
const ROLE_CONFIG = {
  ADMIN:  { label: "Quản trị viên", color: "#7c3aed", bg: "#ede9fe" },
  EXPERT: { label: "Chuyên gia",    color: "#0369a1", bg: "#e0f2fe" },
  FARMER: { label: "Nông dân",      color: "#15803d", bg: "#dcfce7" },
};

export default function UserScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Đọc user từ storage khi màn hình load
  useEffect(() => {
    getStoredUser().then((stored) => {
      if (!stored) {
        // Không có user → chưa đăng nhập → về login
        router.replace("/auth/login");
      } else {
        setUser(stored);
      }
      setIsLoading(false);
    });
  }, []);

  const handleLogout = useCallback(() => {
    Alert.alert(
      "Đăng xuất",
      "Bạn có chắc muốn đăng xuất không?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Đăng xuất",
          style: "destructive",
          onPress: async () => {
            setIsLoggingOut(true);
            try {
              await authApi.logout(); // Báo BE xóa refresh token
            } catch {
              // Lỗi mạng → vẫn logout local
            } finally {
              await clearAllStorage();
              router.replace("/auth/login");
            }
          },
        },
      ]
    );
  }, []);

  // ── Loading state ──────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  if (!user) return null;

  const role = ROLE_CONFIG[user.role as keyof typeof ROLE_CONFIG] ?? ROLE_CONFIG.FARMER;
const initials = (user?.fullName || "Khách Hàng")
  .split(" ")
  .map((w) => w[0]?.toUpperCase() || "")
  .slice(0, 2)
  .join("");

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── Header ────────────────────────────────────────────────── */}
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <View style={styles.logoBox}><Leaf size={18} color="#fff" /></View>
            <Text style={styles.logoText}>Agri-Scan AI</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} disabled={isLoggingOut} style={styles.logoutBtn}>
            {isLoggingOut
              ? <ActivityIndicator size="small" color="#dc2626" />
              : <LogOut size={22} color="#dc2626" />}
          </TouchableOpacity>
        </View>

        {/* ── Avatar + Tên ──────────────────────────────────────────── */}
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.fullName}>{user.fullName}</Text>
          <View style={[styles.roleBadge, { backgroundColor: role.bg }]}>
            <Text style={[styles.roleText, { color: role.color }]}>{role.label}</Text>
          </View>
        </View>

        {/* ── Thông tin tài khoản ───────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin tài khoản</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={[styles.infoIcon, { backgroundColor: "#eff6ff" }]}>
                <Mail size={18} color="#2563eb" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{user.email}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={[styles.infoIcon, { backgroundColor: role.bg }]}>
                <Shield size={18} color={role.color} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Vai trò</Text>
                <Text style={styles.infoValue}>{role.label}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={[styles.infoIcon, { backgroundColor: "#f0fdf4" }]}>
                <User size={18} color="#16a34a" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>ID tài khoản</Text>
                <Text style={[styles.infoValue, styles.idText]}>{user.id}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ── Tính năng nhanh ───────────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tính năng</Text>
          <View style={styles.infoCard}>
            {[
              { label: "Chẩn đoán bệnh cây", route: "/scan", icon: <Leaf size={18} color="#16a34a" />, bg: "#f0fdf4" },
              { label: "Lịch sử quét", route: "/history", icon: <Clock size={18} color="#d97706" />, bg: "#fffbeb" },
            ].map((item, i, arr) => (
              <React.Fragment key={item.route}>
                <TouchableOpacity
                  style={styles.infoRow}
                  onPress={() => router.push(item.route as any)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.infoIcon, { backgroundColor: item.bg }]}>
                    {item.icon}
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoValue}>{item.label}</Text>
                  </View>
                  <ChevronRight size={18} color="#9ca3af" />
                </TouchableOpacity>
                {i < arr.length - 1 && <View style={styles.divider} />}
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* ── Nút đăng xuất ─────────────────────────────────────────── */}
        <View style={[styles.section, { marginBottom: insets.bottom + 24 }]}>
          <TouchableOpacity
            style={styles.logoutFullBtn}
            onPress={handleLogout}
            disabled={isLoggingOut}
            activeOpacity={0.8}
          >
            <LogOut size={18} color="#dc2626" />
            <Text style={styles.logoutFullText}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },

  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingVertical: 14 },
  logoRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  logoBox: { backgroundColor: "#16a34a", padding: 6, borderRadius: 8 },
  logoText: { fontSize: 18, fontWeight: "800", color: "#111827" },
  logoutBtn: { padding: 8 },

  profileSection: { alignItems: "center", paddingVertical: 24, paddingHorizontal: 20 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: "#16a34a", justifyContent: "center", alignItems: "center", marginBottom: 14, shadowColor: "#16a34a", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
  avatarText: { fontSize: 28, fontWeight: "bold", color: "#fff" },
  fullName: { fontSize: 22, fontWeight: "bold", color: "#111827", marginBottom: 8 },
  roleBadge: { paddingHorizontal: 14, paddingVertical: 5, borderRadius: 20 },
  roleText: { fontSize: 13, fontWeight: "600" },

  section: { paddingHorizontal: 16, marginBottom: 16 },
  sectionTitle: { fontSize: 13, fontWeight: "700", color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10, paddingHorizontal: 4 },

  infoCard: { backgroundColor: "#fff", borderRadius: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3, overflow: "hidden" },
  infoRow: { flexDirection: "row", alignItems: "center", padding: 16 },
  infoIcon: { width: 38, height: 38, borderRadius: 10, justifyContent: "center", alignItems: "center", marginRight: 14 },
  infoContent: { flex: 1 },
  infoLabel: { fontSize: 12, color: "#9ca3af", marginBottom: 2 },
  infoValue: { fontSize: 15, fontWeight: "500", color: "#111827" },
  idText: { fontSize: 12, color: "#6b7280", fontFamily: Platform.OS === "ios" ? "Courier" : "monospace" },
  divider: { height: 1, backgroundColor: "#f3f4f6", marginHorizontal: 16 },

  logoutFullBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, backgroundColor: "#fef2f2", borderWidth: 1, borderColor: "#fecaca", borderRadius: 14, paddingVertical: 16 },
  logoutFullText: { fontSize: 16, fontWeight: "600", color: "#dc2626" },
});
