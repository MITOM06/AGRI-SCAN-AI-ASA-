import React, { useState, useEffect } from "react";
import {
  View,
  Text,
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
import * as Location from "expo-location";
import {
  ArrowLeft,
  Trash2,
  Calendar,
  Droplets,
  ThermometerSun,
  Leaf,
  Camera as CameraIcon,
  CheckCircle2,
  AlertTriangle,
  Sprout,
  Sparkles,
} from "lucide-react-native";

import {
  myGardenApi,
  uploadApi,
  HEALTHY_CONDITION,
} from "@agri-scan/shared";
import { useT } from "../context/I18nContext";

import { styles } from "../styles/garden-detail.styles";
type TabType = "ROADMAP" | "CHECKIN";

export default function GardenDetailScreen() {
  const t = useT();
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

  const fetchPlantDetail = async () => {
    try {
      setLoading(true);
      const res = await myGardenApi.getUserGarden();
      const foundPlant = res.find((p: any) => p._id === plantId);

      if (foundPlant) {
        setPlant(foundPlant);
      } else {
        Alert.alert(t("common.error"), t("myGarden.detailNotFound"));
        router.back();
      }
    } catch (error) {
      console.log("Lỗi tải chi tiết cây:", error);
      Alert.alert(t("common.error"), t("myGarden.detailLoadFailed"));
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlant = () => {
    Alert.alert(
      t("myGarden.deleteConfirmTitle"),
      t("myGarden.deleteConfirmMessage"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("myGarden.deleteConfirmYes"),
          style: "destructive",
          onPress: async () => {
            try {
              await myGardenApi.removePlant(plantId as string);
              Alert.alert(
                t("myGarden.deleteSuccessTitle"),
                t("myGarden.deleteSuccessMessage"),
              );
              router.back();
            } catch (error) {
              Alert.alert(
                t("common.error"),
                t("myGarden.deleteFailedShort"),
              );
            }
          },
        },
      ],
    );
  };

  const handleDailyCheckIn = async () => {
    if (Platform.OS === "web") {
      alert(t("myGarden.checkInWebOnly"));
      return;
    }

    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      let lat = 10.7626,
        lon = 106.6601;
      if (status === "granted") {
        const loc = await Location.getCurrentPositionAsync({});
        lat = loc.coords.latitude;
        lon = loc.coords.longitude;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets[0].uri) {
        setIsCheckingIn(true);

        // Upload ảnh check-in lên GCS qua API chung, lấy URL thật
        const asset = result.assets[0];
        const { url: uploadedImageUrl } = await uploadApi.uploadImage({
          uri: asset.uri,
          name: asset.fileName ?? "checkin.jpg",
          type: asset.mimeType ?? "image/jpeg",
        });

        const todayStr = new Date().toDateString();
        const todayTask = plant?.careRoadmap?.find(
          (t: any) => new Date(t.date).toDateString() === todayStr,
        );
        const currentDay = todayTask ? todayTask.day : 1;

        const res = await myGardenApi.dailyCheckIn(plantId as string, {
          currentDay,
          imageUrl: uploadedImageUrl,
          lat,
          lon,
        });

        if (res.requireRegeneration) {
          Alert.alert(t("myGarden.checkInWarningTitle"), res.message, [
            {
              text: t("myGarden.checkInCreateNewRoadmap"),
              onPress: () =>
                router.push({
                  pathname: "/garden-setup",
                  params: { imageUri: result.assets[0].uri },
                } as any),
            },
          ]);
        } else {
          Alert.alert(t("myGarden.checkInSuccessTitle"), res.message);
          fetchPlantDetail();
        }
      }
    } catch (error: any) {
      console.log("Lỗi checkin:", error);
      Alert.alert(
        t("common.error"),
        error?.response?.data?.message ||
          t("myGarden.checkInFailedMessage"),
      );
    } finally {
      setIsCheckingIn(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerBox}>
        <ActivityIndicator size="large" color="#16a34a" />
        <Text style={{ marginTop: 12, color: "#64748b" }}>
          {t("myGarden.detailLoading")}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* 🔥 FIX: Các nút công cụ được làm nổi (Floating Header) */}
      <View style={[styles.floatingHeader, { top: Math.max(insets.top, 10) }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleDeletePlant}
          style={[styles.iconBtn, { backgroundColor: "rgba(239,68,68,0.9)" }]}
        >
          <Trash2 size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* 🔥 FIX: Gói tất cả vào một ScrollView duy nhất để lướt mượt toàn trang */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
        bounces={false}
      >
        {/* ẢNH BÌA */}
        <View style={styles.coverSection}>
          <Image
            source={{
              uri:
                plant?.imageUrl ||
                "https://placehold.co/400x300?text=Agri+Scan",
            }}
            style={styles.coverImg}
          />
          <View style={styles.overlay} />
        </View>

        {/* THẺ THÔNG TIN TỔNG QUAN */}
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
                {t("myGarden.conditionLabel")}{" "}
                <Text
                  style={{
                    color:
                      plant?.currentCondition === HEALTHY_CONDITION
                        ? "#16a34a"
                        : "#ef4444",
                  }}
                >
                  {/* currentCondition là dữ liệu từ API → hiện nguyên văn */}
                  {plant?.currentCondition || t("myGarden.conditionLoading")}
                </Text>
              </Text>
            </View>
            <View style={styles.goalBadge}>
              <Text style={styles.goalBadgeText}>
                {plant?.userGoal === "HEAL_DISEASE"
                  ? t("myGarden.goalHealShort")
                  : t("myGarden.goalDefaultShort")}
              </Text>
            </View>
          </View>

          {plant?.roadmapSummary && (
            <View
              style={{
                marginTop: 16,
                backgroundColor: "#f0fdf4",
                padding: 12,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: "#dcfce3",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 6,
                }}
              >
                <Sparkles
                  size={16}
                  color="#16a34a"
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={{ fontWeight: "bold", color: "#15803d", fontSize: 14 }}
                >
                  {t("myGarden.aiEvaluation")}
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 14,
                  color: "#166534",
                  fontStyle: "italic",
                  lineHeight: 22,
                }}
              >
                {plant.roadmapSummary}
              </Text>
            </View>
          )}

          <View style={styles.progressSection}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <Text style={styles.progressLabel}>
                {t("myGarden.completionProgress")}
              </Text>
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

        {/* HAI TAB ĐIỀU HƯỚNG CÙNG CUỘN LÊN */}
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
              {t("myGarden.roadmapAi")}
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
              {t("myGarden.checkInToday")}
            </Text>
          </TouchableOpacity>
        </View>

        {/* NỘI DUNG TỪNG TAB */}
        <View style={styles.contentArea}>
          {activeTab === "ROADMAP" ? (
            <View style={styles.roadmapTab}>
              <Text style={styles.sectionTitle}>
                {t("myGarden.nextTasks")}
              </Text>
              <View style={styles.timelineLine} />

              {plant?.careRoadmap?.map((task: any, index: number) => (
                <View key={index} style={styles.taskItem}>
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
                  <View
                    style={[
                      styles.taskCard,
                      task.isCompleted ? styles.taskCardDone : {},
                    ]}
                  >
                    <View style={styles.taskHeader}>
                      <Text style={styles.taskDayTitle}>
                        {t("myGarden.dayN", { day: task.day })}
                      </Text>
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
                        <Text style={{ fontWeight: "bold" }}>
                          {t("myGarden.taskWaterInline")}
                        </Text>{" "}
                        {task.waterAction}
                      </Text>
                    </View>
                    <View style={styles.taskDetailRow}>
                      <Leaf
                        size={16}
                        color="#16a34a"
                        style={{ marginTop: 2 }}
                      />
                      <Text style={styles.taskDetailText}>
                        <Text style={{ fontWeight: "bold" }}>
                          {t("myGarden.taskFertilizerInline")}
                        </Text>{" "}
                        {task.fertilizerAction}
                      </Text>
                    </View>
                    <View style={styles.taskDetailRow}>
                      <AlertTriangle
                        size={16}
                        color="#dc2626"
                        style={{ marginTop: 2 }}
                      />
                      <Text style={styles.taskDetailText}>
                        <Text style={{ fontWeight: "bold" }}>
                          {t("myGarden.taskCareInline")}
                        </Text>{" "}
                        {task.careAction}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.checkinTab}>
              <View style={styles.checkinBox}>
                <Sprout size={64} color="#16a34a" />
                <Text style={styles.checkinTitle}>
                  {t("myGarden.checkInTimeTitle")}
                </Text>
                <Text style={styles.checkinDesc}>
                  {t("myGarden.checkInTimeDesc")}
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
                      <Text style={styles.cameraBtnText}>
                        {t("myGarden.checkInOpenCamera")}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
                <View style={styles.warningBox}>
                  <AlertTriangle size={20} color="#d97706" />
                  <Text style={styles.warningText}>
                    {t("myGarden.checkInWarningNote")}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
