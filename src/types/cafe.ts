export interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: MenuCategory;
}

export interface MenuCategory {
  id: number;
  name: string;
}
export interface OrderItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface Expense {
  id?: number;
  title: string;
  amount: number;
  category: String;
  expense_date: string;
}

export interface AppNotification {
  id: number;
  title: string;
  message: string;
  type: "ORDER" | "BILL" | "MENU" | "CATEGORY";
  createdAt: string;
}

export interface Order {
  id: string;
  tableNo: number;
  items: OrderItem[];
  status: "ACTIVE" | "PREPARED" | "BILLED" | "PAID";
  paymentMethod?: "cash" | "card" | "upi";
  createdAt: string;
  billedAt?: string;
  paidAt?: string;
}

// export const MENU_ITEMS: MenuItem[] = [
//   { id: "1", name: "Espresso", price: 120, category: "Coffee" },
//   { id: "2", name: "Cappuccino", price: 180, category: "Coffee" },
//   { id: "3", name: "Latte", price: 200, category: "Coffee" },
//   { id: "4", name: "Americano", price: 150, category: "Coffee" },
//   { id: "5", name: "Mocha", price: 220, category: "Coffee" },
//   { id: "6", name: "Green Tea", price: 100, category: "Tea" },
//   { id: "7", name: "Masala Chai", price: 80, category: "Tea" },
//   { id: "8", name: "Iced Tea", price: 130, category: "Tea" },
//   { id: "9", name: "Club Sandwich", price: 250, category: "Snacks" },
//   { id: "10", name: "Paneer Wrap", price: 220, category: "Snacks" },
//   { id: "11", name: "Veg Burger", price: 180, category: "Snacks" },
//   { id: "12", name: "French Fries", price: 150, category: "Snacks" },
//   { id: "13", name: "Chocolate Cake", price: 200, category: "Desserts" },
//   { id: "14", name: "Brownie", price: 160, category: "Desserts" },
//   { id: "15", name: "Cheesecake", price: 250, category: "Desserts" },
//   { id: "16", name: "Cold Coffee", price: 180, category: "Beverages" },
//   { id: "17", name: "Mango Shake", price: 160, category: "Beverages" },
//   { id: "18", name: "Lemonade", price: 100, category: "Beverages" },
// ];

export interface CafeConfig {
  cafeName: string;
  tableCount: number;
}
