import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Star, Store, ShieldCheck, Info } from "lucide-react-native";

import { productApi } from "@agri-scan/shared";

export default function ProductDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Lấy ID sản phẩm từ trang Shop truyền sang
  const { id } = useLocalSearchParams();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchProductDetail();
  }, [id]);

  const fetchProductDetail = async () => {
    try {
      const res = await productApi.getProductById(id as string);
      setProduct(res);
    } catch (error) {
      console.error("Lỗi tải chi tiết sản phẩm:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount || 0);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#16a34a" />
        <Text style={styles.loadingText}>Đang tải thông tin sản phẩm...</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Không tìm thấy sản phẩm!</Text>
        <TouchableOpacity
          style={styles.backBtnError}
          onPress={() => router.back()}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Nút Back nổi trên ảnh */}
      <View style={[styles.floatingHeader, { top: Math.max(insets.top, 20) }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Ảnh sản phẩm */}
        <Image
          source={{
            uri: product.images?.[0] || "https://placehold.co/600x400",
          }}
          style={styles.productImage}
        />

        {/* Khối thông tin cơ bản */}
        <View style={styles.infoSection}>
          <Text style={styles.price}>{formatCurrency(product.price)}</Text>
          <Text style={styles.productName}>{product.name}</Text>

          <View style={styles.statsRow}>
            <View style={styles.ratingBox}>
              <Star size={16} color="#f59e0b" fill="#f59e0b" />
              <Text style={styles.ratingText}>
                {product.rating.toFixed(1)}/5
              </Text>
            </View>
            <Text style={styles.soldText}>Đã bán {product.sold}</Text>
            <Text style={styles.stockText}>Kho: {product.stock}</Text>
          </View>
        </View>

        {/* Khối thông tin Gian hàng */}
        <View style={styles.sellerSection}>
          <View style={styles.sellerIconBox}>
            <Store size={24} color="#16a34a" />
          </View>
          <View style={styles.sellerInfo}>
            <Text style={styles.sellerName}>
              {product.sellerId?.fullName || "Gian hàng Nông Dân"}
            </Text>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            >
              <ShieldCheck size={14} color="#2563eb" />
              <Text style={styles.sellerBadge}>Người bán uy tín</Text>
            </View>
          </View>
        </View>

        {/* Khối Mô tả chi tiết */}
        <View style={styles.descSection}>
          <Text style={styles.sectionTitle}>Chi tiết sản phẩm</Text>
          <View style={styles.descRow}>
            <Text style={styles.descLabel}>Danh mục:</Text>
            <Text style={styles.descValue}>{product.category}</Text>
          </View>
          <View style={styles.descRow}>
            <Text style={styles.descLabel}>Thương hiệu:</Text>
            <Text style={styles.descValue}>
              {product.brand || "Đang cập nhật"}
            </Text>
          </View>

          <Text style={styles.descTitle}>Mô tả:</Text>
          <Text style={styles.descContent}>{product.description}</Text>

          {product.usageInstructions && (
            <View style={styles.usageBox}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 8,
                }}
              >
                <Info size={18} color="#0284c7" />
                <Text style={styles.usageTitle}>Hướng dẫn sử dụng</Text>
              </View>
              <Text style={styles.usageContent}>
                {product.usageInstructions}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Thanh Bottom Bar chứa nút Mua Ngay */}
      <View
        style={[
          styles.bottomBar,
          { paddingBottom: Math.max(insets.bottom, 16) },
        ]}
      >
        <TouchableOpacity
          style={styles.buyButton}
          onPress={() => {
            // Chuyển sang trang thanh toán và mang theo các thông tin cần thiết
            router.push({
              pathname: "/checkout",
              params: {
                productId: product._id,
                sellerId: product.sellerId?._id || product.sellerId,
                name: product.name,
                price: product.price,
                image: product.images?.[0],
              },
            } as any);
          }}
        >
          <Text style={styles.buyButtonText}>Mua Ngay</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f4f6" },
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 12, color: "#64748b" },
  backBtnError: {
    marginTop: 16,
    backgroundColor: "#ef4444",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },

  floatingHeader: { position: "absolute", left: 16, zIndex: 10 },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.9)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  productImage: {
    width: "100%",
    height: 350,
    backgroundColor: "#e2e8f0",
    resizeMode: "cover",
  },

  infoSection: { backgroundColor: "#fff", padding: 16, marginBottom: 10 },
  price: { fontSize: 24, fontWeight: "900", color: "#ef4444", marginBottom: 8 },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    lineHeight: 26,
    marginBottom: 12,
  },
  statsRow: { flexDirection: "row", alignItems: "center", gap: 16 },
  ratingBox: { flexDirection: "row", alignItems: "center", gap: 4 },
  ratingText: { fontSize: 14, fontWeight: "bold", color: "#f59e0b" },
  soldText: { fontSize: 14, color: "#64748b" },
  stockText: { fontSize: 14, color: "#16a34a", fontWeight: "600" },

  sellerSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 10,
  },
  sellerIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#dcfce3",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  sellerInfo: { flex: 1 },
  sellerName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 4,
  },
  sellerBadge: { fontSize: 12, color: "#2563eb", fontWeight: "600" },

  descSection: { backgroundColor: "#fff", padding: 16, flex: 1 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 16,
  },
  descRow: { flexDirection: "row", marginBottom: 12 },
  descLabel: { width: 100, fontSize: 14, color: "#64748b" },
  descValue: { flex: 1, fontSize: 14, fontWeight: "600", color: "#334155" },
  descTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0f172a",
    marginTop: 8,
    marginBottom: 8,
  },
  descContent: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 22,
    marginBottom: 16,
  },

  usageBox: {
    backgroundColor: "#e0f2fe",
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  usageTitle: { fontSize: 14, fontWeight: "bold", color: "#0284c7" },
  usageContent: { fontSize: 14, color: "#0369a1", lineHeight: 22 },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  buyButton: {
    backgroundColor: "#ef4444",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  buyButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
