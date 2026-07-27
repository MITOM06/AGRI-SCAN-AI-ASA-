import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Lock, CheckCircle2, EyeOff, Eye } from "lucide-react-native";

import { authApi } from "@agri-scan/shared";
import { useT } from "../../context/I18nContext";

export default function SetPasswordScreen() {
  const t = useT();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!password || !confirmPassword) {
      Alert.alert(t("common.error"), t("auth.mFillAllInfo"));
      return;
    }
    if (password.length < 6) {
      Alert.alert(t("common.error"), t("auth.mPasswordMin6"));
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert(t("common.error"), t("auth.mPasswordRepeatMismatch"));
      return;
    }

    try {
      setIsSubmitting(true);
      // 🔥 Gọi đúng tên hàm setPassword đã có trong auth.api.ts của bạn
      await authApi.setPassword(password);

      Alert.alert(
        t("auth.mSetPasswordSuccessTitle"),
        t("auth.mSetPasswordSuccessMessage"),
        [
          {
            text: t("auth.mExploreNow"),
            onPress: () => router.replace("/user"),
          },
        ],
      );
    } catch (error: any) {
      const msg =
        error.response?.data?.message || t("auth.mSetPasswordFailed");
      Alert.alert(t("common.error"), Array.isArray(msg) ? msg.join("\n") : msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 60) }]}>
        <View style={styles.iconWrapper}>
          <CheckCircle2 size={40} color="#16a34a" />
        </View>
        <Text style={styles.title}>{t("auth.mSetPasswordTitle")}</Text>
        <Text style={styles.subtitle}>
          {t("auth.mSetPasswordSubtitle")}
        </Text>
      </View>

      <View style={styles.form}>
        {/* Mật khẩu mới */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t("auth.mNewPasswordLabel")}</Text>
          <View style={styles.inputWrapper}>
            <Lock size={20} color="#64748b" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder={t("auth.mSetPasswordPlaceholder")}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <Eye size={20} color="#64748b" />
              ) : (
                <EyeOff size={20} color="#64748b" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Nhập lại mật khẩu */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t("auth.mConfirmPasswordLabel")}</Text>
          <View style={styles.inputWrapper}>
            <Lock size={20} color="#64748b" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder={t("auth.mRepeatNewPasswordPlaceholder")}
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <Eye size={20} color="#64748b" />
              ) : (
                <EyeOff size={20} color="#64748b" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitBtnText}>
              {t("auth.mSetPasswordSubmit")}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { alignItems: "center", paddingHorizontal: 24, paddingBottom: 30 },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#dcfce3",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: "#111827",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#475569",
    textAlign: "center",
    lineHeight: 22,
  },

  form: { paddingHorizontal: 24 },
  inputGroup: { marginBottom: 20 },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 52,
    backgroundColor: "#f9fafb",
  },
  inputIcon: { marginRight: 10 },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#111827",
    outlineStyle: "none" as any,
  },

  submitBtn: {
    backgroundColor: "#16a34a",
    height: 52,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  submitBtnDisabled: { opacity: 0.7 },
  submitBtnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
