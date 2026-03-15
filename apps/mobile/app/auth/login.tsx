import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { Link, useRouter, useLocalSearchParams } from "expo-router";
import {
  Leaf,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Check,
} from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";

// 🔥 Đã xóa loginSchema để tránh lỗi vỡ form ngầm
import { type LoginFormData, authApi } from "@agri-scan/shared";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const isFromRegister = params.registered === "true";

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  // ==========================================
  // 🔥 CẤU HÌNH GOOGLE AUTH SESSION TỪ BIẾN MÔI TRƯỜNG
  // ==========================================
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    webClientId:
      process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID ||
      "702635334461-qq8hvp2rom1e4slf27ftavn502nprrj6.apps.googleusercontent.com",
    iosClientId:
      process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID ||
      "702635334461-qq8hvp2rom1e4slf27ftavn502nprrj6.apps.googleusercontent.com",
    androidClientId:
      process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID ||
      "702635334461-qq8hvp2rom1e4slf27ftavn502nprrj6.apps.googleusercontent.com",
    redirectUri:
      Platform.OS === "web"
        ? "http://localhost:8081"
        : "https://auth.expo.io/@tungpro123/mobile",
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      if (id_token) verifyGoogleTokenWithBackend(id_token);
    } else if (response?.type === "error") {
      setApiError("Hủy đăng nhập hoặc có lỗi từ Google.");
    }
  }, [response]);

  const verifyGoogleTokenWithBackend = async (idToken: string) => {
    setIsSubmitting(true);
    setApiError("");
    try {
      const res = await authApi.loginWithGoogleMobile(idToken);
      if (Platform.OS === "web") {
        localStorage.setItem("accessToken", res.accessToken);
        localStorage.setItem("refreshToken", res.refreshToken);
        localStorage.setItem("user", JSON.stringify(res.user));
      } else {
        await SecureStore.setItemAsync("accessToken", res.accessToken);
        await SecureStore.setItemAsync("refreshToken", res.refreshToken);
        await SecureStore.setItemAsync("user", JSON.stringify(res.user));
      }
      if (res.user?.role === 'ADMIN') {
        router.replace("/admin");
      } else {
        router.replace("/user");
      }
    } catch (error: any) {
      setApiError(
        error.response?.data?.message || "Đăng nhập Google thất bại!",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    if (!agreeTerms) {
      setApiError(
        "Vui lòng đồng ý với Điều khoản và Chính sách bảo mật trước!",
      );
      return;
    }
    promptAsync();
  };

  const handleFacebookLogin = () => {
    if (!agreeTerms) {
      setApiError("Vui lòng đồng ý với Điều khoản trước!");
      return;
    }
    Alert.alert("Thông báo", "Facebook Login đang được tích hợp!");
  };

  // ==========================================
  // 🔥 LOGIC ĐĂNG NHẬP (ĐÃ CHUYỂN SANG BẮT LỖI THỦ CÔNG)
  // ==========================================

  // Lấy getValues ra để lấy dữ liệu thay vì chờ handleSubmit
  const { control, getValues } = useForm<LoginFormData>({
    defaultValues: { email: "", password: "" },
  });

  const onManualSubmit = async () => {
    const data = getValues(); // Lấy dữ liệu ngay lập tức từ ô input

    // 1. Rào chắn: Phải nhập đủ thông tin
    if (!data.email || !data.password) {
      setApiError("Vui lòng nhập đầy đủ Email và Mật khẩu!");
      return;
    }

    // 2. Rào chắn: Phải đồng ý điều khoản
    if (!agreeTerms) {
      setApiError("Vui lòng đồng ý với Điều khoản và Chính sách bảo mật!");
      return;
    }

    setIsSubmitting(true);
    setApiError("");

    try {
      // 3. Gọi API đăng nhập
      const res = await authApi.login(data);
      if (Platform.OS === "web") {
        localStorage.setItem("accessToken", res.accessToken);
        localStorage.setItem("refreshToken", res.refreshToken);
        localStorage.setItem("user", JSON.stringify(res.user));
      } else {
        await SecureStore.setItemAsync("accessToken", res.accessToken);
        await SecureStore.setItemAsync("refreshToken", res.refreshToken);
        await SecureStore.setItemAsync("user", JSON.stringify(res.user));
      }
      if (res.user?.role === 'ADMIN') {
        router.replace("/admin");
      } else {
        router.replace("/user");
      }
    } catch (error: any) {
      // Bắt lỗi từ Backend trả về
      setApiError(
        error.response?.data?.message ||
        "Đăng nhập thất bại. Vui lòng thử lại!",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: Math.max(insets.top, 20) + 20 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled" // 🔥 ĐÃ THÊM: Sửa triệt để lỗi phải bấm 2 lần
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color="#374151" />
        </TouchableOpacity>

        <View style={styles.card}>
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Leaf size={32} color="#16a34a" />
            </View>
            <Text style={styles.title}>Chào mừng trở lại!</Text>
            <Text style={styles.subtitle}>
              Đăng nhập để tiếp tục chăm sóc khu vườn của bạn
            </Text>
          </View>

          {isFromRegister && (
            <View style={styles.successAlert}>
              <CheckCircle2 size={20} color="#16a34a" />
              <View style={styles.successTextContainer}>
                <Text style={styles.successTitle}>Đăng ký thành công!</Text>
                <Text style={styles.successDesc}>
                  Vui lòng đăng nhập với tài khoản vừa tạo.
                </Text>
              </View>
            </View>
          )}

          {apiError ? (
            <View style={styles.errorAlert}>
              <Text style={styles.errorText}>{apiError}</Text>
            </View>
          ) : null}

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Email"
                    placeholder="Nhập địa chỉ email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onBlur={onBlur}
                    onChangeText={(text) => {
                      onChange(text);
                      if (apiError) setApiError("");
                    }}
                    value={value}
                  />
                )}
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.passwordHeader}>
                <Text style={styles.inputLabel}>Mật khẩu</Text>
                <Link href="/auth/forgot-password" asChild>
                  <TouchableOpacity>
                    <Text style={styles.forgotPassword}>Quên mật khẩu?</Text>
                  </TouchableOpacity>
                </Link>
              </View>
              <View style={styles.passwordWrapper}>
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      placeholder="Nhập mật khẩu của bạn"
                      secureTextEntry={!showPassword}
                      onBlur={onBlur}
                      onChangeText={(text) => {
                        onChange(text);
                        if (apiError) setApiError("");
                      }}
                      value={value}
                    />
                  )}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={20} color="#9ca3af" />
                  ) : (
                    <Eye size={20} color="#9ca3af" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* CHECKBOX */}
            <TouchableOpacity
              style={styles.checkboxContainer}
              activeOpacity={0.7}
              onPress={() => {
                setAgreeTerms(!agreeTerms);
                if (apiError) setApiError("");
              }}
            >
              <View
                style={[styles.checkbox, agreeTerms && styles.checkboxActive]}
              >
                {agreeTerms && <Check size={14} color="#fff" strokeWidth={3} />}
              </View>
              <Text style={styles.checkboxText}>
                Tôi đồng ý với <Text style={styles.linkText}>Điều khoản</Text>{" "}
                và <Text style={styles.linkText}>CSBM</Text>
              </Text>
            </TouchableOpacity>

            <Button
              title="Đăng nhập"
              onPress={onManualSubmit} // 🔥 ĐÃ THAY ĐỔI: Gọi trực tiếp hàm submit siêu an toàn
              isLoading={isSubmitting}
              style={{ marginTop: 8 }}
            />

            {/* MẠNG XÃ HỘI */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>hoặc đăng nhập bằng</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialContainer}>
              <TouchableOpacity
                style={[styles.socialBtn, isSubmitting && { opacity: 0.5 }]}
                onPress={handleGoogleLogin}
                disabled={isSubmitting || !request}
                activeOpacity={0.7}
              >
                <Image
                  source={{
                    uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/120px-Google_%22G%22_logo.svg.png",
                  }}
                  style={styles.socialIcon}
                />
                <Text style={styles.socialBtnText}>Google</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.socialBtn,
                  { backgroundColor: "#1877F2", borderColor: "#1877F2" },
                ]}
                onPress={handleFacebookLogin}
                activeOpacity={0.7}
              >
                <Image
                  source={{
                    uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/2021_Facebook_icon.svg/120px-2021_Facebook_icon.svg.png",
                  }}
                  style={[styles.socialIcon, { tintColor: "#fff" }]}
                />
                <Text style={[styles.socialBtnText, { color: "#fff" }]}>
                  Facebook
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Chưa có tài khoản? </Text>
              <Link href="/auth/register" asChild>
                <TouchableOpacity>
                  <Text style={styles.registerLink}>Đăng ký ngay</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 40 },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 24,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  header: { alignItems: "center", marginBottom: 24 },
  iconContainer: {
    width: 60,
    height: 60,
    backgroundColor: "rgba(22, 163, 74, 0.1)",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  subtitle: { color: "#4b5563", textAlign: "center", fontSize: 14 },
  successAlert: {
    flexDirection: "row",
    backgroundColor: "#f0fdf4",
    borderWidth: 1,
    borderColor: "#bbf7d0",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    alignItems: "flex-start",
  },
  successTextContainer: { marginLeft: 12, flex: 1 },
  successTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#15803d",
    marginBottom: 4,
  },
  successDesc: { fontSize: 13, color: "#166534", lineHeight: 20 },
  errorAlert: {
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fecaca",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  errorText: { color: "#dc2626", fontSize: 14, textAlign: "center" },
  form: { width: "100%" },
  inputGroup: { marginBottom: 16 },
  passwordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  inputLabel: { fontSize: 14, fontWeight: "600", color: "#374151" },
  forgotPassword: { fontSize: 13, color: "#16a34a", fontWeight: "600" },
  passwordWrapper: { position: "relative" },
  eyeIcon: { position: "absolute", right: 12, top: 12, padding: 4 },

  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: "#d1d5db",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxActive: { backgroundColor: "#16a34a", borderColor: "#16a34a" },
  checkboxText: { flex: 1, fontSize: 13, color: "#4b5563", lineHeight: 20 },
  linkText: { color: "#16a34a", fontWeight: "bold" },

  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#e5e7eb" },
  dividerText: { marginHorizontal: 12, color: "#9ca3af", fontSize: 13 },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  socialBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#fff",
    marginHorizontal: 4,
  },
  socialIcon: { width: 20, height: 20, marginRight: 8, resizeMode: "contain" },
  socialBtnText: { fontSize: 15, fontWeight: "600", color: "#374151" },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  registerText: { color: "#6b7280", fontSize: 14 },
  registerLink: { color: "#16a34a", fontWeight: "bold", fontSize: 14 },
});
