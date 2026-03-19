"use client";
import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { CheckCircle2, AlertTriangle } from "lucide-react";

import type { IMyGardenPlant, IScanResult } from "@agri-scan/shared";
import { useMyGarden } from "../../hooks/useMyGarden";
import { useAuth } from "../../hooks/useAuth";
import { useScan } from "../../hooks/useScan";

import { GardenOverview } from "./overview/GardenOverview";
import { UploadView } from "./upload/UploadView";
import { AnalyzingView } from "./upload/AnalyzingView";
import { ResultView } from "./result/ResultView";
import { TrackingView } from "./tracking/TrackingView";

// BƯỚC 1: Đã import Mock Data
import { MOCK_PLANTS, FRUIT_STAGES, FLOWER_STAGES, ORNAMENTAL_STAGES } from "../data/gardenData";

// Helper: map IScanResult → IMyGardenPlant để ResultView hiển thị được
const mapScanResultToPlant = (result: IScanResult): IMyGardenPlant => ({
  _id: result.scanHistoryId,
  userId: "",
  plantId: {
    _id: "65f2a1b0c9e8d7f6a5b4c3d2",
    commonName: result.topDisease?.name ?? "Không xác định",
    images: [result.imageUrl],
  },
  customName: result.topDisease?.name ?? "Không xác định",
  plantGroup: "ORNAMENTAL",
  userGoal: "MAINTAIN",
  currentCondition: result.topDisease ? result.topDisease.name : "Khỏe mạnh",
  growthStages: [],
  currentStageIndex: 0,
  progressPercentage: 0,
  lastInteractionDate: new Date().toISOString(),
  careRoadmap: [],
  status: "IN_PROGRESS",
});

export function MyGardenPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { scan } = useScan();

  const {
    garden,
    isLoading: isGardenLoading,
    isAdding,
    error: gardenError,
    fetchGarden,
    addPlant,
    removePlant: removeFromGarden,
  } = useMyGarden();

  const [step, setStep] = useState<
    "OVERVIEW" | "UPLOAD" | "ANALYZING" | "RESULT" | "TRACKING"
  >("OVERVIEW");
  const [selectedPlant, setSelectedPlant] = useState<IMyGardenPlant | null>(
    null,
  );
  const [scanResult, setScanResult] = useState<IScanResult | null>(null);
  const [analyzingText, setAnalyzingText] = useState(
    "Đang trích xuất đặc trưng lá...",
  );
  const [isViewingTracked, setIsViewingTracked] = useState(false);
  const [isUpdatingTracked, setIsUpdatingTracked] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "TRACKING" | "FRUIT" | "FLOWER" | "ORNAMENTAL"
  >("TRACKING");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) fetchGarden();
  }, [user, fetchGarden]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  useEffect(() => {
    if (step === "ANALYZING") {
      const texts = [
        "Đang trích xuất đặc trưng lá...",
        "Đang nhận diện chủng loại...",
        "Đang quét các dấu hiệu bệnh lý...",
        "Đang tổng hợp phác đồ chăm sóc...",
      ];
      let i = 0;
      const interval = setInterval(() => {
        i = (i + 1) % texts.length;
        setAnalyzingText(texts[i]);
      }, 800);
      return () => clearInterval(interval);
    }
  }, [step]);

  const showToast = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // BƯỚC 2: Sửa hàm xử lý ảnh để AI "chạy bằng cơm" với Mock Data
  const handleRealUpload = async (file: File) => {
    setStep("ANALYZING");

    // 1. Logic cập nhật tiến độ (Tracking) giữ nguyên
    if (isUpdatingTracked && selectedPlant) {
      setTimeout(() => {
        const updatedPlant: IMyGardenPlant = {
          ...selectedPlant,
          currentCondition: Math.random() > 0.5 ? "Khỏe mạnh" : "Cần chú ý",
          progressPercentage: Math.min(
            100,
            selectedPlant.progressPercentage + Math.floor(Math.random() * 10),
          ),
        };
        setSelectedPlant(updatedPlant);
        setIsUpdatingTracked(false);
        setStep("TRACKING");
        showToast("Đã cập nhật trạng thái cây thành công!");
      }, 3000);
      return;
    }

    // 2. DÙNG FILE MOCK DATA: Bỏ qua API thật
    setTimeout(() => {
      // Random ngẫu nhiên 1 cây từ file gardenData
      const randomPlant = MOCK_PLANTS[Math.floor(Math.random() * MOCK_PLANTS.length)];
      
      // Khớp giai đoạn phát triển (Stages) theo đúng Group
      const stages = 
        randomPlant.group === 'FRUIT' ? FRUIT_STAGES : 
        randomPlant.group === 'FLOWER' ? FLOWER_STAGES : 
        ORNAMENTAL_STAGES;

      // Ánh xạ data giả vào đúng định dạng IMyGardenPlant
      const fakeScannedPlant: IMyGardenPlant = {
        _id: "scan_" + Date.now(), // ID tạm
        userId: "local_user",
        plantId: {
          _id: randomPlant.id,
          commonName: randomPlant.species,
          images: [randomPlant.image],
        },
        customName: randomPlant.name,
        plantGroup: randomPlant.group as any,
        userGoal: "MAINTAIN",
        currentCondition: randomPlant.health === 'GOOD' ? 'Khỏe mạnh' : (randomPlant.healthMessage || 'Cần chú ý'),
        growthStages: stages,
        currentStageIndex: 2, // Giả vờ cây đang ở giai đoạn 3
        progressPercentage: 45,
        lastInteractionDate: new Date().toISOString(),
        careRoadmap: [],
        status: "IN_PROGRESS",
      };

      // Đẩy data lên giao diện
      setSelectedPlant(fakeScannedPlant);
      setIsViewingTracked(false);
      setStep("RESULT");
      
    }, 2500); // Hiệu ứng quét 2.5 giây
  };

  const handleReset = () => {
    setStep("OVERVIEW");
    setSelectedPlant(null);
    setScanResult(null);
    setIsViewingTracked(false);
  };

  const handleAddToGarden = async () => {
    if (!selectedPlant) return;

    let lat = 10.8231;
    let lon = 106.6297;
    try {
      const pos = await new Promise<GeolocationPosition>((res, rej) =>
        navigator.geolocation.getCurrentPosition(res, rej, { timeout: 3000 }),
      );
      lat = pos.coords.latitude;
      lon = pos.coords.longitude;
    } catch {
      // fallback TP.HCM
    }

    const plantIdForApi = selectedPlant.plantId._id;
    const diseaseName = scanResult?.topDisease?.name ?? undefined;
    const defaultGoal =
      selectedPlant.plantGroup === "FRUIT"
        ? "GET_FRUIT"
        : selectedPlant.plantGroup === "FLOWER"
          ? "GET_FLOWER"
          : "MAINTAIN";

    const result = await addPlant({
      plantId: plantIdForApi,
      customName: selectedPlant.customName,
      userGoal: defaultGoal,
      diseaseName,
      lat,
      lon,
    });

    if (result) {
      showToast(
        `Đã thêm "${selectedPlant.customName}" vào vườn! AI đang tạo lộ trình...`,
      );
      setStep("OVERVIEW");
    } else {
      showToast(
        gardenError ?? "Không thể thêm cây. Vui lòng thử lại.",
        "error",
      );
    }
  };

  const handleViewTrackedPlant = (plant: IMyGardenPlant) => {
    setSelectedPlant(plant);
    setIsViewingTracked(true);
    setStep("RESULT");
  };

  const handleTrackPlant = (plant: IMyGardenPlant) => {
    setSelectedPlant(plant);
    setIsViewingTracked(true);
    setStep("TRACKING");
  };

  const handleRemovePlant = async (gardenId: string) => {
    const success = await removeFromGarden(gardenId);
    if (success) {
      showToast("Đã xóa cây khỏi vườn.");
    } else {
      showToast(gardenError ?? "Không thể xóa cây.", "error");
    }
    setStep("OVERVIEW");
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-24 font-sans selection:bg-emerald-200 selection:text-emerald-900 pt-16">
      <AnimatePresence mode="wait">
        {step === "OVERVIEW" && (
          <GardenOverview
            trackedPlants={garden}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            setStep={setStep}
            setSelectedPlant={setSelectedPlant}
            setIsViewingTracked={setIsViewingTracked}
            handleRemovePlant={handleRemovePlant}
            handleTrackPlant={handleTrackPlant}
            handleViewTrackedPlant={handleViewTrackedPlant}
            navigate={router.push}
            isLoading={isGardenLoading}
          />
        )}
        {step === "UPLOAD" && (
          <UploadView
            setStep={setStep}
            handleRealUpload={handleRealUpload}
            fileInputRef={fileInputRef}
          />
        )}
        {step === "ANALYZING" && (
          <AnalyzingView
            analyzingText={
              isAdding ? "AI đang tạo lộ trình chăm sóc..." : analyzingText
            }
          />
        )}
        {step === "RESULT" && (
          <ResultView
            selectedPlant={selectedPlant}
            isViewingTracked={isViewingTracked}
            handleReset={handleReset}
            handleRemovePlant={handleRemovePlant}
            handleAddToGarden={handleAddToGarden}
          />
        )}
        {step === "TRACKING" && (
          <TrackingView
            selectedPlant={selectedPlant}
            setStep={setStep}
            setIsUpdatingTracked={setIsUpdatingTracked}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-900/95 backdrop-blur-md text-white px-6 py-3.5 rounded-full shadow-2xl flex items-center gap-3 z-50 border border-gray-800"
          >
            {toastType === "success" ? (
              <CheckCircle2 size={20} className="text-emerald-400" />
            ) : (
              <AlertTriangle size={20} className="text-red-400" />
            )}
            <span className="font-medium text-sm md:text-base">
              {toastMessage}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}