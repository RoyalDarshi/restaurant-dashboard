interface Transaction {
  id: string;
  machineId: string;
  productId: string;
  restaurantId: string;
  amount: number;
  timestamp: string;
}

export const restaurants = [
  { id: "R1", name: "Downtown Diner", location: "Main Street" },
  { id: "R2", name: "Burger Hub", location: "Mall Branch" },
];

export const products = [
  { id: "1", name: "Classic Fries", price: 3.99 },
  { id: "2", name: "Cheese Burger", price: 8.99 },
  { id: "3", name: "Soft Drink", price: 2.99 },
  { id: "4", name: "Chicken Wings", price: 6.99 },
  { id: "5", name: "Salad Bowl", price: 7.99 },
];

export const machines = [
  { id: "A1", location: "Main Counter" },
  { id: "A2", location: "Drive-Thru" },
  { id: "A3", location: "Outdoor Kiosk" },
];

export const transactions: Transaction[] = [
  // Current Day (March 21st) Transactions
  {
    id: "T1",
    machineId: "A1",
    productId: "2",
    restaurantId: "R1",
    amount: 8.99,
    timestamp: "2024-03-21T08:30:00",
  },
  {
    id: "T2",
    machineId: "A2",
    productId: "1",
    restaurantId: "R1",
    amount: 3.99,
    timestamp: "2024-03-21T09:15:00",
  },
  {
    id: "T3",
    machineId: "A3",
    productId: "3",
    restaurantId: "R2",
    amount: 2.99,
    timestamp: "2024-03-21T10:00:00",
  },
  {
    id: "T4",
    machineId: "A1",
    productId: "4",
    restaurantId: "R1",
    amount: 6.99,
    timestamp: "2024-03-21T12:30:00",
  },
  {
    id: "T5",
    machineId: "A2",
    productId: "2",
    restaurantId: "R2",
    amount: 8.99,
    timestamp: "2024-03-21T13:45:00",
  },

  // Yesterday (March 20th) Transactions
  {
    id: "T6",
    machineId: "A3",
    productId: "5",
    restaurantId: "R1",
    amount: 7.99,
    timestamp: "2024-03-20T09:00:00",
  },
  {
    id: "T7",
    machineId: "A1",
    productId: "1",
    restaurantId: "R2",
    amount: 3.99,
    timestamp: "2024-03-20T11:30:00",
  },
  {
    id: "T8",
    machineId: "A2",
    productId: "3",
    restaurantId: "R1",
    amount: 2.99,
    timestamp: "2024-03-20T14:15:00",
  },
  {
    id: "T9",
    machineId: "A3",
    productId: "2",
    restaurantId: "R2",
    amount: 8.99,
    timestamp: "2024-03-20T17:00:00",
  },

  // Last 7 Days Transactions (March 15th-20th)
  {
    id: "T10",
    machineId: "A1",
    productId: "4",
    restaurantId: "R1",
    amount: 6.99,
    timestamp: "2024-03-19T12:00:00",
  },
  {
    id: "T11",
    machineId: "A2",
    productId: "5",
    restaurantId: "R2",
    amount: 7.99,
    timestamp: "2024-03-18T15:30:00",
  },
  {
    id: "T12",
    machineId: "A3",
    productId: "1",
    restaurantId: "R1",
    amount: 3.99,
    timestamp: "2024-03-17T10:45:00",
  },
  {
    id: "T13",
    machineId: "A1",
    productId: "2",
    restaurantId: "R2",
    amount: 8.99,
    timestamp: "2024-03-16T13:15:00",
  },
  {
    id: "T14",
    machineId: "A2",
    productId: "3",
    restaurantId: "R1",
    amount: 2.99,
    timestamp: "2024-03-15T16:00:00",
  },
  {
    id: "T15",
    machineId: "A3",
    productId: "4",
    restaurantId: "R2",
    amount: 6.99,
    timestamp: "2024-03-19T18:30:00",
  },
  {
    id: "T16",
    machineId: "A1",
    productId: "5",
    restaurantId: "R1",
    amount: 7.99,
    timestamp: "2024-03-18T19:45:00",
  },
  {
    id: "T17",
    machineId: "A2",
    productId: "1",
    restaurantId: "R2",
    amount: 3.99,
    timestamp: "2024-03-17T20:15:00",
  },

  // Additional transactions for better time distribution
  {
    id: "T18",
    machineId: "A1",
    productId: "2",
    restaurantId: "R1",
    amount: 8.99,
    timestamp: "2024-03-21T18:00:00",
  },
  {
    id: "T19",
    machineId: "A2",
    productId: "3",
    restaurantId: "R2",
    amount: 2.99,
    timestamp: "2024-03-21T19:30:00",
  },
  {
    id: "T20",
    machineId: "A3",
    productId: "4",
    restaurantId: "R1",
    amount: 6.99,
    timestamp: "2024-03-20T20:45:00",
  },
];
