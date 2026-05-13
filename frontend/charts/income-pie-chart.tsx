"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import type { IncomeBucket } from "@/types/api";

const COLORS = ["#14b8a6", "#0ea5e9", "#22d3ee", "#2dd4bf"];

export function IncomePieChart({ data }: { data: IncomeBucket[] }) {
  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="count" nameKey="income" innerRadius={65} outerRadius={110} paddingAngle={2}>
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
