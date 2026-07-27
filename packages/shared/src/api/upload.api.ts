/**
 * upload.api.ts — Upload ảnh chung (GCS) dùng cho Web & Mobile.
 *
 * Backend: POST /api/upload/image (multipart/form-data, field 'image')
 *          → trả về { url: string } là public URL trên GCS.
 *
 * Cần đăng nhập (JWT). Dùng cho: check-in vườn (mobile), avatar, ảnh feedback...
 */

import { axiosClient } from "./axios-client";
import { API_ENDPOINTS } from "../constants";

export interface IUploadResponse {
  url: string; // public URL của ảnh trên GCS
}

/**
 * File truyền vào:
 * - Web:    File | Blob (từ <input type="file"> hoặc canvas.toBlob)
 * - Mobile: { uri, name, type } (React Native FormData part)
 */
export type UploadableFile =
  | File
  | Blob
  | { uri: string; name?: string; type?: string };

export const uploadApi = {
  /**
   * Upload 1 ảnh, trả về public URL.
   * POST /api/upload/image
   */
  uploadImage: async (file: UploadableFile): Promise<IUploadResponse> => {
    const formData = new FormData();
    // RN FormData chấp nhận object { uri, name, type }; web dùng File/Blob trực tiếp
    formData.append("image", file as unknown as Blob);

    const res = await axiosClient.post<IUploadResponse>(
      API_ENDPOINTS.UPLOAD.IMAGE,
      formData,
      { headers: { "Content-Type": "multipart/form-data" }, timeout: 60000 },
    );
    return res.data;
  },
};
