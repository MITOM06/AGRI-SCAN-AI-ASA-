import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { Timer, Smartphone } from "lucide-react-native";
import { Button } from "../../components/ui/Button";

export default function OTPVerificationScreen() {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [seconds, setSeconds] = useState(60); // Bộ đếm 60 giây
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
    setIsSubmitting(true);
    // Giả lập check OTP
    await new Promise((res) => setTimeout(res, 1000));
    setIsSubmitting(false);

    // Nếu đúng chuyển sang trang đặt lại mật khẩu
    router.push("/auth/reset-password");
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Smartphone size={28} color="#16a34a" />
          </View>
          <Text style={styles.title}>Xác thực OTP</Text>
          <Text style={styles.subtitle}>
            Mã xác thực đã được gửi đến email của bạn
          </Text>
        </View>

        <TextInput
          style={styles.otpInput}
          placeholder="Nhập 6 số"
          keyboardType="number-pad"
          maxLength={6}
          value={otp}
          onChangeText={setOtp}
        />

        <View style={styles.timerRow}>
          <Timer size={16} color={seconds > 0 ? "#6b7280" : "#ef4444"} />
          <Text
            style={[styles.timerText, seconds === 0 && { color: "#ef4444" }]}
          >
            {seconds > 0 ? ` Gửi lại sau ${seconds}s` : " Mã đã hết hạn"}
          </Text>
        </View>

        <Button
          title="Xác nhận"
          variant="primary"
          isLoading={isSubmitting}
          onPress={handleVerify}
          disabled={otp.length < 6}
        />

        {seconds === 0 && (
          <TouchableOpacity
            onPress={() => setSeconds(60)}
            style={styles.resendBtn}
          >
            <Text style={styles.resendText}>Gửi lại mã mới</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    justifyContent: "center",
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 16,
    elevation: 5,
  },
  header: { alignItems: "center", marginBottom: 30 },
  iconContainer: {
    width: 50,
    height: 50,
    backgroundColor: "#dcfce3",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  title: { fontSize: 22, fontWeight: "bold", color: "#111827" },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 5,
  },
  otpInput: {
    borderBottomWidth: 2,
    borderBottomColor: "#16a34a",
    fontSize: 24,
    textAlign: "center",
    padding: 10,
    letterSpacing: 10,
    marginBottom: 20,
  },
  timerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  timerText: { fontSize: 14, color: "#6b7280" },
  resendBtn: { marginTop: 15, alignItems: "center" },
  resendText: { color: "#16a34a", fontWeight: "600" },
});
