'use client';
import { useState, useCallback } from 'react';
import { isValidImageFile } from '@agri-scan/shared';
import type { IScanStatusResponse, IScanHistoryDetail } from '@agri-scan/shared';
import { scanApi } from '@agri-scan/shared';

interface UseScanResult {
  isScanning: boolean;
  scanResult: IScanStatusResponse | null;
  error: string | null;
  scan: (file: File) => Promise<IScanStatusResponse | null>;
  getScanDetail: (scanId: string) => Promise<IScanHistoryDetail | null>;
  sendFeedback: (scanId: string, isAccurate: boolean) => Promise<void>;
  reset: () => void;
}

export function useScan(): UseScanResult {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<IScanStatusResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const scan = useCallback(async (file: File): Promise<IScanStatusResponse | null> => {
    const validation = isValidImageFile(file);
    if (!validation.valid) {
      // Các chuỗi lỗi ở hook này là KEY i18n; component dịch bằng t(error)
      setError(validation.error || 'scan.invalidFile');
      return null;
    }

    setIsScanning(true);
    setError(null);

    try {
      const result = await scanApi.scanImageAndWait(file);

      if (result.status !== 'COMPLETED') {
        throw new Error(result.message || 'scan.analysisIncomplete');
      }

      setScanResult(result);
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'scan.scanError';
      setError(errorMessage);
      return null;
    } finally {
      setIsScanning(false);
    }
  }, []);

  const getScanDetail = useCallback(async (scanId: string): Promise<IScanHistoryDetail | null> => {
    try {
      return await scanApi.getScanDetail(scanId);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'scan.detailFetchFailed';
      setError(errorMessage);
      return null;
    }
  }, []);

  const sendFeedback = useCallback(async (scanId: string, isAccurate: boolean) => {
    await scanApi.sendFeedback(scanId, isAccurate);
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