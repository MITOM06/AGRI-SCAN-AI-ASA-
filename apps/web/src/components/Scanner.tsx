"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Image as ImageIcon,
  Camera,
  X,
  Loader2,
  Leaf,
  User,
  Bot,
  Plus,
  MessageSquare,
  PanelLeftClose,
  PanelLeft,
  History,
  Settings,
  LogOut,
} from "lucide-react";
import { default as ReactWebcam } from "react-webcam";
import { motion, AnimatePresence } from "framer-motion";
import { cn, scanApi } from "@agri-scan/shared";
import type { IChatSession } from "@agri-scan/shared";

interface Message {
  id: string;
  text?: string;
  image?: string;
  sender: "user" | "bot";
  timestamp: Date;
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
  if (diffDays <= 0) return "Hôm nay";
  if (diffDays === 1) return "Hôm qua";
  if (diffDays <= 7) return "7 ngày trước";
  return "30 ngày trước";
};

export function Scanner() {
  const [history, setHistory] = useState<IChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const webcamRef = useRef<ReactWebcam>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isBotTyping]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      if (!inputText) {
        textareaRef.current.style.height = "40px";
      } else {
        textareaRef.current.style.height = `${Math.min(
          textareaRef.current.scrollHeight,
          120,
        )}px`;
      }
    }
  }, [inputText]);

  // Responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Load chat history from API on mount
  useEffect(() => {
    scanApi
      .getChatHistory()
      .then(setHistory)
      .catch(() => {});
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      e.target.value = "";
    }
  };

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setSelectedImage(imageSrc);
      setSelectedImageFile(null); // webcam gives base64; will convert to blob at send time
      setIsCameraOpen(false);
    }
  }, [webcamRef]);

  const handleSend = async () => {
    if (!inputText.trim() && !selectedImage) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim() || undefined,
      image: selectedImage || undefined,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    const questionText = inputText.trim();
    const capturedImage = selectedImage;
    const capturedFile = selectedImageFile;

    setInputText("");
    setSelectedImage(null);
    setSelectedImageFile(null);
    setIsBotTyping(true);

    if (textareaRef.current) textareaRef.current.style.height = "auto";

    try {
      if (capturedImage) {
        // Image scan flow — requires login
        let fileToUpload: File | Blob;
        if (capturedFile) {
          fileToUpload = capturedFile;
        } else {
          // webcam base64 → blob
          const fetchRes = await fetch(capturedImage);
          fileToUpload = await fetchRes.blob();
        }

        const result = await scanApi.scanImage(fileToUpload);
        const topPrediction = result.predictions?.[0];
        const diseaseName =
          result.topDisease?.name ||
          topPrediction?.diseaseName ||
          "Không xác định";
        const confidence = topPrediction
          ? Math.round(topPrediction.confidence * 100)
          : 0;
        const symptomsText = result.topDisease?.symptoms?.length
          ? `\n\nTriệu chứng:\n${result.topDisease.symptoms.map((s) => `• ${s}`).join("\n")}`
          : "";

        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            text: `Kết quả chẩn đoán\n\nBệnh phát hiện: ${diseaseName}\nĐộ tin cậy: ${confidence}%${symptomsText}`,
            sender: "bot",
            timestamp: new Date(),
          },
        ]);
      } else {
        // Text chat flow — works without login
        const response = await scanApi.chatWithAi(
          questionText,
          currentSessionId || undefined,
        );

        if (response.sessionId && response.sessionId !== currentSessionId) {
          setCurrentSessionId(response.sessionId);
          scanApi
            .getChatHistory()
            .then(setHistory)
            .catch(() => {});
        }

        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            text: response.answer,
            sender: "bot",
            timestamp: new Date(),
          },
        ]);
      }
    } catch (error: unknown) {
      const status = (error as { response?: { status?: number } })?.response
        ?.status;
      const errorText =
        status === 401
          ? "Bạn cần đăng nhập để sử dụng tính năng quét ảnh."
          : "Có lỗi xảy ra. Vui lòng thử lại.";
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: errorText,
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsBotTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const loadSession = async (sessionId: string) => {
    setCurrentSessionId(sessionId);
    setIsBotTyping(true);
    if (window.innerWidth < 1024) setIsSidebarOpen(false);
    try {
      const detail = await scanApi.getSessionMessages(sessionId);
      const loadedMessages: Message[] = detail.messages.map((msg, i) => ({
        id: `${sessionId}-${i}`,
        text: msg.content,
        sender: msg.role === "user" ? "user" : "bot",
        timestamp: new Date(msg.timestamp),
      }));
      setMessages(loadedMessages);
    } catch {
      setMessages([]);
    } finally {
      setIsBotTyping(false);
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setInputText("");
    setSelectedImage(null);
    setSelectedImageFile(null);
    setCurrentSessionId(null);
    if (window.innerWidth < 1024) setIsSidebarOpen(false);
  };

  return (
    <div className="fixed top-16 left-0 w-full h-[calc(100vh-4rem)] flex bg-white overflow-hidden font-sans text-gray-800">
      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{
          width: isSidebarOpen ? 260 : 0,
          opacity: isSidebarOpen ? 1 : 0,
        }}
        className="bg-[#1B5E20] text-green-50 shrink-0 flex flex-col overflow-hidden border-r border-green-800 relative z-20"
      >
        <div className="p-3 flex-1 overflow-y-auto custom-scrollbar">
          <button
            onClick={startNewChat}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-lg border border-green-700/50 hover:bg-green-800/50 transition-colors text-sm text-left mb-4 bg-green-800/20 text-white"
          >
            <Plus size={16} />
            <span>Cuộc trò chuyện mới</span>
          </button>

          {["Hôm nay", "Hôm qua", "7 ngày trước", "30 ngày trước"].map(
            (group) => {
              const groupSessions = history.filter(
                (h) => getDateGroup(h.updatedAt) === group,
              );
              if (groupSessions.length === 0) return null;
              return (
                <div key={group}>
                  <div className="mt-4 mb-2 px-3 text-xs font-medium text-green-200/70">
                    {group}
                  </div>
                  {groupSessions.map((h) => (
                    <button
                      key={h.sessionId}
                      onClick={() => loadSession(h.sessionId)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-green-800/50 transition-colors text-sm text-left group truncate text-green-50",
                        currentSessionId === h.sessionId && "bg-green-800/50",
                      )}
                    >
                      <MessageSquare size={16} className="text-green-300" />
                      <span className="truncate flex-1">{h.title}</span>
                    </button>
                  ))}
                </div>
              );
            },
          )}
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full relative bg-white">
        {/* Top Bar (Mobile/Toggle) */}
        <div className="absolute top-0 left-0 z-10">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
          >
            {isSidebarOpen ? (
              <PanelLeftClose size={20} />
            ) : (
              <PanelLeft size={20} />
            )}
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center px-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary">
                <Leaf size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Agri-Scan AI
              </h2>
              <p className="text-gray-500 mb-8 max-w-md">
                Trợ lý nông nghiệp thông minh của bạn. Hãy hỏi tôi về bệnh cây
                trồng, cách chăm sóc hoặc gửi ảnh để chẩn đoán.
              </p>
            </div>
          ) : (
            <div className="flex flex-col pb-32">
              {messages.map((msg) => (
                <div key={msg.id} className="w-full py-2 px-4">
                  <div
                    className={cn(
                      "max-w-3xl mx-auto flex gap-3",
                      msg.sender === "user" ? "flex-row-reverse" : "flex-row",
                    )}
                  >
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 shadow-sm",
                        msg.sender === "user"
                          ? "bg-gray-200 text-gray-600"
                          : "bg-primary text-white",
                      )}
                    >
                      {msg.sender === "user" ? (
                        <User size={16} />
                      ) : (
                        <Leaf size={16} />
                      )}
                    </div>

                    <div
                      className={cn(
                        "flex flex-col max-w-[80%]",
                        msg.sender === "user" ? "items-end" : "items-start",
                      )}
                    >
                      <div className="text-xs text-gray-400 mb-1 px-1">
                        {msg.sender === "user" ? "Bạn" : "Agri-Scan AI"}
                      </div>

                      <div
                        className={cn(
                          "rounded-2xl px-4 py-3 shadow-sm overflow-hidden",
                          msg.sender === "user"
                            ? "bg-primary text-white rounded-tr-none"
                            : "bg-white border border-gray-100 text-gray-800 rounded-tl-none",
                        )}
                      >
                        {msg.image && (
                          <div className="mb-3 rounded-lg overflow-hidden bg-black/5">
                            <img
                              src={msg.image}
                              alt="User upload"
                              className="w-full h-auto max-h-60 object-cover"
                            />
                          </div>
                        )}

                        {msg.text && (
                          <div
                            className={cn(
                              "prose prose-sm max-w-none leading-relaxed whitespace-pre-wrap break-words",
                              msg.sender === "user"
                                ? "text-white prose-invert"
                                : "text-gray-800",
                            )}
                          >
                            {msg.text}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {isBotTyping && (
                <div className="w-full py-2 px-4">
                  <div className="max-w-3xl mx-auto flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
                      <Leaf size={16} />
                    </div>
                    <div className="flex flex-col items-start">
                      <div className="text-xs text-gray-400 mb-1 px-1">
                        Agri-Scan AI
                      </div>
                      <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none px-4 py-4 shadow-sm flex items-center gap-1">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-white via-white to-transparent pt-5 pb-6 px-4">
          <div className="max-w-3xl mx-auto">
            {selectedImage && (
              <div className="mb-3 relative inline-block">
                <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                  <img
                    src={selectedImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute -top-2 -right-2 bg-gray-900 text-white rounded-full p-1 hover:bg-gray-700"
                >
                  <X size={12} />
                </button>
              </div>
            )}

            <div className="flex items-center w-full p-1.5 bg-white border border-gray-300 shadow-sm rounded-3xl transition-all">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors shrink-0"
                title="Tải ảnh lên"
              >
                <Plus size={20} />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />

              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Nhắn tin..."
                className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none outline-none py-2 px-3 text-gray-900 placeholder-gray-500 resize-none max-h-[120px] text-sm leading-relaxed overflow-hidden"
                rows={1}
              />

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => setIsCameraOpen(true)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                  title="Chụp ảnh"
                >
                  <Camera size={20} />
                </button>
                <button
                  onClick={handleSend}
                  disabled={!inputText.trim() && !selectedImage}
                  className={cn(
                    "p-2 rounded-full transition-all flex items-center justify-center",
                    inputText.trim() || selectedImage
                      ? "bg-primary text-white shadow-sm hover:bg-primary-dark"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed",
                  )}
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
            <div className="text-center mt-2">
              <p className="text-xs text-gray-400">
                Agri-Scan AI có thể mắc lỗi. Hãy kiểm tra lại thông tin quan
                trọng.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Camera Modal */}
      <AnimatePresence>
        {isCameraOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4"
          >
            <div className="relative w-full max-w-lg aspect-[3/4] bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
              {/* @ts-ignore */}
              <ReactWebcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setIsCameraOpen(false)}
                className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
              >
                <X size={24} />
              </button>
              <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                <button
                  onClick={capture}
                  className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center hover:scale-95 transition-transform"
                >
                  <div className="w-12 h-12 bg-white rounded-full"></div>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
