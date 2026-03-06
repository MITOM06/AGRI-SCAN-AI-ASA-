import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
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
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useRouter } from "expo-router"; // Import thêm useRouter
import {
  Send,
  Camera as CameraIcon,
  X,
  Leaf,
  User,
  Plus,
  PanelLeft,
  MessageSquare,
  ArrowLeft, // Import thêm ArrowLeft
} from "lucide-react-native";

const { width } = Dimensions.get("window");

// Khởi tạo Gemini AI
const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || "YOUR_API_KEY_HERE";
const ai = new GoogleGenerativeAI(API_KEY);

interface Message {
  id: string;
  text?: string;
  image?: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const MOCK_HISTORY = [
  { id: "1", title: "Bệnh đốm lá trên cây Cà phê", date: "Hôm nay" },
  { id: "2", title: "Cách bón phân NPK", date: "Hôm qua" },
  { id: "3", title: "Sâu bệnh hại lúa mùa mưa", date: "7 ngày trước" },
];

export default function ScanChatScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter(); // Khởi tạo router
  const [permission, requestPermission] = useCameraPermissions();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isBotTyping, setIsBotTyping] = useState(false);

  // --- STATE VÀ HIỆU ỨNG MENU BÊN TRÁI ---
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // Bắt đầu từ -width (ẩn hoàn toàn bên trái màn hình)
  const slideAnim = useRef(new Animated.Value(-width)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const openSidebar = () => {
    setIsSidebarOpen(true);
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0, // Kéo vào trong màn hình
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1, // Làm mờ nền
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeSidebar = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -width, // Đẩy ngược ra ngoài bên trái
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsSidebarOpen(false);
    });
  };

  const scrollViewRef = useRef<ScrollView>(null);
  const cameraRef = useRef<any>(null);

  // Cuộn xuống cuối khi có tin nhắn mới
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages, isBotTyping]);

  // Mở Camera
  const handleOpenCamera = async () => {
    if (!permission?.granted) {
      const { granted } = await requestPermission();
      if (!granted) {
        alert("Cần cấp quyền camera để chụp ảnh.");
        return;
      }
    }
    setIsCameraOpen(true);
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({
        base64: true,
        quality: 0.7,
      });
      setSelectedImage(`data:image/jpeg;base64,${photo.base64}`);
      setIsCameraOpen(false);
    }
  };

  // Mở Thư viện ảnh
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      setSelectedImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  // Gửi tin nhắn và gọi AI
  const handleSend = async () => {
    if (!inputText.trim() && !selectedImage) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      image: selectedImage || undefined,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    const userText = inputText;
    const userImage = selectedImage;

    setInputText("");
    setSelectedImage(null);
    setIsBotTyping(true);

    try {
      const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
        Bạn là Agri-Scan AI, một chuyên gia nông nghiệp thân thiện. 
        Câu hỏi: "${userText}".
        ${userImage ? "Đính kèm: Bức ảnh cây trồng." : ""}
        Hãy trả lời bằng tiếng Việt, phân tích bệnh (nếu có), đưa ra nguyên nhân và cách điều trị.
      `;

      let response;
      if (userImage) {
        const base64Data = userImage.split(",")[1];
        response = await model.generateContent([
          prompt,
          { inlineData: { data: base64Data, mimeType: "image/jpeg" } },
        ]);
      } else {
        response = await model.generateContent(prompt);
      }

      const botText = response.response.text();

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: botText,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: "Xin lỗi, hiện tại tôi không thể kết nối tới hệ thống. Vui lòng thử lại sau!",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsBotTyping(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Bar */}
      {/* Header Bar */}
      <View
        style={[
          styles.header,
          {
            // Dùng insets.top chuẩn cho mọi dòng máy giống trang Home
            paddingTop: Math.max(insets.top, 10) + 10,
          },
        ]}
      >
        {/* Nút Quay lại và Nút Sidebar được nhóm chung */}
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

        {/* Nút tạo cuộc trò chuyện mới */}
        <TouchableOpacity
          onPress={() => setMessages([])}
          style={styles.iconBtn}
        >
          <Plus size={24} color="#374151" />
        </TouchableOpacity>
      </View>

      {/* --- Sidebar Lịch sử trượt từ trái sang (Animated Drawer) --- */}
      <Modal visible={isSidebarOpen} transparent={true} animationType="none">
        <View style={styles.modalContainer}>
          {/* Lớp nền mờ */}
          <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
            <TouchableOpacity
              style={{ flex: 1 }}
              activeOpacity={1}
              onPress={closeSidebar}
            />
          </Animated.View>

          {/* Menu Trượt từ trái qua */}
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
                <Text style={styles.sidebarTitle}>Lịch sử trò chuyện</Text>
                <TouchableOpacity onPress={closeSidebar}>
                  <X size={24} color="#fff" />
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.historyList}
                showsVerticalScrollIndicator={false}
              >
                {MOCK_HISTORY.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.historyItem}
                    onPress={closeSidebar}
                  >
                    <MessageSquare size={18} color="#86efac" />
                    <View style={{ marginLeft: 10 }}>
                      <Text style={styles.historyText} numberOfLines={1}>
                        {item.title}
                      </Text>
                      <Text style={styles.historyDate}>{item.date}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </Animated.View>
        </View>
      </Modal>

      {/* Vùng Tin nhắn */}
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
              <Text style={styles.emptyTitle}>Xin chào!</Text>
              <Text style={styles.emptyDesc}>
                Tôi là chuyên gia nông nghiệp AI. Hãy hỏi tôi về sâu bệnh, cách
                chăm sóc cây hoặc gửi ảnh để tôi phân tích nhé.
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
                  {msg.text ? (
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
          )}
        </ScrollView>

        {/* Thanh Nhập Liệu (Input Area) */}
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
                <X size={14} color="#fff" />
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.inputBar}>
            <TouchableOpacity style={styles.actionBtn} onPress={pickImage}>
              <Plus size={22} color="#6b7280" />
            </TouchableOpacity>

            <TextInput
              style={styles.textInput}
              placeholder="Hỏi về bệnh cây..."
              placeholderTextColor="#9ca3af"
              multiline
              value={inputText}
              onChangeText={setInputText}
            />

            <TouchableOpacity
              style={styles.actionBtn}
              onPress={handleOpenCamera}
            >
              <CameraIcon size={22} color="#6b7280" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.sendBtn,
                inputText.trim() || selectedImage
                  ? styles.sendBtnActive
                  : styles.sendBtnDisabled,
              ]}
              onPress={handleSend}
              disabled={!inputText.trim() && !selectedImage}
            >
              <Send
                size={18}
                color={inputText.trim() || selectedImage ? "#fff" : "#9ca3af"}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.disclaimer}>
            Agri-Scan AI có thể mắc lỗi. Hãy kiểm tra lại thông tin.
          </Text>
        </View>
      </KeyboardAvoidingView>

      {/* Modal Camera Fullscreen */}
      <Modal visible={isCameraOpen} transparent={true}>
        <View style={styles.cameraContainer}>
          <CameraView style={{ flex: 1 }} facing="back" ref={cameraRef}>
            <View style={styles.cameraOverlay}>
              <TouchableOpacity
                style={styles.camCloseBtn}
                onPress={() => setIsCameraOpen(false)}
              >
                <X size={28} color="#fff" />
              </TouchableOpacity>
              <View style={styles.camBottomBar}>
                <TouchableOpacity
                  style={styles.captureBtn}
                  onPress={takePicture}
                >
                  <View style={styles.captureBtnInner} />
                </TouchableOpacity>
              </View>
            </View>
          </CameraView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    backgroundColor: "#fff",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginRight: 24,
  }, // Thêm marginRight để căn giữa title tốt hơn
  iconBtn: { padding: 8 },

  // --- Styles Sidebar Trái (Lịch sử) ---
  modalContainer: { flex: 1, flexDirection: "row" },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  leftDrawer: {
    position: "absolute",
    left: 0, // Cố định ở mép trái
    top: 0,
    bottom: 0,
    width: width * 0.75, // Chiếm 75% màn hình
    backgroundColor: "#1B5E20", // Màu xanh lá đậm giống ảnh Web
    shadowColor: "#000",
    shadowOffset: { width: 5, height: 0 }, // Đổ bóng sang phải
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 20,
  },
  sidebarContent: { flex: 1 },
  sidebarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  sidebarTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  historyList: { flex: 1, padding: 16 },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.1)",
    marginBottom: 10,
  },
  historyText: { color: "#fff", fontSize: 15, fontWeight: "500" },
  historyDate: { color: "#86efac", fontSize: 12, marginTop: 4 },

  // --- Styles Chat ---
  chatArea: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 20 },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 80,
    paddingHorizontal: 20,
  },
  botAvatarLarge: {
    width: 70,
    height: 70,
    backgroundColor: "#dcfce3",
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 10,
  },
  emptyDesc: {
    fontSize: 15,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 22,
  },
  messageWrapper: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "flex-end",
  },
  msgLeft: { justifyContent: "flex-start" },
  msgRight: { justifyContent: "flex-end" },
  botAvatarSmall: {
    width: 28,
    height: 28,
    backgroundColor: "#16a34a",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    marginBottom: 4,
  },
  userAvatarSmall: {
    width: 28,
    height: 28,
    backgroundColor: "#f3f4f6",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
    marginBottom: 4,
  },
  messageBubble: {
    maxWidth: "75%",
    padding: 12,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  bubbleUser: { backgroundColor: "#16a34a", borderBottomRightRadius: 4 },
  bubbleBot: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderBottomLeftRadius: 4,
  },
  msgText: { fontSize: 15, lineHeight: 22 },
  textUser: { color: "#fff" },
  textBot: { color: "#374151" },
  msgImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginBottom: 8,
    resizeMode: "cover",
  },

  // --- Styles Input ---
  inputContainer: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  previewContainer: {
    position: "relative",
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  previewImg: {
    width: 70,
    height: 70,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  removePreviewBtn: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#374151",
    borderRadius: 12,
    padding: 4,
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#f9fafb",
    borderRadius: 24,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  actionBtn: { padding: 10 },
  textInput: {
    flex: 1,
    maxHeight: 100,
    minHeight: 40,
    fontSize: 15,
    color: "#111827",
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 4,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
    marginLeft: 4,
  },
  sendBtnActive: { backgroundColor: "#16a34a" },
  sendBtnDisabled: { backgroundColor: "#f3f4f6" },
  disclaimer: {
    textAlign: "center",
    fontSize: 11,
    color: "#9ca3af",
    marginTop: 8,
  },

  cameraContainer: { flex: 1, backgroundColor: "#000" },
  cameraOverlay: { flex: 1, justifyContent: "space-between" },
  camCloseBtn: {
    alignSelf: "flex-end",
    marginTop: 50,
    marginRight: 20,
    padding: 10,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 20,
  },
  camBottomBar: { paddingBottom: 50, alignItems: "center" },
  captureBtn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 4,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  captureBtnInner: {
    width: 54,
    height: 54,
    backgroundColor: "#fff",
    borderRadius: 27,
  },
});
