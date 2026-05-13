"use client";

import { useEffect, useState } from "react";
import { analyticsService } from "@/services/analytics.service";
import type { Metrics } from "@/types/api";

export function useDashboardMetrics() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchMetrics() {
      try {
        const response = await analyticsService.getMetrics();
        if (isMounted) setMetrics(response.metrics);
      } catch {
        if (isMounted) setError("Failed to load metrics");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchMetrics();

    return () => {
      isMounted = false;
    };
  }, []);

  return { metrics, isLoading, error };
}
