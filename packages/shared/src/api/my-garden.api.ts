import { axiosClient } from './axios-client';
import {
  IMyGardenPlant,
  AddPlantPayload,
  DailyCheckInPayload,
} from '../types/my-garden.types';

export type { AddPlantPayload, DailyCheckInPayload };

export const myGardenApi = {
  getUserGarden: async (): Promise<IMyGardenPlant[]> => {
    const response = await axiosClient.get('/api/my-garden');
    return response.data;
  },

  addPlantToGarden: async (
    payload: AddPlantPayload,
  ): Promise<{ message: string; data: IMyGardenPlant }> => {
    const response = await axiosClient.post('/api/my-garden', payload);
    return response.data;
  },

  dailyCheckIn: async (
    gardenId: string,
    payload: DailyCheckInPayload,
  ): Promise<{
    requireRegeneration: boolean;
    message: string;
    progressPercentage?: number;
    status?: string;
    todayTask?: unknown;
  }> => {
    const response = await axiosClient.post(
      `/api/my-garden/${gardenId}/check-in`,
      payload,
    );
    return response.data;
  },

  removePlant: async (gardenId: string): Promise<{ message: string }> => {
    const response = await axiosClient.delete(`/api/my-garden/${gardenId}`);
    return response.data;
  },
};