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
  TextInput,
  Platform,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as Location from "expo-location";
import {
  ArrowLeft,
  MapPin,
  Leaf,
  Stethoscope,
  Sparkles,
  CheckCircle2,
} from "lucide-react-native";

const GOALS = [
  { id: "HEAL_DISEASE", label: "Chữa bệnh cho cây", icon: "💊" },
  { id: "GET_FRUIT", label: "Thu hoạch quả", icon: "🍅" },
  { id: "GET_FLOWER", label: "Lấy hoa", icon: "🌸" },
  { id: "MAINTAIN", label: "Duy trì khỏe mạnh", icon: "🌿" },
];

export default function GardenSetupScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Nhận link ảnh từ trang My Garden truyền sang
  const { imageUri } = useLocalSearchParams();

  const [isScanning, setIsScanning] = useState(true);
  const [scanData, setScanData] = useState<any>(null);

  const [customName, setCustomName] = useState("");
  const [selectedGoal, setSelectedGoal] = useState("MAINTAIN");

  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(
    null,
  );
  const [locationStatus, setLocationStatus] = useState("Đang lấy vị trí...");

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getLocation();

    if (imageUri) {
      processImageWithAI_MOCK(imageUri as string);
    } else {
      Alert.alert("Lỗi", "Không tìm thấy ảnh hợp lệ.");
      router.back();
    }
  }, [imageUri]);

  const getLocation = async () => {
    try {
      if (Platform.OS === "web") {
        setLocation({ lat: 10.762622, lon: 106.660172 });
        setLocationStatus("Đã lấy vị trí (Web Mode)");
        return;
      }

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocationStatus("Bị từ chối quyền vị trí");
        setLocation({ lat: 10.762622, lon: 106.660172 });
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation({ lat: loc.coords.latitude, lon: loc.coords.longitude });
      setLocationStatus("Đã lấy vị trí chính xác");
    } catch (error) {
      setLocationStatus("Không thể lấy vị trí");
      setLocation({ lat: 10.762622, lon: 106.660172 }); // Fallback
    }
  };

  // ====================================================================
  // 🔥 HÀM GIẢ LẬP AI QUÉT ẢNH (CHỜ 2 GIÂY RỒI TRẢ VỀ BỆNH)
  // ====================================================================
  const processImageWithAI_MOCK = async (uri: string) => {
    try {
      setIsScanning(true);

      // Giả lập thời gian AI xử lý mất 2 giây
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Tạo kết quả giả định (Giả sử AI quét ra bệnh Đốm lá)
      const fakeResult = {
        topDisease: {
          name: "Bệnh đốm lá (Test Mode)",
          plantId: { _id: "60d5ecb8b392d700153ef123" },
        },
      };

      setScanData(fakeResult);

      // Tự động chuyển mục tiêu thành "Chữa bệnh"
      setSelectedGoal("HEAL_DISEASE");
    } catch (error: any) {
      Alert.alert("Lỗi AI", "Không thể nhận diện ảnh lúc này.");
      router.back();
    } finally {
      setIsScanning(false);
    }
  };

  // ====================================================================
  // 🔥 HÀM GIẢ LẬP LƯU LỘ TRÌNH (CHỜ 2 GIÂY RỒI BÁO THÀNH CÔNG)
  // ====================================================================
  const handleCreateRoadmap_MOCK = async () => {
    if (!customName.trim())
      return Alert.alert(
        "Thiếu thông tin",
        "Vui lòng đặt tên cho cây của bạn.",
      );
    if (!location)
      return Alert.alert(
        "Chờ chút",
        "Hệ thống đang lấy vị trí GPS của bạn để kiểm tra thời tiết.",
      );

    try {
      setIsSubmitting(true);

      // Giả lập thời gian Backend lưu DB và gọi AI tạo lộ trình mất 2 giây
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Không gọi API thật nữa, báo thành công luôn
      Alert.alert(
        "🎉 Thành công (Chế độ Test)!",
        "AI đã phân tích thời tiết và tạo xong lộ trình chăm sóc 7 ngày cho cây của bạn.",
        [
          {
            text: "Xem vườn ngay",
            onPress: () => router.replace("/my-garden" as any),
          },
        ],
      );
    } catch (error: any) {
      Alert.alert("Lỗi", "Có lỗi xảy ra khi tạo lộ trình.");
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
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          disabled={isScanning || isSubmitting}
        >
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Khai báo thông tin</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* ẢNH PREVIEW VÀ TRẠNG THÁI AI */}
        <View style={styles.imageSection}>
          <Image
            source={{ uri: imageUri as string }}
            style={styles.previewImg}
          />

          {isScanning ? (
            <View style={styles.scanningOverlay}>
              <ActivityIndicator size="large" color="#16a34a" />
              <Text style={styles.scanningText}>
                AI đang phân tích tình trạng cây...
              </Text>
            </View>
          ) : (
            <View style={styles.resultBadge}>
              <CheckCircle2 size={20} color="#16a34a" />
              <View style={{ marginLeft: 8, flex: 1 }}>
                <Text style={styles.resultTitle}>Hoàn tất phân tích!</Text>
                <Text style={styles.resultDesc} numberOfLines={1}>
                  Phát hiện: {scanData?.topDisease?.name || "Cây khỏe mạnh"}
                </Text>
              </View>
            </View>
          )}
        </View>

        <View
          style={{ opacity: isScanning ? 0.5 : 1 }}
          pointerEvents={isScanning ? "none" : "auto"}
        >
          {/* TÊN CÂY TÙY CHỈNH */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              1. Đặt tên cho cây của bạn{" "}
              <Text style={{ color: "#ef4444" }}>*</Text>
            </Text>
            <View style={styles.inputWrapper}>
              <Leaf size={20} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Ví dụ: Cà chua ban công, Hoa hồng trồng chậu..."
                value={customName}
                onChangeText={setCustomName}
              />
            </View>
          </View>

          {/* MỤC TIÊU TRỒNG */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              2. Mục tiêu chăm sóc <Text style={{ color: "#ef4444" }}>*</Text>
            </Text>
            <Text style={styles.subLabel}>
              AI sẽ dựa vào mục tiêu này để đưa ra lời khuyên phù hợp.
            </Text>
            <View style={styles.goalsContainer}>
              {GOALS.map((goal) => (
                <TouchableOpacity
                  key={goal.id}
                  style={[
                    styles.goalBtn,
                    selectedGoal === goal.id && styles.goalBtnActive,
                  ]}
                  onPress={() => setSelectedGoal(goal.id)}
                >
                  <Text style={styles.goalIcon}>{goal.icon}</Text>
                  <Text
                    style={[
                      styles.goalText,
                      selectedGoal === goal.id && styles.goalTextActive,
                    ]}
                  >
                    {goal.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* VỊ TRÍ & THỜI TIẾT */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>3. Tọa độ & Thời tiết</Text>
            <View style={styles.locationBox}>
              <View style={styles.locIconBox}>
                <MapPin size={24} color="#3b82f6" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.locTitle}>Vị trí vườn của bạn</Text>
                <Text style={styles.locDesc}>{locationStatus}</Text>
                {location && (
                  <Text style={styles.locCoords}>
                    Lat: {location.lat.toFixed(4)} | Lon:{" "}
                    {location.lon.toFixed(4)}
                  </Text>
                )}
              </View>
            </View>
            <Text style={styles.aiNotice}>
              <Sparkles size={14} color="#d97706" /> AI sẽ lấy dữ liệu thời tiết
              7 ngày tới tại vị trí này để tối ưu lượng nước tưới.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* NÚT SUBMIT */}
      <View
        style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) }]}
      >
        <TouchableOpacity
          style={[
            styles.submitBtn,
            (isScanning || isSubmitting) && styles.submitBtnDisabled,
          ]}
          onPress={handleCreateRoadmap_MOCK}
          disabled={isScanning || isSubmitting}
        >
          {isSubmitting ? (
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <ActivityIndicator color="#fff" />
              <Text style={styles.submitBtnText}>AI đang soạn lộ trình...</Text>
            </View>
          ) : (
            <>
              <Stethoscope size={20} color="#fff" />
              <Text style={styles.submitBtnText}>Tạo Lộ Trình Chăm Sóc</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
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
  content: { padding: 16, paddingBottom: 40 },

  imageSection: {
    position: "relative",
    marginBottom: 24,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#e2e8f0",
    elevation: 3,
  },
  previewImg: { width: "100%", height: 220, resizeMode: "cover" },
  scanningOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.85)",
    justifyContent: "center",
    alignItems: "center",
  },
  scanningText: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: "bold",
    color: "#16a34a",
  },
  resultBadge: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255,255,255,0.95)",
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  resultTitle: { fontSize: 14, fontWeight: "bold", color: "#16a34a" },
  resultDesc: { fontSize: 13, color: "#475569", marginTop: 2 },

  inputGroup: { marginBottom: 24 },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 6,
  },
  subLabel: {
    fontSize: 13,
    color: "#64748b",
    marginBottom: 12,
    fontStyle: "italic",
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 52,
  },
  inputIcon: { marginRight: 10 },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: "#1e293b",
    outlineStyle: "none" as any,
  },

  goalsContainer: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  goalBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    width: "48%",
  },
  goalBtnActive: { backgroundColor: "#f0fdf4", borderColor: "#16a34a" },
  goalIcon: { fontSize: 18, marginRight: 8 },
  goalText: { fontSize: 13, fontWeight: "600", color: "#64748b", flex: 1 },
  goalTextActive: { color: "#16a34a" },

  locationBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eff6ff",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#bfdbfe",
  },
  locIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#dbeafe",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  locTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1e3a8a",
    marginBottom: 2,
  },
  locDesc: { fontSize: 13, color: "#3b82f6", marginBottom: 4 },
  locCoords: {
    fontSize: 11,
    color: "#60a5fa",
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  aiNotice: {
    fontSize: 12,
    color: "#d97706",
    marginTop: 8,
    fontStyle: "italic",
  },

  footer: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  submitBtn: {
    flexDirection: "row",
    backgroundColor: "#16a34a",
    paddingVertical: 16,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
