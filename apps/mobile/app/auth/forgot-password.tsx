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
// Thêm icon CheckCircle2 và ArrowLeft cho đẹp
import { Leaf, ArrowLeft, CheckCircle2 } from "lucide-react-native";

import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

// Schema chỉ cần mỗi Email là đủ
const forgotPasswordSchema = z.object({
  email: z.string().email("Email không hợp lệ. Vui lòng kiểm tra lại."),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Thêm state để theo dõi xem đã gửi email thành công chưa
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema as any), // Tạm thời ép kiểu để xử lý lỗi Zod
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsSubmitting(true);
    // TODO: Gọi API gửi email reset password sau
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Yêu cầu khôi phục cho email:", data);
    setIsSubmitting(false);

    // Gửi xong thì bật giao diện thành công lên
    router.push({
      pathname: "/auth/otp-verification",
      params: { email: data.email }, // Truyền email để trang OTP hiển thị cho user biết
    });
  };

  // ------------------------------------------------------------------
  // GIAO DIỆN 2: Hiển thị khi đã bấm gửi email thành công
  // ------------------------------------------------------------------
  if (isSuccess) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <View style={styles.card}>
          <View style={styles.header}>
            <View
              style={[styles.iconContainer, { backgroundColor: "#dcfce3" }]}
            >
              <CheckCircle2 size={36} color="#16a34a" />
            </View>
            <Text style={styles.title}>Đã gửi email khôi phục!</Text>
            <Text style={styles.subtitle}>
              Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu. Vui lòng kiểm tra hộp
              thư đến (và cả hộp thư rác) của bạn nhé.
            </Text>
          </View>
          <Button
            title="Quay lại đăng nhập"
            variant="primary"
            size="lg"
            onPress={() => router.replace("/auth/login")}
            style={{ marginTop: 8 }}
          />
        </View>
      </View>
    );
  }

  // ------------------------------------------------------------------
  // GIAO DIỆN 1: Form nhập email (Mặc định)
  // ------------------------------------------------------------------
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled" // Kế thừa bí kíp trị bàn phím iOS
      >
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Leaf size={28} color="#16a34a" />
            </View>
            <Text style={styles.title}>Quên mật khẩu?</Text>
            <Text style={styles.subtitle}>
              Đừng lo lắng! Hãy nhập email bạn đã đăng ký, chúng tôi sẽ gửi liên
              kết để đặt lại mật khẩu.
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Email của bạn"
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

            <Button
              title="Gửi yêu cầu"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              onPress={handleSubmit(onSubmit)}
              style={styles.submitButton}
            />

            {/* Footer có nút Quay lại xịn xò */}
            <View style={styles.footer}>
              <Link href="/auth/login" asChild>
                <TouchableOpacity style={styles.backLink}>
                  <ArrowLeft
                    size={18}
                    color="#4b5563"
                    style={{ marginRight: 6 }}
                  />
                  <Text style={styles.backText}>Quay lại đăng nhập</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  centerContent: {
    justifyContent: "center",
    padding: 16,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 80, // Vẫn giữ padding để chống văng form trên iOS
    paddingBottom: 60,
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
    marginBottom: 24,
  },
  iconContainer: {
    width: 48,
    height: 48,
    backgroundColor: "rgba(22, 163, 74, 0.1)",
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
    textAlign: "center",
  },
  subtitle: {
    color: "#4b5563",
    textAlign: "center",
    fontSize: 14,
    lineHeight: 20,
    paddingHorizontal: 8,
  },
  form: {
    width: "100%",
  },
  submitButton: {
    marginTop: 12,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  backLink: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  backText: {
    color: "#4b5563",
    fontWeight: "500",
    fontSize: 15,
  },
});
