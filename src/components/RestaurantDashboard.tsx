// RestaurantDashboard.tsx
import { useState, useEffect, useCallback } from "react";
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
  ReceiptText, // Import a new icon for invoices if desired, e.g., ReceiptText from lucide-react
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

// Helper function for Indian Rupee formatting (Lakhs and Crores)
const formatIndianCurrency = (value: number) => {
  if (value === null || value === undefined) {
    return "N/A"; // Handle null or undefined values gracefully
  }
  if (value >= 10000000) {
    return `₹${(value / 10000000).toLocaleString(undefined, {
      maximumFractionDigits: 2,
    })} Cr`;
  } else if (value >= 100000) {
    return `₹${(value / 100000).toLocaleString(undefined, {
      maximumFractionDigits: 2,
    })} L`;
  } else {
    return `₹${value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
};
// Helper to get date string inYYYY-MM-DD format
const getFormattedDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Type definitions for data
interface Transaction {
  id: number;
  restaurantId: string;
  productId: string;
  productName: string;
  machineId: string;
  transactionType: string;
  timestamp: number;
  amount: number;
  quantity: number;
  itemFamilyGroup: string;
  itemDayPart: string;
}

interface FilterOption {
  id: string;
  name: string;
}

// Reusable Card Component
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
  <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
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

// Summary Cards Component
interface SummaryCardsProps {
  totalSales: number;
  totalOrders: number;
  avgOrderValue: number;
  totalInvoices: number; // Changed from avgSalesPerMachine to totalInvoices
  selectedTimePeriod: string;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({
  totalSales,
  totalOrders,
  avgOrderValue,
  totalInvoices, // Changed from avgSalesPerMachine to totalInvoices
  selectedTimePeriod,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <Card
      title="Total Sales"
      value={formatIndianCurrency(totalSales)} // Updated to formatIndianCurrency
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
      value={formatIndianCurrency(avgOrderValue)} // Updated to formatIndianCurrency
      icon={<Utensils className="text-amber-500" />}
      description={`Avg. per order ${selectedTimePeriod}`}
      color="text-amber-500"
    />
    <Card
      title="Total GC" // Changed title
      value={totalInvoices.toLocaleString()} // Changed value to totalInvoices
      icon={<ReceiptText className="text-violet-500" />} // Changed icon
      description={`Invoices ${selectedTimePeriod}`} // Changed description
      color="text-violet-500"
    />
  </div>
);

// Sales Charts Component
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
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-gray-700">
        Daily Sales Trend
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

    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-gray-700">
        Hourly Sales Trend
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
      <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-1">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          Sales by Restaurant
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
      <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-1">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          Top 5 Products by Sales
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

// Product Charts Component
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
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
    {salesByProductDescription.length > 0 && (
      <>
        <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-1">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Sales by Product Description (Bar Chart)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              layout="vertical"
              data={salesByProductDescription.slice(0, 10)} // Show only top 5
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
        <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-1">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Sales by Product Description (Pie Chart)
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
                // label={({ name, percent }) =>
                //   `${name} ${(percent * 100).toFixed(0)}%`
                // }
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
              {/* <Legend /> */}
            </PieChart>
          </ResponsiveContainer>
        </div>
      </>
    )}

    {salesByItemFamilyGroup.length > 0 && (
      <>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Sales by Item Family Group (Bar Chart)
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
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Sales by Item Family Group (Pie Chart)
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
                // label={({ name, percent }) =>
                //   `${name} ${(percent * 100).toFixed(0)}%`
                // }
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
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Sales by Item Day Part (Bar Chart)
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
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Sales by Item Day Part (Pie Chart)
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
                // label={({ name, percent }) =>
                //   `${name} ${(percent * 100).toFixed(0)}%`
                // }
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

// Transactions Table Component
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
      <div className="mt-4 flex justify-end">
        <nav
          className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
          aria-label="Pagination"
        >
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => paginate(i + 1)}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                currentPage === i + 1
                  ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </nav>
      </div>
    </div>
  );
};

// Main App Component
export default function App() {
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("last30days");
  const [selectedRestaurant, setSelectedRestaurant] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState("all");
  const [selectedMachine, setSelectedMachine] = useState("all");
  const [selectedTransactionType, setSelectedTransactionType] = useState("all");
  const [currentView, setCurrentView] = useState("sales"); // 'sales' or 'product'

  const [restaurants, setRestaurants] = useState<FilterOption[]>([]);
  const [products, setProducts] = useState<FilterOption[]>([]);
  const [machines, setMachines] = useState<string[]>([]);
  const [transactionTypes, setTransactionTypes] = useState<string[]>([]);

  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New states for aggregated data
  const [summaryData, setSummaryData] = useState({
    totalSales: 0,
    totalOrders: 0,
    avgOrderValue: 0,
    totalInvoices: 0, // Changed from avgSalesPerMachine to totalInvoices
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

  // Fetch initial filter options
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/mock-data`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setRestaurants(data.restaurants);
        setProducts(data.products);
        setMachines(data.machines);
        setTransactionTypes(data.transactionTypes);
      } catch (err: any) {
        console.error("Failed to fetch filter options:", err);
        setError("Failed to load filter options. " + err.message);
      }
    };
    fetchFilterOptions();
  }, []);

  // Clear selected product when switching to product view
  useEffect(() => {
    if (currentView === "product") {
      setSelectedProduct("all");
    }
  }, [currentView]);

  // Fetch dashboard data based on filters and current view
  useEffect(() => {
    const fetchAllDashboardData = async () => {
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

        // --- Fetch Summary Data ---
        const summaryResponse = await fetch(
          `${API_BASE_URL}/sales/summary?${params}`
        );
        if (!summaryResponse.ok)
          throw new Error(`Summary fetch failed: ${summaryResponse.status}`);
        const summary = await summaryResponse.json();
        setSummaryData(summary);

        // --- Fetch Sales View Charts Data ---
        if (currentView === "sales") {
          const dailyResponse = await fetch(
            `${API_BASE_URL}/sales/daily-trend?${params}`
          );
          if (!dailyResponse.ok)
            throw new Error(
              `Daily sales fetch failed: ${dailyResponse.status}`
            );
          setDailySalesData(await dailyResponse.json());

          const hourlyResponse = await fetch(
            `${API_BASE_URL}/sales/hourly-trend?${params}`
          );
          if (!hourlyResponse.ok)
            throw new Error(
              `Hourly sales fetch failed: ${hourlyResponse.status}`
            );
          setHourlySalesData(await hourlyResponse.json());

          // Sales by Restaurant is only fetched if 'All Restaurants' is selected
          if (selectedRestaurant === "all") {
            // Ensure restaurantId is not passed for salesByRestaurant endpoint if 'all'
            const paramsForRestaurantChart = new URLSearchParams({
              timePeriod: selectedTimePeriod,
              productId: selectedProduct,
              machineId: selectedMachine,
              transactionType: selectedTransactionType,
            }).toString();
            const byRestaurantResponse = await fetch(
              `${API_BASE_URL}/sales/by-restaurant?${paramsForRestaurantChart}`
            );
            if (!byRestaurantResponse.ok)
              throw new Error(
                `Sales by restaurant fetch failed: ${byRestaurantResponse.status}`
              );
            setSalesByRestaurantData(await byRestaurantResponse.json());
          } else {
            setSalesByRestaurantData([]); // Clear data if a specific restaurant is chosen
          }

          const byProductResponse = await fetch(
            `${API_BASE_URL}/sales/by-product?${params}`
          );
          if (!byProductResponse.ok)
            throw new Error(
              `Sales by product fetch failed: ${byProductResponse.status}`
            );
          setSalesByProductData(await byProductResponse.json());
        } else {
          // Clear sales view data when not in sales view
          setDailySalesData([]);
          setHourlySalesData([]);
          setSalesByRestaurantData([]);
          setSalesByProductData([]);
        }

        // --- Fetch Product View Charts Data ---
        if (currentView === "product") {
          const byProductDescResponse = await fetch(
            `${API_BASE_URL}/product/by-description?${params}`
          );
          if (!byProductDescResponse.ok)
            throw new Error(
              `Sales by product description fetch failed: ${byProductDescResponse.status}`
            );
          setSalesByProductDescriptionData(await byProductDescResponse.json());

          const byFamilyGroupResponse = await fetch(
            `${API_BASE_URL}/product/by-family-group?${params}`
          );
          if (!byFamilyGroupResponse.ok)
            throw new Error(
              `Sales by item family group fetch failed: ${byFamilyGroupResponse.status}`
            );
          setSalesByItemFamilyGroupData(await byFamilyGroupResponse.json());

          const byDayPartResponse = await fetch(
            `${API_BASE_URL}/product/by-day-part?${params}`
          );
          if (!byDayPartResponse.ok)
            throw new Error(
              `Sales by item day part fetch failed: ${byDayPartResponse.status}`
            );
          setSalesByItemDayPartData(await byDayPartResponse.json());
        } else {
          // Clear product view data when not in product view
          setSalesByProductDescriptionData([]);
          setSalesByItemFamilyGroupData([]);
          setSalesByItemDayPartData([]);
        }

        // --- Fetch Filtered Transactions (for the table) ---
        const transactionsResponse = await fetch(
          `${API_BASE_URL}/sales?${params}`
        );
        if (!transactionsResponse.ok)
          throw new Error(
            `Transactions fetch failed: ${transactionsResponse.status}`
          );
        setFilteredTransactions(await transactionsResponse.json());
      } catch (err: any) {
        console.error("Failed to fetch dashboard data:", err);
        setError(
          "Failed to load data. Please ensure the backend server is running and configured correctly, and that your database contains data for the selected filters. Error: " +
            err.message
        );
        // Clear all data on error
        setSummaryData({
          totalSales: 0,
          totalOrders: 0,
          avgOrderValue: 0,
          totalInvoices: 0, // Changed from avgSalesPerMachine to totalInvoices
        });
        setDailySalesData([]);
        setHourlySalesData([]);
        setSalesByRestaurantData([]);
        setSalesByProductData([]);
        setSalesByProductDescriptionData([]);
        setSalesByItemFamilyGroupData([]);
        setSalesByItemDayPartData([]);
        setFilteredTransactions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAllDashboardData();
  }, [
    selectedTimePeriod,
    selectedRestaurant,
    selectedProduct,
    selectedMachine,
    selectedTransactionType,
    currentView, // Crucial dependency for changing views
  ]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Restaurant Sales Dashboard
        </h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setCurrentView("sales")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              currentView === "sales"
                ? "bg-indigo-600 text-white shadow"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Sales View
          </button>
          <button
            onClick={() => setCurrentView("product")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              currentView === "product"
                ? "bg-indigo-600 text-white shadow"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Product View
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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

          {currentView === "sales" && ( // Conditionally render product filter
            <div>
              <label
                htmlFor="product"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Product
              </label>
              <div className="relative">
                <select
                  id="product"
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md appearance-none bg-white border"
                >
                  <option value="all">All Products</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <Coffee className="h-5 w-5" />
                </div>
              </div>
            </div>
          )}

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
                  <option key={m} value={m}>
                    {m}
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
                {transactionTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <ShoppingBag className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard data...</p>
          </div>
        )}

        {error && (
          <div className="p-6 text-center text-red-500 text-lg">{error}</div>
        )}

        {!loading && !error && (
          <>
            {currentView === "sales" && (
              <>
                <SummaryCards
                  totalSales={summaryData.totalSales}
                  totalOrders={summaryData.totalOrders}
                  avgOrderValue={summaryData.avgOrderValue}
                  totalInvoices={summaryData.totalInvoices} // Passed totalInvoices
                  selectedTimePeriod={selectedTimePeriod}
                />
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
