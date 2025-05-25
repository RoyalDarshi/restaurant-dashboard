// RestaurantDashboard.tsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  LineChart,
  Line,
  BarChart,
  PieChart,
  Bar,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Calendar,
  Clock,
  Coffee,
  Utensils,
  TrendingUp,
  PieChart as PieChartIcon,
  BarChart2,
  MapPin,
  HardDrive,
  ShoppingBag,
  ReceiptText,
  Store,
  Truck,
  Tag,
} from "lucide-react";

const API_BASE_URL = "http://localhost:3001/api";

const COLORS = [
  "#6366F1",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#06B6D4",
  "#EC4899",
  "#A8A29E",
  "#34D399",
  "#FB923C",
  "#F87171",
  "#C084FC",
  "#22D3EE",
];

const formatIndianCurrency = (value: number) => {
  if (value === null || value === undefined) return "N/A";
  if (value >= 10000000)
    return `₹${(value / 10000000).toLocaleString(undefined, {
      maximumFractionDigits: 2,
    })} Cr`;
  else if (value >= 100000)
    return `₹${(value / 100000).toLocaleString(undefined, {
      maximumFractionDigits: 2,
    })} L`;
  else
    return `₹${value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
};

interface Transaction {
  id: number;
  restaurantId: string;
  productId: string;
  productName: string;
  machineId: string;
  transactionType: string;
  deliveryChannel: string;
  pod: string;
  timestamp: number;
  amount: number;
  quantity: number;
  itemFamilyGroup: string;
  itemDayPart: string;
}

interface FilterOption {
  id: string;
  name: string;
  subcategory_1?: string;
  reporting_2?: string;
  piecategory_3?: string;
  reporting_id_4?: string;
}

interface CardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  color?: string;
}

const Card: React.FC<CardProps> = ({
  title,
  value,
  icon,
  description,
  color = "text-indigo-500",
}) => (
  <div className="bg-white p-2 rounded-lg shadow-md flex items-center space-x-1">
    <div
      className={`p-3 rounded-full bg-opacity-20 ${color.replace(
        "text-",
        "bg-"
      )}`}
    >
      {icon}
    </div>
    <div>
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      {description && (
        <p className="text-gray-400 text-xs mt-1">{description}</p>
      )}
    </div>
  </div>
);

interface SummaryCardsProps {
  totalSales: number;
  totalOrders: number;
  avgOrderValue: number;
  totalInvoices: number;
  selectedTimePeriod: string;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({
  totalSales,
  totalOrders,
  avgOrderValue,
  totalInvoices,
  selectedTimePeriod,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mb-1">
    <Card
      title="Total Sales"
      value={formatIndianCurrency(totalSales)}
      icon={<TrendingUp className="text-indigo-500" />}
      description={`Sales ${selectedTimePeriod}`}
      color="text-indigo-500"
    />
    <Card
      title="Total Orders"
      value={totalOrders.toLocaleString()}
      icon={<ShoppingBag className="text-emerald-500" />}
      description={`Orders ${selectedTimePeriod}`}
      color="text-emerald-500"
    />
    <Card
      title="Average Order Value"
      value={formatIndianCurrency(avgOrderValue)}
      icon={<Utensils className="text-amber-500" />}
      description={`Avg. per order ${selectedTimePeriod}`}
      color="text-amber-500"
    />
    <Card
      title="Total GC"
      value={totalInvoices.toLocaleString()}
      icon={<ReceiptText className="text-violet-500" />}
      description={`Invoices ${selectedTimePeriod}`}
      color="text-violet-500"
    />
  </div>
);

interface SalesChartsProps {
  dailySales: { name: string; sales: number }[];
  hourlySales: { name: string; sales: number }[];
  salesByRestaurant: { name: string; value: number }[];
  salesByProduct: { name: string; value: number }[];
  selectedRestaurant: string;
}

const SalesCharts: React.FC<SalesChartsProps> = ({
  dailySales,
  hourlySales,
  salesByRestaurant,
  salesByProduct,
  selectedRestaurant,
}) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-2">
    <div className="bg-white p-2 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-gray-700">
        Daily Sales Performance
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={dailySales}
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="name" stroke="#666" />
          <YAxis stroke="#666" />
          <Tooltip formatter={(value: number) => formatIndianCurrency(value)} />
          <Legend />
          <Line
            type="monotone"
            dataKey="sales"
            stroke="#6366F1"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
    <div className="bg-white p-2 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-gray-700">
        Hourly Sales Distribution
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={hourlySales}
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="name" stroke="#666" />
          <YAxis stroke="#666" />
          <Tooltip formatter={(value: number) => formatIndianCurrency(value)} />
          <Legend />
          <Bar dataKey="sales" fill="#10B981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
    {selectedRestaurant === "all" && salesByRestaurant.length > 0 && (
      <div className="bg-white p-2 rounded-lg shadow-md lg:col-span-1">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          Sales Breakdown by Restaurant
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={salesByRestaurant}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {salesByRestaurant.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => formatIndianCurrency(value)}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    )}
    {salesByProduct.length > 0 && (
      <div className="bg-white p-2 rounded-lg shadow-md lg:col-span-1">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          Top Selling Products
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            layout="vertical"
            data={salesByProduct}
            margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis
              type="number"
              stroke="#666"
              formatter={(value: number) => formatIndianCurrency(value)}
            />
            <YAxis type="category" dataKey="name" stroke="#666" width={80} />
            <Tooltip
              formatter={(value: number) => formatIndianCurrency(value)}
            />
            <Legend />
            <Bar dataKey="value" fill="#EF4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    )}
  </div>
);

interface ProductChartsProps {
  salesByProductDescription: { name: string; value: number }[];
  salesByItemFamilyGroup: { name: string; value: number }[];
  salesByItemDayPart: { name: string; value: number }[];
}

const ProductCharts: React.FC<ProductChartsProps> = ({
  salesByProductDescription,
  salesByItemFamilyGroup,
  salesByItemDayPart,
}) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-2">
    {salesByProductDescription.length > 0 && (
      <>
        <div className="bg-white p-2 rounded-lg shadow-md lg:col-span-1">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Product-wise Sales Overview (Bar Chart)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              layout="vertical"
              data={salesByProductDescription.slice(0, 10)}
              margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                type="number"
                stroke="#666"
                formatter={(value: number) => formatIndianCurrency(value)}
              />
              <YAxis type="category" dataKey="name" stroke="#666" width={150} />
              <Tooltip
                formatter={(value: number) => formatIndianCurrency(value)}
              />
              <Legend />
              <Bar dataKey="value" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-2 rounded-lg shadow-md lg:col-span-1">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Product-wise Sales Overview (Pie Chart)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={salesByProductDescription}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
              >
                {salesByProductDescription.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => formatIndianCurrency(value)}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </>
    )}
    {salesByItemFamilyGroup.length > 0 && (
      <>
        <div className="bg-white p-2 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Sales by Product Category (Bar Chart)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              layout="vertical"
              data={salesByItemFamilyGroup}
              margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                type="number"
                stroke="#666"
                formatter={(value: number) => formatIndianCurrency(value)}
              />
              <YAxis type="category" dataKey="name" stroke="#666" width={150} />
              <Tooltip
                formatter={(value: number) => formatIndianCurrency(value)}
              />
              <Legend />
              <Bar dataKey="value" fill="#06B6D4" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-2 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Sales by Product Category (Pie Chart)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={salesByItemFamilyGroup}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
              >
                {salesByItemFamilyGroup.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => formatIndianCurrency(value)}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </>
    )}
    {salesByItemDayPart.length > 0 && (
      <>
        <div className="bg-white p-2 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Sales by Day Part (Bar Chart)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              layout="vertical"
              data={salesByItemDayPart}
              margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                type="number"
                stroke="#666"
                formatter={(value: number) => formatIndianCurrency(value)}
              />
              <YAxis type="category" dataKey="name" stroke="#666" width={150} />
              <Tooltip
                formatter={(value: number) => formatIndianCurrency(value)}
              />
              <Legend />
              <Bar dataKey="value" fill="#EC4899" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-2 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Sales by Day Part (Pie Chart)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={salesByItemDayPart}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
              >
                {salesByItemDayPart.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => formatIndianCurrency(value)}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </>
    )}
  </div>
);

interface StoreChartsProps {
  salesBySaleType: { name: string; value: number }[];
  salesByDeliveryChannel: { name: string; value: number }[];
  salesByPod: { name: string; value: number }[];
}

const StoreCharts: React.FC<StoreChartsProps> = ({
  salesBySaleType,
  salesByDeliveryChannel,
  salesByPod,
}) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-2">
    {salesBySaleType.length > 0 && (
      <>
        <div className="bg-white p-2 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Sales by Transaction Type (Bar Chart)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              layout="vertical"
              data={salesBySaleType}
              margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                type="number"
                stroke="#666"
                formatter={(value: number) => formatIndianCurrency(value)}
              />
              <YAxis type="category" dataKey="name" stroke="#666" width={80} />
              <Tooltip
                formatter={(value: number) => formatIndianCurrency(value)}
              />
              <Legend />
              <Bar dataKey="value" fill={COLORS[0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-2 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Sales by Transaction Type (Pie Chart)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={salesBySaleType}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
              >
                {salesBySaleType.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => formatIndianCurrency(value)}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </>
    )}
    {salesByDeliveryChannel.length > 0 && (
      <>
        <div className="bg-white p-2 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Sales by Delivery Method (Bar Chart)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              layout="vertical"
              data={salesByDeliveryChannel}
              margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                type="number"
                stroke="#666"
                formatter={(value: number) => formatIndianCurrency(value)}
              />
              <YAxis type="category" dataKey="name" stroke="#666" width={80} />
              <Tooltip
                formatter={(value: number) => formatIndianCurrency(value)}
              />
              <Legend />
              <Bar dataKey="value" fill={COLORS[1]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-2 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Sales by Delivery Method (Pie Chart)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={salesByDeliveryChannel}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
              >
                {salesByDeliveryChannel.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => formatIndianCurrency(value)}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </>
    )}
    {salesByPod.length > 0 && (
      <>
        <div className="bg-white p-2 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Sales by Payment Method (Bar Chart)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              layout="vertical"
              data={salesByPod}
              margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                type="number"
                stroke="#666"
                formatter={(value: number) => formatIndianCurrency(value)}
              />
              <YAxis type="category" dataKey="name" stroke="#666" width={80} />
              <Tooltip
                formatter={(value: number) => formatIndianCurrency(value)}
              />
              <Legend />
              <Bar dataKey="value" fill={COLORS[2]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-2 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Sales by Payment Method (Pie Chart)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={salesByPod}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
              >
                {salesByPod.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => formatIndianCurrency(value)}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </>
    )}
  </div>
);

interface TransactionsTableProps {
  filteredTransactions: Transaction[];
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({
  filteredTransactions,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTransactions.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h3 className="text-lg font-semibold mb-4 text-gray-700">
        Transactions Detail
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Restaurant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Machine
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Delivery Channel
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                POD
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.map((transaction) => (
              <tr key={transaction.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {transaction.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(transaction.timestamp).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {transaction.restaurantId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {transaction.productName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {transaction.machineId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {transaction.transactionType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {transaction.deliveryChannel}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {transaction.pod}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatIndianCurrency(transaction.amount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {transaction.quantity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-4 flex items-center justify-between">
        <p className="text-sm text-gray-700 sm:mb-0">
          Page {currentPage} of {totalPages}
        </p>
        <nav className="flex space-x-1" aria-label="Pagination">
          <button
            onClick={() => paginate(1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-md text-sm border bg-white text-gray-500 hover:bg-gray-100 disabled:opacity-50"
          >
            First
          </button>
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-md text-sm border bg-white text-gray-500 hover:bg-gray-100 disabled:opacity-50"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((page) =>
              totalPages <= 5
                ? true
                : Math.abs(currentPage - page) <= 1 ||
                  page === 1 ||
                  page === totalPages
            )
            .map((page, index, arr) => {
              const prevPage = arr[index - 1];
              const showEllipsis = prevPage && page - prevPage > 1;
              return (
                <React.Fragment key={page}>
                  {showEllipsis && (
                    <span className="px-2 py-1 text-sm text-gray-400">...</span>
                  )}
                  <button
                    onClick={() => paginate(page)}
                    className={`px-3 py-1 rounded-md text-sm border ${
                      currentPage === page
                        ? "bg-indigo-500 text-white border-indigo-500"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                </React.Fragment>
              );
            })}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-md text-sm border bg-white text-gray-500 hover:bg-gray-100 disabled:opacity-50"
          >
            Next
          </button>
          <button
            onClick={() => paginate(totalPages)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-md text-sm border bg-white text-gray-500 hover:bg-gray-100 disabled:opacity-50"
          >
            Last
          </button>
        </nav>
      </div>
    </div>
  );
};

interface ProductFilterProps {
  products: FilterOption[]; // Now expects flat list of products
  selectedProductHierarchy: {
    subcategory_1: string;
    reporting_2: string;
    piecategory_3: string;
    reporting_id_4: string;
    productName: string;
  };
  onSelectProductHierarchy: (
    hierarchy: React.SetStateAction<{
      subcategory_1: string;
      reporting_2: string;
      piecategory_3: string;
      reporting_id_4: string;
      productName: string;
    }>
  ) => void;
}

const ProductFilter: React.FC<ProductFilterProps> = ({
  products,
  selectedProductHierarchy,
  onSelectProductHierarchy,
}) => {
  const {
    subcategory_1,
    reporting_2,
    piecategory_3,
    reporting_id_4,
    productName,
  } = selectedProductHierarchy;

  const handleSelectChange = useCallback(
    (level: string, value: string) => {
      let newHierarchy = { ...selectedProductHierarchy };

      if (level === "subcategory_1") {
        newHierarchy = {
          subcategory_1: value,
          reporting_2: "all",
          piecategory_3: "all",
          reporting_id_4: "all",
          productName: "all",
        };
      } else if (level === "reporting_2") {
        newHierarchy = {
          ...newHierarchy,
          reporting_2: value,
          piecategory_3: "all",
          reporting_id_4: "all",
          productName: "all",
        };
      } else if (level === "piecategory_3") {
        newHierarchy = {
          ...newHierarchy,
          piecategory_3: value,
          reporting_id_4: "all",
          productName: "all",
        };
      } else if (level === "reporting_id_4") {
        newHierarchy = {
          ...newHierarchy,
          reporting_id_4: value,
          productName: "all",
        };
      } else if (level === "productName") {
        newHierarchy = {
          ...newHierarchy,
          productName: value,
        };
      }
      onSelectProductHierarchy(newHierarchy);
    },
    [onSelectProductHierarchy, selectedProductHierarchy]
  );

  const subcategoryOptions = useMemo(() => {
    const unique = [...new Set(products.map((p) => p.subcategory_1))];
    return ["all", ...unique.filter((subcat) => subcat != null)];
  }, [products]);

  const reporting2Options = useMemo(() => {
    const filteredProducts =
      subcategory_1 === "all"
        ? products
        : products.filter((p) => p.subcategory_1 === subcategory_1);
    const unique = [...new Set(filteredProducts.map((p) => p.reporting_2))];
    return ["all", ...unique.filter((opt) => opt != null)];
  }, [products, subcategory_1]);

  const piecategory3Options = useMemo(() => {
    let filteredProducts = products;
    if (subcategory_1 !== "all")
      filteredProducts = filteredProducts.filter(
        (p) => p.subcategory_1 === subcategory_1
      );
    if (reporting_2 !== "all")
      filteredProducts = filteredProducts.filter(
        (p) => p.reporting_2 === reporting_2
      );
    const unique = [...new Set(filteredProducts.map((p) => p.piecategory_3))];
    return ["all", ...unique.filter((opt) => opt != null)];
  }, [products, subcategory_1, reporting_2]);

  const reportingId4Options = useMemo(() => {
    let filteredProducts = products;
    if (subcategory_1 !== "all")
      filteredProducts = filteredProducts.filter(
        (p) => p.subcategory_1 === subcategory_1
      );
    if (reporting_2 !== "all")
      filteredProducts = filteredProducts.filter(
        (p) => p.reporting_2 === reporting_2
      );
    if (piecategory_3 !== "all")
      filteredProducts = filteredProducts.filter(
        (p) => p.piecategory_3 === piecategory_3
      );
    const unique = [...new Set(filteredProducts.map((p) => p.reporting_id_4))];
    return ["all", ...unique.filter((opt) => opt != null)];
  }, [products, subcategory_1, reporting_2, piecategory_3]);

  const productNameOptions = useMemo(() => {
    let filteredProducts = products;
    if (subcategory_1 !== "all")
      filteredProducts = filteredProducts.filter(
        (p) => p.subcategory_1 === subcategory_1
      );
    if (reporting_2 !== "all")
      filteredProducts = filteredProducts.filter(
        (p) => p.reporting_2 === reporting_2
      );
    if (piecategory_3 !== "all")
      filteredProducts = filteredProducts.filter(
        (p) => p.piecategory_3 === piecategory_3
      );
    if (reporting_id_4 !== "all")
      filteredProducts = filteredProducts.filter(
        (p) => p.reporting_id_4 === reporting_id_4
      );
    // Ensure that the 'id' for productName is 'productid' from the backend
    return [
      { id: "all", name: "All Products" },
      ...filteredProducts.map((p) => ({ id: p.id, name: p.name })),
    ];
  }, [products, subcategory_1, reporting_2, piecategory_3, reporting_id_4]);

  return (
    <div className="bg-white p-2 rounded-lg shadow-md mb-1">
      <h3 className="text-lg font-semibold mb-2">Product Filter</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div>
          <label
            htmlFor="subcategory_1"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Subcategory 1
          </label>
          <select
            id="subcategory_1"
            value={subcategory_1}
            onChange={(e) =>
              handleSelectChange("subcategory_1", e.target.value)
            }
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md appearance-none bg-white border"
          >
            {subcategoryOptions.map((option) => (
              <option key={option} value={option}>
                {option === "all" ? "All Subcategories" : option}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="reporting_2"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Reporting 2
          </label>
          <select
            id="reporting_2"
            value={reporting_2}
            onChange={(e) => handleSelectChange("reporting_2", e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md appearance-none bg-white border"
            disabled={subcategory_1 === "all"}
          >
            {reporting2Options.map((option) => (
              <option key={option} value={option}>
                {option === "all" ? "All Reporting 2" : option}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="piecategory_3"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Piecategory 3
          </label>
          <select
            id="piecategory_3"
            value={piecategory_3}
            onChange={(e) =>
              handleSelectChange("piecategory_3", e.target.value)
            }
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md appearance-none bg-white border"
            disabled={reporting_2 === "all"}
          >
            {piecategory3Options.map((option) => (
              <option key={option} value={option}>
                {option === "all" ? "All Piecategory 3" : option}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="reporting_id_4"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Reporting ID 4
          </label>
          <select
            id="reporting_id_4"
            value={reporting_id_4}
            onChange={(e) =>
              handleSelectChange("reporting_id_4", e.target.value)
            }
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md appearance-none bg-white border"
            disabled={piecategory_3 === "all"}
          >
            {reportingId4Options.map((option) => (
              <option key={option} value={option}>
                {option === "all" ? "All Reporting ID 4" : option}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="productName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Product Name
          </label>
          <select
            id="productName"
            value={productName}
            onChange={(e) => handleSelectChange("productName", e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md appearance-none bg-white border"
            disabled={reporting_id_4 === "all"}
          >
            {productNameOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("last3Months");
  const [selectedRestaurant, setSelectedRestaurant] = useState("all");
  const [selectedMachine, setSelectedMachine] = useState("all");
  const [selectedTransactionType, setSelectedTransactionType] = useState("all");
  const [selectedDeliveryChannel, setSelectedDeliveryChannel] = useState("all");
  const [selectedPod, setSelectedPod] = useState("all");
  const [currentView, setCurrentView] = useState("sales");

  const [restaurants, setRestaurants] = useState<FilterOption[]>([]);
  const [allProductsFlat, setAllProductsFlat] = useState<FilterOption[]>([]); // Renamed from 'products'
  const [machines, setMachines] = useState<FilterOption[]>([]);
  const [transactionTypes, setTransactionTypes] = useState<string[]>([]);
  const [deliveryChannels, setDeliveryChannels] = useState<string[]>([]);
  const [pods, setPods] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [summaryData, setSummaryData] = useState({
    totalSales: 0,
    totalOrders: 0,
    avgOrderValue: 0,
    totalInvoices: 0,
  });
  const [dailySalesData, setDailySalesData] = useState<
    { name: string; sales: number }[]
  >([]);
  const [hourlySalesData, setHourlySalesData] = useState<
    { name: string; sales: number }[]
  >([]);
  const [salesByRestaurantData, setSalesByRestaurantData] = useState<
    { name: string; value: number }[]
  >([]);
  const [salesByProductData, setSalesByProductData] = useState<
    { name: string; value: number }[]
  >([]);
  const [salesByProductDescriptionData, setSalesByProductDescriptionData] =
    useState<{ name: string; value: number }[]>([]);
  const [salesByItemFamilyGroupData, setSalesByItemFamilyGroupData] = useState<
    { name: string; value: number }[]
  >([]);
  const [salesByItemDayPartData, setSalesByItemDayPartData] = useState<
    { name: string; value: number }[]
  >([]);
  const [salesBySaleTypeData, setSalesBySaleTypeData] = useState<
    { name: string; value: number }[]
  >([]);
  const [salesByDeliveryChannelData, setSalesByDeliveryChannelData] = useState<
    { name: string; value: number }[]
  >([]);
  const [salesByPodData, setSalesByPodData] = useState<
    { name: string; value: number }[]
  >([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);

  const [selectedProductHierarchy, setSelectedProductHierarchy] = useState({
    subcategory_1: "all",
    reporting_2: "all",
    piecategory_3: "all",
    reporting_id_4: "all",
    productName: "all",
  });

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/mock-data`);
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setRestaurants(data.restaurants);
        setAllProductsFlat(data.allProductsFlat); // Use allProductsFlat
        setMachines(data.machines);
        setTransactionTypes(data.transactionTypes);
        setDeliveryChannels(data.deliveryChannels);
        setPods(data.pods);
      } catch (err: any) {
        console.error("Failed to fetch filter options:", err);
        setError("Failed to load filter options. " + err.message);
      }
    };
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    const fetchAllDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const commonParams: { [key: string]: string } = {
          timePeriod: selectedTimePeriod,
          restaurantId: selectedRestaurant,
          machineId: selectedMachine,
          transactionType: selectedTransactionType,
          deliveryChannel: selectedDeliveryChannel,
          pod: selectedPod,
        };

        // Construct product filter based on the deepest selected hierarchy level
        let productFilterParam: { type: string; value: string } | null = null;
        if (selectedProductHierarchy.productName !== "all") {
          productFilterParam = {
            type: "productid", // Corresponds to productid in product_master
            value: selectedProductHierarchy.productName,
          };
        } else if (selectedProductHierarchy.reporting_id_4 !== "all") {
          productFilterParam = {
            type: "reporting_id_4",
            value: selectedProductHierarchy.reporting_id_4,
          };
        } else if (selectedProductHierarchy.piecategory_3 !== "all") {
          productFilterParam = {
            type: "piecategory_3",
            value: selectedProductHierarchy.piecategory_3,
          };
        } else if (selectedProductHierarchy.reporting_2 !== "all") {
          productFilterParam = {
            type: "reporting_2",
            value: selectedProductHierarchy.reporting_2,
          };
        } else if (selectedProductHierarchy.subcategory_1 !== "all") {
          productFilterParam = {
            type: "subcategory_1",
            value: selectedProductHierarchy.subcategory_1,
          };
        }

        if (productFilterParam) {
          commonParams.product = JSON.stringify(productFilterParam); // Stringify the object
        }

        const queryString = new URLSearchParams(commonParams).toString();

        const summaryResponse = await fetch(
          `${API_BASE_URL}/sales/summary?${queryString}`
        );
        if (!summaryResponse.ok)
          throw new Error(`Summary fetch failed: ${summaryResponse.status}`);
        const summary = await summaryResponse.json();
        setSummaryData(summary);

        if (currentView === "sales") {
          const dailyResponse = await fetch(
            `${API_BASE_URL}/sales/daily-trend?${queryString}`
          );
          if (!dailyResponse.ok)
            throw new Error(
              `Daily sales fetch failed: ${dailyResponse.status}`
            );
          setDailySalesData(await dailyResponse.json());

          const hourlyResponse = await fetch(
            `${API_BASE_URL}/sales/hourly-trend?${queryString}`
          );
          if (!hourlyResponse.ok)
            throw new Error(
              `Hourly sales fetch failed: ${hourlyResponse.status}`
            );
          setHourlySalesData(await hourlyResponse.json());

          if (selectedRestaurant === "all") {
            // For sales by restaurant, remove restaurantId from params if 'all'
            const { restaurantId, ...paramsForRestaurantChart } = commonParams;
            const byRestaurantResponse = await fetch(
              `${API_BASE_URL}/sales/by-restaurant?${new URLSearchParams(
                paramsForRestaurantChart
              ).toString()}`
            );
            if (!byRestaurantResponse.ok)
              throw new Error(
                `Sales by restaurant fetch failed: ${byRestaurantResponse.status}`
              );
            setSalesByRestaurantData(await byRestaurantResponse.json());
          } else {
            setSalesByRestaurantData([]);
          }

          const byProductResponse = await fetch(
            `${API_BASE_URL}/sales/by-product?${queryString}`
          );
          if (!byProductResponse.ok)
            throw new Error(
              `Sales by product fetch failed: ${byProductResponse.status}`
            );
          setSalesByProductData(await byProductResponse.json());

          // Clear product-specific and store-specific data when in sales view
          setSalesByProductDescriptionData([]);
          setSalesByItemFamilyGroupData([]);
          setSalesByItemDayPartData([]);
          setSalesBySaleTypeData([]);
          setSalesByDeliveryChannelData([]);
          setSalesByPodData([]);
        } else if (currentView === "product") {
          const byProductDescriptionResponse = await fetch(
            `${API_BASE_URL}/product/by-description?${queryString}`
          );
          if (!byProductDescriptionResponse.ok)
            throw new Error(
              `Sales by product description fetch failed: ${byProductDescriptionResponse.status}`
            );
          setSalesByProductDescriptionData(
            await byProductDescriptionResponse.json()
          );

          const byFamilyGroupResponse = await fetch(
            `${API_BASE_URL}/product/by-family-group?${queryString}`
          );
          if (!byFamilyGroupResponse.ok)
            throw new Error(
              `Sales by item family group fetch failed: ${byFamilyGroupResponse.status}`
            );
          setSalesByItemFamilyGroupData(await byFamilyGroupResponse.json());

          const byDayPartResponse = await fetch(
            `${API_BASE_URL}/product/by-day-part?${queryString}`
          );
          if (!byDayPartResponse.ok)
            throw new Error(
              `Sales by item day part fetch failed: ${byDayPartResponse.status}`
            );
          setSalesByItemDayPartData(await byDayPartResponse.json());

          // Clear sales-specific and store-specific data when in product view
          setDailySalesData([]);
          setHourlySalesData([]);
          setSalesByRestaurantData([]);
          setSalesByProductData([]);
          setSalesBySaleTypeData([]);
          setSalesByDeliveryChannelData([]);
          setSalesByPodData([]);
        } else if (currentView === "store") {
          const bySaleTypeResponse = await fetch(
            `${API_BASE_URL}/sales/by-sale-type?${queryString}`
          );
          if (!bySaleTypeResponse.ok)
            throw new Error(
              `Sales by sale type fetch failed: ${bySaleTypeResponse.status}`
            );
          setSalesBySaleTypeData(await bySaleTypeResponse.json());

          const byDeliveryChannelResponse = await fetch(
            `${API_BASE_URL}/sales/by-delivery-channel?${queryString}`
          );
          if (!byDeliveryChannelResponse.ok)
            throw new Error(
              `Sales by delivery channel fetch failed: ${byDeliveryChannelResponse.status}`
            );
          setSalesByDeliveryChannelData(await byDeliveryChannelResponse.json());

          const byPodResponse = await fetch(
            `${API_BASE_URL}/sales/by-pod?${queryString}`
          );
          if (!byPodResponse.ok)
            throw new Error(
              `Sales by POD fetch failed: ${byPodResponse.status}`
            );
          setSalesByPodData(await byPodResponse.json());

          // Clear sales-specific and product-specific data when in store view
          setDailySalesData([]);
          setHourlySalesData([]);
          setSalesByRestaurantData([]);
          setSalesByProductData([]);
          setSalesByProductDescriptionData([]);
          setSalesByItemFamilyGroupData([]);
          setSalesByItemDayPartData([]);
        }

        const transactionsResponse = await fetch(
          `${API_BASE_URL}/sales?${queryString}`
        );
        if (!transactionsResponse.ok)
          throw new Error(
            `Transactions fetch failed: ${transactionsResponse.status}`
          );
        setFilteredTransactions(await transactionsResponse.json());
      } catch (err: any) {
        console.error("Failed to fetch dashboard data:", err);
        setError(
          "Failed to load data. Please ensure the backend server is running and configured correctly. Error: " +
            err.message
        );
        setSummaryData({
          totalSales: 0,
          totalOrders: 0,
          avgOrderValue: 0,
          totalInvoices: 0,
        });
        setDailySalesData([]);
        setHourlySalesData([]);
        setSalesByRestaurantData([]);
        setSalesByProductData([]);
        setSalesByProductDescriptionData([]);
        setSalesByItemFamilyGroupData([]);
        setSalesByItemDayPartData([]);
        setSalesBySaleTypeData([]);
        setSalesByDeliveryChannelData([]);
        setSalesByPodData([]);
        setFilteredTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllDashboardData();
  }, [
    selectedTimePeriod,
    selectedRestaurant,
    selectedMachine,
    selectedTransactionType,
    selectedDeliveryChannel,
    selectedPod,
    currentView,
    selectedProductHierarchy, // Include the new hierarchy state here
  ]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Restaurant Analytics Dashboard
        </h1>
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              currentView === "sales"
                ? "bg-indigo-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setCurrentView("sales")}
          >
            <BarChart2 className="inline-block mr-2" size={18} /> Sales Overview
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              currentView === "product"
                ? "bg-indigo-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setCurrentView("product")}
          >
            <Coffee className="inline-block mr-2" size={18} /> Product Insights
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              currentView === "store"
                ? "bg-indigo-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setCurrentView("store")}
          >
            <Store className="inline-block mr-2" size={18} /> Store Performance
          </button>
        </div>
      </header>

      <main className="flex-1 p-2 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-2">
          <div>
            <label
              htmlFor="timePeriod"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Time Period
            </label>
            <div className="relative">
              <select
                id="timePeriod"
                value={selectedTimePeriod}
                onChange={(e) => setSelectedTimePeriod(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md appearance-none bg-white border"
              >
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="last7days">Last 7 Days</option>
                <option value="last30days">Last 30 Days</option>
                <option value="thisMonth">This Month</option>
                <option value="last3Months">Last 3 Months</option>
                <option value="last6Months">Last 6 Months</option>
                <option value="thisYear">This Year</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <Calendar className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="restaurant"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Restaurant
            </label>
            <div className="relative">
              <select
                id="restaurant"
                value={selectedRestaurant}
                onChange={(e) => setSelectedRestaurant(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md appearance-none bg-white border"
              >
                <option value="all">All Restaurants</option>
                {restaurants.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <MapPin className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Removed the simple "Product" dropdown, now using ProductFilter */}

          <div>
            <label
              htmlFor="machine"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Machine
            </label>
            <div className="relative">
              <select
                id="machine"
                value={selectedMachine}
                onChange={(e) => setSelectedMachine(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md appearance-none bg-white border"
              >
                <option value="all">All Machines</option>
                {machines.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <HardDrive className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="transactionType"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Transaction Type
            </label>
            <div className="relative">
              <select
                id="transactionType"
                value={selectedTransactionType}
                onChange={(e) => setSelectedTransactionType(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md appearance-none bg-white border"
              >
                <option value="all">All Types</option>
                {transactionTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <Tag className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="deliveryChannel"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Delivery Channel
            </label>
            <div className="relative">
              <select
                id="deliveryChannel"
                value={selectedDeliveryChannel}
                onChange={(e) => setSelectedDeliveryChannel(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md appearance-none bg-white border"
              >
                <option value="all">All Channels</option>
                {deliveryChannels.map((channel) => (
                  <option key={channel} value={channel}>
                    {channel}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <Truck className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="pod"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              POD
            </label>
            <div className="relative">
              <select
                id="pod"
                value={selectedPod}
                onChange={(e) => setSelectedPod(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md appearance-none bg-white border"
              >
                <option value="all">All PODs</option>
                {pods.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <Tag className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>

        <ProductFilter
          products={allProductsFlat}
          selectedProductHierarchy={selectedProductHierarchy}
          onSelectProductHierarchy={setSelectedProductHierarchy}
        />

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <>
            <SummaryCards
              totalSales={summaryData.totalSales}
              totalOrders={summaryData.totalOrders}
              avgOrderValue={summaryData.avgOrderValue}
              totalInvoices={summaryData.totalInvoices}
              selectedTimePeriod={selectedTimePeriod}
            />

            {currentView === "sales" && (
              <>
                <SalesCharts
                  dailySales={dailySalesData}
                  hourlySales={hourlySalesData}
                  salesByRestaurant={salesByRestaurantData}
                  salesByProduct={salesByProductData}
                  selectedRestaurant={selectedRestaurant}
                />
                <TransactionsTable
                  filteredTransactions={filteredTransactions}
                />
              </>
            )}

            {currentView === "product" && (
              <ProductCharts
                salesByProductDescription={salesByProductDescriptionData}
                salesByItemFamilyGroup={salesByItemFamilyGroupData}
                salesByItemDayPart={salesByItemDayPartData}
              />
            )}

            {currentView === "store" && (
              <StoreCharts
                salesBySaleType={salesBySaleTypeData}
                salesByDeliveryChannel={salesByDeliveryChannelData}
                salesByPod={salesByPodData}
              />
            )}
          </>
        )}

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 px-6 py-4 mt-auto">
          <div className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Restaurant Analytics Dashboard. All
            rights reserved.
          </div>
        </footer>
      </main>
    </div>
  );
}
