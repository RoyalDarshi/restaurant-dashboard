import type { Transaction, Product, Machine, Restaurant } from "../types";

export const products: Product[] = [
  { id: "1", name: "Fries" },
  { id: "2", name: "Burger" },
  { id: "3", name: "Soda" },
];
export const machines: Machine[] = [
  { id: "m1", name: "Machine A" },
  { id: "m2", name: "Machine B" },
];
export const restaurants: Restaurant[] = [
  { id: "r1", name: "Downtown Diner" },
  { id: "r2", name: "Uptown Grill" },
];

function randomDate(start: Date, end: Date) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}
export const transactions: Transaction[] = Array.from({ length: 200 }).map(
  (_, i) => ({
    id: `t${i}`,
    restaurantId:
      restaurants[Math.floor(Math.random() * restaurants.length)].id,
    productId: products[Math.floor(Math.random() * products.length)].id,
    machineId: machines[Math.floor(Math.random() * machines.length)].id,
    timestamp: randomDate(
      new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
      new Date()
    ),
    amount: Math.floor(Math.random() * 20) + 1,
  })
);
