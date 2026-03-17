import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ArrowLeft, Send, MessageSquareWarning } from "lucide-react-native";

import { adminApi } from "@agri-scan/shared";

type CategoryType = "BUG" | "FEATURE" | "COMPLAINT" | "GENERAL";

export default function FeedbackScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [category, setCategory] = useState<CategoryType>("GENERAL");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories: { id: CategoryType; label: string }[] = [
    { id: "GENERAL", label: "Hỗ trợ chung" },
    { id: "BUG", label: "Báo lỗi ứng dụng" },
    { id: "FEATURE", label: "Góp ý tính năng" },
    { id: "COMPLAINT", label: "Khiếu nại" },
  ];

  const handleSubmit = async () => {
    if (content.trim().length < 10) {
      Alert.alert(
        "Lỗi",
        "Vui lòng nhập nội dung phản hồi ít nhất 10 ký tự để Admin hiểu rõ vấn đề nhé!",
      );
      return;
    }

    try {
      setIsSubmitting(true);
      // Gọi API gửi feedback xuống Backend
      await adminApi.submitFeedback({
        category,
        content: content.trim(),
      });

      Alert.alert(
        "Gửi thành công!",
        "Cảm ơn bạn đã gửi phản hồi. Ban quản trị sẽ xem xét và phản hồi sớm nhất.",
        [{ text: "Về trang chủ", onPress: () => router.back() }],
      );
    } catch (error: any) {
      Alert.alert(
        "Lỗi",
        error.response?.data?.message || "Không thể gửi phản hồi lúc này.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gửi Phản Hồi</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <MessageSquareWarning size={32} color="#16a34a" />
          </View>
          <Text style={styles.introText}>
            Bạn đang gặp vấn đề hay có ý tưởng hay? Hãy chia sẻ cùng Agri-Scan
            để chúng tôi cải thiện ứng dụng nhé!
          </Text>
        </View>

        <Text style={styles.label}>Chủ đề phản hồi:</Text>
        <View style={styles.categoryContainer}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryChip,
                category === cat.id && styles.categoryChipActive,
              ]}
              onPress={() => setCategory(cat.id)}
            >
              <Text
                style={[
                  styles.categoryText,
                  category === cat.id && styles.categoryTextActive,
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Nội dung chi tiết:</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Mô tả chi tiết vấn đề bạn đang gặp phải..."
            multiline
            textAlignVertical="top"
            value={content}
            onChangeText={setContent}
            maxLength={1000}
          />
          <Text style={styles.charCount}>{content.length}/1000</Text>
        </View>
      </ScrollView>

      <View
        style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) }]}
      >
        <TouchableOpacity
          style={[
            styles.submitBtn,
            (!content.trim() || isSubmitting) && styles.submitBtnDisabled,
          ]}
          onPress={handleSubmit}
          disabled={!content.trim() || isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Send size={20} color="#fff" />
              <Text style={styles.submitBtnText}>Gửi cho Ban Quản Trị</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: "#fff",
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#111827" },
  content: { padding: 20 },
  iconContainer: { alignItems: "center", marginBottom: 30 },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#dcfce3",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  introText: {
    textAlign: "center",
    color: "#4b5563",
    fontSize: 15,
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 12,
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 24,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  categoryChipActive: { backgroundColor: "#16a34a", borderColor: "#16a34a" },
  categoryText: { color: "#4b5563", fontWeight: "600", fontSize: 14 },
  categoryTextActive: { color: "#fff" },
  inputContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 12,
    height: 200,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: "#1f2937",
    outlineStyle: "none" as any,
  },
  charCount: {
    textAlign: "right",
    color: "#9ca3af",
    fontSize: 12,
    marginTop: 8,
  },
  footer: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  submitBtn: {
    backgroundColor: "#16a34a",
    paddingVertical: 16,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
