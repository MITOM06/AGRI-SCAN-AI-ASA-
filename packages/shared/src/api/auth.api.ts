import { axiosClient } from './axios-client';

export const authApi = {
    login: async (data: any) => {
        const response = await axiosClient.post('/auth/login', data);
        return response.data;
    },

    register: async (data: any) => {
        const response = await axiosClient.post('/auth/register', data);
        return response.data;
    },

    forgotPassword: async (email: string) => {
        const response = await axiosClient.post('/auth/forgot-password', { email });
        return response.data;
    },

    verifyOtp: async (email: string, otp: string) => {
        const response = await axiosClient.post('/auth/verify-otp', { email, otp });
        return response.data;
    },

    resetPassword: async (data: any) => {
        const response = await axiosClient.post('/auth/reset-password', data);
        return response.data;
    },
    getProfile: async () => (await axiosClient.get('/auth/profile')).data,

    logout: async () => {
        const response = await axiosClient.post('/auth/logout');
        return response.data;
    },
};