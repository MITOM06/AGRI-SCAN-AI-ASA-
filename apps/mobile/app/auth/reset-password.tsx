import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "expo-router";
import { Lock, Eye, EyeOff } from "lucide-react-native";

// CHUẨN MONOREPO: Import schema từ shared
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "@agri-scan/shared";

// Import các component dùng chung
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { AuthHeader } from "./AuthHeader";

// 🌟 TUYỆT CHIÊU CUSTOM RESOLVER 🌟
const customResetResolver = async (values: any) => {
  const result = resetPasswordSchema.safeParse(values);
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

export default function ResetPasswordScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, handleSubmit, watch } = useForm<ResetPasswordFormData>({
    resolver: customResetResolver,
    mode: "onChange",
    defaultValues: {
      token: "dummy_token_from_otp", // Schema yêu cầu token, nên gán tạm mặc định để nó không báo lỗi token
      password: "",
      confirmPassword: "",
    },
  });

  // Check độ mạnh mật khẩu y như trang Đăng ký
  const password = watch("password", "");
  const isPasswordLengthValid = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsSubmitting(true);
    // TODO: Giả lập gọi API đổi mật khẩu
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Dữ liệu đổi pass:", data);
    setIsSubmitting(false);

    Alert.alert("Thành công", "Mật khẩu của bạn đã được cập nhật!", [
      { text: "Đăng nhập ngay", onPress: () => router.replace("/auth/login") },
    ]);
  };

  return (
    <View style={styles.container}>
      <AuthHeader showBack={true} />

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
                <Lock size={28} color="#16a34a" />
              </View>
              <Text style={styles.title}>Mật khẩu mới</Text>
              <Text style={styles.subtitle}>
                Vui lòng nhập mật khẩu mới để hoàn tất việc khôi phục tài khoản
              </Text>
            </View>

            {/* Mật khẩu mới */}
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
                      label="Mật khẩu mới"
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
              <Text style={hasUpperCase ? styles.reqValid : styles.reqInvalid}>
                • Chứa ít nhất 1 chữ hoa
              </Text>
              <Text style={hasLowerCase ? styles.reqValid : styles.reqInvalid}>
                • Chứa ít nhất 1 chữ thường
              </Text>
              <Text style={hasNumber ? styles.reqValid : styles.reqInvalid}>
                • Chứa ít nhất 1 số
              </Text>
              <Text
                style={hasSpecialChar ? styles.reqValid : styles.reqInvalid}
              >
                • Chứa ít nhất 1 ký tự đặc biệt
              </Text>
            </View>

            {/* Xác nhận mật khẩu */}
            <Controller
              control={control}
              name="confirmPassword"
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <View style={styles.inputGroup}>
                  <View style={styles.passwordWrapper}>
                    <Input
                      label="Xác nhận mật khẩu"
                      placeholder="••••••••"
                      secureTextEntry={!showConfirmPassword}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      error={error?.message}
                    />
                    <TouchableOpacity
                      style={styles.eyeIcon}
                      onPress={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
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
              title="Cập nhật mật khẩu"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              onPress={handleSubmit(onSubmit)}
              style={styles.submitButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
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
  header: { alignItems: "center", marginBottom: 25 },
  iconContainer: {
    width: 52,
    height: 52,
    backgroundColor: "#dcfce3",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: { fontSize: 22, fontWeight: "bold", color: "#111827" },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 6,
    lineHeight: 20,
  },

  inputGroup: { marginBottom: 14 },
  passwordWrapper: { position: "relative" },
  eyeIcon: { position: "absolute", right: 12, top: 38, padding: 4, zIndex: 1 },

  requirementsContainer: {
    marginTop: -4,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  requirementsTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
  },
  reqValid: { fontSize: 12, color: "#16a34a", marginBottom: 2 },
  reqInvalid: { fontSize: 12, color: "#9ca3af", marginBottom: 2 },

  submitButton: { marginTop: 10 },
});
