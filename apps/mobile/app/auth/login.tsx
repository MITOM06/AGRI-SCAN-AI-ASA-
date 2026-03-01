import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "expo-router";
import { z } from "zod";
import { Leaf } from "lucide-react-native";

// Import các component dùng chung mà chúng ta vừa tạo
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

// Tạm thời định nghĩa Schema nội bộ để xử lý dứt điểm lỗi Zod
const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(8, "Mật khẩu tối thiểu 8 ký tự"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema as any), // Tạm thời ép kiểu để xử lý lỗi Zod
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    // TODO: Tích hợp API đăng nhập sau
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Dữ liệu đăng nhập:", data);
    setIsSubmitting(false);

    // Đăng nhập xong chuyển về trang chủ
    router.replace("/");
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { justifyContent: "center" },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            {/* --- Phần Header --- */}
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <Leaf size={28} color="#16a34a" />
              </View>
              <Text style={styles.title}>Chào mừng trở lại</Text>
              <Text style={styles.subtitle}>
                Đăng nhập để tiếp tục quản lý vườn cây của bạn
              </Text>
            </View>

            {/* --- Phần Form Nhập liệu --- */}
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

// Styles cho các phần bố cục (Layout)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb", // Tương đương bg-gray-50
  },
  scrollContent: {
    flexGrow: 1,
    // justifyContent: "center",
    // padding: 16,
    paddingTop: Platform.OS === "ios" ? 100 : 60,
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
    backgroundColor: "rgba(22, 163, 74, 0.1)", // bg-primary/10
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
    marginTop: -4, // Căn chỉnh lại khoảng cách do Input email phía trên
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
    marginTop: 8,
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
