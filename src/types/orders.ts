export interface OrderRecord {
  id: string;               
  order_id: string;
  payment_id?: string;
  amount: number;
  currency: string;
  email: string;
  status: string;
}

// Directus schema expects collections as arrays
export interface OrdersCollection {
  orders: OrderRecord[];
}
