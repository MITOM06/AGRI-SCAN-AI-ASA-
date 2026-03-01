import React from "react";
import {
  ScrollView,
  StyleSheet,
  SafeAreaView,
  View,
  StatusBar,
  Platform,
} from "react-native";

// 1. Import các mảnh ghép từ thư mục components
import { Header } from "../components/home/Header";
import { StatsGrid } from "../components/home/StatsGrid";
import { ActivityChart } from "../components/home/ActivityChart";
import { RecentScans } from "../components/home/RecentScans";

export default function HomeScreen() {
  return (
    // SafeAreaView giúp nội dung không bị đè lên "tai thỏ" của iPhone
    <SafeAreaView style={styles.safeArea}>
      {/* Tùy chỉnh thanh trạng thái pin/sóng cho đẹp */}
      <StatusBar barStyle="dark-content" />

      {/* Header thường để cố định ở trên cùng để user luôn thấy tên mình */}
      <View style={styles.headerContainer}>
        <Header name="Văn A" />
      </View>

      {/* ScrollView chứa toàn bộ nội dung có thể cuộn được */}
      <ScrollView
        showsVerticalScrollIndicator={false} // Ẩn thanh cuộn cho mượt
        contentContainerStyle={styles.scrollContent}
      >
        {/* Lần lượt đặt các mảnh ghép vào */}
        <StatsGrid />

        <View style={styles.divider} />

        <ActivityChart />

        <View style={styles.divider} />

        <RecentScans />

        {/* Khoảng trống cuối trang để không bị che bởi thanh Tab Bar */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f9fafb", // Màu nền xám nhạt cực sang của Web
    // Xử lý khoảng cách cho Android (vì SafeAreaView chỉ chạy tốt trên iOS)
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  headerContainer: {
    backgroundColor: "#f9fafb",
    paddingTop: 10,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  divider: {
    height: 10, // Tạo khoảng cách giữa các phần cho thoáng mắt
  },
});
