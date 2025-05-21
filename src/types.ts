export interface Transaction {
  id: string;
  restaurantId: string;
  productId: string;
  machineId: string;
  timestamp: Date;
  amount: number;
}
export interface Product {
  id: string;
  name: string;
}
export interface Machine {
  id: string;
  name: string;
}
export interface Restaurant {
  id: string;
  name: string;
}
