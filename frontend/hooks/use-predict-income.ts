"use client";

import { useState } from "react";
import { analyticsService } from "@/services/analytics.service";
import type { PredictRequest, PredictResponse } from "@/types/api";

export function usePredictIncome() {
  const [result, setResult] = useState<PredictResponse["result"] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function predict(payload: PredictRequest) {
    setIsLoading(true);
    setError(null);
    try {
      const response = await analyticsService.predictIncome(payload);
      setResult(response.result);
      return response.result;
    } catch {
      setError("Prediction failed");
      throw new Error("Prediction failed");
    } finally {
      setIsLoading(false);
    }
  }

  return { predict, result, isLoading, error };
}
