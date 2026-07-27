import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Modal,
  ActivityIndicator,
  Animated,
  Dimensions,
  Alert,
  Linking,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import {
  Send,
  Camera as CameraIcon,
  X,
  Leaf,
  User,
  Plus,
  PanelLeft,
  MessageSquare,
  ArrowLeft,
  Image as ImageIcon,
} from "lucide-react-native";

import { scanApi, DEFAULT_PLANT_NAME } from "@agri-scan/shared";
import { useT } from "../context/I18nContext";

import { styles } from "../styles/scan.styles";
const { width } = Dimensions.get("window");

interface Message {
  id: string;
  text?: string;
  image?: string;
  sender: "user" | "bot";
  timestamp: Date;
  scanResult?: any;
}

const getDateGroup = (date: string | Date): string => {
  const d = new Date(date);
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const diffDays = Math.floor(
    (todayStart.getTime() -
      new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()) /
      (1000 * 60 * 60 * 24),
  );
  // Trả về KEY i18n, không phải nhãn — hàm này ở cấp module, không gọi được hook
  if (diffDays <= 0) return "scan.groupToday";
  if (diffDays === 1) return "scan.groupYesterday";
  if (diffDays <= 7) return "scan.group7Days";
  return "scan.group30Days";
};

export default function ScanChatScreen() {
  const t = useT();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isBotTyping, setIsBotTyping] = useState(false);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSidebarTab, setActiveSidebarTab] = useState<"chat" | "scan">(
    "chat",
  );
  const [currentScanLabel, setCurrentScanLabel] = useState<string | undefined>(
    undefined,
  );

  type SessionItem = {
    id: string;
    title: string;
    updatedAt: Date;
    type: "chat" | "scan";
    scanHistoryId?: string;
    rawData?: any;
  };
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | undefined>(
    undefined,
  );
  const [lastSyncedSessionId, setLastSyncedSessionId] = useState<
    string | undefined
  >(undefined);

  const slideAnim = useRef(new Animated.Value(-width)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    fetchSidebarData();
  }, []);

  useEffect(() => {
    setTimeout(
      () => scrollViewRef.current?.scrollToEnd({ animated: true }),
      100,
    );
  }, [messages, isBotTyping]);

  const fetchSidebarData = async () => {
    try {
      const chatSessionsApi = await scanApi.getChatHistory();
      const scanItems = await scanApi.getScanHistory();

      const merged: SessionItem[] = [];

      (chatSessionsApi || []).forEach((s) => {
        merged.push({
          id: s.sessionId,
          title: s.title || t("scan.defaultChatTitle"),
          updatedAt: new Date(s.updatedAt),
          type: "chat",
        });
      });

      (scanItems || []).forEach((s: any) => {
        const rawId = s.id ?? s.scanHistoryId ?? s._id;
        const topDiseaseInfo = s.aiPredictions?.[0]?.diseaseId;
        const topName =
          topDiseaseInfo?.name ||
          s.topPrediction?.diseaseName ||
          t("scan.defaultScanTitle");
        const scannedAt =
          s.scannedAt ?? s.createdAt ?? s.updatedAt ?? Date.now();

        merged.push({
          id: `scan-${rawId}`,
          title: topName,
          updatedAt: new Date(scannedAt),
          type: "scan",
          scanHistoryId: rawId,
          rawData: s,
        });
      });

      merged.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
      setSessions(merged);
    } catch (error) {
      console.log("Lỗi lấy dữ liệu sidebar:", error);
    }
  };

  const loadChatSession = async (sessionId: string) => {
    try {
      const detail = await scanApi.getSessionMessages(sessionId);
      if (detail && detail.messages) {
        const loadedMsgs: Message[] = detail.messages.map(
          (msg: any, index: number) => ({
            id: `${sessionId}-${index}`,
            text: msg.content,
            sender: (msg.role === "user" ? "user" : "bot") as "user" | "bot",
            timestamp: new Date(msg.timestamp),
          }),
        );
        setMessages(loadedMsgs);
        setLastSyncedSessionId(sessionId);
      } else {
        setMessages([]);
        setLastSyncedSessionId(sessionId);
      }
    } catch (error) {
      console.log("Lỗi tải tin nhắn:", error);
      setMessages([]);
    }
  };

  const openSidebar = () => {
    setIsSidebarOpen(true);
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeSidebar = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -width,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setIsSidebarOpen(false));
  };

  const handleNewChat = () => {
    setMessages([]);
    setInputText("");
    setSelectedImage(null);
    setCurrentSessionId(undefined);
    setLastSyncedSessionId(undefined);
    setCurrentScanLabel(undefined);
    closeSidebar();
  };

  const loadScanSessionFromData = (detail: any) => {
    try {
      const rawId = detail.id ?? detail.scanHistoryId ?? detail._id;
      const imageUrl =
        detail.imageUrl ?? detail.image ?? detail.image?.url ?? undefined;

      const topPrediction =
        detail.aiPredictions?.[0] || detail.predictions?.[0];
      const diseaseInfo = topPrediction?.diseaseId ?? detail.topDisease;

      const fakeResult = {
        predictions: [{ confidence: topPrediction?.confidence || 0 }],
        topDisease: diseaseInfo,
      };

      const scanTime = new Date(
        detail.scannedAt ?? detail.createdAt ?? Date.now(),
      );

      setMessages([
        {
          id: `scan-user-${rawId}`,
          image: imageUrl,
          sender: "user",
          timestamp: scanTime,
        },
        {
          id: `scan-bot-${rawId}`,
          text: t("scan.resultHeading"),
          sender: "bot",
          timestamp: new Date(scanTime.getTime() + 1000),
          scanResult: fakeResult,
        },
      ]);

      setLastSyncedSessionId(undefined);
      setCurrentSessionId(undefined);
    } catch (err) {
      console.log("Lỗi hiển thị chi tiết quét:", err);
      setMessages([]);
    }
  };

  const handleSelectSession = async (session: SessionItem) => {
    if (session.type === "chat") {
      setCurrentSessionId(session.id);
      await loadChatSession(session.id);
    } else if (session.type === "scan" && session.rawData) {
      loadScanSessionFromData(session.rawData);
    }
    closeSidebar();
  };

  // =================================================================
  // 🔥 XỬ LÝ QUYỀN MÁY ẢNH VÀ THƯ VIỆN ẢNH CHUẨN XÁC NHẤT
  // =================================================================

  const handleOpenCamera = async () => {
    if (Platform.OS === "web") {
      alert(t("scan.cameraNotSupportedWeb"));
      return;
    }

    try {
      const currentPerm = await ImagePicker.getCameraPermissionsAsync();

      if (currentPerm?.status !== "granted") {
        const newPerm = await ImagePicker.requestCameraPermissionsAsync();

        if (newPerm?.status !== "granted") {
          Alert.alert(
            t("scan.permissionCameraTitle"),
            t("scan.permissionCameraMessage"),
            [
              { text: t("common.close"), style: "cancel" },
              {
                text: t("scan.openSettings"),
                onPress: () => Linking.openSettings(),
              },
            ],
          );
          return;
        }
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets[0].uri) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.log("Lỗi mở camera:", error);
      Alert.alert(
        t("scan.errorTitle"),
        t("scan.cameraOpenFailed"),
      );
    }
  };

  const pickImage = async () => {
    try {
      const currentPerm = await ImagePicker.getMediaLibraryPermissionsAsync();

      if (currentPerm?.status !== "granted") {
        const newPerm = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (newPerm?.status !== "granted") {
          Alert.alert(
            t("scan.permissionLibraryTitle"),
            t("scan.permissionLibraryMessage"),
            [
              { text: t("common.close"), style: "cancel" },
              {
                text: t("scan.openSettings"),
                onPress: () => Linking.openSettings(),
              },
            ],
          );
          return;
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 1,
        allowsEditing: false,
        aspect: [4, 3],
      });

      if (!result.canceled && result.assets && result.assets[0].uri) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.log("Lỗi chọn ảnh:", error);
    }
  };

  // =================================================================

  const handleSend = async () => {
    if (!inputText.trim() && !selectedImage) return;

    if (lastSyncedSessionId && !currentSessionId) {
      alert(
        t("scan.oldSessionWarning"),
      );
      return;
    }

    const userText = inputText.trim();
    const userImage = selectedImage;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        text: userText || undefined,
        image: userImage || undefined,
        sender: "user",
        timestamp: new Date(),
      },
    ]);

    setInputText("");
    setSelectedImage(null);
    setIsBotTyping(true);

    try {
      if (userImage) {
        // 🔥 CẬP NHẬT LOGIC MỚI: Xử lý file chuẩn Web/Mobile
        let fileToUpload: any;

        if (Platform.OS === "web") {
          const response = await fetch(userImage);
          const blob = await response.blob();
          const FileRef = (window as any).File;
          fileToUpload = new FileRef([blob], "upload.jpg", {
            type: blob.type || "image/jpeg",
          });
        } else {
          fileToUpload = {
            uri: userImage,
            name: "upload.jpg",
            type: "image/jpeg",
          };
        }

        // 🔥 CẬP NHẬT API MỚI: Dùng scanImageAndWait để đợi AI trả kết quả
        const result = await scanApi.scanImageAndWait(fileToUpload);

        // Lưu label bệnh hàng đầu để dùng trong các tin nhắn tiếp theo
        const topLabel = result.topDisease?.name;
        if (topLabel) {
          setCurrentScanLabel(topLabel);
        }

        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            text: t("scan.resultHeading"),
            sender: "bot",
            timestamp: new Date(),
            scanResult: result, // result giờ đã là full object có topDisease và predictions
          },
        ]);
        fetchSidebarData();
      } else if (userText) {
        // 🔥 CẬP NHẬT API MỚI: Dùng chatAndWait
        const aiResponse = await scanApi.chatAndWait(
          userText,
          // Gửi lên API → là DỮ LIỆU, không dịch
          currentScanLabel || DEFAULT_PLANT_NAME,
          currentSessionId || undefined,
        );

        if (aiResponse.sessionId && !currentSessionId) {
          setCurrentSessionId(aiResponse.sessionId);
          setLastSyncedSessionId(undefined);
        }

        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            text: aiResponse.answer,
            sender: "bot",
            timestamp: new Date(),
          },
        ]);
        await fetchSidebarData();
      }
    } catch (error: any) {
      console.log("🔥 LỖI THẬT SỰ:", error?.response?.data || error.message);
      const status = error?.response?.status;
      const backendMsg = error?.response?.data?.message;

      let errorText = t("scan.errorServerConnection");

      if (status === 401) {
        errorText = t("scan.errorLoginRequired");
      } else if (status === 400) {
        const detail = Array.isArray(backendMsg) ? backendMsg[0] : backendMsg;
        errorText = t("scan.errorDataPrefix", {
          detail: detail || t("scan.errorInvalidImage"),
        });
        if (errorText.includes("expected size is less than")) {
          errorText = t("scan.errorImageTooLarge");
        }
      } else if (status === 500) {
        errorText = t("scan.errorAiOverloaded");
      } else if (error.message === "Network Error") {
        errorText = t("scan.errorNetworkOrCorrupt");
      } else {
        errorText = t("scan.errorGenericPrefix", { message: error.message });
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: `⚠️ ${errorText}`,
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsBotTyping(false);
    }
  };

  const formatDate = (dateStr: string | Date) =>
    new Date(dateStr).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  // Helper function để render treatments an toàn cho cả Backend cũ và mới
  const renderTreatments = (treatmentsData: any) => {
    if (!treatmentsData) return null;

    // Backend mới: treatments là array of strings
    if (
      Array.isArray(treatmentsData) &&
      treatmentsData.length > 0 &&
      typeof treatmentsData[0] === "string"
    ) {
      return (
        <View style={styles.treatmentsSection}>
          <Text style={styles.sectionTitle}>
            {t("scan.treatmentMethods")}
          </Text>
          {treatmentsData.map((step: string, idx: number) => (
            <Text key={`flat-${idx}`} style={styles.treatmentText}>
              • {step}
            </Text>
          ))}
        </View>
      );
    }

    // Backend cũ: treatments là object có biological, chemical, preventive
    if (typeof treatmentsData === "object" && !Array.isArray(treatmentsData)) {
      return (
        <View style={styles.treatmentsSection}>
          <Text style={styles.sectionTitle}>
            {t("scan.treatmentMethods")}
          </Text>

          {treatmentsData.biological &&
            treatmentsData.biological.length > 0 && (
              <View style={styles.treatmentSubSection}>
                <Text style={styles.treatmentSubTitle}>
                  {t("scan.treatmentOrganic")}
                </Text>
                {treatmentsData.biological.map(
                  (treatment: string, idx: number) => (
                    <Text key={`bio-${idx}`} style={styles.treatmentText}>
                      {treatment}
                    </Text>
                  ),
                )}
              </View>
            )}

          {treatmentsData.chemical && treatmentsData.chemical.length > 0 && (
            <View style={styles.treatmentSubSection}>
              <Text style={styles.treatmentSubTitle}>
                {t("scan.treatmentChemicalLabel")}
              </Text>
              {treatmentsData.chemical.map((treatment: string, idx: number) => (
                <Text key={`chem-${idx}`} style={styles.treatmentText}>
                  {treatment}
                </Text>
              ))}
            </View>
          )}

          {treatmentsData.preventive &&
            treatmentsData.preventive.length > 0 && (
              <View style={styles.treatmentSubSection}>
                <Text style={styles.treatmentSubTitle}>
                  {t("scan.treatmentPreventive")}
                </Text>
                {treatmentsData.preventive.map(
                  (treatment: string, idx: number) => (
                    <Text key={`prev-${idx}`} style={styles.treatmentText}>
                      {treatment}
                    </Text>
                  ),
                )}
              </View>
            )}
        </View>
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      <View
        style={[styles.header, { paddingTop: Math.max(insets.top, 10) + 10 }]}
      >
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.iconBtn}
          >
            <ArrowLeft size={24} color="#374151" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={openSidebar}
            style={[styles.iconBtn, { marginLeft: 4 }]}
          >
            <PanelLeft size={24} color="#374151" />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerTitle}>Agri-Scan AI</Text>
        <TouchableOpacity onPress={handleNewChat} style={styles.iconBtn}>
          <Plus size={24} color="#374151" />
        </TouchableOpacity>
      </View>

      <Modal visible={isSidebarOpen} transparent={true} animationType="none">
        <View style={styles.modalContainer}>
          <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
            <TouchableOpacity
              style={{ flex: 1 }}
              activeOpacity={1}
              onPress={closeSidebar}
            />
          </Animated.View>

          <Animated.View
            style={[
              styles.leftDrawer,
              { transform: [{ translateX: slideAnim }] },
            ]}
          >
            <View
              style={[
                styles.sidebarContent,
                { paddingTop: Math.max(insets.top, 10) + 10 },
              ]}
            >
              <View style={styles.sidebarHeader}>
                <Text style={styles.sidebarTitle}>
                  {t("scan.historyTitle")}
                </Text>
                <TouchableOpacity onPress={closeSidebar}>
                  <X size={24} color="#fff" />
                </TouchableOpacity>
              </View>

              <View style={styles.tabsContainer}>
                <TouchableOpacity
                  style={[
                    styles.tabBtn,
                    activeSidebarTab === "chat"
                      ? styles.tabBtnActive
                      : undefined,
                  ]}
                  onPress={() => setActiveSidebarTab("chat")}
                >
                  <MessageSquare
                    size={16}
                    color={activeSidebarTab === "chat" ? "#86efac" : "#9ca3af"}
                  />
                  <Text
                    style={[
                      styles.tabText,
                      activeSidebarTab === "chat"
                        ? styles.tabTextActive
                        : undefined,
                    ]}
                  >
                    {" "}
                    {t("scan.tabChat")}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.tabBtn,
                    activeSidebarTab === "scan"
                      ? styles.tabBtnActive
                      : undefined,
                  ]}
                  onPress={() => setActiveSidebarTab("scan")}
                >
                  <ImageIcon
                    size={16}
                    color={activeSidebarTab === "scan" ? "#86efac" : "#9ca3af"}
                  />
                  <Text
                    style={[
                      styles.tabText,
                      activeSidebarTab === "scan"
                        ? styles.tabTextActive
                        : undefined,
                    ]}
                  >
                    {" "}
                    {t("scan.tabScans")}
                  </Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.historyList}
                showsVerticalScrollIndicator={false}
              >
                {activeSidebarTab === "chat" ? (
                  <>
                    <TouchableOpacity
                      style={styles.newChatSidebarBtn}
                      onPress={handleNewChat}
                    >
                      <Plus size={18} color="#fff" />
                      <Text style={styles.newChatSidebarText}>
                        {t("scan.newChat")}
                      </Text>
                    </TouchableOpacity>
                    {sessions.filter((s) => s.type === "chat").length === 0 ? (
                      <Text style={styles.emptySidebarTxt}>
                        {t("scan.noHistory")}
                      </Text>
                    ) : (
                      [
                        "scan.groupToday",
                        "scan.groupYesterday",
                        "scan.group7Days",
                        "scan.group30Days",
                      ].map((group) => {
                        const groupSessions = sessions.filter(
                          (h) =>
                            h.type === "chat" &&
                            getDateGroup(h.updatedAt) === group,
                        );
                        if (groupSessions.length === 0) return null;
                        return (
                          <View key={group}>
                            <Text style={styles.dateGroupHeader}>
                              {t(group)}
                            </Text>
                            {groupSessions.map((item) => (
                              <TouchableOpacity
                                key={item.id}
                                style={[
                                  styles.historyItem,
                                  currentSessionId === item.id &&
                                  item.type === "chat"
                                    ? styles.historyItemActive
                                    : undefined,
                                ]}
                                onPress={() => handleSelectSession(item)}
                              >
                                <MessageSquare
                                  size={18}
                                  color={
                                    currentSessionId === item.id &&
                                    item.type === "chat"
                                      ? "#fff"
                                      : "#86efac"
                                  }
                                />
                                <View style={{ marginLeft: 12, flex: 1 }}>
                                  <Text
                                    style={[
                                      styles.historyText,
                                      currentSessionId === item.id &&
                                      item.type === "chat"
                                        ? { color: "#fff" }
                                        : undefined,
                                    ]}
                                    numberOfLines={1}
                                  >
                                    {item.title}
                                  </Text>
                                  <Text style={styles.historyDate}>
                                    {formatDate(item.updatedAt)}
                                  </Text>
                                </View>
                              </TouchableOpacity>
                            ))}
                          </View>
                        );
                      })
                    )}
                  </>
                ) : sessions.filter((s) => s.type === "scan").length === 0 ? (
                  <Text style={styles.emptySidebarTxt}>
                    {t("scan.noScanHistory")}
                  </Text>
                ) : (
                  sessions
                    .filter((s) => s.type === "scan")
                    .map((item) => (
                      <TouchableOpacity
                        key={item.id}
                        style={styles.historyItem}
                        onPress={() => handleSelectSession(item)}
                      >
                        <ImageIcon size={18} color="#86efac" />
                        <View style={{ flex: 1, marginLeft: 12 }}>
                          <Text style={styles.historyText} numberOfLines={1}>
                            {item.title}
                          </Text>
                          <Text style={styles.historyDate}>
                            {formatDate(item.updatedAt)}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))
                )}
              </ScrollView>

              <View
                style={[
                  styles.sidebarFooter,
                  { paddingBottom: Math.max(insets.bottom, 20) },
                ]}
              >
                <TouchableOpacity
                  style={styles.upgradeBtn}
                  activeOpacity={0.8}
                  onPress={() => {
                    closeSidebar();
                    setTimeout(() => router.push("/upgrade"), 300);
                  }}
                >
                  <View style={styles.upgradeIconWrapper}>
                    <Leaf size={20} color="#ca8a04" />
                  </View>
                  <View style={{ marginLeft: 12 }}>
                    <Text style={styles.upgradeTitle}>
                      {t("scan.upgradePlan")}
                    </Text>
                    <Text style={styles.upgradeSub}>
                      {t("scan.upgradeSubtitle")}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </View>
      </Modal>

      <KeyboardAvoidingView
        style={styles.chatArea}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.botAvatarLarge}>
                <Leaf size={36} color="#16a34a" />
              </View>
              <Text style={styles.emptyTitle}>Agri-Scan AI</Text>
              <Text style={styles.emptyDesc}>
                {t("scan.welcomeSubtitleMobile")}
              </Text>
            </View>
          ) : (
            messages.map((msg) => (
              <View
                key={msg.id}
                style={[
                  styles.messageWrapper,
                  msg.sender === "user" ? styles.msgRight : styles.msgLeft,
                ]}
              >
                {msg.sender === "bot" && (
                  <View style={styles.botAvatarSmall}>
                    <Leaf size={14} color="#fff" />
                  </View>
                )}
                <View
                  style={
                    msg.sender === "user"
                      ? styles.messageContentUser
                      : styles.messageContentBot
                  }
                >
                  <Text style={styles.senderLabel}>
                    {msg.sender === "user"
                      ? t("scan.senderYou")
                      : t("scan.senderAssistant")}
                  </Text>
                  <View
                    style={[
                      styles.messageBubble,
                      msg.sender === "user"
                        ? styles.bubbleUser
                        : styles.bubbleBot,
                    ]}
                  >
                    {msg.image && (
                      <Image
                        source={{ uri: msg.image }}
                        style={styles.msgImage}
                      />
                    )}

                    {msg.scanResult ? (
                      <View style={styles.scanResultContainer}>
                        <Text style={styles.diagnosisTitle}>
                          {t("scan.resultHeading")}
                        </Text>
                        <View style={styles.diseaseSection}>
                          <Text style={styles.diseaseLabel}>
                            {t("scan.diseaseDetectedLabel")}{" "}
                          </Text>
                          <Text style={styles.diseaseName}>
                            {msg.scanResult.topDisease?.name ||
                              t("scan.unknownDisease")}
                          </Text>
                          <Text style={styles.confidenceText}>
                            {t("scan.confidenceLabel")}{" "}
                            {Math.round(
                              (msg.scanResult.predictions?.[0]?.confidence ||
                                0) * 100,
                            )}
                            %
                          </Text>
                        </View>

                        {msg.scanResult.topDisease?.symptoms &&
                        msg.scanResult.topDisease.symptoms.length > 0 ? (
                          <View style={styles.symptomsSection}>
                            <Text style={styles.sectionTitle}>
                              {t("scan.symptomsLabel")}
                            </Text>
                            {msg.scanResult.topDisease.symptoms.map(
                              (symptom: string, idx: number) => (
                                <Text key={idx} style={styles.bulletText}>
                                  • {symptom}
                                </Text>
                              ),
                            )}
                          </View>
                        ) : null}

                        {/* Gọi hàm render an toàn */}
                        {renderTreatments(
                          msg.scanResult.topDisease?.treatments,
                        )}
                      </View>
                    ) : msg.text ? (
                      <Text
                        style={[
                          styles.msgText,
                          msg.sender === "user"
                            ? styles.textUser
                            : styles.textBot,
                        ]}
                      >
                        {msg.text}
                      </Text>
                    ) : null}
                  </View>
                </View>
                {msg.sender === "user" && (
                  <View style={styles.userAvatarSmall}>
                    <User size={14} color="#4b5563" />
                  </View>
                )}
              </View>
            ))
          )}

          {isBotTyping && (
            <View style={[styles.messageWrapper, styles.msgLeft]}>
              <View style={styles.botAvatarSmall}>
                <Leaf size={14} color="#fff" />
              </View>
              <View style={styles.messageContentBot}>
                <Text style={styles.senderLabel}>Agri-Scan AI</Text>
                <View
                  style={[
                    styles.messageBubble,
                    styles.bubbleBot,
                    { paddingVertical: 14, paddingHorizontal: 16 },
                  ]}
                >
                  <ActivityIndicator size="small" color="#16a34a" />
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        <View
          style={[
            styles.inputContainer,
            { paddingBottom: Math.max(insets.bottom, 10) },
          ]}
        >
          {selectedImage && (
            <View style={styles.previewContainer}>
              <Image
                source={{ uri: selectedImage }}
                style={styles.previewImg}
              />
              <TouchableOpacity
                style={styles.removePreviewBtn}
                onPress={() => setSelectedImage(null)}
              >
                <X size={12} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.inputWrapper}>
            <View style={styles.inputBar}>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={pickImage}
                activeOpacity={0.7}
              >
                <ImageIcon size={22} color="#9ca3af" />
              </TouchableOpacity>
              <TextInput
                style={styles.textInput}
                placeholder={t("scan.inputPlaceholderMobile")}
                placeholderTextColor="#9ca3af"
                multiline
                value={inputText}
                onChangeText={setInputText}
              />
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={handleOpenCamera}
              >
                <CameraIcon size={22} color="#9ca3af" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.sendBtn,
                  inputText.trim() || selectedImage
                    ? styles.sendBtnActive
                    : styles.sendBtnDisabled,
                ]}
                onPress={handleSend}
                disabled={(!inputText.trim() && !selectedImage) || isBotTyping}
              >
                <Send
                  size={18}
                  color={inputText.trim() || selectedImage ? "#fff" : "#9ca3af"}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.disclaimer}>
              {t("scan.disclaimer")}
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
