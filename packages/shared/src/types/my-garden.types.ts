export interface IDailyTask {
  day: number;
  date: string;
  weatherContext: string;
  waterAction: string;
  fertilizerAction: string;
  careAction: string;
  isCompleted: boolean;
}

export interface IMyGardenPlant {
  _id: string;
  userId: string;
  plantId: {
    _id: string;
    commonName: string;
    images: string[];
  };
  customName: string;
  plantGroup: "FRUIT" | "FLOWER" | "ORNAMENTAL";
  userGoal: string;
  currentCondition: string;
  growthStages: string[];
  currentStageIndex: number;
  progressPercentage: number;
  lastInteractionDate: string;
  careRoadmap: IDailyTask[];
  status: "IN_PROGRESS" | "COMPLETED" | "FAILED";
}

// ── Thêm: DTO dùng chung cho cả web và mobile ──
// Định nghĩa DTO cho đầu vào của hàm thêm cây
export interface AddPlantPayload {
  plantName: string;
  diseaseName: string;
  imageUrl?: string;
  customName?: string;
  userGoal: string;
  lat: number;
  lon: number;
}

// Định nghĩa DTO cho đầu vào của hàm Check-in
export interface DailyCheckInPayload {
  currentDay: number;
  imageUrl: string;
  lat: number;
  lon: number;
}
