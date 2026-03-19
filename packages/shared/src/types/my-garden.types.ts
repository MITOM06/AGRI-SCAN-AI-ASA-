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
  plantGroup: 'FRUIT' | 'FLOWER' | 'ORNAMENTAL';
  userGoal: string;
  currentCondition: string;
  growthStages: string[];
  currentStageIndex: number;
  progressPercentage: number;
  lastInteractionDate: string;
  careRoadmap: IDailyTask[];
  status: 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
}

// ── Thêm: DTO dùng chung cho cả web và mobile ──
export interface AddPlantPayload {
  plantId: string;
  customName?: string;
  userGoal: 'HEAL_DISEASE' | 'GET_FRUIT' | 'GET_FLOWER' | 'MAINTAIN';
  diseaseName?: string;
  lat: number;
  lon: number;
}