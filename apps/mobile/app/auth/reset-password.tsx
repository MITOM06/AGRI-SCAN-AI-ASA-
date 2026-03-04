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
import { useRouter } from "expo-router";
import { Lock, Eye, EyeOff } from "lucide-react-native";

// Import các component dùng chung
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { AuthHeader } from "./AuthHeader";

export default function ResetPasswordScreen() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleComplete = async () => {
    if (!password || password.length < 8) {
      Alert.alert("Thông báo", "Mật khẩu phải có ít nhất 8 ký tự");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp");
      return;
    }

    setIsSubmitting(true);
    // Giả lập gọi API đổi mật khẩu
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    Alert.alert("Thành công", "Mật khẩu của bạn đã được cập nhật!", [
      { text: "Đăng nhập ngay", onPress: () => router.replace("/auth/login") },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Nút quay lại cố định trên đỉnh */}
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
            <View style={styles.passwordWrapper}>
              <Input
                label="Mật khẩu mới"
                placeholder="••••••••"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
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

            {/* Xác nhận mật khẩu */}
            <Input
              label="Xác nhận mật khẩu"
              placeholder="••••••••"
              secureTextEntry={!showPassword} // Dùng chung trạng thái ẩn hiện với ô trên cho tiện
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            <Button
              title="Cập nhật mật khẩu"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              onPress={handleComplete}
              style={styles.submitButton}
            />
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
    justifyContent: "center", // Căn giữa Card theo chiều dọc
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
  header: {
    alignItems: "center",
    marginBottom: 25,
  },
  iconContainer: {
    width: 52,
    height: 52,
    backgroundColor: "#dcfce3",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111827",
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 6,
    lineHeight: 20,
  },
  passwordWrapper: {
    position: "relative",
  },
  eyeIcon: {
    position: "absolute",
    right: 12,
    top: 38,
    padding: 4,
    zIndex: 1,
  },
  submitButton: {
    marginTop: 10,
  },
});
