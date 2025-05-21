import React, { useState, useMemo } from "react";
import { transactions, products } from "./data/mockData";
import FilterBar from "./components/FilterBar";
import ChartCard from "./components/ChartCard";
import RestaurantDashboard from "./components/RestaurantDashboard";

export default function App() {
  const [range, setRange] = useState("last7");
  const [product, setProduct] = useState("all");
  const [machine, setMachine] = useState("all");

  const filtered = useMemo(() => {
    const now = new Date();
    let start = new Date();
    if (range === "today") start.setHours(0, 0, 0, 0);
    else if (range === "yesterday") {
      start.setDate(now.getDate() - 1);
      start.setHours(0, 0, 0, 0);
      now.setDate(now.getDate() - 1);
    } else start.setDate(now.getDate() - 7);
    return transactions.filter(
      (t) =>
        t.timestamp >= start &&
        t.timestamp <= now &&
        (product === "all" || t.productId === product) &&
        (machine === "all" || t.machineId === machine)
    );
  }, [range, product, machine]);

  const perDay = useMemo(
    () =>
      Object.entries(
        filtered.reduce((acc, t) => {
          const d = t.timestamp.toISOString().split("T")[0];
          acc[d] = (acc[d] || 0) + t.amount;
          return acc;
        }, {} as Record<string, number>)
      ).map(([date, total]) => ({ date, total })),
    [filtered]
  );

  const perProduct = useMemo(
    () =>
      Object.entries(
        filtered.reduce((acc, t) => {
          acc[t.productId] = (acc[t.productId] || 0) + t.amount;
          return acc;
        }, {} as Record<string, number>)
      ).map(([pid, total]) => ({
        product: products.find((p) => p.id === pid)?.name || pid,
        total,
      })),
    [filtered]
  );

  return (
    // <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
    //   <div className="container mx-auto p-4 md:p-8">
    //     <div className="flex flex-col md:flex-row items-center justify-between mb-8">
    //       <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500 dark:from-indigo-400 dark:to-blue-300">
    //         Restaurant Analytics
    //       </h1>
    //       <div className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-2 md:mt-0">
    //         {new Date().toLocaleDateString("en-US", {
    //           weekday: "long",
    //           year: "numeric",
    //           month: "long",
    //           day: "numeric",
    //         })}
    //       </div>
    //     </div>

    //     <FilterBar
    //       range={range}
    //       onRangeChange={setRange}
    //       product={product}
    //       onProductChange={setProduct}
    //       machine={machine}
    //       onMachineChange={setMachine}
    //     />

    //     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
    //       <ChartCard
    //         data={perDay}
    //         title="Sales Over Time"
    //         type="line"
    //         dataKey="total"
    //         xKey="date"
    //       />
    //       <ChartCard
    //         data={perProduct}
    //         title="Sales by Product"
    //         type="bar"
    //         dataKey="total"
    //         xKey="product"
    //       />
    //     </div>
    //   </div>
    // </div>
    <RestaurantDashboard />
  );
}
