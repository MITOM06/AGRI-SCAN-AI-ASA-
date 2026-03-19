import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StatusBar,
  Alert,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import {
  ArrowLeft,
  Trash2,
  Calendar,
  Droplets,
  ThermometerSun,
  Leaf,
  Camera as CameraIcon,
  CheckCircle2,
  Clock,
  Sprout,
  AlertTriangle,
} from "lucide-react-native";

import { myGardenApi } from "@agri-scan/shared";

type TabType = "ROADMAP" | "CHECKIN";

export default function GardenDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { plantId } = useLocalSearchParams();

  const [activeTab, setActiveTab] = useState<TabType>("ROADMAP");
  const [plant, setPlant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isCheckingIn, setIsCheckingIn] = useState(false);

  useEffect(() => {
    fetchPlantDetail();
  }, [plantId]);

  //   const fetchPlantDetail = async () => {
  //     try {
  //       setLoading(true);
  //       // Vì API hiện tại chỉ có getUserGarden (lấy tất cả), ta sẽ gọi và lọc ra cây này
  //       // Trong thực tế có thể gọi thẳng API getGardenById
  //       const res = await myGardenApi.getUserGarden();
  //       const foundPlant = res.find((p: any) => p._id === plantId);

  //       if (foundPlant) {
  //         setPlant(foundPlant);
  //       } else {
  //         // NẾU KHÔNG TÌM THẤY (Hoặc đang test không có DB), TẠO DỮ LIỆU MOCK ĐỂ XEM GIAO DIỆN
  //         setPlant(MOCK_PLANT);
  //       }
  //     } catch (error) {
  //       console.log("Lỗi tải chi tiết cây:", error);
  //       setPlant(MOCK_PLANT); // Fallback mock data
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   const handleDeletePlant = () => {
  //     Alert.alert(
  //       "Xóa cây khỏi vườn?",
  //       "Bạn có chắc chắn muốn ngừng chăm sóc cây này không? Bạn sẽ nhận lại 1 vị trí trống trong vườn.",
  //       [
  //         { text: "Hủy", style: "cancel" },
  //         {
  //           text: "Xóa bỏ",
  //           style: "destructive",
  //           onPress: async () => {
  //             try {
  //               // Xóa thật nếu có ID hợp lệ
  //               if (plantId && plantId !== "mock-id") {
  //                 await myGardenApi.removePlant(plantId as string);
  //               }
  //               Alert.alert("Thành công", "Đã xóa cây khỏi vườn.");
  //               router.back();
  //             } catch (error) {
  //               Alert.alert("Lỗi", "Không thể xóa cây lúc này.");
  //             }
  //           },
  //         },
  //       ],
  //     );
  //   };
  const fetchPlantDetail = async () => {
    try {
      setLoading(true);

      // 🔥 GIẢ LẬP GỌI API: Chờ 1 giây rồi load thẳng dữ liệu giả MOCK_PLANT
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setPlant(MOCK_PLANT);
    } catch (error) {
      console.log("Lỗi tải chi tiết cây:", error);
      setPlant(MOCK_PLANT);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlant = () => {
    Alert.alert(
      "Xóa cây khỏi vườn?",
      "Bạn có chắc chắn muốn ngừng chăm sóc cây này không? Bạn sẽ nhận lại 1 vị trí trống trong vườn.",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa bỏ",
          style: "destructive",
          onPress: async () => {
            // 🔥 GIẢ LẬP XÓA THÀNH CÔNG (Fix cho cả Web và Mobile)
            if (Platform.OS === "web") {
              window.alert("Thành công: Đã xóa cây khỏi vườn (Chế độ Test).");
              router.back();
            } else {
              Alert.alert("Thành công", "Đã xóa cây khỏi vườn (Chế độ Test).");
              router.back();
            }
          },
        },
      ],
    );
  };
  // =================================================================
  // HÀM XỬ LÝ CHECK-IN (CHỤP ẢNH)
  // =================================================================
  // =================================================================
  // HÀM XỬ LÝ CHECK-IN (CHỤP ẢNH)
  // =================================================================
  const handleDailyCheckIn = async () => {
    // 🔥 Bổ sung hàm Mock bị thiếu ở đây
    const processCheckIn_MOCK = async () => {
      setIsCheckingIn(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const isNeglected = Math.random() < 0.1; // 10% ra lỗi bỏ bê

      if (isNeglected) {
        Alert.alert(
          "⚠️ Cảnh báo từ AI",
          "Bạn đã không cập nhật quá 3 ngày. Lộ trình cũ đã bị hủy, AI đang đánh giá lại tình trạng cây từ ảnh mới của bạn...",
          [
            {
              text: "Tạo lộ trình mới",
              onPress: () =>
                router.push({
                  pathname: "/garden-setup",
                  params: {
                    imageUri:
                      "https://placehold.co/400x400.png?text=Mock+Image",
                  },
                } as any),
            },
          ],
        );
      } else {
        Alert.alert(
          "🎉 Tuyệt vời!",
          "Check-in thành công! Bạn đang chăm sóc cây rất tốt.",
        );
        setPlant((prev: any) => ({
          ...prev,
          progressPercentage: Math.min(
            100,
            (prev?.progressPercentage || 0) + 15,
          ),
        }));
      }
      setIsCheckingIn(false);
    };

    if (Platform.OS === "web") {
      alert("Tính năng chụp ảnh check-in đang hoạt động ở chế độ Web (Mock).");
      await processCheckIn_MOCK();
      return;
    }

    try {
      // 1. Mở Camera chụp ảnh (Dành cho Mobile)
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        quality: 0.7,
      });

      if (!result.canceled) {
        setIsCheckingIn(true);

        // 2. GIẢ LẬP GỌI API CHECK-IN (Chờ 1.5s)
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // 3. Giả lập logic "Bỏ bê 3 ngày" (Random 10% ra lỗi này để test)
        const isNeglected = Math.random() < 0.1;

        if (isNeglected) {
          Alert.alert(
            "⚠️ Cảnh báo từ AI",
            "Bạn đã không cập nhật quá 3 ngày. Lộ trình cũ đã bị hủy, AI đang đánh giá lại tình trạng cây từ ảnh mới của bạn...",
            [
              {
                text: "Tạo lộ trình mới",
                onPress: () =>
                  router.push({
                    pathname: "/garden-setup",
                    params: { imageUri: result.assets[0].uri },
                  } as any),
              },
            ],
          );
        } else {
          Alert.alert(
            "🎉 Tuyệt vời!",
            "Check-in thành công! Bạn đang chăm sóc cây rất tốt.",
          );
          setPlant((prev: any) => ({
            ...prev,
            progressPercentage: Math.min(
              100,
              (prev?.progressPercentage || 0) + 15,
            ),
          }));
        }
      }
    } catch (error) {
      Alert.alert("Lỗi", "Có lỗi xảy ra khi chụp ảnh check-in.");
    } finally {
      setIsCheckingIn(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerBox}>
        <ActivityIndicator size="large" color="#16a34a" />
        <Text style={{ marginTop: 12, color: "#64748b" }}>
          Đang tải thông tin cây...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* ẢNH BÌA & NÚT ĐIỀU HƯỚNG */}
      <View style={styles.coverSection}>
        <Image
          source={{
            uri:
              plant?.plantInfo?.aiPrediction?.imageUrl ||
              "https://hips.hearstapps.com/hmg-prod/images/cute-rose-photos-1616781223.jpg",
          }}
          style={styles.coverImg}
        />
        <View style={styles.overlay} />

        <View style={[styles.headerRow, { top: Math.max(insets.top, 20) }]}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.iconBtn}
          >
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleDeletePlant}
            style={[styles.iconBtn, { backgroundColor: "rgba(239,68,68,0.8)" }]}
          >
            <Trash2 size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* THẺ THÔNG TIN TỔNG QUAN (Overlapping) */}
      <View style={styles.infoCard}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.plantName}>{plant?.customName}</Text>
            <Text style={styles.plantCondition}>
              Tình trạng:{" "}
              <Text
                style={{
                  color:
                    plant?.currentCondition === "Khỏe mạnh"
                      ? "#16a34a"
                      : "#ef4444",
                }}
              >
                {plant?.currentCondition}
              </Text>
            </Text>
          </View>
          <View style={styles.goalBadge}>
            <Text style={styles.goalBadgeText}>
              {plant?.userGoal === "HEAL_DISEASE" ? "Chữa bệnh" : "Nuôi trồng"}
            </Text>
          </View>
        </View>

        <View style={styles.progressSection}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 6,
            }}
          >
            <Text style={styles.progressLabel}>Tiến độ hoàn thành</Text>
            <Text style={styles.progressValue}>
              {plant?.progressPercentage || 0}%
            </Text>
          </View>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${plant?.progressPercentage || 0}%` },
              ]}
            />
          </View>
        </View>
      </View>

      {/* HAI TAB ĐIỀU HƯỚNG */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabBtn,
            activeTab === "ROADMAP" && styles.tabBtnActive,
          ]}
          onPress={() => setActiveTab("ROADMAP")}
        >
          <Calendar
            size={18}
            color={activeTab === "ROADMAP" ? "#fff" : "#64748b"}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "ROADMAP" && styles.tabTextActive,
            ]}
          >
            Lộ trình (AI)
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabBtn,
            activeTab === "CHECKIN" && styles.tabBtnActive,
          ]}
          onPress={() => setActiveTab("CHECKIN")}
        >
          <CameraIcon
            size={18}
            color={activeTab === "CHECKIN" ? "#fff" : "#64748b"}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "CHECKIN" && styles.tabTextActive,
            ]}
          >
            Check-in hằng ngày
          </Text>
        </TouchableOpacity>
      </View>

      {/* NỘI DUNG TỪNG TAB */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentArea}
      >
        {activeTab === "ROADMAP" ? (
          // ==================== TAB 1: LỘ TRÌNH ====================
          <View style={styles.roadmapTab}>
            <Text style={styles.sectionTitle}>Các việc cần làm 7 ngày tới</Text>

            <View style={styles.timelineLine} />

            {plant?.careRoadmap?.map((task: any, index: number) => (
              <View key={index} style={styles.taskItem}>
                {/* Dấu chấm Timeline */}
                <View
                  style={[
                    styles.timelineDot,
                    task.isCompleted ? styles.timelineDotDone : {},
                  ]}
                >
                  {task.isCompleted ? (
                    <CheckCircle2 size={16} color="#fff" />
                  ) : (
                    <Text style={styles.dotText}>{task.day}</Text>
                  )}
                </View>

                {/* Thẻ Nội dung Task */}
                <View
                  style={[
                    styles.taskCard,
                    task.isCompleted ? styles.taskCardDone : {},
                  ]}
                >
                  <View style={styles.taskHeader}>
                    <Text style={styles.taskDayTitle}>Ngày {task.day}</Text>
                    <Text style={styles.taskDate}>
                      {new Date(task.date).toLocaleDateString("vi-VN")}
                    </Text>
                  </View>

                  <View style={styles.taskDetailRow}>
                    <ThermometerSun
                      size={16}
                      color="#f59e0b"
                      style={{ marginTop: 2 }}
                    />
                    <Text style={styles.taskDetailText}>
                      {task.weatherContext}
                    </Text>
                  </View>

                  <View style={styles.taskDetailRow}>
                    <Droplets
                      size={16}
                      color="#0ea5e9"
                      style={{ marginTop: 2 }}
                    />
                    <Text style={styles.taskDetailText}>
                      <Text style={{ fontWeight: "bold" }}>Nước:</Text>{" "}
                      {task.waterAction}
                    </Text>
                  </View>

                  <View style={styles.taskDetailRow}>
                    <Leaf size={16} color="#16a34a" style={{ marginTop: 2 }} />
                    <Text style={styles.taskDetailText}>
                      <Text style={{ fontWeight: "bold" }}>Phân bón:</Text>{" "}
                      {task.fertilizerAction}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : (
          // ==================== TAB 2: CHECK-IN ====================
          <View style={styles.checkinTab}>
            <View style={styles.checkinBox}>
              <Sprout size={60} color="#16a34a" />
              <Text style={styles.checkinTitle}>Đến lúc chăm cây rồi!</Text>
              <Text style={styles.checkinDesc}>
                Hãy chụp một bức ảnh cập nhật tình trạng mới nhất của cây để AI
                đánh giá xem bạn có đang làm đúng theo lộ trình không nhé.
              </Text>

              <TouchableOpacity
                style={styles.cameraBtn}
                onPress={handleDailyCheckIn}
                disabled={isCheckingIn}
              >
                {isCheckingIn ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <CameraIcon size={24} color="#fff" />
                    <Text style={styles.cameraBtnText}>Mở Camera Check-in</Text>
                  </>
                )}
              </TouchableOpacity>

              <View style={styles.warningBox}>
                <AlertTriangle size={16} color="#d97706" />
                <Text style={styles.warningText}>
                  Lưu ý: Nếu bạn quên check-in quá 3 ngày, lộ trình cũ sẽ bị hủy
                  và phải quét AI tạo lại từ đầu!
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

// DỮ LIỆU MOCK ĐỂ TEST GIAO DIỆN KHI BACKEND CHƯA CÓ
const MOCK_PLANT = {
  _id: "mock-id",
  customName: "Hoa hồng ban công",
  currentCondition: "Bệnh đốm lá đen",
  userGoal: "HEAL_DISEASE",
  progressPercentage: 30,
  plantInfo: {
    aiPrediction: {
      imageUrl:
        "https://hips.hearstapps.com/hmg-prod/images/cute-rose-photos-1616781223.jpg",
    },
  },
  careRoadmap: [
    {
      day: 1,
      date: new Date().toISOString(),
      weatherContext: "Nắng gắt, 34°C",
      waterAction: "Tưới đẫm 500ml vào gốc buổi sáng.",
      fertilizerAction: "Ngừng bón phân hôm nay.",
      careAction: "Cắt tỉa lá bệnh.",
      isCompleted: true,
    },
    {
      day: 2,
      date: new Date(Date.now() + 86400000).toISOString(),
      weatherContext: "Nắng nhẹ, 30°C",
      waterAction: "Tưới 200ml giữ ẩm.",
      fertilizerAction: "Phun thuốc trị nấm đốm đen.",
      careAction: "Theo dõi vết đốm.",
      isCompleted: true,
    },
    {
      day: 3,
      date: new Date(Date.now() + 86400000 * 2).toISOString(),
      weatherContext: "Mưa to, 26°C",
      waterAction: "KHÔNG tưới nước, tránh úng.",
      fertilizerAction: "Không bón phân.",
      careAction: "Che chắn tránh mưa tạt.",
      isCompleted: false,
    },
    {
      day: 4,
      date: new Date(Date.now() + 86400000 * 3).toISOString(),
      weatherContext: "Âm u, 28°C",
      waterAction: "Tưới nhẹ 100ml nếu đất khô.",
      fertilizerAction: "Bón nhẹ NPK tan chậm.",
      careAction: "Đón nắng sáng.",
      isCompleted: false,
    },
  ],
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  centerBox: { flex: 1, justifyContent: "center", alignItems: "center" },

  coverSection: { width: "100%", height: 280, position: "relative" },
  coverImg: { width: "100%", height: "100%", resizeMode: "cover" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  headerRow: {
    position: "absolute",
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  infoCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: -50,
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  plantName: {
    fontSize: 22,
    fontWeight: "900",
    color: "#0f172a",
    marginBottom: 4,
  },
  plantCondition: { fontSize: 14, color: "#64748b", fontWeight: "600" },
  goalBadge: {
    backgroundColor: "#fef3c7",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  goalBadgeText: { color: "#d97706", fontWeight: "bold", fontSize: 12 },

  progressSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  progressLabel: { fontSize: 13, color: "#64748b", fontWeight: "bold" },
  progressValue: { fontSize: 14, color: "#16a34a", fontWeight: "900" },
  progressBarBg: {
    height: 10,
    backgroundColor: "#e2e8f0",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#16a34a",
    borderRadius: 5,
  },

  tabContainer: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: "#e2e8f0",
    borderRadius: 12,
    padding: 4,
  },
  tabBtn: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    borderRadius: 10,
  },
  tabBtnActive: {
    backgroundColor: "#16a34a",
    shadowColor: "#16a34a",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  tabText: { fontSize: 14, fontWeight: "bold", color: "#64748b" },
  tabTextActive: { color: "#fff" },

  contentArea: { padding: 16, paddingBottom: 60 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 16,
  },

  // ROADMAP TIMELINE STYLES
  roadmapTab: { position: "relative", paddingLeft: 10 },
  timelineLine: {
    position: "absolute",
    left: 23,
    top: 45,
    bottom: 20,
    width: 2,
    backgroundColor: "#cbd5e1",
  },
  taskItem: { flexDirection: "row", marginBottom: 20 },
  timelineDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#f1f5f9",
    borderWidth: 2,
    borderColor: "#cbd5e1",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
    marginTop: 10,
  },
  timelineDotDone: { backgroundColor: "#16a34a", borderColor: "#16a34a" },
  dotText: { fontSize: 12, fontWeight: "bold", color: "#64748b" },
  taskCard: {
    flex: 1,
    marginLeft: 16,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    elevation: 1,
  },
  taskCardDone: { opacity: 0.7, backgroundColor: "#f8fafc" },
  taskHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  taskDayTitle: { fontSize: 16, fontWeight: "bold", color: "#1e293b" },
  taskDate: { fontSize: 12, color: "#94a3b8", fontWeight: "600" },
  taskDetailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 8,
  },
  taskDetailText: { flex: 1, fontSize: 14, color: "#475569", lineHeight: 20 },

  // CHECKIN STYLES
  checkinTab: { padding: 10 },
  checkinBox: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    elevation: 2,
  },
  checkinTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#0f172a",
    marginTop: 16,
    marginBottom: 8,
  },
  checkinDesc: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  cameraBtn: {
    flexDirection: "row",
    backgroundColor: "#16a34a",
    width: "100%",
    paddingVertical: 18,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    elevation: 3,
  },
  cameraBtnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  warningBox: {
    flexDirection: "row",
    backgroundColor: "#fef3c7",
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
    gap: 10,
  },
  warningText: { flex: 1, fontSize: 13, color: "#d97706", lineHeight: 18 },
});
