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

import {
  scanApi,
  myGardenApi,
  HEALTHY_CONDITION,
  DEFAULT_PLANT_NAME,
} from "@agri-scan/shared";
import { useT } from "../context/I18nContext";

// Định nghĩa Type chính xác cho mục tiêu
type GoalType = "HEAL_DISEASE" | "GET_FRUIT" | "GET_FLOWER" | "MAINTAIN";

// `id` là mã gửi lên API — không dịch. Nhãn nằm ở `labelKey`.
const GOALS: { id: GoalType; labelKey: string; icon: string }[] = [
  { id: "HEAL_DISEASE", labelKey: "myGarden.goalHealDisease", icon: "💊" },
  { id: "GET_FRUIT", labelKey: "myGarden.goalGetFruit", icon: "🍅" },
  { id: "GET_FLOWER", labelKey: "myGarden.goalGetFlower", icon: "🌸" },
  { id: "MAINTAIN", labelKey: "myGarden.goalMaintain", icon: "🌿" },
];

export default function GardenSetupScreen() {
  const t = useT();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { imageUri } = useLocalSearchParams();

  const [isScanning, setIsScanning] = useState(true);
  const [scanData, setScanData] = useState<any>(null);

  // Dữ liệu bóc tách từ AI
  const [scannedImageUrl, setScannedImageUrl] = useState<string>("");
  // Hai giá trị này đi vào payload addPlant → là DỮ LIỆU, không dịch
  const [plantName, setPlantName] = useState<string>(DEFAULT_PLANT_NAME);
  const [diseaseName, setDiseaseName] = useState<string>(HEALTHY_CONDITION);

  const [customName, setCustomName] = useState("");
  // 🔥 FIX: Ép đúng kiểu GoalType thay vì string chung chung
  const [selectedGoal, setSelectedGoal] = useState<GoalType>("MAINTAIN");
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(
    null,
  );
  const [locationStatus, setLocationStatus] = useState(t("myGarden.locating"));
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getLocation();

    if (imageUri) {
      processImageWithAI_REAL(imageUri as string);
    } else {
      Alert.alert(t("common.error"), t("myGarden.errorNoValidImage"));
      router.back();
    }
  }, [imageUri]);

  const getLocation = async () => {
    try {
      if (Platform.OS === "web") {
        setLocation({ lat: 10.762622, lon: 106.660172 });
        setLocationStatus(t("myGarden.locationWebMode"));
        return;
      }
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocationStatus(t("myGarden.locationDenied"));
        setLocation({ lat: 10.762622, lon: 106.660172 });
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setLocation({ lat: loc.coords.latitude, lon: loc.coords.longitude });
      setLocationStatus(t("myGarden.locationOk"));
    } catch (error) {
      setLocationStatus(t("myGarden.locationFailed"));
      setLocation({ lat: 10.762622, lon: 106.660172 });
    }
  };

  const processImageWithAI_REAL = async (uri: string) => {
    try {
      setIsScanning(true);

      let fileToUpload: any;
      if (Platform.OS === "web") {
        const response = await fetch(uri);
        const blob = await response.blob();
        const FileRef = (window as any).File;
        fileToUpload = new FileRef([blob], "upload.jpg", {
          type: blob.type || "image/jpeg",
        });
      } else {
        fileToUpload = { uri, name: "upload.jpg", type: "image/jpeg" };
      }

      const result = await scanApi.scanImageAndWait(fileToUpload);
      setScanData(result);

      const uploadedImgUrl =
        (result as any).imageUrl || (result as any).image?.url;
      if (uploadedImgUrl) {
        setScannedImageUrl(uploadedImgUrl);
      }

      const topPred =
        (result as any).predictions?.[0] || (result as any).aiPredictions?.[0];
      const diseaseLabel =
        topPred?.diseaseId?.name ||
        (result as any).topDisease?.name ||
        HEALTHY_CONDITION;

      let pName = DEFAULT_PLANT_NAME;
      let dName = diseaseLabel;

      if (diseaseLabel.includes("___")) {
        const parts = diseaseLabel.split("___");
        pName = parts[0].replace(/_/g, " ");
        dName = parts[1].replace(/_/g, " ");
      } else if (diseaseLabel.includes("_")) {
        pName = diseaseLabel.split("_")[0];
      }

      setPlantName(pName);
      setDiseaseName(dName);

      if (dName !== HEALTHY_CONDITION && dName !== "healthy") {
        setSelectedGoal("HEAL_DISEASE");
      } else {
        setSelectedGoal("MAINTAIN");
      }
    } catch (error: any) {
      console.log("Lỗi scan ảnh tạo vườn:", error);
      Alert.alert(
        t("myGarden.errorAiTitle"),
        error?.message || t("myGarden.errorAiMessage"),
      );
      router.back();
    } finally {
      setIsScanning(false);
    }
  };

  const handleCreateRoadmap_REAL = async () => {
    if (!customName.trim())
      return Alert.alert(
        t("myGarden.errorMissingInfoTitle"),
        t("myGarden.errorMissingNameMessage"),
      );
    if (!location)
      return Alert.alert(
        t("myGarden.waitTitle"),
        t("myGarden.waitGpsMessage"),
      );

    try {
      setIsSubmitting(true);

      await myGardenApi.addPlantToGarden({
        plantName: plantName,
        diseaseName: diseaseName,
        imageUrl: scannedImageUrl || (imageUri as string),
        customName: customName.trim(),
        userGoal: selectedGoal,
        lat: location.lat,
        lon: location.lon,
      });

      Alert.alert(
        t("myGarden.successTitle"),
        t("myGarden.successMessage"),
        [
          {
            text: t("myGarden.viewGardenNow"),
            onPress: () => router.replace("/my-garden" as any),
          },
        ],
      );
    } catch (error: any) {
      console.log("Lỗi tạo lộ trình:", error);
      Alert.alert(
        t("common.error"),
        error?.response?.data?.message || t("myGarden.errorCreateRoadmap"),
      );
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

      <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          disabled={isScanning || isSubmitting}
        >
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("myGarden.setupTitle")}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.imageSection}>
          <Image
            source={{ uri: imageUri as string }}
            style={styles.previewImg}
          />
          {isScanning ? (
            <View style={styles.scanningOverlay}>
              <ActivityIndicator size="large" color="#16a34a" />
              <Text style={styles.scanningText}>
                {t("myGarden.analyzingCondition")}
              </Text>
            </View>
          ) : (
            <View style={styles.resultBadge}>
              <CheckCircle2 size={20} color="#16a34a" />
              <View style={{ marginLeft: 8, flex: 1 }}>
                <Text style={styles.resultTitle}>
                  {t("myGarden.analysisDone")}
                </Text>
                <Text style={styles.resultDesc} numberOfLines={1}>
                  {t("myGarden.detectedPrefix", { disease: diseaseName })}
                </Text>
              </View>
            </View>
          )}
        </View>

        <View
          style={{ opacity: isScanning ? 0.5 : 1 }}
          pointerEvents={isScanning ? "none" : "auto"}
        >
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              {t("myGarden.step1Label")}{" "}
              <Text style={{ color: "#ef4444" }}>*</Text>
            </Text>
            <View style={styles.inputWrapper}>
              <Leaf size={20} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder={t("myGarden.namePlaceholder")}
                value={customName}
                onChangeText={setCustomName}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              {t("myGarden.step2Label")}{" "}
              <Text style={{ color: "#ef4444" }}>*</Text>
            </Text>
            <Text style={styles.subLabel}>
              {t("myGarden.step2Hint")}
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
                    {t(goal.labelKey)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t("myGarden.step3Label")}</Text>
            <View style={styles.locationBox}>
              <View style={styles.locIconBox}>
                <MapPin size={24} color="#3b82f6" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.locTitle}>
                  {t("myGarden.yourGardenLocation")}
                </Text>
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
              <Sparkles size={14} color="#d97706" /> {t("myGarden.weatherHint")}
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.submitBtn,
              (isScanning || isSubmitting) && styles.submitBtnDisabled,
            ]}
            onPress={handleCreateRoadmap_REAL}
            disabled={isScanning || isSubmitting}
          >
            {isSubmitting ? (
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <ActivityIndicator color="#fff" />
                <Text style={styles.submitBtnText}>
                  {t("myGarden.composingRoadmap")}
                </Text>
              </View>
            ) : (
              <>
                <Stethoscope size={20} color="#fff" />
                <Text style={styles.submitBtnText}>
                  {t("myGarden.submitButton")}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// BẠN GIỮ NGUYÊN CÁC STYLES TỪ FILE CŨ NHÉ
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
  content: { padding: 16, paddingBottom: 60 },
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
  submitBtn: {
    flexDirection: "row",
    backgroundColor: "#16a34a",
    paddingVertical: 16,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
    elevation: 3,
  },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
