import { useState, useEffect } from "react";
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
  AreaChart, // Import AreaChart
  Area, // Import Area
} from "recharts";
import {
  Filter,
  Calendar,
  Clock,
  Coffee,
  Utensils,
  TrendingUp,
  PieChart as PieChartIcon,
  BarChart2,
  MapPin, // New icon for AreaMap placeholder
  HardDrive, // Icon for machine related metric
  ShoppingBag, // Icon for transaction type
} from "lucide-react";

// Mock data generation remains unchanged
const generateMockData = () => {
  const restaurants = [
    "Downtown Diner",
    "Beach Bistro",
    "Mountain Grill",
    "City Café",
    "Riverside Restaurant",
  ];
  const products = [
    "Burger",
    "Fries",
    "Pizza",
    "Pasta",
    "Salad",
    "Sandwich",
    "Coffee",
    "Soda",
  ];
  const machines = ["POS-001", "POS-002", "POS-003", "KIOSK-001", "KIOSK-002"];
  const transactionTypes = ["Machine", "Online", "Delivery", "Dine-in (Cash)"]; // New transaction types

  const transactions = Array.from({ length: 3650 }, (_, i) => {
    const date = new Date();
    // Go back up to 365 days
    const randomDaysAgo = Math.floor(Math.random() * 365);
    date.setDate(date.getDate() - randomDaysAgo);
    date.setHours(Math.floor(Math.random() * 14) + 8); // Between 8 AM - 10 PM
    date.setMinutes(Math.floor(Math.random() * 60));
    date.setSeconds(Math.floor(Math.random() * 60));

    const type =
      transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
    let machineId = null; // Default to null

    if (type === "Machine") {
      machineId = machines[Math.floor(Math.random() * machines.length)];
    }

    return {
      id: `tx-${i + 1}`,
      restaurantId: restaurants[Math.floor(Math.random() * restaurants.length)],
      productId: products[Math.floor(Math.random() * products.length)],
      machineId: machineId, // Assign based on type
      transactionType: type, // New field
      timestamp: date.getTime(),
      amount: Math.floor(Math.random() * 30) + 5,
      quantity: Math.floor(Math.random() * 3) + 1,
    };
  });

  return { restaurants, products, machines, transactionTypes, transactions };
};

const mockData = generateMockData();

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

// Updated filter function with new time periods
const filterTransactionsByTimePeriod = (transactions, period) => {
  const now = new Date();
  const todayStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  ).getTime();
  const yesterdayStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 1
  ).getTime();
  const sevenDaysAgo = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 7
  ).getTime();
  const firstDayOfMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  ).getTime();
  const threeMonthsAgo = new Date(
    now.getFullYear(),
    now.getMonth() - 2,
    1
  ).getTime();
  const sixMonthsAgo = new Date(
    now.getFullYear(),
    now.getMonth() - 5,
    1
  ).getTime();
  const firstDayOfYear = new Date(now.getFullYear(), 0, 1).getTime();

  switch (period) {
    case "today":
      return transactions.filter((tx) => tx.timestamp >= todayStart);
    case "yesterday":
      return transactions.filter(
        (tx) => tx.timestamp >= yesterdayStart && tx.timestamp < todayStart
      );
    case "last7days":
      return transactions.filter((tx) => tx.timestamp >= sevenDaysAgo);
    case "thisMonth":
      return transactions.filter((tx) => tx.timestamp >= firstDayOfMonth);
    case "last3Months":
      return transactions.filter((tx) => tx.timestamp >= threeMonthsAgo);
    case "last6Months":
      return transactions.filter((tx) => tx.timestamp >= sixMonthsAgo);
    case "thisYear":
      return transactions.filter((tx) => tx.timestamp >= firstDayOfYear);
    default:
      return transactions;
  }
};

// Helper to get date string in YYYY-MM-DD format
const getDateString = (timestamp) => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function RestaurantDashboard() {
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("today");
  const [selectedRestaurant, setSelectedRestaurant] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState("all");
  const [selectedMachine, setSelectedMachine] = useState("all");
  const [selectedTransactionType, setSelectedTransactionType] = useState("all"); // New state for transaction type
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  useEffect(() => {
    let filtered = filterTransactionsByTimePeriod(
      mockData.transactions,
      selectedTimePeriod
    );
    if (selectedRestaurant !== "all") {
      filtered = filtered.filter(
        (tx) => tx.restaurantId === selectedRestaurant
      );
    }
    if (selectedProduct !== "all") {
      filtered = filtered.filter((tx) => tx.productId === selectedProduct);
    }
    if (selectedMachine !== "all") {
      // Only filter by machine if a specific machine is selected
      filtered = filtered.filter((tx) => tx.machineId === selectedMachine);
    }
    if (selectedTransactionType !== "all") {
      filtered = filtered.filter(
        (tx) => tx.transactionType === selectedTransactionType
      );
    }
    setFilteredTransactions(filtered);
  }, [
    selectedTimePeriod,
    selectedRestaurant,
    selectedProduct,
    selectedMachine,
    selectedTransactionType, // Add to dependency array
  ]);

  // Calculate sales by restaurant for pie chart
  const salesByRestaurant =
    selectedRestaurant === "all"
      ? mockData.restaurants.map((restaurant) => {
          const sales = filteredTransactions
            .filter((tx) => tx.restaurantId === restaurant)
            .reduce((total, tx) => total + tx.amount, 0);
          return { name: restaurant, value: sales };
        })
      : [];

  // Calculate sales by product
  const salesByProduct = mockData.products
    .map((product) => {
      const sales = filteredTransactions
        .filter((tx) => tx.productId === product)
        .reduce((total, tx) => total + tx.amount, 0);
      return { name: product, value: sales };
    })
    .sort((a, b) => b.value - a.value);

  // Calculate hourly sales
  const hourlySales = Array.from({ length: 14 }, (_, i) => {
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

  // Calculate daily sales based on selected time period
  const getDateRange = () => {
    const now = new Date();
    let start;
    let end = now;
    switch (selectedTimePeriod) {
      case "today":
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        end = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // End of today for single day
        break;
      case "yesterday":
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
        end = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1); // End of yesterday for single day
        break;
      case "last7days":
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
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
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
    }
    return { start, end };
  };

  const dailySalesMap = {};
  filteredTransactions.forEach((tx) => {
    const dateStr = getDateString(tx.timestamp);
    if (!dailySalesMap[dateStr]) dailySalesMap[dateStr] = 0;
    dailySalesMap[dateStr] += tx.amount;
  });

  const { start, end } = getDateRange();
  const days = [];
  const currentDate = new Date(start);
  // Ensure the loop includes the 'end' date if it's not the same as 'start'
  while (currentDate.getTime() <= end.getTime()) {
    days.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const dailySales = days.map((day) => {
    const dateStr = getDateString(day.getTime());
    const sales = dailySalesMap[dateStr] || 0;
    return {
      name: day.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      sales,
    }; // Nicer date format
  });

  // Format numbers as currency
  const formatCurrency = (value) => `₹${value.toFixed(2)}`;

  // Calculate summary metrics
  const totalSales = filteredTransactions.reduce(
    (sum, tx) => sum + tx.amount,
    0
  );
  const totalOrders = filteredTransactions.length;
  const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

  // Calculate Average Sales per Machine (only considering 'Machine' transactions)
  const salesByMachine = {};
  filteredTransactions
    .filter((tx) => tx.transactionType === "Machine" && tx.machineId) // Filter for machine transactions with a machineId
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

  const avgSalesPerMachine =
    machineCountWithSales > 0
      ? totalSalesAcrossMachines / machineCountWithSales
      : 0;

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
              {mockData.restaurants.map((restaurant) => (
                <option key={restaurant} value={restaurant}>
                  {restaurant}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center">
            <Coffee className="mr-2 h-5 w-5 text-gray-600" />
            <select
              className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-800 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
            >
              <option value="all">All Products</option>
              {mockData.products.map((product) => (
                <option key={product} value={product}>
                  {product}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center">
            <HardDrive className="mr-2 h-5 w-5 text-gray-600" />
            <select
              className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-800 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
              value={selectedMachine}
              onChange={(e) => setSelectedMachine(e.target.value)}
            >
              <option value="all">All Machines</option>
              {mockData.machines.map((machine) => (
                <option key={machine} value={machine}>
                  {machine}
                </option>
              ))}
            </select>
          </div>
          {/* New Filter for Transaction Type */}
          <div className="flex items-center">
            <ShoppingBag className="mr-2 h-5 w-5 text-gray-600" />
            <select
              className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-800 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
              value={selectedTransactionType}
              onChange={(e) => setSelectedTransactionType(e.target.value)}
            >
              <option value="all">All Transaction Types</option>
              {mockData.transactionTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
        {" "}
        {/* Changed grid-cols-3 to grid-cols-4 to accommodate new card */}
        <div className="bg-white rounded-xl shadow-lg p-6 flex items-center justify-between transition-transform duration-200 hover:scale-[1.02]">
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Total Sales</h3>
            <p className="text-4xl font-bold text-indigo-600 mt-2">
              {formatCurrency(totalSales)}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              For {selectedTimePeriod}
            </p>
          </div>
          <TrendingUp className="h-10 w-10 text-indigo-400 opacity-75" />
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 flex items-center justify-between transition-transform duration-200 hover:scale-[1.02]">
          <div>
            <h3 className="text-lg font-semibold text-gray-700">
              Total Orders
            </h3>
            <p className="text-4xl font-bold text-emerald-600 mt-2">
              {totalOrders}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              For {selectedTimePeriod}
            </p>
          </div>
          <BarChart2 className="h-10 w-10 text-emerald-400 opacity-75" />
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 flex items-center justify-between transition-transform duration-200 hover:scale-[1.02]">
          <div>
            <h3 className="text-lg font-semibold text-gray-700">
              Avg Order Value
            </h3>
            <p className="text-4xl font-bold text-purple-600 mt-2">
              {formatCurrency(avgOrderValue)}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              For {selectedTimePeriod}
            </p>
          </div>
          <PieChartIcon className="h-10 w-10 text-purple-400 opacity-75" />
        </div>
        {/* New Summary Card for Average Sales per Machine */}
        <div className="bg-white rounded-xl shadow-lg p-6 flex items-center justify-between transition-transform duration-200 hover:scale-[1.02]">
          <div>
            <h3 className="text-lg font-semibold text-gray-700">
              Avg Sales / Machine
            </h3>
            <p className="text-4xl font-bold text-blue-600 mt-2">
              {formatCurrency(avgSalesPerMachine)}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              For {selectedTimePeriod}
            </p>
          </div>
          <HardDrive className="h-10 w-10 text-blue-400 opacity-75" />
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
        {/* Daily Sales Trend */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <LineChart className="mr-2 h-6 w-6 text-indigo-500" /> Daily Sales
            Trend
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
                  formatter={(value) => formatCurrency(value)}
                  labelFormatter={(label) => `Date: ${label}`}
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
                  stroke={COLORS[0]} // Using the first color from the new palette
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
                  formatter={(value) => formatCurrency(value)}
                  labelFormatter={(label) => `Hour: ${label}`}
                  wrapperStyle={{
                    borderRadius: "8px",
                    boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="sales"
                  name="Sales"
                  fill={COLORS[1]}
                  barSize={25}
                />{" "}
                {/* Using second color */}
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
                      percent > 0
                        ? `${name}: ${(percent * 100).toFixed(1)}%`
                        : ""
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
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  {/* <Legend
      align="right"
      verticalAlign="middle"
      layout="vertical"
      wrapperStyle={{ paddingLeft: "20px" }}
    /> */}
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Sales by Product */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Coffee className="mr-2 h-6 w-6 text-red-500" /> Top Products by
            Sales
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesByProduct.slice(0, 5)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis
                  type="number"
                  tickFormatter={formatCurrency}
                  stroke="#555"
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={100}
                  stroke="#555"
                />{" "}
                {/* Increased width for product names */}
                <Tooltip
                  formatter={(value) => formatCurrency(value)}
                  wrapperStyle={{
                    borderRadius: "8px",
                    boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="value"
                  name="Sales"
                  fill={COLORS[3]}
                  barSize={25}
                />{" "}
                {/* Using fourth color */}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Area Map Placeholder */}
        <div className="bg-white rounded-xl shadow-lg p-6 lg:col-span-2">
          {" "}
          {/* Span full width on large screens */}
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <MapPin className="mr-2 h-6 w-6 text-blue-500" /> Restaurant
            Locations / Sales Distribution
          </h3>
          <div className="h-96 bg-gray-50 border border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-lg">
            <p>
              Placeholder for Area Map (e.g., showing sales distribution by
              region)
            </p>
          </div>
          {/* Example of how an AreaChart might look if you were to use it with different data */}
          {/*
           <div className="h-72 mt-4">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={dailySales} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                 <CartesianGrid strokeDasharray="3 3" />
                 <XAxis dataKey="name" />
                 <YAxis />
                 <Tooltip />
                 <Area type="monotone" dataKey="sales" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
               </AreaChart>
             </ResponsiveContainer>
           </div>
           */}
        </div>
      </div>

      {/* Transactions Table */}
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
                        {transaction.productId}
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
