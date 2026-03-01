'use client';

/**
 * useScan Hook - Xử lý logic quét ảnh và chẩn đoán AI
 */

import { useState, useCallback } from 'react';
import { scanService } from '@/services/scan.service';
import { isValidImageFile } from '@agri-scan/shared';
import type { IScanResult, IScanHistoryDetail } from '@agri-scan/shared';

interface UseScanResult {
  isScanning: boolean;
  scanResult: IScanResult | null;
  error: string | null;
  scan: (file: File) => Promise<IScanResult | null>;
  getScanDetail: (scanId: string) => Promise<IScanHistoryDetail | null>;
  sendFeedback: (scanId: string, isAccurate: boolean) => Promise<void>;
  reset: () => void;
}

export function useScan(): UseScanResult {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<IScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const scan = useCallback(async (file: File): Promise<IScanResult | null> => {
    // Validate file trước khi upload
    const validation = isValidImageFile(file);
    if (!validation.valid) {
      setError(validation.error || 'File không hợp lệ');
      return null;
    }

    setIsScanning(true);
    setError(null);

    try {
      const result = await scanService.scanImage(file);
      setScanResult(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi quét ảnh';
      setError(errorMessage);
      return null;
    } finally {
      setIsScanning(false);
    }
  }, []);

  const getScanDetail = useCallback(async (scanId: string): Promise<IScanHistoryDetail | null> => {
    try {
      return await scanService.getScanResult(scanId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể lấy chi tiết kết quả';
      setError(errorMessage);
      return null;
    }
  }, []);

  const sendFeedback = useCallback(async (scanId: string, isAccurate: boolean): Promise<void> => {
    try {
      await scanService.sendFeedback(scanId, isAccurate);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể gửi feedback';
      setError(errorMessage);
    }
  }, []);

  const reset = useCallback(() => {
    setScanResult(null);
    setError(null);
    setIsScanning(false);
  }, []);

  return {
    isScanning,
    scanResult,
    error,
    scan,
    getScanDetail,
    sendFeedback,
    reset,
  };
}
