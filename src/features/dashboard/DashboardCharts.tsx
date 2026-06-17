"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts";

const COLORS = {
  TRANSPORTATION: "#f43f5e", // rose
  FOOD: "#f59e0b", // amber
  ENERGY: "#10b981", // emerald
  SHOPPING: "#3b82f6", // blue
  TRAVEL: "#8b5cf6", // violet
  WASTE: "#a8a29e", // stone
  WATER: "#0ea5e9", // sky
  CLOTHING: "#ec4899", // pink
  ELECTRONICS: "#14b8a6", // teal
  SERVICES: "#84cc16", // lime
  ENTERTAINMENT: "#f97316", // orange
  OTHER: "#64748b", // slate
};

export function DashboardCharts({ records }: { records: any[] }) {
  // Aggregate records by category
  const aggregated = records.reduce((acc, record) => {
    if (!acc[record.category]) {
      acc[record.category] = 0;
    }
    acc[record.category] += record.amount;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.keys(aggregated).map((key) => ({
    name: key,
    amount: aggregated[key],
  })).sort((a, b) => b.amount - a.amount);

  if (data.length === 0) {
    return <div className="h-full flex items-center justify-center text-muted-foreground">No data available yet.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 0, left: 30, bottom: 0 }}>
        <XAxis type="number" hide />
        <YAxis 
          type="category" 
          dataKey="name" 
          axisLine={false} 
          tickLine={false} 
          fontSize={12}
          tickFormatter={(value) => value.charAt(0) + value.slice(1).toLowerCase()}
        />
        <Tooltip 
          cursor={{ fill: 'var(--muted)', opacity: 0.4 }}
          contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '8px', border: '1px solid var(--border)' }}
          itemStyle={{ color: 'var(--foreground)' }}
          formatter={(value: any) => [`${Number(value || 0).toFixed(0)} kg CO₂e`, "Amount"]}
        />
        <Bar dataKey="amount" radius={[0, 4, 4, 0]} barSize={32} isAnimationActive={false}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS] || COLORS.OTHER} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
