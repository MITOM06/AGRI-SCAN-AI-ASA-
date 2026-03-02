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
} from "react-native"; // Hoặc từ react-native
import { View as RNView, StyleSheet as RNStyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Timer, Smartphone } from "lucide-react-native";

// Import các component dùng chung
import { Button } from "../../components/ui/Button";
import { AuthHeader } from "./AuthHeader";

export default function OTPVerificationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email || "email của bạn"; // Lấy email truyền từ trang trước sang

  const [otp, setOtp] = useState("");
  const [seconds, setSeconds] = useState(60);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Xử lý bộ đếm ngược
  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [seconds]);

  const handleVerify = async () => {
    if (otp.length < 6) return;

    setIsSubmitting(true);
    // Giả lập check OTP
    await new Promise((res) => setTimeout(res, 1500));
    setIsSubmitting(false);

    // Chuyển sang trang đặt lại mật khẩu
    router.push("/auth/reset-password");
  };

  const handleResend = () => {
    setSeconds(60);
    setOtp("");
    Alert.alert("Thông báo", "Mã OTP mới đã được gửi lại vào email.");
  };

  return (
    <RNView style={styles.container}>
      {/* Nút quay lại để user có thể sửa lại Email nếu nhập sai ở trang trước */}
      <AuthHeader showBack={true} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <RNView style={styles.card}>
            <RNView style={styles.header}>
              <RNView style={styles.iconContainer}>
                <Smartphone size={28} color="#16a34a" />
              </RNView>
              <Text style={styles.title}>Xác thực OTP</Text>
              <Text style={styles.subtitle}>
                Vui lòng nhập mã 6 số được gửi đến:{"\n"}
                <Text style={{ fontWeight: "600", color: "#374151" }}>
                  {email}
                </Text>
              </Text>
            </RNView>

            <TextInput
              style={styles.otpInput}
              placeholder="000000"
              placeholderTextColor="#d1d5db"
              keyboardType="number-pad"
              maxLength={6}
              value={otp}
              onChangeText={setOtp}
              autoFocus={true} // Tự động hiện bàn phím khi vào trang
            />

            <RNView style={styles.timerRow}>
              <Timer size={16} color={seconds > 0 ? "#6b7280" : "#ef4444"} />
              <Text
                style={[
                  styles.timerText,
                  seconds === 0 && { color: "#ef4444", fontWeight: "600" },
                ]}
              >
                {seconds > 0 ? ` Gửi lại sau ${seconds}s` : " Mã đã hết hạn"}
              </Text>
            </RNView>

            <Button
              title="Xác nhận mã"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              onPress={handleVerify}
              disabled={otp.length < 6}
            />

            {seconds === 0 && (
              <TouchableOpacity
                onPress={handleResend}
                style={styles.resendBtn}
                activeOpacity={0.7}
              >
                <Text style={styles.resendText}>Gửi lại mã mới</Text>
              </TouchableOpacity>
            )}
          </RNView>
        </ScrollView>
      </KeyboardAvoidingView>
    </RNView>
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
  otpInput: {
    borderBottomWidth: 2,
    borderBottomColor: "#16a34a",
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 10,
    letterSpacing: 15, // Tạo khoảng cách rộng giữa các con số cho dễ nhìn
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
