import { Footer } from "../../components/ui/Footer";
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  BackHandler,
  Animated,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { Link, useRouter, useLocalSearchParams } from "expo-router";
import {
  Leaf,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";

import { loginSchema, type LoginFormData, authApi } from "@agri-scan/shared";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

const customLoginResolver = async (values: any) => {
  const result = loginSchema.safeParse(values);
  if (result.success) return { values: result.data, errors: {} };
  const formErrors: Record<string, any> = {};
  const fieldErrors = result.error.flatten().fieldErrors;
  for (const key in fieldErrors) {
    formErrors[key] = {
      type: "validation",
      message: fieldErrors[key as keyof typeof fieldErrors]?.[0],
    };
  }
  return { values: {}, errors: formErrors };
};

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { registered } = useLocalSearchParams();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState("");

  const { control, handleSubmit } = useForm<LoginFormData>({
    resolver: customLoginResolver,
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(-10)).current;

  useEffect(() => {
    if (registered === "true") {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [registered]);

  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      router.replace("/");
      return true;
    });
    return () => sub.remove();
  }, []);

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    setApiError("");
    try {
      const response = await authApi.login({
        email: data.email,
        password: data.password,
      });

      // Lưu token trực tiếp theo platform - KHÔNG phụ thuộc getTokenStorage()
      if (Platform.OS === "web") {
        localStorage.setItem("accessToken", response.accessToken);
        localStorage.setItem("refreshToken", response.refreshToken);
        localStorage.setItem("user", JSON.stringify(response.user));
      } else {
        await SecureStore.setItemAsync("accessToken", response.accessToken);
        await SecureStore.setItemAsync("refreshToken", response.refreshToken);
        await SecureStore.setItemAsync("user", JSON.stringify(response.user));
      }

      router.replace("/user");
    } catch (error: any) {
      setApiError(
        error.response?.data?.message ||
          "Đăng nhập thất bại. Vui lòng thử lại.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={[styles.customHeader, { paddingTop: Math.max(insets.top, 20) }]}
      >
        <TouchableOpacity
          onPress={() => router.replace("/")}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <ArrowLeft size={26} color="#374151" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <Leaf size={28} color="#16a34a" />
              </View>
              <Text style={styles.title}>Chào mừng trở lại</Text>
              <Text style={styles.subtitle}>
                Đăng nhập để tiếp tục quản lý vườn cây của bạn
              </Text>
            </View>

            {registered === "true" && (
              <Animated.View
                style={[
                  styles.successAlert,
                  {
                    opacity: fadeAnim,
                    transform: [{ translateY: translateYAnim }],
                  },
                ]}
              >
                <CheckCircle2
                  size={20}
                  color="#15803d"
                  style={{ marginTop: 2 }}
                />
                <View style={styles.successTextContainer}>
                  <Text style={styles.successTitle}>Đăng ký thành công!</Text>
                  <Text style={styles.successDesc}>
                    Vui lòng đăng nhập bằng email và mật khẩu vừa tạo.
                  </Text>
                </View>
              </Animated.View>
            )}

            {apiError !== "" && (
              <View style={styles.errorAlert}>
                <Text style={styles.errorText}>{apiError}</Text>
              </View>
            )}

            <View style={styles.form}>
              <Controller
                control={control}
                name="email"
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error },
                }) => (
                  <View style={styles.inputGroup}>
                    <Input
                      label="Email"
                      placeholder="name@example.com"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      error={error?.message}
                    />
                  </View>
                )}
              />

              <View style={styles.passwordHeader}>
                <Text style={styles.customLabel}>Mật khẩu</Text>
                <Link href="/auth/forgot-password" style={styles.forgotLink}>
                  Quên mật khẩu?
                </Link>
              </View>

              <Controller
                control={control}
                name="password"
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error },
                }) => (
                  <View style={styles.inputGroup}>
                    <View style={styles.passwordWrapper}>
                      <Input
                        placeholder="••••••••"
                        secureTextEntry={!showPassword}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        error={error?.message}
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
                )}
              />

              <Button
                title="Đăng nhập"
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
                onPress={handleSubmit(onSubmit)}
                style={styles.submitButton}
              />

              <View style={styles.footer}>
                <Text style={styles.footerText}>Chưa có tài khoản? </Text>
                <Link href="/auth/register" style={styles.registerLink}>
                  Đăng ký ngay
                </Link>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  customHeader: { paddingHorizontal: 16, zIndex: 10 },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: 40,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 24,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  header: { alignItems: "center", marginBottom: 24 },
  iconContainer: {
    width: 48,
    height: 48,
    backgroundColor: "rgba(22, 163, 74, 0.1)",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
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
    marginTop: 4,
  },
  customLabel: { fontSize: 14, fontWeight: "500", color: "#374151" },
  forgotLink: { fontSize: 14, fontWeight: "500", color: "#16a34a" },
  passwordWrapper: { position: "relative" },
  eyeIcon: { position: "absolute", right: 12, top: 12, padding: 4 },
  submitButton: { marginTop: 12 },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 24 },
  footerText: { color: "#6b7280", fontSize: 14 },
  registerLink: { color: "#16a34a", fontWeight: "600", fontSize: 14 },
});
