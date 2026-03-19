'use client';
import { useState, useCallback, useEffect } from 'react';
import { myGardenApi } from '@agri-scan/shared';
import type { IMyGardenPlant, AddPlantPayload } from '@agri-scan/shared';

interface UseMyGardenResult {
  garden: IMyGardenPlant[];
  isLoading: boolean;
  isAdding: boolean;
  error: string | null;
  fetchGarden: () => Promise<void>;
  addPlant: (payload: AddPlantPayload) => Promise<IMyGardenPlant | null>;
  removePlant: (gardenId: string) => Promise<boolean>;
  checkIn: (gardenId: string, currentDay: number) => Promise<{
    requireRegeneration: boolean;
    message: string;
    progressPercentage?: number;
  } | null>;
}

export function useMyGarden(): UseMyGardenResult {
  const [garden, setGarden] = useState<IMyGardenPlant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lấy danh sách cây từ BE
  const fetchGarden = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await myGardenApi.getUserGarden();
      setGarden(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Không thể tải dữ liệu vườn';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Trong file useMyGarden.ts, thay thế hàm addPlant cũ bằng hàm này:
  const addPlant = useCallback(async (payload: AddPlantPayload): Promise<IMyGardenPlant | null> => {
    setIsAdding(true);
    setError(null);
    
    // MOCK DATA: Chặn không gọi API thật để tránh lỗi ID ảo
    return await new Promise((resolve) => {
      setTimeout(() => {
        const fakeNewPlant: IMyGardenPlant = {
          _id: "garden_" + Date.now() + "_" + Math.random().toString(36).substring(7),
          userId: "local",
          plantId: {
            _id: payload.plantId,
            commonName: payload.customName || "Cây mới",
            // Lấy tạm 1 ảnh mặc định
            images: ["https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&q=80&w=800"]
          },
          customName: payload.customName || "Cây mới",
          plantGroup: "ORNAMENTAL",
          userGoal: payload.userGoal,
          currentCondition: payload.diseaseName || "Khỏe mạnh",
          growthStages: ["Giai đoạn 1", "Giai đoạn 2", "Giai đoạn 3"],
          currentStageIndex: 0,
          progressPercentage: 0,
          lastInteractionDate: new Date().toISOString(),
          careRoadmap: [],
          status: "IN_PROGRESS"
        };
        
        // Cập nhật state nội bộ để UI hiển thị ngay lập tức
        setGarden(prev => [fakeNewPlant, ...prev]);
        setIsAdding(false);
        resolve(fakeNewPlant); // Trả về data để MyGardenPage nhảy sang OVERVIEW
      }, 1500); // Tạo hiệu ứng loading 1.5s cho chân thực
    });
  }, []);

  // Xóa cây khỏi vườn
  const removePlant = useCallback(async (gardenId: string): Promise<boolean> => {
    try {
      await myGardenApi.removePlant(gardenId);
      setGarden(prev => prev.filter(p => p._id !== gardenId));
      return true;
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Không thể xóa cây';
      setError(msg);
      return false;
    }
  }, []);

  // Check-in tiến trình hằng ngày
  const checkIn = useCallback(async (gardenId: string, currentDay: number) => {
    try {
      const res = await myGardenApi.dailyCheckIn(gardenId, currentDay);
      // Cập nhật progressPercentage local nếu BE trả về
      if (!res.requireRegeneration && res.progressPercentage !== undefined) {
        setGarden(prev =>
          prev.map(p =>
            p._id === gardenId ? { ...p, progressPercentage: res.progressPercentage! } : p
          )
        );
      }
      return res;
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Check-in thất bại';
      setError(msg);
      return null;
    }
  }, []);

  return {
    garden,
    isLoading,
    isAdding,
    error,
    fetchGarden,
    addPlant,
    removePlant,
    checkIn,
  };
}