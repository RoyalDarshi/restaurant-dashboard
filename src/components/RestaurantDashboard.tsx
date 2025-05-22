import { useState, useEffect, useMemo } from "react";
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
} from "lucide-react";

// Backend API URL
const API_BASE_URL = "http://localhost:3001/api"; // Ensure this matches your backend port

// Updated COLORS for a more modern and vibrant look
const COLORS = [
  "#6366F1", // Indigo-500
  "#10B981", // Emerald-500
  "#F59E0B", // Amber-500
  "#EF4444", // Red-500
  "#8B5CF6", // Violet-500
  "#06B6D4", // Cyan-500
  "#EC4899", // Pink-500
  "#A8A29E", // Stone-500
];

// Helper to get date string in YYYY-MM-DD format
const getDateString = (timestamp: number) => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Type definitions for data
interface Transaction {
  id: string;
  restaurantId: string;
  productId: string;
  productName: string;
  machineId: string;
  transactionType: string;
  timestamp: number;
  amount: number;
  quantity: number;
  itemFamilyGroup?: string; // Optional, as it's new
  itemDayPart?: string; // Optional, as it's new
}

interface MockDataOptions {
  restaurants: string[];
  products: { item_code: string; item_description: string }[];
  machines: string[];
  transactionTypes: string[];
  itemFamilyGroups?: string[]; // Optional, as it's new
  itemDayParts?: string[]; // Optional, as it's new
}

// Helper to format numbers as currency
const formatCurrency = (value: number) => `₹${value.toFixed(2)}`;

// SummaryCards Component
interface SummaryCardsProps {
  totalSales: number;
  totalOrders: number;
  avgOrderValue: number;
  avgSalesPerMachine: number;
  selectedTimePeriod: string;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({
  totalSales,
  totalOrders,
  avgOrderValue,
  avgSalesPerMachine,
  selectedTimePeriod,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
    <div className="bg-white rounded-xl shadow-lg p-6 flex items-center justify-between transition-transform duration-200 hover:scale-[1.02]">
      <div>
        <h3 className="text-lg font-semibold text-gray-700">Total Sales</h3>
        <p className="text-4xl font-bold text-indigo-600 mt-2">
          {formatCurrency(totalSales)}
        </p>
        <p className="text-sm text-gray-500 mt-1">For {selectedTimePeriod}</p>
      </div>
      <TrendingUp className="h-10 w-10 text-indigo-400 opacity-75" />
    </div>
    <div className="bg-white rounded-xl shadow-lg p-6 flex items-center justify-between transition-transform duration-200 hover:scale-[1.02]">
      <div>
        <h3 className="text-lg font-semibold text-gray-700">Total Orders</h3>
        <p className="text-4xl font-bold text-emerald-600 mt-2">
          {totalOrders}
        </p>
        <p className="text-sm text-gray-500 mt-1">For {selectedTimePeriod}</p>
      </div>
      <BarChart2 className="h-10 w-10 text-emerald-400 opacity-75" />
    </div>
    <div className="bg-white rounded-xl shadow-lg p-6 flex items-center justify-between transition-transform duration-200 hover:scale-[1.02]">
      <div>
        <h3 className="text-lg font-semibold text-gray-700">Avg Order Value</h3>
        <p className="text-4xl font-bold text-purple-600 mt-2">
          {formatCurrency(avgOrderValue)}
        </p>
        <p className="text-sm text-gray-500 mt-1">For {selectedTimePeriod}</p>
      </div>
      <PieChartIcon className="h-10 w-10 text-purple-400 opacity-75" />
    </div>
    <div className="bg-white rounded-xl shadow-lg p-6 flex items-center justify-between transition-transform duration-200 hover:scale-[1.02]">
      <div>
        <h3 className="text-lg font-semibold text-gray-700">
          Avg Sales / Machine
        </h3>
        <p className="text-4xl font-bold text-blue-600 mt-2">
          {formatCurrency(avgSalesPerMachine)}
        </p>
        <p className="text-sm text-gray-500 mt-1">For {selectedTimePeriod}</p>
      </div>
      <HardDrive className="h-10 w-10 text-blue-400 opacity-75" />
    </div>
  </div>
);

// SalesCharts Component
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
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
    {/* Daily Sales Trend */}
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <LineChart className="mr-2 h-6 w-6 text-indigo-500" /> Daily Sales Trend
      </h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dailySales}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis
              dataKey="name"
              angle={-15}
              textAnchor="end"
              height={40}
              stroke="#555"
            />
            <YAxis tickFormatter={formatCurrency} stroke="#555" />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              labelFormatter={(label: string) => `Date: ${label}`}
              wrapperStyle={{
                borderRadius: "8px",
                boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="sales"
              name="Sales"
              stroke={COLORS[0]}
              strokeWidth={3}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>

    {/* Hourly Sales */}
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <Clock className="mr-2 h-6 w-6 text-emerald-500" /> Hourly Sales
      </h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={hourlySales}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis
              dataKey="name"
              angle={-15}
              textAnchor="end"
              height={40}
              stroke="#555"
            />
            <YAxis tickFormatter={formatCurrency} stroke="#555" />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              labelFormatter={(label: string) => `Hour: ${label}`}
              wrapperStyle={{
                borderRadius: "8px",
                boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
              }}
            />
            <Legend />
            <Bar dataKey="sales" name="Sales" fill={COLORS[1]} barSize={25} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>

    {/* Sales by Restaurant (Pie Chart) */}
    {selectedRestaurant === "all" && (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <PieChartIcon className="mr-2 h-6 w-6 text-amber-500" /> Sales by
          Restaurant
        </h3>
        <div className="h-72 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={salesByRestaurant}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  percent > 0 ? `${name}: ${(percent * 100).toFixed(1)}%` : ""
                }
                outerRadius={100}
                dataKey="value"
              >
                {salesByRestaurant.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke={COLORS[index % COLORS.length]}
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    )}

    {/* Sales by Product (Top 5) */}
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <Coffee className="mr-2 h-6 w-6 text-red-500" /> Top Products by Sales
      </h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={salesByProduct.slice(0, 5)} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis type="number" tickFormatter={formatCurrency} stroke="#555" />
            <YAxis
              type="category"
              dataKey="name" // Use 'name' which holds product_description
              width={100}
              stroke="#555"
            />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              wrapperStyle={{
                borderRadius: "8px",
                boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
              }}
            />
            <Legend />
            <Bar dataKey="value" name="Sales" fill={COLORS[3]} barSize={25} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>

    {/* Area Map Placeholder */}
    <div className="bg-white rounded-xl shadow-lg p-6 lg:col-span-2">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <MapPin className="mr-2 h-6 w-6 text-blue-500" /> Restaurant Locations /
        Sales Distribution
      </h3>
      <div className="h-96 bg-gray-50 border border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-lg">
        <p>
          Placeholder for Area Map (e.g., showing sales distribution by region)
        </p>
      </div>
    </div>
  </div>
);

// TransactionsTable Component
interface TransactionsTableProps {
  filteredTransactions: Transaction[];
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({
  filteredTransactions,
}) => (
  <div className="p-6">
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <h3 className="text-xl font-semibold text-gray-800 p-6 border-b border-gray-200">
        All Transactions
      </h3>
      <div className="overflow-x-auto">
        <div className="max-h-96 overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Restaurant
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Machine
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="hover:bg-gray-50 transition-colors duration-150 ease-in-out"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600">
                    {transaction.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.restaurantId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.productName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.machineId || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.transactionType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(transaction.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    {formatCurrency(transaction.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {filteredTransactions.length === 0 && (
        <div className="p-6 text-center text-gray-500 text-base">
          No transactions found with the current filters.
        </div>
      )}
    </div>
  </div>
);

// ProductCharts Component
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
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
    {/* Sales by Product Description - Bar Chart */}
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <Coffee className="mr-2 h-6 w-6 text-red-500" /> Sales by Product
        Description (Bar)
      </h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={salesByProductDescription}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis
              dataKey="name"
              angle={-15}
              textAnchor="end"
              height={40}
              interval={0} // Ensure all labels are shown
              stroke="#555"
            />
            <YAxis tickFormatter={formatCurrency} stroke="#555" />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              wrapperStyle={{
                borderRadius: "8px",
                boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
              }}
            />
            <Legend />
            <Bar dataKey="value" name="Sales" fill={COLORS[3]} barSize={25} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>

    {/* Sales by Product Description - Pie Chart */}
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <PieChartIcon className="mr-2 h-6 w-6 text-pink-500" /> Sales by Product
        Description (Pie)
      </h3>
      <div className="h-72 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={salesByProductDescription}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                percent > 0 ? `${name}: ${(percent * 100).toFixed(1)}%` : ""
              }
              outerRadius={100}
              dataKey="value"
            >
              {salesByProductDescription.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  stroke={COLORS[index % COLORS.length]}
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>

    {/* Sales by Item Family Group - Bar Chart */}
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <Utensils className="mr-2 h-6 w-6 text-violet-500" /> Sales by Item
        Family Group (Bar)
      </h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={salesByItemFamilyGroup}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis
              dataKey="name"
              angle={-15}
              textAnchor="end"
              height={40}
              interval={0}
              stroke="#555"
            />
            <YAxis tickFormatter={formatCurrency} stroke="#555" />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              wrapperStyle={{
                borderRadius: "8px",
                boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
              }}
            />
            <Legend />
            <Bar dataKey="value" name="Sales" fill={COLORS[4]} barSize={25} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>

    {/* Sales by Item Family Group - Pie Chart */}
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <PieChartIcon className="mr-2 h-6 w-6 text-cyan-500" /> Sales by Item
        Family Group (Pie)
      </h3>
      <div className="h-72 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={salesByItemFamilyGroup}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                percent > 0 ? `${name}: ${(percent * 100).toFixed(1)}%` : ""
              }
              outerRadius={100}
              dataKey="value"
            >
              {salesByItemFamilyGroup.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  stroke={COLORS[index % COLORS.length]}
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>

    {/* Sales by Item Day Part - Bar Chart */}
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <Clock className="mr-2 h-6 w-6 text-emerald-500" /> Sales by Item Day
        Part (Bar)
      </h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={salesByItemDayPart}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis
              dataKey="name"
              angle={-15}
              textAnchor="end"
              height={40}
              interval={0}
              stroke="#555"
            />
            <YAxis tickFormatter={formatCurrency} stroke="#555" />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              wrapperStyle={{
                borderRadius: "8px",
                boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
              }}
            />
            <Legend />
            <Bar dataKey="value" name="Sales" fill={COLORS[1]} barSize={25} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>

    {/* Sales by Item Day Part - Pie Chart */}
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <PieChartIcon className="mr-2 h-6 w-6 text-indigo-500" /> Sales by Item
        Day Part (Pie)
      </h3>
      <div className="h-72 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={salesByItemDayPart}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                percent > 0 ? `${name}: ${(percent * 100).toFixed(1)}%` : ""
              }
              outerRadius={100}
              dataKey="value"
            >
              {salesByItemDayPart.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  stroke={COLORS[index % COLORS.length]}
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);

export default function App() {
  const [currentView, setCurrentView] = useState("sales"); // 'sales' or 'product'
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("today");
  const [selectedRestaurant, setSelectedRestaurant] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState("all"); // Stores item_code
  const [selectedMachine, setSelectedMachine] = useState("all");
  const [selectedTransactionType, setSelectedTransactionType] = useState("all");
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);
  const [mockDataOptions, setMockDataOptions] = useState<MockDataOptions>({
    restaurants: [],
    products: [], // Now an array of { item_code, item_description }
    machines: [],
    transactionTypes: [],
    itemFamilyGroups: [], // Initialize new options
    itemDayParts: [], // Initialize new options
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch mock data options on component mount
  useEffect(() => {
    const fetchMockOptions = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/mock-data`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: MockDataOptions = await response.json();
        setMockDataOptions({
          restaurants: data.restaurants,
          products: data.products,
          machines: data.machines,
          transactionTypes: data.transactionTypes,
          itemFamilyGroups: data.itemFamilyGroups || [],
          itemDayParts: data.itemDayParts || [],
        });
      } catch (err: any) {
        console.error("Failed to fetch mock data options:", err);
        setError("Failed to load filter options: " + err.message);
      }
    };
    fetchMockOptions();
  }, []); // Run once on mount

  // Fetch filtered transactions from backend
  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          timePeriod: selectedTimePeriod,
          restaurantId: selectedRestaurant,
          productId: selectedProduct, // Send item_code for filtering
          machineId: selectedMachine,
          transactionType: selectedTransactionType,
        }).toString();

        const response = await fetch(`${API_BASE_URL}/sales?${params}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Transaction[] = await response.json();
        setFilteredTransactions(data);
        console.log("Fetched and Filtered Transactions:", data); // DEBUG LOG
      } catch (err: any) {
        console.error("Failed to fetch transactions:", err);
        setError(
          "Failed to load data. Please ensure the backend server is running and configured correctly, and that your database contains data for the selected filters. Error: " +
            err.message
        );
        setFilteredTransactions([]); // Clear data on error
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [
    selectedTimePeriod,
    selectedRestaurant,
    selectedProduct, // Dependency for re-fetching when product filter changes
    selectedMachine,
    selectedTransactionType,
  ]);

  // Calculate sales by restaurant for pie chart
  const salesByRestaurant = useMemo(() => {
    return selectedRestaurant === "all"
      ? mockDataOptions.restaurants.map((restaurant) => {
          const sales = filteredTransactions
            .filter((tx) => tx.restaurantId === restaurant)
            .reduce((total, tx) => total + tx.amount, 0);
          return { name: restaurant, value: sales };
        })
      : [];
  }, [filteredTransactions, selectedRestaurant, mockDataOptions.restaurants]);

  // Calculate sales by product (using productName for display)
  const salesByProduct = useMemo(() => {
    return mockDataOptions.products
      .map((productOption) => {
        // Iterate over the full list of products from options
        const sales = filteredTransactions
          .filter((tx) => tx.productId === productOption.item_code) // Filter by item_code
          .reduce((total, tx) => total + tx.amount, 0);
        return { name: productOption.item_description, value: sales }; // Display item_description
      })
      .sort((a, b) => b.value - a.value);
  }, [filteredTransactions, mockDataOptions.products]);

  // Calculate hourly sales
  const hourlySales = useMemo(() => {
    return Array.from({ length: 14 }, (_, i) => {
      const hour = i + 8;
      const hourStart = hour;
      const hourEnd = hour + 1;
      const hourFormatted = `${hourStart % 12 || 12}${
        hourStart < 12 ? "am" : "pm"
      }-${hourEnd % 12 || 12}${hourEnd < 12 ? "am" : "pm"}`;
      const sales = filteredTransactions
        .filter((tx) => new Date(tx.timestamp).getHours() === hour)
        .reduce((total, tx) => total + tx.amount, 0);
      return { name: hourFormatted, sales };
    });
  }, [filteredTransactions]);

  // Calculate daily sales based on selected time period
  const dailySales = useMemo(() => {
    const getDateRange = () => {
      const now = new Date();
      let start: Date;
      let end = new Date(now); // Initialize end with a copy of now

      switch (selectedTimePeriod) {
        case "today":
          start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          end = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case "yesterday":
          start = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() - 1
          );
          end = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
          break;
        case "last7days":
          start = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() - 6
          );
          break;
        case "thisMonth":
          start = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case "last3Months":
          start = new Date(now.getFullYear(), now.getMonth() - 2, 1);
          break;
        case "last6Months":
          start = new Date(now.getFullYear(), now.getMonth() - 5, 1);
          break;
        case "thisYear":
          start = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          start = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() - 29
          ); // Default to last 30 days if no period
      }
      return { start, end };
    };

    const dailySalesMap: { [key: string]: number } = {};
    filteredTransactions.forEach((tx) => {
      const dateStr = getDateString(tx.timestamp);
      if (!dailySalesMap[dateStr]) dailySalesMap[dateStr] = 0;
      dailySalesMap[dateStr] += tx.amount;
    });

    const { start, end } = getDateRange();
    const days = [];
    const currentDate = new Date(start);
    while (currentDate.getTime() <= end.getTime()) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days.map((day) => {
      const dateStr = getDateString(day.getTime());
      const sales = dailySalesMap[dateStr] || 0;
      return {
        name: day.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        sales,
      };
    });
  }, [filteredTransactions, selectedTimePeriod]);

  // Calculate summary metrics
  const totalSales = useMemo(() => {
    return filteredTransactions.reduce((sum, tx) => sum + tx.amount, 0);
  }, [filteredTransactions]);

  const totalOrders = useMemo(() => {
    return filteredTransactions.length;
  }, [filteredTransactions]);

  const avgOrderValue = useMemo(() => {
    return totalOrders > 0 ? totalSales / totalOrders : 0;
  }, [totalSales, totalOrders]);

  // Calculate Average Sales per Machine (only considering 'Machine' transactions)
  const avgSalesPerMachine = useMemo(() => {
    const salesByMachine: {
      [key: string]: { totalSales: number; transactionCount: number };
    } = {};
    filteredTransactions
      .filter((tx) => tx.transactionType === "Machine" && tx.machineId)
      .forEach((tx) => {
        if (!salesByMachine[tx.machineId]) {
          salesByMachine[tx.machineId] = { totalSales: 0, transactionCount: 0 };
        }
        salesByMachine[tx.machineId].totalSales += tx.amount;
        salesByMachine[tx.machineId].transactionCount += 1;
      });

    let totalSalesAcrossMachines = 0;
    let machineCountWithSales = 0;
    for (const machineId in salesByMachine) {
      totalSalesAcrossMachines += salesByMachine[machineId].totalSales;
      machineCountWithSales++;
    }

    return machineCountWithSales > 0
      ? totalSalesAcrossMachines / machineCountWithSales
      : 0;
  }, [filteredTransactions]);

  // New calculations for Product View charts
  const salesByProductDescription = useMemo(() => {
    const dataMap: { [key: string]: number } = {};
    filteredTransactions.forEach((tx) => {
      if (tx.productName) {
        dataMap[tx.productName] = (dataMap[tx.productName] || 0) + tx.amount;
      }
    });
    return Object.entries(dataMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filteredTransactions]);

  const salesByItemFamilyGroup = useMemo(() => {
    const dataMap: { [key: string]: number } = {};
    filteredTransactions.forEach((tx) => {
      if (tx.itemFamilyGroup) {
        dataMap[tx.itemFamilyGroup] =
          (dataMap[tx.itemFamilyGroup] || 0) + tx.amount;
      }
    });
    return Object.entries(dataMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filteredTransactions]);

  const salesByItemDayPart = useMemo(() => {
    const dataMap: { [key: string]: number } = {};
    filteredTransactions.forEach((tx) => {
      if (tx.itemDayPart) {
        dataMap[tx.itemDayPart] = (dataMap[tx.itemDayPart] || 0) + tx.amount;
      }
    });
    return Object.entries(dataMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filteredTransactions]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 font-sans antialiased">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-gray-800">
            Restaurant Analytics Dashboard
          </h1>
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleString()}
          </div>
        </div>
      </header>

      {/* View Selection Buttons */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm flex gap-4 justify-center">
        <button
          className={`px-6 py-3 rounded-lg font-semibold text-lg transition-all duration-200 ${
            currentView === "sales"
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => setCurrentView("sales")}
        >
          Sales View
        </button>
        <button
          className={`px-6 py-3 rounded-lg font-semibold text-lg transition-all duration-200 ${
            currentView === "product"
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => setCurrentView("product")}
        >
          Product View
        </button>
      </div>

      {/* Filter Section */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex flex-wrap gap-6 items-center">
          <div className="flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-gray-600" />
            <select
              className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-800 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
              value={selectedTimePeriod}
              onChange={(e) => setSelectedTimePeriod(e.target.value)}
            >
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="last7days">Last 7 Days</option>
              <option value="thisMonth">This Month</option>
              <option value="last3Months">Last 3 Months</option>
              <option value="last6Months">Last 6 Months</option>
              <option value="thisYear">This Year</option>
            </select>
          </div>
          <div className="flex items-center">
            <Utensils className="mr-2 h-5 w-5 text-gray-600" />
            <select
              className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-800 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
              value={selectedRestaurant}
              onChange={(e) => setSelectedRestaurant(e.target.value)}
            >
              <option value="all">All Restaurants</option>
              {mockDataOptions.restaurants.map((restaurant) => (
                <option key={restaurant} value={restaurant}>
                  {restaurant}
                </option>
              ))}
            </select>
          </div>
          {currentView === "sales" && ( // Product filter only visible in Sales View
            <div className="flex items-center">
              <Coffee className="mr-2 h-5 w-5 text-gray-600" />
              <select
                className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-800 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
              >
                <option value="all">All Products</option>
                {mockDataOptions.products.map((product) => (
                  <option key={product.item_code} value={product.item_code}>
                    {product.item_description}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="flex items-center">
            <HardDrive className="mr-2 h-5 w-5 text-gray-600" />
            <select
              className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-800 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
              value={selectedMachine}
              onChange={(e) => setSelectedMachine(e.target.value)}
            >
              <option value="all">All Machines</option>
              {mockDataOptions.machines.map((machine) => (
                <option key={machine} value={machine}>
                  {machine}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center">
            <ShoppingBag className="mr-2 h-5 w-5 text-gray-600" />
            <select
              className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-800 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
              value={selectedTransactionType}
              onChange={(e) => setSelectedTransactionType(e.target.value)}
            >
              <option value="all">All Transaction Types</option>
              {mockDataOptions.transactionTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading && (
        <div className="p-6 text-center text-gray-500 text-lg">
          Loading data...
        </div>
      )}
      {error && (
        <div className="p-6 text-center text-red-500 text-lg">{error}</div>
      )}

      {!loading && !error && (
        <>
          <SummaryCards
            totalSales={totalSales}
            totalOrders={totalOrders}
            avgOrderValue={avgOrderValue}
            avgSalesPerMachine={avgSalesPerMachine}
            selectedTimePeriod={selectedTimePeriod}
          />

          {currentView === "sales" && (
            <>
              <SalesCharts
                dailySales={dailySales}
                hourlySales={hourlySales}
                salesByRestaurant={salesByRestaurant}
                salesByProduct={salesByProduct}
                selectedRestaurant={selectedRestaurant}
              />
              <TransactionsTable filteredTransactions={filteredTransactions} />
            </>
          )}

          {currentView === "product" && (
            <ProductCharts
              salesByProductDescription={salesByProductDescription}
              salesByItemFamilyGroup={salesByItemFamilyGroup}
              salesByItemDayPart={salesByItemDayPart}
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
    </div>
  );
}
