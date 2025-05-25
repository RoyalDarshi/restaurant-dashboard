import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
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
  ChevronRight,
  ChevronDown,
  User, // New icon for OC/OM
} from "lucide-react";

const API_BASE_URL = "http://localhost:3001/api";

const COLORS = [
  "#4F46E5",
  "#059669",
  "#D97706",
  "#DC2626",
  "#7C3AED",
  "#0891B2",
  "#E11D48",
  "#6B7280",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
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
  pod: string; // Keeping pod for now in Transaction interface
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
  state?: string;
  city?: string;
}

// New interface for OC/OM options
interface OcOmOption {
  email: string;
  name: string;
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
  color = "text-indigo-600",
}) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center space-x-4 hover:shadow-md transition-shadow duration-200">
    <div
      className={`p-3 rounded-full bg-opacity-15 ${color.replace(
        "text-",
        "bg-"
      )}`}
    >
      {icon}
    </div>
    <div>
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <p className="text-2xl font-semibold text-gray-800">{value}</p>
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
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
    <Card
      title="Total Sales"
      value={formatIndianCurrency(totalSales)}
      icon={<TrendingUp className="text-indigo-600" />}
      description={`Sales ${selectedTimePeriod}`}
      color="text-indigo-600"
    />
    <Card
      title="Total Orders"
      value={totalOrders.toLocaleString()}
      icon={<ShoppingBag className="text-emerald-600" />}
      description={`Orders ${selectedTimePeriod}`}
      color="text-emerald-600"
    />
    <Card
      title="Average Order Value"
      value={formatIndianCurrency(avgOrderValue)}
      icon={<Utensils className="text-amber-600" />}
      description={`Avg. per order ${selectedTimePeriod}`}
      color="text-amber-600"
    />
    <Card
      title="Total GC"
      value={totalInvoices.toLocaleString()}
      icon={<ReceiptText className="text-violet-600" />}
      description={`Invoices ${selectedTimePeriod}`}
      color="text-violet-600"
    />
  </div>
);

interface SalesChartsProps {
  dailySales: { name: string; sales: number }[];
  hourlySales: { name: string; sales: number }[];
  salesByRestaurant: { name: string; value: number }[];
  salesByProduct: { name: string; value: number }[];
  selectedStoreHierarchy: { state: string; city: string; storeName: string };
}

const SalesCharts: React.FC<SalesChartsProps> = ({
  dailySales,
  hourlySales,
  salesByRestaurant,
  salesByProduct,
  selectedStoreHierarchy,
}) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
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
            stroke={COLORS[0]}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
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
          <Bar dataKey="sales" fill={COLORS[1]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
    {selectedStoreHierarchy.state === "all" && salesByRestaurant.length > 0 && (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 lg:col-span-1">
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
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 lg:col-span-1">
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
            <Bar dataKey="value" fill={COLORS[3]} />
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
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
    {salesByProductDescription.length > 0 && (
      <>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 lg:col-span-1">
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
              <Bar dataKey="value" fill={COLORS[4]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 lg:col-span-1">
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
              {/* <Legend /> */}
            </PieChart>
          </ResponsiveContainer>
        </div>
      </>
    )}
    {salesByItemFamilyGroup.length > 0 && (
      <>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
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
              <Bar dataKey="value" fill={COLORS[5]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
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
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
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
              <Bar dataKey="value" fill={COLORS[6]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
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
}

const StoreCharts: React.FC<StoreChartsProps> = ({
  salesBySaleType,
  salesByDeliveryChannel,
}) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
    {salesBySaleType.length > 0 && (
      <>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
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
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
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
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
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
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
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
  </div>
);

interface OcOmStoreSummaryData {
  storeName: string;
  totalSales: number;
  totalOrders: number;
  avgOrderValue: number;
  totalInvoices: number;
}

// New interface for aggregated OC/OM sales data
interface OcOmAggregatedData {
  email: string;
  name: string;
  totalSales: number;
  totalOrders: number;
  avgOrderValue: number;
  totalInvoices: number;
}

interface OcOmChartsProps {
  salesByOcOmStoreSummary: OcOmStoreSummaryData[];
  ocSalesSummary: OcOmAggregatedData[]; // New prop
  omSalesSummary: OcOmAggregatedData[]; // New prop
  selectedOcOmFilterType: "all" | "oc" | "om";
  selectedOcOmEmail: string; // New prop to determine if a specific OC/OM is selected
  selectedTimePeriod: string; // Pass selected time period for SummaryCards
}

const OcOmCharts: React.FC<OcOmChartsProps> = ({
  salesByOcOmStoreSummary,
  selectedOcOmFilterType,
  selectedOcOmEmail,
}) => {
  // Always render the four store-wise charts
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
      {salesByOcOmStoreSummary.length > 0 ? (
        <>
          {/* Total Sales by Store */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Total Sales by Store
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                layout="horizontal" // Changed to horizontal layout
                data={salesByOcOmStoreSummary}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis
                  type="category" // Changed to category type
                  dataKey="storeName" // Data key for store names
                  stroke="#666"
                  angle={-45} // Rotate labels for better readability
                  textAnchor="end"
                  height={80} // Adjust height for rotated labels
                />
                <YAxis
                  type="number" // Changed to number type
                  stroke="#666"
                  formatter={(value: number) => formatIndianCurrency(value)}
                />
                <Tooltip
                  formatter={(value: number) => formatIndianCurrency(value)}
                />
                <Legend />
                <Bar dataKey="totalSales" fill={COLORS[0]} name="Total Sales" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Total Orders by Store */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Total Orders by Store
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                layout="horizontal" // Changed to horizontal layout
                data={salesByOcOmStoreSummary}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis
                  type="category" // Changed to category type
                  dataKey="storeName" // Data key for store names
                  stroke="#666"
                  angle={-45} // Rotate labels for better readability
                  textAnchor="end"
                  height={80} // Adjust height for rotated labels
                />
                <YAxis
                  type="number" // Changed to number type
                  stroke="#666"
                />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="totalOrders"
                  fill={COLORS[1]}
                  name="Total Orders"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Average Order Value by Store */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Average Order Value by Store
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                layout="horizontal" // Changed to horizontal layout
                data={salesByOcOmStoreSummary}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis
                  type="category" // Changed to category type
                  dataKey="storeName" // Data key for store names
                  stroke="#666"
                  angle={-45} // Rotate labels for better readability
                  textAnchor="end"
                  height={80} // Adjust height for rotated labels
                />
                <YAxis
                  type="number" // Changed to number type
                  stroke="#666"
                  formatter={(value: number) => formatIndianCurrency(value)}
                />
                <Tooltip
                  formatter={(value: number) => formatIndianCurrency(value)}
                />
                <Legend />
                <Bar
                  dataKey="avgOrderValue"
                  fill={COLORS[2]}
                  name="Avg. Order Value"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Total Invoices by Store (Total GC) */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Total GC by Store
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                layout="horizontal" // Changed to horizontal layout
                data={salesByOcOmStoreSummary}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis
                  type="category" // Changed to category type
                  dataKey="storeName" // Data key for store names
                  stroke="#666"
                  angle={-45} // Rotate labels for better readability
                  textAnchor="end"
                  height={80} // Adjust height for rotated labels
                />
                <YAxis
                  type="number" // Changed to number type
                  stroke="#666"
                />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalInvoices" fill={COLORS[3]} name="Total GC" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-4 text-center text-gray-600 lg:col-span-2">
          No store-wise sales data available for the selected filters.
        </div>
      )}
    </div>
  );
};

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
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
      <h3 className="text-lg font-semibold mb-4 text-gray-700">
        Transactions Detail
      </h3>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Restaurant
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Machine
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Delivery Channel
              </th>
              {/* Removed POD column */}
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Quantity
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50">
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
                {/* Removed POD data cell */}
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
            className="px-3 py-1 rounded-md text-sm border bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            First
          </button>
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-md text-sm border bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
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
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white text-gray-700 hover:bg-gray-100 border-gray-300"
                    } transition-colors duration-200`}
                  >
                    {page}
                  </button>
                </React.Fragment>
              );
            })}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-md text-sm border bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Next
          </button>
          <button
            onClick={() => paginate(totalPages)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-md text-sm border bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Last
          </button>
        </nav>
      </div>
    </div>
  );
};

interface ProductNode {
  name: string;
  id?: string;
  children?: { [key: string]: ProductNode };
}

const buildProductHierarchy = (products: FilterOption[]): ProductNode => {
  const hierarchy: ProductNode = { name: "All Products", children: {} };
  products.forEach((p) => {
    let currentLevel = hierarchy.children;
    if (p.subcategory_1) {
      if (!currentLevel![p.subcategory_1]) {
        currentLevel![p.subcategory_1] = {
          name: p.subcategory_1,
          children: {},
        };
      }
      currentLevel = currentLevel![p.subcategory_1].children;
    }
    if (p.reporting_2) {
      if (!currentLevel![p.reporting_2]) {
        currentLevel![p.reporting_2] = { name: p.reporting_2, children: {} };
      }
      currentLevel = currentLevel![p.reporting_2].children;
    }
    if (p.piecategory_3) {
      if (!currentLevel![p.piecategory_3]) {
        currentLevel![p.piecategory_3] = {
          name: p.piecategory_3,
          children: {},
        };
      }
      currentLevel = currentLevel![p.piecategory_3].children;
    }
    if (p.reporting_id_4) {
      if (!currentLevel![p.reporting_id_4]) {
        currentLevel![p.reporting_id_4] = {
          name: p.reporting_id_4,
          children: {},
        };
      }
      currentLevel = currentLevel![p.reporting_id_4].children;
    }
    if (p.name && p.id) {
      if (!currentLevel![p.name]) {
        currentLevel![p.name] = { name: p.name, id: p.id };
      }
    }
  });
  return hierarchy;
};

interface StoreNode {
  name: string;
  id?: string;
  children?: { [key: string]: StoreNode };
}

const buildStoreHierarchy = (stores: FilterOption[]): StoreNode => {
  const hierarchy: StoreNode = { name: "All Stores", children: {} };
  stores.forEach((s) => {
    let currentLevel = hierarchy.children;
    if (s.state) {
      if (!currentLevel![s.state]) {
        currentLevel![s.state] = { name: s.state, children: {} };
      }
      currentLevel = currentLevel![s.state].children;
    }
    if (s.city) {
      if (!currentLevel![s.city]) {
        currentLevel![s.city] = { name: s.city, children: {} };
      }
      currentLevel = currentLevel![s.city].children;
    }
    if (s.name && s.id) {
      if (!currentLevel![s.name]) {
        currentLevel![s.name] = { name: s.name, id: s.id };
      }
    }
  });
  return hierarchy;
};

interface CascadingProductFilterProps {
  products: FilterOption[];
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

interface MenuItemProps {
  node: ProductNode;
  level: number;
  onSelect: (
    hierarchy: React.SetStateAction<{
      subcategory_1: string;
      reporting_2: string;
      piecategory_3: string;
      reporting_id_4: string;
      productName: string;
    }>
  ) => void;
  currentHierarchy: {
    subcategory_1: string;
    reporting_2: string;
    piecategory_3: string;
    reporting_id_4: string;
    productName: string;
  };
  path: string[];
  closeDropdown: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({
  node,
  level,
  onSelect,
  currentHierarchy,
  path,
  closeDropdown,
}) => {
  const hasChildren = node.children && Object.keys(node.children).length > 0;
  const [isHovered, setIsHovered] = useState(false);

  const isSelected =
    (level === 0 &&
      node.name === "All Products" &&
      currentHierarchy.subcategory_1 === "all") ||
    (level === 1 &&
      node.name === currentHierarchy.subcategory_1 &&
      currentHierarchy.reporting_2 === "all") ||
    (level === 2 &&
      node.name === currentHierarchy.reporting_2 &&
      currentHierarchy.piecategory_3 === "all") ||
    (level === 3 &&
      node.name === currentHierarchy.piecategory_3 &&
      currentHierarchy.reporting_id_4 === "all") ||
    (level === 4 &&
      node.name === currentHierarchy.reporting_id_4 &&
      currentHierarchy.productName === "all") ||
    (level === 5 && node.id === currentHierarchy.productName);

  const handleSelect = () => {
    let newHierarchy = { ...currentHierarchy };
    if (node.name === "All Products") {
      newHierarchy = {
        subcategory_1: "all",
        reporting_2: "all",
        piecategory_3: "all",
        reporting_id_4: "all",
        productName: "all",
      };
    } else if (level === 1) {
      newHierarchy = {
        subcategory_1: node.name,
        reporting_2: "all",
        piecategory_3: "all",
        reporting_id_4: "all",
        productName: "all",
      };
    } else if (level === 2) {
      newHierarchy = {
        ...newHierarchy,
        subcategory_1: path[0] || "all",
        reporting_2: node.name,
        piecategory_3: "all",
        reporting_id_4: "all",
        productName: "all",
      };
    } else if (level === 3) {
      newHierarchy = {
        ...newHierarchy,
        subcategory_1: path[0] || "all",
        reporting_2: path[1] || "all",
        piecategory_3: node.name,
        reporting_id_4: "all",
        productName: "all",
      };
    } else if (level === 4) {
      newHierarchy = {
        ...newHierarchy,
        subcategory_1: path[0] || "all",
        reporting_2: path[1] || "all",
        piecategory_3: path[2] || "all",
        reporting_id_4: node.name,
        productName: "all",
      };
    } else if (level === 5 && node.id) {
      newHierarchy = {
        ...newHierarchy,
        subcategory_1: path[0] || "all",
        reporting_2: path[1] || "all",
        piecategory_3: path[2] || "all",
        reporting_id_4: path[3] || "all",
        productName: node.id,
      };
    }
    onSelect(newHierarchy);
    if (!hasChildren) {
      closeDropdown();
    }
  };

  const handleSelectAll = (currentLevel: number) => {
    let newHierarchy = { ...currentHierarchy };
    if (currentLevel === 0) {
      newHierarchy = {
        subcategory_1: "all",
        reporting_2: "all",
        piecategory_3: "all",
        reporting_id_4: "all",
        productName: "all",
      };
    } else if (currentLevel === 1) {
      newHierarchy = {
        ...newHierarchy,
        reporting_2: "all",
        piecategory_3: "all",
        reporting_id_4: "all",
        productName: "all",
      };
    } else if (currentLevel === 2) {
      newHierarchy = {
        ...newHierarchy,
        piecategory_3: "all",
        reporting_id_4: "all",
        productName: "all",
      };
    } else if (currentLevel === 3) {
      newHierarchy = {
        ...newHierarchy,
        reporting_id_4: "all",
        productName: "all",
      };
    } else if (currentLevel === 4) {
      newHierarchy = { ...newHierarchy, productName: "all" };
    }
    onSelect(newHierarchy);
    closeDropdown();
  };

  return (
    <li
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        onClick={handleSelect}
        className={`flex items-center justify-between w-full px-4 py-2 text-left text-sm rounded-md transition-colors duration-150
          ${
            isSelected
              ? "bg-indigo-600 text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
      >
        {node.name}
        {hasChildren && (
          <ChevronRight className="w-4 h-4 ml-2 text-gray-400 group-hover:text-white" />
        )}
      </button>
      {hasChildren && isHovered && (
        <ul className="absolute left-full top-0 mt-0 w-48 bg-white border border-gray-200 rounded-md shadow-lg block z-10">
          <li className="relative">
            <button
              onClick={() => handleSelectAll(level)}
              className={`flex items-center justify-between w-full px-4 py-2 text-left text-sm rounded-md transition-colors duration-150
                ${
                  (level === 0 && currentHierarchy.subcategory_1 === "all") ||
                  (level === 1 && currentHierarchy.reporting_2 === "all") ||
                  (level === 2 && currentHierarchy.piecategory_3 === "all") ||
                  (level === 3 && currentHierarchy.reporting_id_4 === "all") ||
                  (level === 4 && currentHierarchy.productName === "all")
                    ? "bg-indigo-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
            >
              {`All ${node.name.replace("All Products", "Products")}`}
            </button>
          </li>
          {Object.values(node.children || {}).map((childNode) => (
            <MenuItem
              key={childNode.name}
              node={childNode}
              level={level + 1}
              onSelect={onSelect}
              currentHierarchy={currentHierarchy}
              path={[...path, childNode.name]}
              closeDropdown={() => setIsDropdownOpen(false)}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

const CascadingProductFilter: React.FC<CascadingProductFilterProps> = ({
  products,
  selectedProductHierarchy,
  onSelectProductHierarchy,
}) => {
  const productHierarchy = useMemo(
    () => buildProductHierarchy(products),
    [products]
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelectProduct = useCallback(
    (newHierarchy: {
      subcategory_1: string;
      reporting_2: string;
      piecategory_3: string;
      reporting_id_4: string;
      productName: string;
    }) => {
      onSelectProductHierarchy(newHierarchy);
      setIsDropdownOpen(false);
    },
    [onSelectProductHierarchy]
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getButtonText = () => {
    const {
      subcategory_1,
      reporting_2,
      piecategory_3,
      reporting_id_4,
      productName,
    } = selectedProductHierarchy;
    if (productName !== "all") {
      const product = products.find((p) => p.id === productName);
      return product ? product.name : "Select Product";
    }
    if (reporting_id_4 !== "all") return reporting_id_4;
    if (piecategory_3 !== "all") return piecategory_3;
    if (reporting_2 !== "all") return reporting_2;
    if (subcategory_1 !== "all") return subcategory_1;
    return "All Products";
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="inline-flex justify-between items-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
      >
        {getButtonText()}
        <ChevronDown size={16} className="ml-2 -mr-1" />
      </button>
      {isDropdownOpen && (
        <ul className="origin-top-right absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
          <MenuItem
            node={productHierarchy}
            level={0}
            onSelect={handleSelectProduct}
            currentHierarchy={selectedProductHierarchy}
            path={[]}
            closeDropdown={() => setIsDropdownOpen(false)}
          />
        </ul>
      )}
    </div>
  );
};

interface CascadingStoreFilterProps {
  stores: FilterOption[];
  selectedStoreHierarchy: { state: string; city: string; storeName: string };
  onSelectStoreHierarchy: (
    hierarchy: React.SetStateAction<{
      state: string;
      city: string;
      storeName: string;
    }>
  ) => void;
}

interface MenuItemStoreProps {
  node: StoreNode;
  level: number;
  onSelect: (
    hierarchy: React.SetStateAction<{
      state: string;
      city: string;
      storeName: string;
    }>
  ) => void;
  currentHierarchy: { state: string; city: string; storeName: string };
  path: string[];
  closeDropdown: () => void;
}

const MenuItemStore: React.FC<MenuItemStoreProps> = ({
  node,
  level,
  onSelect,
  currentHierarchy,
  path,
  closeDropdown,
}) => {
  const hasChildren = node.children && Object.keys(node.children).length > 0;
  const [isHovered, setIsHovered] = useState(false);

  const isSelected =
    (level === 0 &&
      node.name === "All Stores" &&
      currentHierarchy.state === "all") ||
    (level === 1 &&
      node.name === currentHierarchy.state &&
      currentHierarchy.city === "all") ||
    (level === 2 &&
      node.name === currentHierarchy.city &&
      currentHierarchy.storeName === "all") ||
    (level === 3 && node.id === currentHierarchy.storeName);

  const handleSelect = () => {
    let newHierarchy = { ...currentHierarchy };
    if (node.name === "All Stores") {
      newHierarchy = { state: "all", city: "all", storeName: "all" };
    } else if (level === 1) {
      newHierarchy = { state: node.name, city: "all", storeName: "all" };
    } else if (level === 2) {
      newHierarchy = {
        ...newHierarchy,
        state: path[0] || "all",
        city: node.name,
        storeName: "all",
      };
    } else if (level === 3 && node.id) {
      newHierarchy = {
        ...newHierarchy,
        state: path[0] || "all",
        city: path[1] || "all",
        storeName: node.id,
      };
    }
    onSelect(newHierarchy);
    if (!hasChildren) {
      closeDropdown();
    }
  };

  const handleSelectAll = (currentLevel: number) => {
    let newHierarchy = { ...currentHierarchy };
    if (currentLevel === 0) {
      newHierarchy = {
        state: "all",
        city: "all",
        storeName: "all",
      };
    } else if (currentLevel === 1) {
      newHierarchy = {
        ...newHierarchy,
        city: "all",
        storeName: "all",
      };
    } else if (currentLevel === 2) {
      newHierarchy = { ...newHierarchy, storeName: "all" };
    }
    onSelect(newHierarchy);
    closeDropdown();
  };

  return (
    <li
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        onClick={handleSelect}
        className={`flex items-center justify-between w-full px-4 py-2 text-left text-sm rounded-md transition-colors duration-150
          ${
            isSelected
              ? "bg-indigo-600 text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
      >
        {node.name}
        {hasChildren && (
          <ChevronRight className="w-4 h-4 ml-2 text-gray-400 group-hover:text-white" />
        )}
      </button>
      {hasChildren && isHovered && (
        <ul className="absolute left-full top-0 mt-0 w-48 bg-white border border-gray-200 rounded-md shadow-lg block z-10">
          <li className="relative">
            <button
              onClick={() => handleSelectAll(level)}
              className={`flex items-center justify-between w-full px-4 py-2 text-left text-sm rounded-md transition-colors duration-150
                ${
                  (level === 0 && currentHierarchy.state === "all") ||
                  (level === 1 && currentHierarchy.city === "all") ||
                  (level === 2 && currentHierarchy.storeName === "all")
                    ? "bg-indigo-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
            >
              {`All ${node.name.replace("All Stores", "Stores")}`}
            </button>
          </li>
          {Object.values(node.children || {}).map((childNode) => (
            <MenuItemStore
              key={childNode.name}
              node={childNode}
              level={level + 1}
              onSelect={onSelect}
              currentHierarchy={currentHierarchy}
              path={[...path, childNode.name]}
              closeDropdown={() => setIsDropdownOpen(false)}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

const CascadingStoreFilter: React.FC<CascadingStoreFilterProps> = ({
  stores,
  selectedStoreHierarchy,
  onSelectStoreHierarchy,
}) => {
  const storeHierarchy = useMemo(() => buildStoreHierarchy(stores), [stores]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelectStore = useCallback(
    (newHierarchy: { state: string; city: string; storeName: string }) => {
      onSelectStoreHierarchy(newHierarchy);
      setIsDropdownOpen(false);
    },
    [onSelectStoreHierarchy]
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getButtonText = () => {
    const { state, city, storeName } = selectedStoreHierarchy;
    if (storeName !== "all") {
      const store = stores.find((s) => s.id === storeName);
      return store ? store.name : "Select Store";
    }
    if (city !== "all") return city;
    if (state !== "all") return state;
    return "All Stores";
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="inline-flex justify-between items-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
      >
        {getButtonText()}
        <ChevronDown size={16} className="ml-2 -mr-1" />
      </button>
      {isDropdownOpen && (
        <ul className="origin-top-right absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
          <MenuItemStore
            node={storeHierarchy}
            level={0}
            onSelect={handleSelectStore}
            currentHierarchy={selectedStoreHierarchy}
            path={[]}
            closeDropdown={() => setIsDropdownOpen(false)}
          />
        </ul>
      )}
    </div>
  );
};

export default function App() {
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("last3Months");
  const [selectedMachine, setSelectedMachine] = useState("all");
  const [selectedTransactionType, setSelectedTransactionType] = useState("all");
  const [selectedDeliveryChannel, setSelectedDeliveryChannel] = useState("all");
  const [selectedOcOmFilterType, setSelectedOcOmFilterType] = useState<
    "all" | "oc" | "om"
  >("all");
  const [selectedOcOmEmail, setSelectedOcOmEmail] = useState("all");
  const [currentView, setCurrentView] = useState("sales");

  const [restaurants, setRestaurants] = useState<FilterOption[]>([]);
  const [allProductsFlat, setAllProductsFlat] = useState<FilterOption[]>([]);
  const [allStoresFlat, setAllStoresFlat] = useState<FilterOption[]>([]);
  const [machines, setMachines] = useState<FilterOption[]>([]);
  const [transactionTypes, setTransactionTypes] = useState<string[]>([]);
  const [deliveryChannels, setDeliveryChannels] = useState<string[]>([]);
  const [ocOptions, setOcOptions] = useState<OcOmOption[]>([]);
  const [omOptions, setOmOptions] = useState<OcOmOption[]>([]);
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
  const [salesByOcOmStoreSummaryData, setSalesByOcOmStoreSummaryData] =
    useState<OcOmStoreSummaryData[]>([]);
  const [ocSalesSummaryData, setOcSalesSummaryData] = useState<
    OcOmAggregatedData[]
  >([]);
  const [omSalesSummaryData, setOmSalesSummaryData] = useState<
    OcOmAggregatedData[]
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

  const [selectedStoreHierarchy, setSelectedStoreHierarchy] = useState({
    state: "all",
    city: "all",
    storeName: "all",
  });

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/mock-data`);
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setRestaurants(data.restaurants);
        setAllProductsFlat(data.allProductsFlat);
        setAllStoresFlat(data.allStoresFlat);
        setMachines(data.machines);
        setTransactionTypes(data.transactionTypes);
        setDeliveryChannels(data.deliveryChannels);
        setOcOptions(data.ocEmailIds); // Set OC options with email and name
        setOmOptions(data.omEmailIds); // Set OM options with email and name
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
        let storeFilter: { type: string; value: string } | null = null;
        if (selectedStoreHierarchy.storeName !== "all") {
          storeFilter = {
            type: "storecode",
            value: selectedStoreHierarchy.storeName,
          };
        } else if (selectedStoreHierarchy.city !== "all") {
          storeFilter = { type: "city", value: selectedStoreHierarchy.city };
        } else if (selectedStoreHierarchy.state !== "all") {
          storeFilter = { type: "state", value: selectedStoreHierarchy.state };
        }

        const baseCommonParams: { [key: string]: string } = {
          timePeriod: selectedTimePeriod,
          machineId: selectedMachine,
          transactionType: selectedTransactionType,
          deliveryChannel: selectedDeliveryChannel,
        };

        if (storeFilter) {
          baseCommonParams.store = JSON.stringify(storeFilter);
        }

        let productFilterParam: { type: string; value: string } | null = null;
        if (selectedProductHierarchy.productName !== "all") {
          productFilterParam = {
            type: "productid",
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
          baseCommonParams.product = JSON.stringify(productFilterParam);
        }

        // Prepare common parameters for all fetches, including OC/OM filters if applicable
        const commonParamsForCharts = { ...baseCommonParams };
        if (selectedOcOmFilterType === "oc" && selectedOcOmEmail !== "all") {
          commonParamsForCharts.ocEmailId = selectedOcOmEmail;
        } else if (
          selectedOcOmFilterType === "om" &&
          selectedOcOmEmail !== "all"
        ) {
          commonParamsForCharts.omEmailId = selectedOcOmEmail;
        }
        const queryStringForCharts = new URLSearchParams(
          commonParamsForCharts
        ).toString();

        // --- Handle Summary Data Fetching ---
        if (currentView === "oc_om") {
          // Always fetch store-wise summary for OC/OM view
          // If selectedOcOmEmail is "all", it will fetch for all stores under the selected OC/OM type (or all if type is "all")
          const ocOmStoreSummaryResponse = await fetch(
            `${API_BASE_URL}/sales/by-oc-om-store-summary?${queryStringForCharts}`
          );
          if (!ocOmStoreSummaryResponse.ok)
            throw new Error(
              `Sales by OC/OM store summary fetch failed: ${ocOmStoreSummaryResponse.status}`
            );
          const fetchedStoreSummary = await ocOmStoreSummaryResponse.json();
          setSalesByOcOmStoreSummaryData(fetchedStoreSummary);

          // Calculate overall summary from the fetched store summary data
          const calculatedSummary = fetchedStoreSummary.reduce(
            (
              acc: {
                totalSales: number;
                totalOrders: number;
                totalInvoices: number;
              },
              curr: OcOmStoreSummaryData
            ) => {
              acc.totalSales += curr.totalSales;
              acc.totalOrders += curr.totalOrders;
              acc.totalInvoices += curr.totalInvoices;
              return acc;
            },
            { totalSales: 0, totalOrders: 0, totalInvoices: 0 }
          );
          const calculatedAvgOrderValue =
            calculatedSummary.totalOrders > 0
              ? calculatedSummary.totalSales / calculatedSummary.totalOrders
              : 0;

          setSummaryData({
            totalSales: calculatedSummary.totalSales,
            totalOrders: calculatedSummary.totalOrders,
            avgOrderValue: calculatedAvgOrderValue,
            totalInvoices: calculatedSummary.totalInvoices,
          });
          setOcSalesSummaryData([]); // Clear aggregated OC sales when viewing specific
          setOmSalesSummaryData([]); // Clear aggregated OM sales when viewing specific
        } else {
          // For other views (sales, product, store), fetch summary as usual
          const summaryResponse = await fetch(
            `${API_BASE_URL}/sales/summary?${queryStringForCharts}`
          );
          if (!summaryResponse.ok)
            throw new Error(`Summary fetch failed: ${summaryResponse.status}`);
          const summary = await summaryResponse.json();
          setSummaryData(summary);
          setOcSalesSummaryData([]); // Clear OC/OM data when not in their view
          setOmSalesSummaryData([]);
          setSalesByOcOmStoreSummaryData([]);
        }

        // Clear all chart data before fetching for the current view (already done above, but keeping for clarity)
        setDailySalesData([]);
        setHourlySalesData([]);
        setSalesByRestaurantData([]);
        setSalesByProductData([]);
        setSalesByProductDescriptionData([]);
        setSalesByItemFamilyGroupData([]);
        setSalesByItemDayPartData([]);
        setSalesBySaleTypeData([]);
        setSalesByDeliveryChannelData([]);

        // --- Handle Chart Data Fetching (remains largely the same, but uses queryStringForCharts) ---
        if (currentView === "sales") {
          const dailyResponse = await fetch(
            `${API_BASE_URL}/sales/daily-trend?${queryStringForCharts}`
          );
          if (!dailyResponse.ok)
            throw new Error(
              `Daily sales fetch failed: ${dailyResponse.status}`
            );
          setDailySalesData(await dailyResponse.json());

          const hourlyResponse = await fetch(
            `${API_BASE_URL}/sales/hourly-trend?${queryStringForCharts}`
          );
          if (!hourlyResponse.ok)
            throw new Error(
              `Hourly sales fetch failed: ${hourlyResponse.status}`
            );
          setHourlySalesData(await hourlyResponse.json());

          if (selectedStoreHierarchy.state === "all") {
            const byRestaurantResponse = await fetch(
              `${API_BASE_URL}/sales/by-restaurant?${queryStringForCharts}`
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
            `${API_BASE_URL}/sales/by-product?${queryStringForCharts}`
          );
          if (!byProductResponse.ok)
            throw new Error(
              `Sales by product fetch failed: ${byProductResponse.status}`
            );
          setSalesByProductData(await byProductResponse.json());
        } else if (currentView === "product") {
          const byProductDescriptionResponse = await fetch(
            `${API_BASE_URL}/product/by-description?${queryStringForCharts}`
          );
          if (!byProductDescriptionResponse.ok)
            throw new Error(
              `Sales by product description fetch failed: ${byProductDescriptionResponse.status}`
            );
          setSalesByProductDescriptionData(
            await byProductDescriptionResponse.json()
          );

          const byFamilyGroupResponse = await fetch(
            `${API_BASE_URL}/product/by-family-group?${queryStringForCharts}`
          );
          if (!byFamilyGroupResponse.ok)
            throw new Error(
              `Sales by item family group fetch failed: ${byFamilyGroupResponse.status}`
            );
          setSalesByItemFamilyGroupData(await byFamilyGroupResponse.json());

          const byDayPartResponse = await fetch(
            `${API_BASE_URL}/product/by-day-part?${queryStringForCharts}`
          );
          if (!byDayPartResponse.ok)
            throw new Error(
              `Sales by item day part fetch failed: ${byDayPartResponse.status}`
            );
          setSalesByItemDayPartData(await byDayPartResponse.json());
        } else if (currentView === "store") {
          const bySaleTypeResponse = await fetch(
            `${API_BASE_URL}/sales/by-sale-type?${queryStringForCharts}`
          );
          if (!bySaleTypeResponse.ok)
            throw new Error(
              `Sales by sale type fetch failed: ${bySaleTypeResponse.status}`
            );
          setSalesBySaleTypeData(await bySaleTypeResponse.json());

          const byDeliveryChannelResponse = await fetch(
            `${API_BASE_URL}/sales/by-delivery-channel?${queryStringForCharts}`
          );
          if (!byDeliveryChannelResponse.ok)
            throw new Error(
              `Sales by delivery channel fetch failed: ${byDeliveryChannelResponse.status}`
            );
          setSalesByDeliveryChannelData(await byDeliveryChannelResponse.json());
        }
        // OC/OM chart data fetching is already handled above within the summary logic for currentView === "oc_om"

        const transactionsResponse = await fetch(
          `${API_BASE_URL}/sales?${queryStringForCharts}`
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
        // Reset all data states on error
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
        setSalesByOcOmStoreSummaryData([]);
        setOcSalesSummaryData([]);
        setOmSalesSummaryData([]);
        setFilteredTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllDashboardData();
  }, [
    selectedTimePeriod,
    selectedMachine,
    selectedTransactionType,
    selectedDeliveryChannel,
    selectedOcOmFilterType,
    selectedOcOmEmail,
    currentView,
    selectedProductHierarchy,
    selectedStoreHierarchy,
  ]);

  // Reset selectedOcOmEmail when selectedOcOmFilterType changes
  useEffect(() => {
    setSelectedOcOmEmail("all");
  }, [selectedOcOmFilterType]);

  // Reset OC/OM filters when currentView changes
  useEffect(() => {
    setSelectedOcOmFilterType("all");
    setSelectedOcOmEmail("all");
  }, [currentView]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Restaurant Analytics Dashboard
          </h1>
        </div>
        <nav className="flex space-x-4">
          <button
            onClick={() => setCurrentView("sales")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              currentView === "sales"
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Sales Overview
          </button>
          <button
            onClick={() => setCurrentView("product")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              currentView === "product"
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Product Analytics
          </button>
          <button
            onClick={() => setCurrentView("store")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              currentView === "store"
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Store Analytics
          </button>
          <button
            onClick={() => setCurrentView("oc_om")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              currentView === "oc_om"
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            OC/OM View
          </button>
        </nav>
      </header>
      <main className="flex-1 p-6">
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {error}
          </div>
        )}
        <div className="mb-6 flex flex-wrap gap-4 items-center">
          <div className="flex items-center space-x-2">
            <Calendar className="text-gray-500" />
            <select
              value={selectedTimePeriod}
              onChange={(e) => setSelectedTimePeriod(e.target.value)}
              className="rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
          <CascadingStoreFilter
            stores={allStoresFlat}
            selectedStoreHierarchy={selectedStoreHierarchy}
            onSelectStoreHierarchy={setSelectedStoreHierarchy}
          />
          <CascadingProductFilter
            products={allProductsFlat}
            selectedProductHierarchy={selectedProductHierarchy}
            onSelectProductHierarchy={setSelectedProductHierarchy}
          />
          <div className="flex items-center space-x-2">
            <HardDrive className="text-gray-500" />
            <select
              value={selectedMachine}
              onChange={(e) => setSelectedMachine(e.target.value)}
              className="rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <option value="all">All Machines</option>
              {machines.map((machine) => (
                <option key={machine.id} value={machine.id}>
                  {machine.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <Tag className="text-gray-500" />
            <select
              value={selectedTransactionType}
              onChange={(e) => setSelectedTransactionType(e.target.value)}
              className="rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <option value="all">All Transaction Types</option>
              {transactionTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <Truck className="text-gray-500" />
            <select
              value={selectedDeliveryChannel}
              onChange={(e) => setSelectedDeliveryChannel(e.target.value)}
              className="rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <option value="all">All Delivery Channels</option>
              {deliveryChannels.map((channel) => (
                <option key={channel} value={channel}>
                  {channel}
                </option>
              ))}
            </select>
          </div>
          {/* OC/OM Filter Type and Email/Name Dropdowns - Only show in OC/OM view */}
          {currentView === "oc_om" && (
            <>
              <div className="flex items-center space-x-2">
                <User className="text-gray-500" />
                <select
                  value={selectedOcOmFilterType}
                  onChange={(e) =>
                    setSelectedOcOmFilterType(
                      e.target.value as "all" | "oc" | "om"
                    )
                  }
                  className="rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <option value="all">All OC/OMs</option>
                  <option value="oc">Operations Consultant (OC)</option>
                  <option value="om">Operations Manager (OM)</option>
                </select>
              </div>
              {(selectedOcOmFilterType === "oc" ||
                selectedOcOmFilterType === "om") && (
                <div className="flex items-center space-x-2">
                  <User className="text-gray-500" />
                  <select
                    value={selectedOcOmEmail}
                    onChange={(e) => setSelectedOcOmEmail(e.target.value)}
                    className="rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <option value="all">
                      All {selectedOcOmFilterType === "oc" ? "OCs" : "OMs"}
                    </option>
                    {(selectedOcOmFilterType === "oc"
                      ? ocOptions
                      : omOptions
                    ).map((option) => (
                      <option key={option.email} value={option.email}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </>
          )}
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <>
            {/* SummaryCards always visible */}
            <SummaryCards
              totalSales={summaryData.totalSales}
              totalOrders={summaryData.totalOrders}
              avgOrderValue={summaryData.avgOrderValue}
              totalInvoices={summaryData.totalInvoices}
              selectedTimePeriod={selectedTimePeriod}
            />
            {currentView === "sales" && (
              <SalesCharts
                dailySales={dailySalesData}
                hourlySales={hourlySalesData}
                salesByRestaurant={salesByRestaurantData}
                salesByProduct={salesByProductData}
                selectedStoreHierarchy={selectedStoreHierarchy}
              />
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
              />
            )}
            {currentView === "oc_om" && ( // Render new OC/OM charts
              <OcOmCharts
                salesByOcOmStoreSummary={salesByOcOmStoreSummaryData}
                ocSalesSummary={ocSalesSummaryData} // Pass new data
                omSalesSummary={omSalesSummaryData} // Pass new data
                selectedOcOmFilterType={selectedOcOmFilterType}
                selectedOcOmEmail={selectedOcOmEmail} // Pass selected email
                selectedTimePeriod={selectedTimePeriod} // Pass selected time period
              />
            )}
            {currentView === "sales" && (
              <TransactionsTable filteredTransactions={filteredTransactions} />
            )}
          </>
        )}
      </main>
    </div>
  );
}
