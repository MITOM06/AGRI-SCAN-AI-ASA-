import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  TextInput,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ArrowLeft, Search, ShoppingCart, Star } from "lucide-react-native";

export default function ShopScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeCategory, setActiveCategory] = useState("Tất cả");

  const categories = ["Tất cả", "Phân bón", "Chế phẩm sinh học", "Dụng cụ"];

  const products = [
    {
      id: 1,
      name: "Nấm đối kháng Trichoderma",
      price: "45.000đ",
      sold: "1.2k đã bán",
      rating: 4.9,
      image:
        "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?q=80&w=400",
    },
    {
      id: 2,
      name: "Phân trùn quế cao cấp",
      price: "80.000đ",
      sold: "850 đã bán",
      rating: 4.8,
      image:
        "https://images.unsplash.com/photo-1590682680695-43b964a3ae17?q=80&w=400",
    },
    {
      id: 3,
      name: "Dịch tỏi trị nhện đỏ",
      price: "120.000đ",
      sold: "340 đã bán",
      rating: 4.7,
      image:
        "https://images.unsplash.com/photo-1611078713063-ce310f8bc5e6?q=80&w=400",
    },
    {
      id: 4,
      name: "Bình xịt tưới cây 2L",
      price: "65.000đ",
      sold: "2.1k đã bán",
      rating: 4.9,
      image:
        "https://images.unsplash.com/photo-1416879598555-ea515d9cf7bf?q=80&w=400",
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cửa hàng Agri-Shop</Text>

        {/* Nút bấm vào Giỏ Hàng */}
        <TouchableOpacity
          onPress={() => router.push("/my-cart")}
          style={styles.cartBtn}
        >
          <ShoppingCart size={20} color="#111827" />
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>2</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#9ca3af" />
          <TextInput
            placeholder="Tìm vật tư nông nghiệp..."
            style={styles.searchInput}
          />
        </View>
      </View>

      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryChip,
                activeCategory === cat && styles.categoryChipActive,
              ]}
              onPress={() => setActiveCategory(cat)}
            >
              <Text
                style={[
                  styles.categoryText,
                  activeCategory === cat && styles.categoryTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.productGrid}
      >
        {products.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.productCard}
            activeOpacity={0.8}
            onPress={() => router.push("/product-detail")}
          >
            <Image source={{ uri: item.image }} style={styles.productImg} />
            <View style={styles.productInfo}>
              <Text style={styles.productName} numberOfLines={2}>
                {item.name}
              </Text>
              <View style={styles.ratingRow}>
                <Star size={12} color="#f59e0b" fill="#f59e0b" />
                <Text style={styles.ratingText}>{item.rating}</Text>
                <Text style={styles.soldText}> | {item.sold}</Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.price}>{item.price}</Text>
                {/* Nút Mua ngay nhảy sang trang Thanh Toán */}
                <TouchableOpacity
                  style={styles.buyBtn}
                  onPress={() => router.push("/buy-detail")}
                >
                  <Text style={styles.buyText}>Mua</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
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
  searchInput: { flex: 1, marginLeft: 8, fontSize: 15 },
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
  productCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 2,
  },
  productImg: { width: "100%", height: 140, backgroundColor: "#f3f4f6" },
  productInfo: { padding: 12 },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 6,
    height: 40,
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
  price: { fontSize: 15, fontWeight: "800", color: "#ef4444" },
  buyBtn: {
    backgroundColor: "#16a34a",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  buyText: { color: "#fff", fontSize: 12, fontWeight: "bold" },
});
