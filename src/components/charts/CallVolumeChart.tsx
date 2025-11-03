import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { CallVolumePoint } from "../../data/types";

interface CallVolumeChartProps {
  data: CallVolumePoint[];
}

export function CallVolumeChart({ data }: CallVolumeChartProps) {
  return (
    <div className="card h-72 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900">Call Volume</p>
          <p className="text-xs text-slate-500">Last 7 days</p>
        </div>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          Live
        </span>
      </div>
      <div className="mt-8 h-[200px] w-full">
        <ResponsiveContainer>
          <LineChart data={data}>
            <defs>
              <linearGradient id="strokeGradient" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#1E40AF" stopOpacity={1} />
                <stop offset="100%" stopColor="#38BDF8" stopOpacity={1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="6 6" stroke="#E2E8F0" />
            <XAxis
              dataKey="date"
              stroke="#94A3B8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                borderRadius: "0.75rem",
                border: "1px solid #CBD5F5",
                boxShadow: "0 20px 40px -24px rgba(30, 64, 175, 0.35)",
              }}
            />
            <Line
              type="monotone"
              dataKey="total"
              stroke="url(#strokeGradient)"
              strokeWidth={3}
              dot={{ r: 4, fill: "#1E40AF" }}
              activeDot={{ r: 6, fill: "#1E40AF" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

