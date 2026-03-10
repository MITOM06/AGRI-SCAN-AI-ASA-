import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ArrowLeft, Clock, Flame, Droplet } from "lucide-react-native";

export default function TipsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const blogs = [
    {
      id: 1,
      title: "Bí quyết ủ phân hữu cơ tại nhà không mùi",
      category: "Phân bón",
      time: "5 phút đọc",
      img: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=600",
      isHot: true,
    },
    {
      id: 2,
      title: "Lịch tưới nước chuẩn cho cây sầu riêng mùa khô",
      category: "Tưới tiêu",
      time: "3 phút đọc",
      img: "https://images.unsplash.com/photo-1592424006691-88b0e74f11d1?q=80&w=600",
      isHot: false,
    },
    {
      id: 3,
      title: "Nhận biết sớm 5 loại sâu bệnh phá hoại lúa",
      category: "Sâu bệnh",
      time: "7 phút đọc",
      img: "https://images.unsplash.com/photo-1625244724120-1fd1d34d00f6?q=80&w=600",
      isHot: false,
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cẩm nang nhà nông</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.pageSubtitle}>
          Đọc mỗi ngày để trở thành chuyên gia nông nghiệp.
        </Text>

        {blogs.map((blog) => (
          <TouchableOpacity
            key={blog.id}
            style={styles.card}
            activeOpacity={0.8}
          >
            <Image source={{ uri: blog.img }} style={styles.cardImg} />
            {blog.isHot && (
              <View style={styles.hotBadge}>
                <Flame size={12} color="#fff" />
                <Text style={styles.hotText}>Mới nhất</Text>
              </View>
            )}
            <View style={styles.cardContent}>
              <Text style={styles.category}>{blog.category}</Text>
              <Text style={styles.title} numberOfLines={2}>
                {blog.title}
              </Text>
              <View style={styles.timeRow}>
                <Clock size={14} color="#9ca3af" />
                <Text style={styles.timeText}>{blog.time}</Text>
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
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
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
  scrollContent: { padding: 16, paddingBottom: 40 },
  pageSubtitle: { fontSize: 15, color: "#6b7280", marginBottom: 20 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardImg: { width: "100%", height: 180, resizeMode: "cover" },
  hotBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "#ef4444",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  hotText: { color: "#fff", fontSize: 11, fontWeight: "bold" },
  cardContent: { padding: 16 },
  category: {
    color: "#10b981",
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 12,
    lineHeight: 26,
  },
  timeRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  timeText: { color: "#9ca3af", fontSize: 13 },
});
