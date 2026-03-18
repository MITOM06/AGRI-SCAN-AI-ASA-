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
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  Package,
} from "lucide-react-native";

import { orderApi } from "@agri-scan/shared";

export default function MyOrdersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const fetchMyOrders = async () => {
    try {
      setLoading(true);
      const res = await orderApi.getMyOrders(1, 100); // Lấy lịch sử 100 đơn gần nhất
      setOrders(res.data || []);
    } catch (error) {
      console.error("Lỗi tải lịch sử đơn hàng:", error);
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

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "PENDING":
        return {
          text: "Chờ xác nhận",
          color: "#f59e0b",
          bg: "#fef3c7",
          icon: <Clock size={16} color="#f59e0b" />,
        };
      case "CONFIRMED":
        return {
          text: "Đã xác nhận",
          color: "#3b82f6",
          bg: "#dbeafe",
          icon: <Package size={16} color="#3b82f6" />,
        };
      case "SHIPPING":
        return {
          text: "Đang giao hàng",
          color: "#0ea5e9",
          bg: "#e0f2fe",
          icon: <Truck size={16} color="#0ea5e9" />,
        };
      case "DELIVERED":
        return {
          text: "Giao thành công",
          color: "#16a34a",
          bg: "#dcfce3",
          icon: <CheckCircle2 size={16} color="#16a34a" />,
        };
      case "CANCELLED":
        return {
          text: "Đã Hủy",
          color: "#ef4444",
          bg: "#fee2e2",
          icon: <XCircle size={16} color="#ef4444" />,
        };
      default:
        return {
          text: "Không rõ",
          color: "#64748b",
          bg: "#f1f5f9",
          icon: <Package size={16} color="#64748b" />,
        };
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* HEADER */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lịch sử mua hàng</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#16a34a"
          style={{ marginTop: 50 }}
        />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {orders.length === 0 ? (
            <View style={styles.emptyBox}>
              <Package size={48} color="#cbd5e1" />
              <Text style={styles.emptyText}>Bạn chưa có đơn hàng nào.</Text>
              <TouchableOpacity
                style={styles.shopBtn}
                onPress={() => router.push("/shop" as any)}
              >
                <Text style={styles.shopBtnText}>Mua sắm ngay</Text>
              </TouchableOpacity>
            </View>
          ) : (
            orders.map((order) => {
              const statusConfig = getStatusConfig(order.orderStatus);
              // Lấy thông tin mặt hàng đầu tiên để hiển thị đại diện
              const firstItem = order.items?.[0] || {};
              const productInfo = firstItem.productId || {};

              return (
                <View key={order._id} style={styles.orderCard}>
                  <View style={styles.orderHeader}>
                    <Text style={styles.shopName}>
                      🛒 {order.sellerId?.fullName || "Gian hàng"}
                    </Text>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: statusConfig.bg },
                      ]}
                    >
                      {statusConfig.icon}
                      <Text
                        style={[
                          styles.statusText,
                          { color: statusConfig.color },
                        ]}
                      >
                        {statusConfig.text}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.orderBody}>
                    <Image
                      source={{
                        uri:
                          productInfo.images?.[0] || "https://placehold.co/100",
                      }}
                      style={styles.productImg}
                    />
                    <View style={styles.productInfo}>
                      <Text style={styles.productName} numberOfLines={2}>
                        {productInfo.name || "Sản phẩm không xác định"}
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          marginTop: 8,
                        }}
                      >
                        <Text style={styles.productPrice}>
                          {formatCurrency(firstItem.priceAtPurchase)}
                        </Text>
                        <Text style={styles.productQty}>
                          x{firstItem.quantity}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {order.items?.length > 1 && (
                    <Text style={styles.moreItemsText}>
                      Và {order.items.length - 1} sản phẩm khác...
                    </Text>
                  )}

                  <View style={styles.orderFooter}>
                    <Text style={styles.totalLabel}>Thành tiền:</Text>
                    <Text style={styles.totalValue}>
                      {formatCurrency(order.totalAmount)}
                    </Text>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f4f6" },
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
  content: { padding: 16, paddingBottom: 100 },

  emptyBox: { alignItems: "center", justifyContent: "center", marginTop: 80 },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: "#64748b",
    marginBottom: 24,
  },
  shopBtn: {
    backgroundColor: "#16a34a",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  shopBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },

  orderCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    paddingBottom: 12,
    marginBottom: 12,
  },
  shopName: { fontSize: 15, fontWeight: "bold", color: "#1e293b" },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: { fontSize: 12, fontWeight: "bold" },

  orderBody: { flexDirection: "row" },
  productImg: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: "#f1f5f9",
  },
  productInfo: { flex: 1, marginLeft: 12 },
  productName: { fontSize: 15, color: "#334155", lineHeight: 22 },
  productPrice: { fontSize: 15, fontWeight: "bold", color: "#111827" },
  productQty: { fontSize: 14, color: "#64748b" },

  moreItemsText: {
    fontSize: 13,
    color: "#64748b",
    textAlign: "center",
    marginTop: 12,
    fontStyle: "italic",
  },

  orderFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  totalLabel: { fontSize: 14, color: "#64748b", marginRight: 8 },
  totalValue: { fontSize: 18, fontWeight: "900", color: "#ef4444" },
});
