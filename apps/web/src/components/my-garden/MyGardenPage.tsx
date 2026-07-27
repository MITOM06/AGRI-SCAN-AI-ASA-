"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { IMyGardenPlant, IScanStatusResponse } from "@agri-scan/shared";
import { HEALTHY_CONDITION, DEFAULT_PLANT_NAME } from "@agri-scan/shared";
import { useT } from "@/context/I18nContext";
import { useScan } from "../../hooks/useScan";
import { useMyGarden } from "../../hooks/useMyGarden";
import { UploadView } from "./upload/UploadView";
import { AnalyzingView } from "./upload/AnalyzingView";
import { ResultView } from "./result/ResultView";
import { GardenOverview } from "./overview/GardenOverview";
import { TrackingView } from "./tracking/TrackingView";

type Step = "OVERVIEW" | "UPLOAD" | "ANALYZING" | "RESULT" | "TRACKING";
type ActiveTab = "TRACKING" | "FRUIT" | "FLOWER" | "ORNAMENTAL";

function normalizeText(value?: string | null) {
  return value?.trim()?.replace(/\s+/g, " ") || "";
}

/**
 * Trả về GIÁ TRỊ lưu vào `currentCondition` — không phải nhãn hiển thị,
 * nên dùng HEALTHY_CONDITION chứ không đi qua t().
 */
function extractDiseaseName(result: IScanStatusResponse | null): string {
  return normalizeText(result?.topDisease?.name) || HEALTHY_CONDITION;
}

function extractPlantName(result: IScanStatusResponse | null): string {
  const disease = result?.topDisease as
    | { commonName?: string; name?: string }
    | undefined
    | null;

  const commonName = normalizeText(disease?.commonName);
  if (commonName) {
    const cleaned = commonName.replace(/\(.*?\)/g, "").trim();
    if (cleaned) return cleaned;
  }

  const diseaseName = normalizeText(disease?.name);
  if (diseaseName) {
    const parts = diseaseName.split(" ");
    if (parts.length > 1) return parts[0];
  }

  return DEFAULT_PLANT_NAME;
}

function getDefaultGoalFromDisease(diseaseName: string) {
  const normalized = diseaseName.toLowerCase();

  if (
    normalized === "khỏe mạnh" ||
    normalized === "khoe manh" ||
    normalized === "healthy" ||
    normalized === "normal"
  ) {
    return "MAINTAIN" as const;
  }

  return "HEAL_DISEASE" as const;
}

function useToast() {
  const showToast = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    if (typeof window !== "undefined") {
      console[type === "error" ? "error" : "log"](`[toast:${type}] ${message}`);
    }
  };

  return { showToast };
}

// KEY i18n — AnalyzingView tự gọi t() khi hiển thị
const ANALYZING_MESSAGES = [
  "myGarden.analyzingStep1",
  "myGarden.analyzingStep2",
  "myGarden.analyzingStep3",
  "myGarden.analyzingStep4",
];

export function MyGardenPage() {
  const t = useT();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [step, setStep] = useState<Step>("OVERVIEW");
  const [activeTab, setActiveTab] = useState<ActiveTab>("TRACKING");
  const [selectedPlant, setSelectedPlant] = useState<IMyGardenPlant | null>(
    null,
  );
  const [scanResult, setScanResult] = useState<IScanStatusResponse | null>(
    null,
  );
  const [isViewingTracked, setIsViewingTracked] = useState(false);
  const [isUpdatingTracked, setIsUpdatingTracked] = useState(false);
  const [analyzingText, setAnalyzingText] = useState(ANALYZING_MESSAGES[0]);

  const { showToast } = useToast();

  const { scan, error: scanError } = useScan();
  const {
    garden,
    isLoading,
    isAdding,
    error: gardenError,
    fetchGarden,
    addPlant,
    removePlant,
    checkIn,
  } = useMyGarden();

  useEffect(() => {
    fetchGarden();
  }, [fetchGarden]);

  useEffect(() => {
    // scanError/gardenError giữ key i18n hoặc câu lỗi backend — t() xử lý cả hai
    if (scanError) showToast(t(scanError), "error");
  }, [scanError]);

  useEffect(() => {
    if (gardenError) showToast(t(gardenError), "error");
  }, [gardenError]);

  useEffect(() => {
    if (step !== "ANALYZING") return;

    let index = 0;
    setAnalyzingText(ANALYZING_MESSAGES[0]);

    const interval = window.setInterval(() => {
      index = (index + 1) % ANALYZING_MESSAGES.length;
      setAnalyzingText(ANALYZING_MESSAGES[index]);
    }, 1400);

    return () => window.clearInterval(interval);
  }, [step]);

  const trackedPlants = useMemo(() => garden || [], [garden]);

  const handleReset = () => {
    setSelectedPlant(null);
    setScanResult(null);
    setIsViewingTracked(false);
    setIsUpdatingTracked(false);
    setStep("OVERVIEW");
  };

  const handleViewTrackedPlant = (plant: IMyGardenPlant) => {
    setSelectedPlant(plant);
    setScanResult(null);
    setIsViewingTracked(true);
    setIsUpdatingTracked(false);
    setStep("RESULT");
  };

  const handleTrackPlant = (plant: IMyGardenPlant) => {
    setSelectedPlant(plant);
    setScanResult(null);
    setIsViewingTracked(true);
    setIsUpdatingTracked(false);
    setStep("TRACKING");
  };

  const handleRemovePlant = async (id: string) => {
    const ok = await removePlant(id);

    if (!ok) {
      showToast(t("myGarden.deleteFailed"), "error");
      return;
    }

    showToast(t("myGarden.deleted"));
    setSelectedPlant(null);
    setScanResult(null);
    setIsViewingTracked(false);
    setIsUpdatingTracked(false);
    setStep("OVERVIEW");
  };

  const handleAddToGarden = async () => {
    if (!selectedPlant) return;

    const defaultGoal = getDefaultGoalFromDisease(
      normalizeText(selectedPlant.currentCondition),
    );

    // Hai giá trị này đi vào payload addPlant → là DỮ LIỆU, không dịch
    const diseaseName =
      normalizeText(selectedPlant.currentCondition) || HEALTHY_CONDITION;

    const plantName =
      normalizeText(selectedPlant.aiLabel) ||
      normalizeText(selectedPlant.customName) ||
      DEFAULT_PLANT_NAME;

    const lat = 10.7769;
    const lon = 106.7009;

    const result = await addPlant({
      plantName,
      diseaseName,
      imageUrl: selectedPlant.imageUrl,
      customName: selectedPlant.customName,
      userGoal: defaultGoal,
      lat,
      lon,
    });

    if (!result) {
      showToast(t("myGarden.addFailed"), "error");
      return;
    }

    setSelectedPlant(result);
    setIsViewingTracked(true);
    setStep("TRACKING");
    showToast(t("myGarden.added"));
  };

  const handleUpdateTrackedPlant = () => {
    if (!selectedPlant) return;
    setIsUpdatingTracked(true);
    setStep("UPLOAD");
  };

  const handleRealUpload = async (file: File) => {
    setStep("ANALYZING");

    try {
      const result = await scan(file);

      if (!result || result.status !== "COMPLETED") {
        showToast(t("myGarden.analyzeFailed"), "error");
        setStep("UPLOAD");
        return;
      }

      setScanResult(result);

      if (isUpdatingTracked && selectedPlant?._id) {
        const lat = 10.7769;
        const lon = 106.7009;
        const imageUrl =
          result.imageUrl || selectedPlant.imageUrl || "/placeholder-plant.png";

        const currentDay =
          (selectedPlant.careRoadmap?.find((task) => !task.isCompleted)?.day ??
            selectedPlant.currentStageIndex + 1) ||
          1;

        const checkInResult = await checkIn(selectedPlant._id, {
          currentDay,
          imageUrl,
          lat,
          lon,
        });

        if (!checkInResult) {
          showToast(t("myGarden.updateConditionFailed"), "error");
          setIsUpdatingTracked(false);
          setStep("TRACKING");
          return;
        }

        setSelectedPlant((prev) =>
          prev
            ? {
                ...prev,
                imageUrl,
                currentCondition: extractDiseaseName(result),
                progressPercentage:
                  checkInResult.progressPercentage ?? prev.progressPercentage,
                status:
                  (checkInResult.status as IMyGardenPlant["status"]) ??
                  prev.status,
                lastInteractionDate: new Date().toISOString(),
              }
            : prev,
        );

        setIsUpdatingTracked(false);
        setStep("TRACKING");
        showToast(checkInResult.message || t("myGarden.conditionUpdated"));
        return;
      }

      const diseaseName = extractDiseaseName(result);
      const plantName = extractPlantName(result);

      const scannedPlant: IMyGardenPlant = {
        _id: result.scanHistoryId || crypto.randomUUID(),
        userId: "",
        aiLabel: plantName,
        imageUrl: result.imageUrl,
        plantInfo: null,
        customName: plantName,
        userGoal: getDefaultGoalFromDisease(diseaseName),
        currentCondition: diseaseName,
        roadmapSummary: "",
        growthStages: [],
        currentStageIndex: 0,
        progressPercentage: 0,
        lastInteractionDate: new Date().toISOString(),
        careRoadmap: [],
        status: "IN_PROGRESS",
      };

      setSelectedPlant(scannedPlant);
      setIsViewingTracked(false);
      setIsUpdatingTracked(false);
      setStep("RESULT");
    } catch {
      showToast(t("myGarden.connectionError"), "error");
      setIsUpdatingTracked(false);
      setStep("UPLOAD");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f6f0] pt-16">
      {step === "OVERVIEW" && (
        <GardenOverview
          trackedPlants={trackedPlants}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setStep={setStep}
          setSelectedPlant={setSelectedPlant}
          setIsViewingTracked={setIsViewingTracked}
          handleRemovePlant={handleRemovePlant}
          handleTrackPlant={handleTrackPlant}
          handleViewTrackedPlant={handleViewTrackedPlant}
          navigate={router.push}
          isLoading={isLoading}
        />
      )}

      {step === "UPLOAD" && (
        <UploadView
          onBack={isUpdatingTracked ? () => setStep("TRACKING") : handleReset}
          handleRealUpload={handleRealUpload}
          fileInputRef={fileInputRef}
        />
      )}

      {step === "ANALYZING" && (
        <AnalyzingView
          analyzingText={
            isAdding
              ? "myGarden.buildingSchedule"
              : isUpdatingTracked
                ? "myGarden.updatingCondition"
                : analyzingText
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
          plant={selectedPlant}
          onBack={handleReset}
          onUpdatePhoto={handleUpdateTrackedPlant}
        />
      )}
    </div>
  );
}
