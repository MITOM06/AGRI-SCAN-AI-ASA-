import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ArrowLeft, Search, ShoppingCart, Star } from "lucide-react-native";

// Bổ sung import productApi
import { productApi, formatCurrencyVN as formatCurrency } from "@agri-scan/shared";

import { useT } from "../context/I18nContext";

// Map chuẩn danh mục với Backend.
// `id` là mã gửi lên API — không dịch. `labelKey` mới là phần được dịch.
const CATEGORIES = [
  { id: "", labelKey: "shop.categoryAll" },
  { id: "FERTILIZER", labelKey: "shop.categoryFertilizer" },
  { id: "PESTICIDE", labelKey: "shop.categoryPesticide" },
  { id: "SEED", labelKey: "shop.categorySeed" },
  { id: "TOOL", labelKey: "shop.categoryTool" },
];

export default function ShopScreen() {
  const t = useT();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [activeCategory, setActiveCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Gọi API lấy dữ liệu mỗi khi đổi Category
  useEffect(() => {
    fetchProducts();
  }, [activeCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await productApi.getProducts({
        category: activeCategory || undefined,
        search: searchQuery || undefined,
        limit: 50, // Lấy tạm 50 món
      });
      setProducts(res.data);
    } catch (error) {
      console.error("Lỗi tải sản phẩm:", error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* HEADER */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("shop.storeTitle")}</Text>

        <TouchableOpacity
          onPress={() => router.push("/my-cart" as any)}
          style={styles.cartBtn}
        >
          <ShoppingCart size={20} color="#111827" />
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>0</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* TÌM KIẾM */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#9ca3af" />
          <TextInput
            placeholder={t("shop.searchPlaceholder")}
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={fetchProducts} // Nhấn Enter để tìm
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={styles.searchActionBtn}
              onPress={fetchProducts}
            >
              <Text style={styles.searchActionText}>{t("common.search")}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* DANH MỤC (CATEGORIES) */}
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryChip,
                activeCategory === cat.id && styles.categoryChipActive,
              ]}
              onPress={() => setActiveCategory(cat.id)}
            >
              <Text
                style={[
                  styles.categoryText,
                  activeCategory === cat.id && styles.categoryTextActive,
                ]}
              >
                {t(cat.labelKey)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* DANH SÁCH SẢN PHẨM */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.productGrid}
      >
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#16a34a"
            style={{ marginTop: 50, width: "100%" }}
          />
        ) : products.length === 0 ? (
          <Text style={styles.emptyText}>{t("shop.noProducts")}</Text>
        ) : (
          products.map((item) => (
            <TouchableOpacity
              key={item._id}
              style={styles.productCard}
              activeOpacity={0.8}
              // 🔥 TRUYỀN ID SẢN PHẨM SANG TRANG CHI TIẾT
              onPress={() =>
                router.push({
                  pathname: "/product-detail",
                  params: { id: item._id },
                } as any)
              }
            >
              <Image
                source={{ uri: item.images?.[0] || "https://placehold.co/400" }}
                style={styles.productImg}
              />
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={2}>
                  {item.name}
                </Text>

                <View style={styles.ratingRow}>
                  <Star size={12} color="#f59e0b" fill="#f59e0b" />
                  <Text style={styles.ratingText}>
                    {item.rating.toFixed(1)}
                  </Text>
                  <Text style={styles.soldText}>
                    {" "}
                    | {t("shop.sold", { count: item.sold })}
                  </Text>
                </View>

                <View style={styles.priceRow}>
                  <Text style={styles.price}>{formatCurrency(item.price)}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
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
  cartBtn: { position: "relative", padding: 8 },
  cartBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#ef4444",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  cartBadgeText: { color: "#fff", fontSize: 10, fontWeight: "bold" },

  searchContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 15,
    outlineStyle: "none" as any,
  },
  searchActionBtn: {
    backgroundColor: "#16a34a",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  searchActionText: { color: "#fff", fontWeight: "bold", fontSize: 13 },

  categoryScroll: { paddingHorizontal: 16, paddingVertical: 16, gap: 8 },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  categoryChipActive: { backgroundColor: "#16a34a", borderColor: "#16a34a" },
  categoryText: { color: "#4b5563", fontWeight: "600", fontSize: 14 },
  categoryTextActive: { color: "#fff" },

  productGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  emptyText: {
    width: "100%",
    textAlign: "center",
    marginTop: 40,
    color: "#6b7280",
  },
  productCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  productImg: {
    width: "100%",
    height: 160,
    backgroundColor: "#f3f4f6",
    resizeMode: "cover",
  },
  productInfo: { padding: 12 },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 6,
    height: 40,
    lineHeight: 20,
  },
  ratingRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  ratingText: {
    fontSize: 12,
    color: "#f59e0b",
    fontWeight: "bold",
    marginLeft: 4,
  },
  soldText: { fontSize: 11, color: "#9ca3af" },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  price: { fontSize: 16, fontWeight: "900", color: "#ef4444" },
});
