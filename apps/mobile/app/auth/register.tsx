import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "expo-router";
import { z } from "zod";
import { Leaf, Eye, EyeOff } from "lucide-react-native";

// Import các component dùng chung
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { AuthHeader } from "./AuthHeader";

// Định nghĩa Schema validation
const registerSchema = z
  .object({
    fullName: z.string().min(1, "Vui lòng nhập họ tên"),
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(8, "Mật khẩu tối thiểu 8 ký tự"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema as any),
  });

  // Theo dõi mật khẩu để hiển thị gợi ý độ mạnh
  const password = watch("password", "");
  const isPasswordLengthValid = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    // Giả lập gọi API
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Dữ liệu đăng ký:", data);
    setIsSubmitting(false);
    router.replace("/auth/login");
  };

  return (
    <View style={styles.container}>
      {/* Nút quay lại luôn cố định ở trên cùng */}
      <AuthHeader showBack={false} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            {/* --- Header --- */}
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <Leaf size={28} color="#16a34a" />
              </View>
              <Text style={styles.title}>Tạo tài khoản mới</Text>
              <Text style={styles.subtitle}>
                Bắt đầu hành trình quản lý vườn cây thông minh
              </Text>
            </View>

            {/* --- Form Nhập liệu --- */}
            <View style={styles.form}>
              <Controller
                control={control}
                name="fullName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Họ và tên"
                    placeholder="Nguyễn Văn A"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    error={errors.fullName?.message}
                  />
                )}
              />

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

              {/* Mật khẩu */}
              <View style={styles.passwordWrapper}>
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="Mật khẩu"
                      placeholder="••••••••"
                      secureTextEntry={!showPassword}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      error={errors.password?.message}
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

              {/* Gợi ý độ mạnh mật khẩu */}
              <View style={styles.requirementsContainer}>
                <Text style={styles.requirementsTitle}>Yêu cầu mật khẩu:</Text>
                <Text
                  style={
                    isPasswordLengthValid ? styles.reqValid : styles.reqInvalid
                  }
                >
                  • Ít nhất 8 ký tự
                </Text>
                <Text
                  style={hasUpperCase ? styles.reqValid : styles.reqInvalid}
                >
                  • Chứa chữ in hoa
                </Text>
                <Text style={hasNumber ? styles.reqValid : styles.reqInvalid}>
                  • Chứa số
                </Text>
                <Text
                  style={hasSpecialChar ? styles.reqValid : styles.reqInvalid}
                >
                  • Chứa ký tự đặc biệt
                </Text>
              </View>

              {/* Xác nhận mật khẩu */}
              <View style={styles.passwordWrapper}>
                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="Xác nhận mật khẩu"
                      placeholder="••••••••"
                      secureTextEntry={!showConfirmPassword}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      error={errors.confirmPassword?.message}
                    />
                  )}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} color="#9ca3af" />
                  ) : (
                    <Eye size={20} color="#9ca3af" />
                  )}
                </TouchableOpacity>
              </View>

              <Button
                title="Tạo tài khoản"
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
                onPress={handleSubmit(onSubmit)}
                style={styles.submitButton}
              />

              <View style={styles.footer}>
                <Text style={styles.footerText}>Đã có tài khoản? </Text>
                <Link href="/auth/login" style={styles.loginLink}>
                  Đăng nhập
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 40,
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
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  iconContainer: {
    width: 52,
    height: 52,
    backgroundColor: "rgba(22, 163, 74, 0.1)",
    borderRadius: 14,
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
    lineHeight: 20,
  },
  form: {
    width: "100%",
  },
  passwordWrapper: {
    position: "relative",
  },
  eyeIcon: {
    position: "absolute",
    right: 12,
    top: 38,
    padding: 4,
  },
  requirementsContainer: {
    marginTop: -8,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  requirementsTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
  },
  reqValid: {
    fontSize: 12,
    color: "#16a34a",
    marginBottom: 2,
  },
  reqInvalid: {
    fontSize: 12,
    color: "#9ca3af",
    marginBottom: 2,
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
  loginLink: {
    color: "#16a34a",
    fontWeight: "700",
    fontSize: 14,
  },
});
