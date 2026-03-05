import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  BackHandler, // Thêm để xử lý nút lùi Android
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "expo-router";
import { z } from "zod";
import { Leaf, ArrowLeft } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Import các component UI chung
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

// Định nghĩa Schema validation
const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(8, "Mật khẩu tối thiểu 8 ký tự"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- XỬ LÝ CHẶN NÚT QUAY LẠI TRÊN ANDROID ---
  useEffect(() => {
    const onBackPress = () => {
      // Khi bấm nút lùi cứng, thay vì quay lại trang cũ (như trang Đổi mật khẩu),
      // ta ép app quay về hẳn trang chủ (Home).
      router.replace("/");
      return true; // Trả về true để ngăn hệ thống thực hiện hành động lùi mặc định
    };

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress,
    );

    return () => subscription.remove();
  }, []);
  // ------------------------------------------

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema as any),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    // Giả lập gọi API đăng nhập
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Dữ liệu đăng nhập:", data);
    setIsSubmitting(false);

    // Đăng nhập thành công, thay thế lịch sử bằng trang User đã đăng nhập
    router.replace("/user");
  };

  return (
    <View style={styles.container}>
      {/* Nút Back tùy chỉnh: Ép về Home để xóa dấu vết các trang Quên mật khẩu trước đó */}
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
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <Leaf size={28} color="#16a34a" />
              </View>
              <Text style={styles.title}>Chào mừng trở lại</Text>
              <Text style={styles.subtitle}>
                Đăng nhập để tiếp tục quản lý vườn cây của bạn
              </Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Email"
                    placeholder="name@example.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    error={errors.email?.message}
                  />
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
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="••••••••"
                    secureTextEntry
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    error={errors.password?.message}
                  />
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
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  customHeader: {
    paddingHorizontal: 16,
    zIndex: 10,
  },
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
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
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
  subtitle: {
    color: "#4b5563",
    textAlign: "center",
    fontSize: 14,
  },
  form: {
    width: "100%",
  },
  passwordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
    marginTop: 4,
  },
  customLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  forgotLink: {
    fontSize: 14,
    fontWeight: "500",
    color: "#16a34a",
  },
  submitButton: {
    marginTop: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  footerText: {
    color: "#6b7280",
    fontSize: 14,
  },
  registerLink: {
    color: "#16a34a",
    fontWeight: "600",
    fontSize: 14,
  },
});
