import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  UploadCloud,
  Tag,
  FileText,
  Package,
  DollarSign,
  Info,
} from "lucide-react-native";

import { productApi } from "@agri-scan/shared";
import { useT } from "../context/I18nContext";

// `id` là mã gửi lên API — không dịch. Nhãn dùng chung key với web & màn shop.
const CATEGORIES = [
  { id: "FERTILIZER", labelKey: "shop.categoryFertilizer" },
  { id: "PESTICIDE", labelKey: "shop.categoryPesticide" },
  { id: "SEED", labelKey: "shop.categorySeed" },
  { id: "TOOL", labelKey: "shop.categoryTool" },
  { id: "OTHER", labelKey: "shop.categoryOther" },
];

export default function AddProductScreen() {
  const t = useT();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("FERTILIZER");
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [usageInstructions, setUsageInstructions] = useState("");
  const [imageUrl, setImageUrl] = useState(""); // Tạm thời dùng link ảnh URL cho lẹ
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddProduct = async () => {
    // 1. Kiểm tra Validate cơ bản
    if (!name.trim()) return alert(t("shop.mErrorNoName"));
    if (!price.trim() || isNaN(Number(price)))
      return alert(t("shop.mErrorInvalidPrice"));
    if (!stock.trim() || isNaN(Number(stock)))
      return alert(t("shop.mErrorInvalidStock"));
    if (!description.trim()) return alert(t("shop.mErrorNoDescription"));

    try {
      setIsSubmitting(true);

      // 2. Chuẩn bị dữ liệu gửi xuống API (Ép kiểu số cho Giá và Kho)
      const payload = {
        name: name.trim(),
        price: Number(price),
        stock: Number(stock),
        category: category,
        description: description.trim(),
        // Giá trị này được LƯU vào DB (product.brand) → là dữ liệu, không dịch
        brand: brand.trim() || "Đang cập nhật",
        usageInstructions: usageInstructions.trim(),
        images: imageUrl.trim()
          ? [imageUrl.trim()]
          : ["https://placehold.co/600x400?text=Agri-Shop"], // Nếu ko nhập link ảnh thì lấy ảnh mặc định
      };

      // 3. Gọi API tạo sản phẩm
      await productApi.createProduct(payload as any);

      // 4. Thành công thì báo và quay về trang Gian hàng
      alert(t("shop.mProductCreated"));
      router.back();
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message || t("shop.mProductCreateFailed");
      alert(
        t("shop.mProductCreateErrorPrefix", {
          message: Array.isArray(errorMsg) ? errorMsg.join(", ") : errorMsg,
        }),
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
      <StatusBar barStyle="dark-content" />

      {/* HEADER */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("shop.mAddProductTitle")}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Ảnh sản phẩm (Dùng URL) */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t("shop.mImageUrlLabel")}</Text>
          <View style={styles.inputWrapper}>
            <UploadCloud size={20} color="#64748b" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder={t("shop.mImageUrlPlaceholder")}
              value={imageUrl}
              onChangeText={setImageUrl}
            />
          </View>
        </View>

        {/* Tên sản phẩm */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t("shop.mProductNameLabel")}</Text>
          <View style={styles.inputWrapper}>
            <Tag size={20} color="#64748b" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder={t("shop.mProductNamePlaceholder")}
              value={name}
              onChangeText={setName}
            />
          </View>
        </View>

        {/* Giá & Kho */}
        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>{t("shop.mPriceLabel")}</Text>
            <View style={styles.inputWrapper}>
              <DollarSign size={20} color="#64748b" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="0"
                keyboardType="numeric"
                value={price}
                onChangeText={setPrice}
              />
            </View>
          </View>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>{t("shop.mStockLabel")}</Text>
            <View style={styles.inputWrapper}>
              <Package size={20} color="#64748b" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="100"
                keyboardType="numeric"
                value={stock}
                onChangeText={setStock}
              />
            </View>
          </View>
        </View>

        {/* Danh mục */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t("shop.mCategoryLabel")}</Text>
          <View style={styles.categoryContainer}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.catBtn,
                  category === cat.id && styles.catBtnActive,
                ]}
                onPress={() => setCategory(cat.id)}
              >
                <Text
                  style={[
                    styles.catText,
                    category === cat.id && styles.catTextActive,
                  ]}
                >
                  {t(cat.labelKey)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Mô tả */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t("shop.mDescriptionLabel")}</Text>
          <View
            style={[
              styles.inputWrapper,
              { height: 100, alignItems: "flex-start", paddingTop: 12 },
            ]}
          >
            <FileText
              size={20}
              color="#64748b"
              style={[styles.icon, { marginTop: 0 }]}
            />
            <TextInput
              style={[styles.input, { height: 80 }]}
              placeholder={t("shop.mDescriptionPlaceholder")}
              multiline
              textAlignVertical="top"
              value={description}
              onChangeText={setDescription}
            />
          </View>
        </View>

        {/* Thương hiệu */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t("shop.mBrandLabel")}</Text>
          <View style={styles.inputWrapper}>
            <Info size={20} color="#64748b" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder={t("shop.mBrandPlaceholder")}
              value={brand}
              onChangeText={setBrand}
            />
          </View>
        </View>

        {/* Hướng dẫn sử dụng */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t("shop.mUsageLabel")}</Text>
          <View
            style={[
              styles.inputWrapper,
              { height: 80, alignItems: "flex-start", paddingTop: 12 },
            ]}
          >
            <Info
              size={20}
              color="#64748b"
              style={[styles.icon, { marginTop: 0 }]}
            />
            <TextInput
              style={[styles.input, { height: 60 }]}
              placeholder={t("shop.mUsagePlaceholder")}
              multiline
              textAlignVertical="top"
              value={usageInstructions}
              onChangeText={setUsageInstructions}
            />
          </View>
        </View>
      </ScrollView>

      {/* BOTTOM BUTTON */}
      <View
        style={[
          styles.bottomBar,
          { paddingBottom: Math.max(insets.bottom, 16) },
        ]}
      >
        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleAddProduct}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitBtnText}>
              {t("shop.mSubmitProduct")}
            </Text>
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
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
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
  content: { padding: 16, paddingBottom: 100 },

  row: { flexDirection: "row", gap: 12 },
  inputGroup: { marginBottom: 16 },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#334155",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
  },
  icon: { marginRight: 10 },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#1e293b",
    outlineStyle: "none" as any,
  },

  categoryContainer: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  catBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  catBtnActive: { backgroundColor: "#16a34a", borderColor: "#16a34a" },
  catText: { color: "#64748b", fontWeight: "600", fontSize: 14 },
  catTextActive: { color: "#fff" },

  bottomBar: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  submitBtn: {
    backgroundColor: "#16a34a",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  submitBtnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
