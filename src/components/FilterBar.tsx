import React from "react";
import { products, machines } from "../data/mockData";

type Props = {
  range: string;
  onRangeChange: (r: string) => void;
  product: string;
  onProductChange: (p: string) => void;
  machine: string;
  onMachineChange: (m: string) => void;
};

export default function FilterBar({
  range,
  onRangeChange,
  product,
  onProductChange,
  machine,
  onMachineChange,
}: Props) {
  const renderFilterOption = (
    value: string,
    label: string,
    activeValue: string
  ) => (
    <button
      className={`px-3 py-2 text-sm rounded-md transition-all duration-200 ${
        activeValue === value
          ? "bg-indigo-500 text-white shadow-md"
          : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700"
      }`}
      onClick={() => onRangeChange(value)}
    >
      {label}
    </button>
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 border border-gray-100 dark:border-gray-700">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex flex-col space-y-2">
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Time Range
          </label>
          <div className="flex space-x-2">
            {renderFilterOption("today", "Today", range)}
            {renderFilterOption("yesterday", "Yesterday", range)}
            {renderFilterOption("last7", "Last 7 Days", range)}
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Product
          </label>
          <div className="relative">
            <select
              value={product}
              onChange={(e) => onProductChange(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
            >
              <option value="all">All Products</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Machine
          </label>
          <div className="relative">
            <select
              value={machine}
              onChange={(e) => onMachineChange(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
            >
              <option value="all">All Machines</option>
              {machines.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
