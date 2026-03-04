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
import { cn } from "@agri-scan/shared";

interface Message {
  id: string;
  text?: string;
  image?: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface ChatHistory {
  id: string;
  title: string;
  date: string;
}

const MOCK_HISTORY: ChatHistory[] = [
  { id: "1", title: "Bệnh đốm lá trên cây Cà phê", date: "Hôm nay" },
  { id: "2", title: "Cách bón phân NPK", date: "Hôm qua" },
  { id: "3", title: "Sâu bệnh hại lúa mùa mưa", date: "7 ngày trước" },
  { id: "4", title: "Tưới nước cho Sầu riêng", date: "30 ngày trước" },
];

export function Scanner() {
  const [history, setHistory] = useState<ChatHistory[]>(MOCK_HISTORY);
  const [messages, setMessages] = useState<Message[]>([]); // Start empty for "New Chat" state
  const [inputText, setInputText] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setSelectedImage(imageSrc);
      setIsCameraOpen(false);
    }
  }, [webcamRef]);

  const handleSend = async () => {
    if (!inputText.trim() && !selectedImage) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      image: selectedImage || undefined,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText("");
    setSelectedImage(null);
    setIsBotTyping(true);

    // Reset height
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    // Simulate Bot Response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "Cảm ơn bạn đã gửi thông tin. Hệ thống đang phân tích dữ liệu hình ảnh và triệu chứng bạn cung cấp... \n\nĐây là giao diện demo, chưa kết nối API thực tế.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsBotTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setInputText("");
    setSelectedImage(null);
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

          <div className="mb-2 px-3 text-xs font-medium text-green-200/70">
            Hôm nay
          </div>
          {history
            .filter((h) => h.date === "Hôm nay")
            .map((h) => (
              <button
                key={h.id}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-green-800/50 transition-colors text-sm text-left group truncate text-green-50"
              >
                <MessageSquare size={16} className="text-green-300" />
                <span className="truncate flex-1">{h.title}</span>
              </button>
            ))}

          <div className="mt-6 mb-2 px-3 text-xs font-medium text-green-200/70">
            7 ngày trước
          </div>
          {history
            .filter((h) => h.date !== "Hôm nay")
            .map((h) => (
              <button
                key={h.id}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-green-800/50 transition-colors text-sm text-left group truncate text-green-50"
              >
                <MessageSquare size={16} className="text-green-300" />
                <span className="truncate flex-1">{h.title}</span>
              </button>
            ))}
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
