import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

type ChartProps = {
  data: any[];
  title: string;
  type: "bar" | "line";
  dataKey: string;
  xKey: string;
};

export default function ChartCard({
  data,
  title,
  type,
  dataKey,
  xKey,
}: ChartProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl">
      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          {title}
        </h3>
        <div className="flex space-x-2">
          <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/30 px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-300">
            {type === "bar" ? "Bar Chart" : "Line Chart"}
          </span>
        </div>
      </div>
      <div className="p-4">
        <ResponsiveContainer width="100%" height={280}>
          {type === "bar" ? (
            <BarChart data={data}>
              <XAxis
                dataKey={xKey}
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: "#E5E7EB" }}
                axisLine={{ stroke: "#E5E7EB" }}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: "#E5E7EB" }}
                axisLine={{ stroke: "#E5E7EB" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  borderRadius: "0.5rem",
                  border: "1px solid #E5E7EB",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Legend />
              <Bar
                dataKey={dataKey}
                fill="#6366F1"
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
              />
            </BarChart>
          ) : (
            <LineChart data={data}>
              <XAxis
                dataKey={xKey}
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: "#E5E7EB" }}
                axisLine={{ stroke: "#E5E7EB" }}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: "#E5E7EB" }}
                axisLine={{ stroke: "#E5E7EB" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  borderRadius: "0.5rem",
                  border: "1px solid #E5E7EB",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke="#6366F1"
                strokeWidth={3}
                dot={{
                  stroke: "#6366F1",
                  strokeWidth: 2,
                  r: 4,
                  fill: "#FFFFFF",
                }}
                activeDot={{
                  stroke: "#6366F1",
                  strokeWidth: 2,
                  r: 6,
                  fill: "#FFFFFF",
                }}
                animationDuration={1500}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
