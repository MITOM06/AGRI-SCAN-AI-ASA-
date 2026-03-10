import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  ArrowLeft,
  ShoppingCart,
  Star,
  Minus,
  Plus,
  ShieldCheck,
  Truck,
} from "lucide-react-native";

export default function ProductDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams();
  const [quantity, setQuantity] = useState(1);

  // Mock data giả lập sản phẩm
  const product = {
    id: id || "1",
    name: "Nấm đối kháng Trichoderma chuyên trị nấm rễ",
    price: "45.000đ",
    originalPrice: "60.000đ",
    sold: "1.2k",
    rating: 4.9,
    reviews: 320,
    image:
      "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?q=80&w=600",
    desc: "Chế phẩm sinh học chứa bào tử nấm Trichoderma spp. giúp tiêu diệt các loại nấm gây hại rễ (Fusarium, Phytophthora,...). Cải tạo đất, giúp rễ phát triển mạnh, an toàn cho môi trường và con người.",
  };

  const handleAddToCart = () => {
    Alert.alert("Thành công", "Đã thêm sản phẩm vào giỏ hàng!", [
      { text: "Ở lại", style: "cancel" },
      { text: "Đến giỏ hàng", onPress: () => router.push("/my-cart") },
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Header Nổi (Tuyệt đẹp) */}
      <View style={[styles.headerFloating, { top: Math.max(insets.top, 10) }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push("/my-cart")}
          style={styles.iconBtn}
        >
          <ShoppingCart size={24} color="#fff" />
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>2</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Image source={{ uri: product.image }} style={styles.productImg} />

        <View style={styles.content}>
          <View style={styles.priceRow}>
            <Text style={styles.price}>{product.price}</Text>
            <Text style={styles.originalPrice}>{product.originalPrice}</Text>
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-25%</Text>
            </View>
          </View>

          <Text style={styles.productName}>{product.name}</Text>

          <View style={styles.ratingRow}>
            <Star size={16} color="#f59e0b" fill="#f59e0b" />
            <Text style={styles.ratingText}>
              {product.rating} ({product.reviews} đánh giá)
            </Text>
            <Text style={styles.soldText}>• Đã bán {product.sold}</Text>
          </View>

          <View style={styles.divider} />

          {/* Chính sách */}
          <View style={styles.policyRow}>
            <View style={styles.policyItem}>
              <ShieldCheck size={20} color="#16a34a" />
              <Text style={styles.policyText}>100% Chính hãng</Text>
            </View>
            <View style={styles.policyItem}>
              <Truck size={20} color="#3b82f6" />
              <Text style={styles.policyText}>Giao hàng toàn quốc</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Mô tả sản phẩm</Text>
          <Text style={styles.descText}>{product.desc}</Text>
        </View>
      </ScrollView>

      {/* Thanh mua hàng dưới cùng */}
      <View
        style={[
          styles.bottomBar,
          { paddingBottom: Math.max(insets.bottom, 16) },
        ]}
      >
        <View style={styles.quantitySelector}>
          <TouchableOpacity
            onPress={() => setQuantity(Math.max(1, quantity - 1))}
            style={styles.qtyBtn}
          >
            <Minus size={16} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.qtyText}>{quantity}</Text>
          <TouchableOpacity
            onPress={() => setQuantity(quantity + 1)}
            style={styles.qtyBtn}
          >
            <Plus size={16} color="#111827" />
          </TouchableOpacity>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.addToCartBtn}
            onPress={handleAddToCart}
          >
            <ShoppingCart size={20} color="#16a34a" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buyNowBtn}
            onPress={() => router.push("/buy-detail")}
          >
            <Text style={styles.buyNowText}>Mua ngay</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  headerFloating: {
    position: "absolute",
    left: 16,
    right: 16,
    zIndex: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  cartBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#ef4444",
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  cartBadgeText: { color: "#fff", fontSize: 10, fontWeight: "bold" },
  scrollContent: { paddingBottom: 100 },
  productImg: { width: "100%", height: 350, resizeMode: "cover" },
  content: {
    padding: 20,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
  },
  priceRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  price: { fontSize: 24, fontWeight: "800", color: "#ef4444", marginRight: 10 },
  originalPrice: {
    fontSize: 16,
    color: "#9ca3af",
    textDecorationLine: "line-through",
    marginRight: 10,
  },
  discountBadge: {
    backgroundColor: "#fef2f2",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  discountText: { color: "#ef4444", fontSize: 12, fontWeight: "bold" },
  productName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    lineHeight: 28,
    marginBottom: 12,
  },
  ratingRow: { flexDirection: "row", alignItems: "center" },
  ratingText: {
    fontSize: 14,
    color: "#4b5563",
    marginLeft: 6,
    fontWeight: "500",
  },
  soldText: { fontSize: 14, color: "#6b7280", marginLeft: 8 },
  divider: { height: 1, backgroundColor: "#f3f4f6", marginVertical: 20 },
  policyRow: { flexDirection: "row", justifyContent: "space-around" },
  policyItem: { alignItems: "center", gap: 6 },
  policyText: { fontSize: 13, color: "#4b5563", fontWeight: "500" },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 12,
  },
  descText: { fontSize: 15, color: "#4b5563", lineHeight: 24 },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
    elevation: 10,
  },
  quantitySelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    paddingHorizontal: 4,
    marginRight: 16,
  },
  qtyBtn: { padding: 10 },
  qtyText: { fontSize: 16, fontWeight: "bold", width: 24, textAlign: "center" },
  actionButtons: { flex: 1, flexDirection: "row", gap: 12 },
  addToCartBtn: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: "#dcfce3",
    justifyContent: "center",
    alignItems: "center",
  },
  buyNowBtn: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    backgroundColor: "#16a34a",
    justifyContent: "center",
    alignItems: "center",
  },
  buyNowText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
