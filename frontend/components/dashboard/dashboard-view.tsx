"use client";

import { Activity, Clock3, Database } from "lucide-react";
import { IncomePieChart } from "@/charts/income-pie-chart";
import { WorkclassBarChart } from "@/charts/workclass-bar-chart";
import { MetricCard } from "@/components/dashboard/metric-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardMetrics } from "@/hooks/use-dashboard-metrics";

export function DashboardView() {
  const { metrics, isLoading, error } = useDashboardMetrics();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-80" />
      </div>
    );
  }

  if (error || !metrics) {
    return <div className="rounded-md border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">{error ?? "Failed to load dashboard metrics."}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Total Records" value={metrics.total_records.toLocaleString()} icon={<Database className="h-5 w-5" />} />
        <MetricCard label="Average Age" value={metrics.average_age.toFixed(1)} icon={<Activity className="h-5 w-5" />} />
        <MetricCard label="Average Work Hours" value={metrics.average_hours_per_week.toFixed(1)} icon={<Clock3 className="h-5 w-5" />} />
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="glass-card">
          <CardHeader><CardTitle>Income Distribution</CardTitle></CardHeader>
          <CardContent><IncomePieChart data={metrics.income_distribution} /></CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader><CardTitle>Workclass Distribution</CardTitle></CardHeader>
          <CardContent><WorkclassBarChart data={metrics.workclass_distribution} /></CardContent>
        </Card>
      </div>
    </div>
  );
}
