import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Timer, Smartphone } from "lucide-react-native";

// Import các component dùng chung
import { Button } from "../../components/ui/Button";
import { AuthHeader } from "./AuthHeader";

export default function OTPVerificationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email || "email của bạn"; // Lấy email truyền từ trang Quên mật khẩu

  const [otp, setOtp] = useState("");
  const [seconds, setSeconds] = useState(60);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Xử lý bộ đếm ngược thời gian
  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds((prev) => prev - 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [seconds]);

  const handleVerify = async () => {
    if (otp.length < 6) return;

    setIsSubmitting(true);
    // TODO: Gọi API kiểm tra mã OTP tại đây
    await new Promise((res) => setTimeout(res, 1500));
    setIsSubmitting(false);

    // Chuyển sang trang đặt lại mật khẩu và truyền token (nếu API có trả về)
    router.push({
      pathname: "/auth/reset-password",
      params: { token: "dummy_token" },
    });
  };

  const handleResend = () => {
    setSeconds(60); // Reset lại 60s
    setOtp(""); // Xóa mã cũ
    // TODO: Gọi API gửi lại mã OTP
    Alert.alert("Thông báo", "Mã OTP mới đã được gửi lại vào email.");
  };

  return (
    <View style={styles.container}>
      {/* Nút quay lại để user có thể sửa lại Email nếu nhập sai ở trang trước */}
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
            {/* --- Header --- */}
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <Smartphone size={28} color="#16a34a" />
              </View>
              <Text style={styles.title}>Xác thực OTP</Text>
              <Text style={styles.subtitle}>
                Vui lòng nhập mã 6 số được gửi đến:{"\n"}
                <Text style={styles.emailText}>{email}</Text>
              </Text>
            </View>

            {/* --- Input OTP --- */}
            <TextInput
              style={styles.otpInput}
              placeholder="000000"
              placeholderTextColor="#d1d5db"
              keyboardType="number-pad"
              maxLength={6}
              value={otp}
              onChangeText={setOtp}
              autoFocus={true} // Tự động bật bàn phím khi vào trang cho tiện
            />

            {/* --- Hẹn giờ --- */}
            <View style={styles.timerRow}>
              <Timer size={16} color={seconds > 0 ? "#6b7280" : "#ef4444"} />
              <Text
                style={[
                  styles.timerText,
                  seconds === 0 && styles.timerTextExpired,
                ]}
              >
                {seconds > 0 ? ` Gửi lại sau ${seconds}s` : " Mã đã hết hạn"}
              </Text>
            </View>

            {/* --- Nút xác nhận --- */}
            <Button
              title="Xác nhận mã"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              onPress={handleVerify}
              disabled={otp.length < 6} // Khóa nút nếu chưa nhập đủ 6 số
            />

            {/* --- Nút gửi lại mã (chỉ hiện khi hết giờ) --- */}
            {seconds === 0 && (
              <TouchableOpacity
                onPress={handleResend}
                style={styles.resendBtn}
                activeOpacity={0.7}
              >
                <Text style={styles.resendText}>Gửi lại mã mới</Text>
              </TouchableOpacity>
            )}
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
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  iconContainer: {
    width: 52,
    height: 52,
    backgroundColor: "rgba(22, 163, 74, 0.1)",
    borderRadius: 14,
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
  subtitle: {
    fontSize: 14,
    color: "#4b5563",
    textAlign: "center",
    lineHeight: 22,
  },
  emailText: {
    fontWeight: "600",
    color: "#374151",
  },
  otpInput: {
    borderBottomWidth: 2,
    borderBottomColor: "#16a34a",
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 10,
    letterSpacing: 15, // Tạo khoảng cách rộng giữa các số cho dễ nhìn
    marginBottom: 25,
    color: "#111827",
  },
  timerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
  },
  timerText: {
    fontSize: 14,
    color: "#6b7280",
    marginLeft: 4,
  },
  timerTextExpired: {
    color: "#ef4444",
    fontWeight: "600",
  },
  resendBtn: {
    marginTop: 20,
    alignItems: "center",
    padding: 10,
  },
  resendText: {
    color: "#16a34a",
    fontWeight: "700",
    fontSize: 15,
  },
});
