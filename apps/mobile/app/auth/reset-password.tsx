import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Lock } from "lucide-react-native";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

export default function ResetPasswordScreen() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleComplete = async () => {
    // Logic đổi mật khẩu ở đây
    alert("Đổi mật khẩu thành công!");
    router.replace("/auth/login");
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Lock size={28} color="#16a34a" />
          </View>
          <Text style={styles.title}>Mật khẩu mới</Text>
          <Text style={styles.subtitle}>
            Vui lòng nhập mật khẩu mới cho tài khoản của bạn
          </Text>
        </View>

        <Input
          label="Mật khẩu mới"
          placeholder="••••••••"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Input
          label="Xác nhận mật khẩu"
          placeholder="••••••••"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <Button
          title="Cập nhật mật khẩu"
          variant="primary"
          onPress={handleComplete}
          style={{ marginTop: 10 }}
        />
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
  header: { alignItems: "center", marginBottom: 25 },
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
});
