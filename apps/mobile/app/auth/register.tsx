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
import { Link, useRouter } from "expo-router";
import { Leaf, Eye, EyeOff } from "lucide-react-native";

import { registerSchema, type RegisterFormData, authApi } from "@agri-scan/shared";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { AuthHeader } from "./AuthHeader";

const customZodResolver = async (values: any) => {
  const result = registerSchema.safeParse(values);
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

export default function RegisterScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  const { control, handleSubmit, watch } = useForm<RegisterFormData>({
    resolver: customZodResolver,
    mode: "onChange",
    defaultValues: { fullName: "", email: "", password: "", confirmPassword: "" },
  });

  const password = watch("password", "");
  const isPasswordLengthValid = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

  // BUG FIX: trước đây chỉ console.log và redirect, không gọi API thật
  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    setApiError("");
    try {
      await authApi.register({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
      });
      router.replace({
        pathname: "/auth/login",
        params: { registered: "true" },
      });
    } catch (error: any) {
      setApiError(
        error.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <AuthHeader showBack={true} />

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
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <Leaf size={28} color="#16a34a" />
              </View>
              <Text style={styles.title}>Tạo tài khoản mới</Text>
              <Text style={styles.subtitle}>
                Bắt đầu hành trình quản lý vườn cây thông minh
              </Text>
            </View>

            {apiError !== "" && (
              <View style={styles.errorAlert}>
                <Text style={styles.errorText}>{apiError}</Text>
              </View>
            )}

            <View style={styles.form}>
              <Controller
                control={control}
                name="fullName"
                render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                  <View style={styles.inputGroup}>
                    <Input label="Họ và tên" placeholder="Nguyễn Văn A"
                      onBlur={onBlur} onChangeText={onChange} value={value} error={error?.message} />
                  </View>
                )}
              />

              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                  <View style={styles.inputGroup}>
                    <Input label="Email" placeholder="name@example.com"
                      keyboardType="email-address" autoCapitalize="none"
                      onBlur={onBlur} onChangeText={onChange} value={value} error={error?.message} />
                  </View>
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                  <View style={styles.inputGroup}>
                    <View style={styles.passwordWrapper}>
                      <Input label="Mật khẩu" placeholder="••••••••"
                        secureTextEntry={!showPassword}
                        onBlur={onBlur} onChangeText={onChange} value={value} error={error?.message} />
                      <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff size={20} color="#9ca3af" /> : <Eye size={20} color="#9ca3af" />}
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              />

              <View style={styles.requirementsContainer}>
                <Text style={styles.requirementsTitle}>Yêu cầu mật khẩu:</Text>
                {[
                  [isPasswordLengthValid, "Ít nhất 8 ký tự"],
                  [hasUpperCase, "Ít nhất 1 chữ hoa"],
                  [hasLowerCase, "Ít nhất 1 chữ thường"],
                  [hasNumber, "Ít nhất 1 số"],
                  [hasSpecialChar, "Ít nhất 1 ký tự đặc biệt"],
                ].map(([valid, label]) => (
                  <Text key={label as string} style={valid ? styles.reqValid : styles.reqInvalid}>
                    • {label as string}
                  </Text>
                ))}
              </View>

              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                  <View style={styles.inputGroup}>
                    <View style={styles.passwordWrapper}>
                      <Input label="Xác nhận mật khẩu" placeholder="••••••••"
                        secureTextEntry={!showConfirmPassword}
                        onBlur={onBlur} onChangeText={onChange} value={value} error={error?.message} />
                      <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                        {showConfirmPassword ? <EyeOff size={20} color="#9ca3af" /> : <Eye size={20} color="#9ca3af" />}
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              />

              <Button title="Tạo tài khoản" variant="primary" size="lg"
                isLoading={isSubmitting} onPress={handleSubmit(onSubmit)} style={styles.submitButton} />

              <View style={styles.footer}>
                <Text style={styles.footerText}>Đã có tài khoản? </Text>
                <Link href="/auth/login" style={styles.loginLink}>Đăng nhập</Link>
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
  scrollContent: { flexGrow: 1, paddingHorizontal: 16, paddingTop: 10, paddingBottom: 40 },
  card: { backgroundColor: "#ffffff", padding: 24, borderRadius: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
  header: { alignItems: "center", marginBottom: 24 },
  iconContainer: { width: 52, height: 52, backgroundColor: "rgba(22, 163, 74, 0.1)", borderRadius: 14, alignItems: "center", justifyContent: "center", marginBottom: 16 },
  title: { fontSize: 24, fontWeight: "bold", color: "#111827", marginBottom: 8 },
  subtitle: { color: "#4b5563", textAlign: "center", fontSize: 14, lineHeight: 20 },
  errorAlert: { backgroundColor: "#fef2f2", borderWidth: 1, borderColor: "#fecaca", borderRadius: 12, padding: 12, marginBottom: 16 },
  errorText: { color: "#dc2626", fontSize: 14, textAlign: "center" },
  form: { width: "100%" },
  inputGroup: { marginBottom: 14 },
  passwordWrapper: { position: "relative" },
  eyeIcon: { position: "absolute", right: 12, top: 38, padding: 4 },
  requirementsContainer: { marginTop: -4, marginBottom: 16, paddingHorizontal: 4 },
  requirementsTitle: { fontSize: 13, fontWeight: "600", color: "#374151", marginBottom: 6 },
  reqValid: { fontSize: 12, color: "#16a34a", marginBottom: 2 },
  reqInvalid: { fontSize: 12, color: "#9ca3af", marginBottom: 2 },
  submitButton: { marginTop: 8 },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 24 },
  footerText: { color: "#6b7280", fontSize: 14 },
  loginLink: { color: "#16a34a", fontWeight: "700", fontSize: 14 },
});
