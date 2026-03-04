import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  Camera as CameraIcon,
  Image as ImageIcon,
  X,
  RefreshCw,
  Leaf,
  AlertCircle,
  CheckCircle2,
} from "lucide-react-native";

// Khởi tạo Gemini AI (Lưu ý: Đổi NEXT_PUBLIC thành EXPO_PUBLIC trong file .env của mobile nhé)
const API_KEY =
  process.env.EXPO_PUBLIC_GEMINI_API_KEY ||
  "NHAP_API_KEY_CUA_BAN_VAO_DAY_NEU_CHUA_CO_ENV";
const ai = new GoogleGenerativeAI(API_KEY);

interface DiagnosisResult {
  diseaseName: string;
  confidence: number;
  description: string;
  treatment: {
    biological: string[];
    chemical: string[];
    preventive: string[];
  };
}

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [image, setImage] = useState<string | null>(null); // Lưu base64
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [facing, setFacing] = useState<"back" | "front">("back");

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cameraRef = useRef<any>(null);

  // 1. Xử lý mở Camera
  const handleOpenCamera = async () => {
    if (!permission?.granted) {
      const { granted } = await requestPermission();
      if (!granted) {
        Alert.alert("Lỗi", "Cần cấp quyền camera để chụp ảnh cây trồng.");
        return;
      }
    }
    setIsCameraOpen(true);
  };

  // 2. Chụp ảnh
  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          base64: true,
          quality: 0.7,
        });
        setImage(photo.base64);
        setIsCameraOpen(false);
        setResult(null);
        setError(null);
      } catch (err) {
        Alert.alert("Lỗi", "Không thể chụp ảnh, vui lòng thử lại.");
      }
    }
  };

  // 3. Chọn ảnh từ thư viện
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      setImage(result.assets[0].base64);
      setResult(null);
      setError(null);
    }
  };

  // 4. Gọi Gemini AI phân tích
  const analyzeImage = async () => {
    if (!image) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `
        Analyze this plant image for diseases. 
        Return a JSON object with the following structure:
        {
          "diseaseName": "Name of the disease or 'Healthy' if no disease found",
          "confidence": 0.95,
          "description": "Brief description of the condition",
          "treatment": {
            "biological": ["List of biological treatments"],
            "chemical": ["List of chemical treatments"],
            "preventive": ["List of preventive measures"]
          }
        }
        If the image is not a plant, return null.
      `;

      const response = await model.generateContent([
        prompt,
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: image,
          },
        },
      ]);

      const text = response.response.text();
      if (!text) throw new Error("Không nhận được phản hồi từ AI");

      // Xử lý chuỗi JSON bị kẹp trong Markdown block (```json ... ```)
      let jsonString = text.trim();
      if (jsonString.startsWith("```json")) {
        jsonString = jsonString
          .replace(/^```json\s*/, "")
          .replace(/\s*```$/, "");
      } else if (jsonString.startsWith("```")) {
        jsonString = jsonString.replace(/^```\s*/, "").replace(/\s*```$/, "");
      }

      const data = JSON.parse(jsonString);

      if (!data) {
        setError(
          "Không nhận diện được cây trồng. Vui lòng thử lại với ảnh rõ nét hơn.",
        );
      } else {
        setResult(data);
      }
    } catch (err) {
      console.error("Analysis error:", err);
      setError("Có lỗi xảy ra khi phân tích ảnh. Vui lòng thử lại.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetScan = () => {
    setImage(null);
    setResult(null);
    setError(null);
  };

  // --- GIAO DIỆN CAMERA MỞ TOÀN MÀN HÌNH MỘT PHẦN ---
  if (isCameraOpen) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
        <CameraView style={{ flex: 1 }} facing={facing} ref={cameraRef}>
          <View style={styles.cameraOverlay}>
            <TouchableOpacity
              onPress={() => setIsCameraOpen(false)}
              style={styles.iconButton}
            >
              <X size={28} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={takePicture}
              style={styles.captureButton}
            >
              <View style={styles.captureInner} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                setFacing((f) => (f === "back" ? "front" : "back"))
              }
              style={styles.iconButton}
            >
              <RefreshCw size={28} color="#fff" />
            </TouchableOpacity>
          </View>
        </CameraView>
      </SafeAreaView>
    );
  }

  // --- GIAO DIỆN CHÍNH ---
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Chẩn Đoán Bệnh Cây</Text>
          <Text style={styles.subtitle}>
            Chụp hoặc tải ảnh lên để AI phân tích sức khỏe cây trồng
          </Text>
        </View>

        {/* Khung chứa ảnh hoặc nút chọn */}
        <View
          style={[
            styles.imageContainer,
            image ? styles.imageContainerActive : null,
          ]}
        >
          {image ? (
            <>
              <Image
                source={{ uri: `data:image/jpeg;base64,${image}` }}
                style={styles.previewImage}
              />
              <TouchableOpacity style={styles.closeBtn} onPress={resetScan}>
                <X size={20} color="#ef4444" />
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconBox}>
                <CameraIcon size={36} color="#16a34a" />
              </View>
              <Text style={styles.emptyTitle}>Bắt đầu chẩn đoán</Text>

              <TouchableOpacity
                style={styles.actionBtnPrimary}
                onPress={handleOpenCamera}
              >
                <CameraIcon size={20} color="#fff" />
                <Text style={styles.actionBtnTextPrimary}>
                  Chụp ảnh trực tiếp
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionBtnSecondary}
                onPress={pickImage}
              >
                <ImageIcon size={20} color="#374151" />
                <Text style={styles.actionBtnTextSecondary}>
                  Tải ảnh từ thư viện
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Nút Phân tích */}
        {image && !result && !isAnalyzing && (
          <TouchableOpacity style={styles.analyzeBtn} onPress={analyzeImage}>
            <Leaf size={20} color="#fff" />
            <Text style={styles.analyzeBtnText}>Phân tích ngay</Text>
          </TouchableOpacity>
        )}

        {/* Đang Load */}
        {isAnalyzing && (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#16a34a" />
            <Text style={styles.loadingText}>AI đang phân tích dữ liệu...</Text>
          </View>
        )}

        {/* Báo Lỗi */}
        {error && (
          <View style={styles.errorBox}>
            <AlertCircle size={20} color="#ef4444" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Kết quả trả về */}
        {result && (
          <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <View>
                <Text style={styles.diseaseName}>{result.diseaseName}</Text>
                <Text style={styles.confidence}>
                  Độ tin cậy: {(result.confidence * 100).toFixed(0)}%
                </Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  result.diseaseName.toLowerCase().includes("healthy") ||
                  result.diseaseName.toLowerCase().includes("khỏe")
                    ? styles.badgeSafe
                    : styles.badgeDanger,
                ]}
              >
                {result.diseaseName.toLowerCase().includes("healthy") ||
                result.diseaseName.toLowerCase().includes("khỏe") ? (
                  <CheckCircle2 size={16} color="#15803d" />
                ) : (
                  <AlertCircle size={16} color="#b91c1c" />
                )}
                <Text
                  style={[
                    styles.statusText,
                    result.diseaseName.toLowerCase().includes("healthy") ||
                    result.diseaseName.toLowerCase().includes("khỏe")
                      ? { color: "#15803d" }
                      : { color: "#b91c1c" },
                  ]}
                >
                  {result.diseaseName.toLowerCase().includes("healthy") ||
                  result.diseaseName.toLowerCase().includes("khỏe")
                    ? "Khỏe mạnh"
                    : "Cần xử lý"}
                </Text>
              </View>
            </View>

            <Text style={styles.description}>{result.description}</Text>

            <View style={styles.treatments}>
              {/* Biện pháp sinh học */}
              <View style={styles.treatmentSection}>
                <View style={styles.treatmentTitleRow}>
                  <View style={[styles.dot, { backgroundColor: "#22c55e" }]} />
                  <Text style={styles.treatmentTitle}>BIỆN PHÁP SINH HỌC</Text>
                </View>
                {result.treatment.biological.map((item, idx) => (
                  <Text
                    key={idx}
                    style={[
                      styles.treatmentItem,
                      { borderLeftColor: "#bbf7d0" },
                    ]}
                  >
                    • {item}
                  </Text>
                ))}
              </View>

              {/* Biện pháp hóa học */}
              <View style={styles.treatmentSection}>
                <View style={styles.treatmentTitleRow}>
                  <View style={[styles.dot, { backgroundColor: "#f97316" }]} />
                  <Text style={styles.treatmentTitle}>BIỆN PHÁP HÓA HỌC</Text>
                </View>
                {result.treatment.chemical.map((item, idx) => (
                  <Text
                    key={idx}
                    style={[
                      styles.treatmentItem,
                      { borderLeftColor: "#fed7aa" },
                    ]}
                  >
                    • {item}
                  </Text>
                ))}
              </View>

              {/* Phòng ngừa */}
              <View style={styles.treatmentSection}>
                <View style={styles.treatmentTitleRow}>
                  <View style={[styles.dot, { backgroundColor: "#3b82f6" }]} />
                  <Text style={styles.treatmentTitle}>PHÒNG NGỪA</Text>
                </View>
                {result.treatment.preventive.map((item, idx) => (
                  <Text
                    key={idx}
                    style={[
                      styles.treatmentItem,
                      { borderLeftColor: "#bfdbfe" },
                    ]}
                  >
                    • {item}
                  </Text>
                ))}
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  scrollContent: { padding: 20, paddingBottom: 60 },
  header: { alignItems: "center", marginBottom: 24 },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#16a34a",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    paddingHorizontal: 20,
  },

  // Khung chứa ảnh
  imageContainer: {
    width: "100%",
    height: 350,
    backgroundColor: "#fff",
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderStyle: "dashed",
    overflow: "hidden",
    justifyContent: "center",
    marginBottom: 20,
  },
  imageContainerActive: {
    borderStyle: "solid",
    borderColor: "#16a34a",
    borderWidth: 1,
  },
  previewImage: { width: "100%", height: "100%", resizeMode: "cover" },
  closeBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 8,
    borderRadius: 20,
  },

  // Empty State (Chưa có ảnh)
  emptyState: { alignItems: "center", padding: 20 },
  emptyIconBox: {
    width: 70,
    height: 70,
    backgroundColor: "#dcfce3",
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 24,
  },
  actionBtnPrimary: {
    width: "100%",
    flexDirection: "row",
    backgroundColor: "#16a34a",
    paddingVertical: 14,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  actionBtnTextPrimary: { color: "#fff", fontSize: 16, fontWeight: "600" },
  actionBtnSecondary: {
    width: "100%",
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 14,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  actionBtnTextSecondary: { color: "#374151", fontSize: 16, fontWeight: "600" },

  // Nút phân tích
  analyzeBtn: {
    flexDirection: "row",
    backgroundColor: "#16a34a",
    paddingVertical: 16,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    shadowColor: "#16a34a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  analyzeBtnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },

  // Trạng thái Loading / Error
  loadingBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#f3f4f6",
  },
  loadingText: { color: "#16a34a", fontWeight: "500", fontSize: 15 },
  errorBox: {
    backgroundColor: "#fef2f2",
    padding: 16,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "#fee2e2",
  },
  errorText: { color: "#ef4444", flex: 1, fontSize: 14 },

  // Kết quả
  resultCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#f3f4f6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  resultHeader: {
    padding: 20,
    backgroundColor: "#f0fdf4",
    borderBottomWidth: 1,
    borderBottomColor: "#dcfce3",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  diseaseName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  confidence: { fontSize: 13, color: "#6b7280" },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeSafe: { backgroundColor: "#dcfce3" },
  badgeDanger: { backgroundColor: "#fee2e2" },
  statusText: { fontSize: 12, fontWeight: "600" },
  description: { padding: 20, fontSize: 15, color: "#4b5563", lineHeight: 24 },

  treatments: { paddingHorizontal: 20, paddingBottom: 20, gap: 20 },
  treatmentSection: { gap: 8 },
  treatmentTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  treatmentTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#111827",
    letterSpacing: 0.5,
  },
  treatmentItem: {
    fontSize: 14,
    color: "#4b5563",
    paddingLeft: 12,
    borderLeftWidth: 2,
    paddingVertical: 2,
    lineHeight: 22,
  },

  // Camera Overlay
  cameraOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    paddingBottom: 40,
  },
  iconButton: {
    width: 50,
    height: 50,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 4,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  captureInner: {
    width: 54,
    height: 54,
    backgroundColor: "#fff",
    borderRadius: 27,
  },
});
