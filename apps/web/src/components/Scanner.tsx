"use client";

import React, { useState, useRef, useCallback } from "react";
import {
  Upload,
  Camera,
  X,
  Loader2,
  Leaf,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Image as ImageIcon,
} from "lucide-react";
import Webcam from "react-webcam";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@agri-scan/shared";

// Initialize Gemini API
const ai = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

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

export function Scanner() {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">(
    "environment",
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const webcamRef = useRef<Webcam>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
        setError(null);
        setIsCameraOpen(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImage(imageSrc);
      setIsCameraOpen(false);
      setResult(null);
      setError(null);
    }
  }, [webcamRef]);

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  const analyzeImage = async () => {
    if (!image) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      // Remove data URL prefix for API
      const base64Data = image.split(",")[1];

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
            data: base64Data,
          },
        },
      ]);

      const text = response.response.text();
      if (!text) throw new Error("No response from AI");

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
    setIsCameraOpen(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-2">
          Chẩn Đoán Bệnh Cây
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          Sử dụng camera hoặc tải ảnh lên để AI phân tích sức khỏe cây trồng.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
        ,{/* Input Section */}
        <div className="space-y-4">
          <div
            className={cn(
              "border-2 border-dashed rounded-2xl h-[320px] sm:h-[400px] lg:h-96 flex flex-col items-center justify-center transition-colors relative overflow-hidden bg-gray-900",
              image ? "border-primary" : "border-gray-300",
            )}
          >
            {isCameraOpen ? (
              <>
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{ facingMode }}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 sm:bottom-4 left-0 right-0 flex justify-center items-center gap-4 sm:gap-6 z-10">
                  <button
                    onClick={() => setIsCameraOpen(false)}
                    className="p-2 sm:p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors touch-manipulation"
                    aria-label="Đóng camera"
                  >
                    <X size={20} className="sm:size-6" />
                  </button>
                  <button
                    onClick={capture}
                    className="p-1 rounded-full border-3 sm:border-4 border-white/50 touch-manipulation"
                    aria-label="Chụp ảnh"
                  >
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-full hover:scale-95 transition-transform" />
                  </button>
                  <button
                    onClick={toggleCamera}
                    className="p-2 sm:p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors touch-manipulation"
                    aria-label="Chuyển camera"
                  >
                    <RefreshCw size={20} className="sm:size-6" />
                  </button>
                </div>
              </>
            ) : image ? (
              <>
                <img
                  src={image}
                  alt="Uploaded plant"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={resetScan}
                  className="absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-white text-red-500 transition-colors shadow-sm"
                >
                  <X size={20} />
                </button>
              </>
            ) : (
              <div className="text-center p-4 sm:p-6 bg-gray-50 w-full h-full flex flex-col items-center justify-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-primary animate-pulse">
                  <Camera size={32} className="sm:size-10" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  Bắt đầu chẩn đoán
                </h3>
                <p className="text-gray-500 mb-4 sm:mb-6 max-w-xs mx-auto text-sm sm:text-base">
                  Chọn phương thức nhập ảnh để bắt đầu phân tích
                </p>

                <div className="flex flex-col gap-3 w-full max-w-xs">
                  <button
                    onClick={() => setIsCameraOpen(true)}
                    className="w-full py-3 sm:py-4 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 shadow-lg shadow-primary/20 touch-manipulation text-sm sm:text-base"
                  >
                    <Camera size={18} className="sm:size-5" />
                    Chụp ảnh trực tiếp
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-3 sm:py-4 bg-white text-gray-700 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 touch-manipulation text-sm sm:text-base"
                  >
                    <ImageIcon size={18} className="sm:size-5" />
                    Tải ảnh từ thư viện
                  </button>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>
            )}
          </div>

          {image && !result && !isAnalyzing && (
            <button
              onClick={analyzeImage}
              className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
            >
              <Leaf size={20} />
              Phân tích ngay
            </button>
          )}

          {isAnalyzing && (
            <div className="w-full py-4 bg-white border border-gray-100 shadow-sm rounded-xl font-medium flex flex-col items-center justify-center gap-2 text-primary">
              <Loader2 size={24} className="animate-spin" />
              <span className="text-sm">Đang phân tích dữ liệu...</span>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-start gap-3 border border-red-100">
              <AlertCircle size={20} className="shrink-0 mt-0.5" />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </div>
        {/* Results Section */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
              >
                <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-primary/5 to-transparent">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {result.diseaseName}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Độ tin cậy: {(result.confidence * 100).toFixed(0)}%
                      </p>
                    </div>
                    <div
                      className={cn(
                        "px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1",
                        result.diseaseName.toLowerCase().includes("healthy") ||
                          result.diseaseName.toLowerCase().includes("khỏe")
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700",
                      )}
                    >
                      {result.diseaseName.toLowerCase().includes("healthy") ||
                      result.diseaseName.toLowerCase().includes("khỏe") ? (
                        <CheckCircle2 size={14} />
                      ) : (
                        <AlertCircle size={14} />
                      )}
                      {result.diseaseName.toLowerCase().includes("healthy") ||
                      result.diseaseName.toLowerCase().includes("khỏe")
                        ? "Cây khỏe mạnh"
                        : "Cần xử lý"}
                    </div>
                  </div>
                  <p className="text-gray-700 mt-4">{result.description}</p>
                </div>

                <div className="p-6 space-y-6 max-h-[500px] overflow-y-auto">
                  {result.treatment && (
                    <>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-green-500"></span>
                          Biện pháp sinh học
                        </h4>
                        <ul className="space-y-2">
                          {result.treatment.biological.map((item, idx) => (
                            <li
                              key={idx}
                              className="text-gray-600 text-sm pl-4 border-l-2 border-green-100"
                            >
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                          Biện pháp hóa học
                        </h4>
                        <ul className="space-y-2">
                          {result.treatment.chemical.map((item, idx) => (
                            <li
                              key={idx}
                              className="text-gray-600 text-sm pl-4 border-l-2 border-orange-100"
                            >
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                          Phòng ngừa
                        </h4>
                        <ul className="space-y-2">
                          {result.treatment.preventive.map((item, idx) => (
                            <li
                              key={idx}
                              className="text-gray-600 text-sm pl-4 border-l-2 border-blue-100"
                            >
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hidden md:flex h-full flex-col items-center justify-center text-center p-8 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50"
              >
                <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4">
                  <Leaf className="text-gray-300" size={32} />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Chưa có kết quả
                </h3>
                <p className="text-gray-500 max-w-xs">
                  Kết quả phân tích và phác đồ điều trị sẽ hiển thị tại đây sau
                  khi bạn chụp hoặc tải ảnh lên.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
