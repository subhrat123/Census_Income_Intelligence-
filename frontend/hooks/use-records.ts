"use client";

import { useEffect, useState } from "react";
import { analyticsService } from "@/services/analytics.service";
import type { RecordsQuery, RecordsResponse } from "@/types/api";

export function useRecords(query: RecordsQuery) {
  const [response, setResponse] = useState<RecordsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function fetchRecords() {
      setIsLoading(true);
      setError(null);
      try {
        const result = await analyticsService.getRecords(query);
        if (mounted) setResponse(result);
      } catch {
        if (mounted) setError("Failed to fetch records");
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    fetchRecords();
    return () => {
      mounted = false;
    };
  }, [query.page, query.limit, query.search, query.workclass, query.sort, query.order]);

  return { response, isLoading, error };
}
