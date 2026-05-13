import { apiClient } from "@/services/api-client";
import type {
  MetricsResponse,
  PredictRequest,
  PredictResponse,
  RecordsQuery,
  RecordsResponse
} from "@/types/api";

export const analyticsService = {
  async getMetrics() {
    const { data } = await apiClient.get<MetricsResponse>("/api/metrics");
    return data;
  },
  async getRecords(params: RecordsQuery) {
    const { data } = await apiClient.get<RecordsResponse>("/api/records", { params });
    return data;
  },
  async predictIncome(payload: PredictRequest) {
    const { data } = await apiClient.post<PredictResponse>("/api/predict", payload);
    return data;
  },
  async healthCheck() {
    const { data } = await apiClient.get<{ status: string }>("/health");
    return data;
  }
};
