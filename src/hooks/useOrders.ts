import { useState } from "react";
import API from "@/services/api";
import { MENU_ITEMS } from "@/types/cafe";
import { useEffect } from "react";

export function useOrders() {
  const [todaysOrders, setTodaysOrders] = useState<any[]>([]);
  const [todaysRevenue, setTodaysRevenue] = useState(0);
  const token = localStorage.getItem("token");

  const createOrder = async (tableNo?: number) => {
    const res = await API.post(`/orders?tableNo=${tableNo || ""}`);
    const newOrder = res.data;

    // 🔥 IMPORTANT: update state immediately
    setTodaysOrders((prev) => [...prev, newOrder]);

    return newOrder;
  };

  console.log("token :", token);

  // ✅ Get Active Order
  const getActiveOrder = (tableNo: number) => {
    return todaysOrders.find(
      (o) =>
        o.tableNo === tableNo &&
        (o.status === "ACTIVE" || o.status === "BILLED") // 🔥 FIX
    );
  };

  // ✅ Add Item
  const addItem = async (orderId: number, menuItem: any) => {
    // 🔥 1. Update UI instantly
    setTodaysOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;

        const existingItem = (order.items || []).find(
          (i: any) => i.menuItem?.id === menuItem.id
        );

        let updatedItems;

        if (existingItem) {
          updatedItems = order.items.map((i: any) =>
            i.menuItem.id === menuItem.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          );
        } else {
          updatedItems = [
            ...(order.items || []),
            {
              menuItem,
              quantity: 1,
            },
          ];
        }

        return {
          ...order,
          items: updatedItems,
        };
      })
    );

    // 🔥 2. Call backend
    try {
      await API.post(`/orders/${orderId}/items`, {
        itemName: menuItem.name,
        price: menuItem.price,
        quantity: 1,
      });
    } catch (err) {
      console.error("Error adding item", err);
    }
  };

//   // ✅ Fetch Orders
//   const fetchOrders = async () => {
//     const res = await API.get("/orders/today");
//     setTodaysOrders(res.data);
//
//     const total = res.data
//       .filter((o) => o.status === "PAID")
//       .reduce((sum: number, o: any) => sum + o.totalAmount, 0);
//
//     setTodaysRevenue(total);
  };
  //  // ✅ Fetch Orders
   const fetchOrders = async () => {
    const res = await API.get("/orders");
    setTodaysOrders(res.data);

    const total = res.data
      .filter((o) => o.status === "PAID")
      .reduce((sum: number, o: any) => sum + o.totalAmount, 0);

    setTodaysRevenue(total);
  };

  // ✅ Total calculator
  const getTotal = (items: any[]) => {
    return items?.reduce((sum, item) => {
      const price = item.menuItem?.price || item.price || 0;
      return sum + price * item.quantity;
    }, 0);
  };

  const generateBill = async (orderId: string) => {
    await API.put(`/orders/${orderId}/bill`);
    await fetchOrders(); // refresh
  };

  const collectPayment = async (orderId: string, method: string) => {
    await API.put(`/orders/${orderId}/pay?method=${method}`);
    await fetchOrders();
  };

  const removeItem = () => {};
  useEffect(() => {
    fetchOrders();
  }, []);

  const removeItem = async (orderId: number, menuItemId: number) => {
    // 🔥 1. Update UI instantly (like addItem)
    setTodaysOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;

        const updatedItems = (order.items || [])
          .map((item: any) => {
            if (item.menuItem?.id === menuItemId) {
              return {
                ...item,
                quantity: item.quantity - 1,
              };
            }
            return item;
          })
          .filter((item: any) => item.quantity > 0); // remove if 0
        return {
          ...order,
          items: updatedItems,
        };
      })
    );

    try {
      fetchOrders();
    } catch (err) {
      console.error("Error removing item", err);
    }
  };

  useEffect(() => {
    console.log("orders updated:", todaysOrders);
  }, [todaysOrders]);

  return {
    todaysOrders,
    todaysRevenue,
    getActiveOrder,
    createOrder,
    removeItem, // ✅ add this
    generateBill, // ✅ add this
    collectPayment,
    addItem,
    getTotal,
    fetchOrders,
  };
}
