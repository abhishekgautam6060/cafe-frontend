import { useState } from "react";
import { Order, MenuItem, OrderItem } from "@/types/cafe";

import { Button } from "@/components/ui/button";
import {
  Plus,
  Minus,
  X,
  Receipt,
  CreditCard,
  Banknote,
  Smartphone,
  ShoppingBag,
} from "lucide-react";

interface OrderPanelProps {
  tableNo: number;
  order: any;
  onClose: () => void;
  menuItems: MenuItem[];
  onAddMoreItem: (orderId: number) => void;
  onCreateOrder: (tableNo: number) => void;
  onPreparedAndServed: (orderId: number) => void;
  getBackToActive: (orderId: number) => void;
  addNotification: (
    title: string,
    message: string,
    type: "ORDER" | "BILL" | "MENU" | "CATEGORY",
    extra?: {
      tableNo?: number;
      orderId?: string;
      redirectTab?: string;
    }
  ) => void;
  onAddItem: (orderId: number, item: MenuItem) => void;
  onRemoveItem: (orderId: number, item: MenuItem) => void;
  onGenerateBill: (orderId: string) => void;
  onCollectPayment: (orderId: string, method: "cash" | "card" | "upi") => void;
  getTotal: (items: OrderItem[]) => number;
}

export default function OrderPanel({
  tableNo,
  order,
  onClose,
  onAddMoreItem,
  onCreateOrder,
  addNotification,
  menuItems,
  onAddItem,
  getBackToActive,
  onRemoveItem,
  onGenerateBill,
  onPreparedAndServed,
  onCollectPayment,
  getTotal,
}: OrderPanelProps) {
  const categories = [
    ...new Map(
      menuItems
        .filter((item) => item.category)
        .map((item) => [item.category.id, item.category])
    ).values(),
  ];
  const [selectedMethod, setSelectedMethod] = useState<
    "cash" | "card" | "upi" | null
  >(null);
  const [forceUpdate, setForceUpdate] = useState(false);
  const [activeCategory, setActiveCategory] = useState<any>("ALL");

  const filteredItems =
    activeCategory === "ALL"
      ? menuItems
      : menuItems.filter(
          (i) => i.category && i.category.id === activeCategory?.id
        );
  const items = order?.items || [];
  const total = order ? getTotal(order.items) : 0;
  const [viewMode, setViewMode] = useState<"ACTIVE" | "PREPARED" | "BILLED">(
    "ACTIVE"
  );
  console.log("ORDER STATUS:", order?.status);

  return (
    <div
      className="fixed inset-0 z-50 bg-foreground/50 backdrop-blur-sm flex justify-end"
      onClick={onClose}
    >
      <div
        className="bg-background w-full max-w-lg h-full overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-primary text-primary-foreground p-5 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-display font-bold">
              {tableNo === 0 ? "Takeaway" : `Table ${tableNo}`}
            </h2>
            {order && (
              <p className="text-xs text-primary-foreground/60 mt-0.5">
                {items.length} items {/* ✅ FIX */}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-primary-foreground/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-6">
          {/* No active order */}
          {!order && (
            <div className="text-center py-16">
              <div className="inline-flex p-4 rounded-2xl bg-muted/50 mb-4">
                <ShoppingBag className="w-10 h-10 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground mb-6">
                No active order for this table
              </p>
              <Button
                onClick={() => {
                  onCreateOrder(tableNo);
                  addNotification(
                    "New Order Created",
                    `Table T${tableNo} created a new order`,
                    "ORDER",
                    {
                      tableNo,
                      redirectTab: "home",
                    }
                  );
                }}
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl px-8"
              >
                Start New Order
              </Button>
            </div>
          )}
          {/* Active order */}
          {order && order.status === "ACTIVE" && (
            <>
              {/* Menu categories */}
              <div>
                <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider text-muted-foreground">
                  Menu
                </h3>

                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {/* ALL CATEGORY */}
                  <button
                    onClick={() => setActiveCategory("ALL")}
                    className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200
      ${
        activeCategory === "ALL"
          ? "bg-primary text-primary-foreground shadow-md"
          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
      }`}
                  >
                    ALL
                  </button>

                  {/* OTHER CATEGORIES */}
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setActiveCategory(c)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200
        ${
          c.id === activeCategory?.id
            ? "bg-primary text-primary-foreground shadow-md"
            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
        }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  {filteredItems.map((item) => {
                    const inOrder = items.find(
                      (i) => i.menuItem?.id === item.id
                    );

                    return (
                      <button
                        key={item.id}
                        onClick={() => onAddItem(order.id, item)}
                        className="bg-card border rounded-xl p-4 text-left hover:border-accent hover:shadow-md transition-all duration-200 relative group"
                      >
                        <p className="font-medium text-sm group-hover:text-accent transition-colors">
                          {item.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          ₹{item.price}
                        </p>

                        {inOrder && (
                          <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold shadow-md">
                            {inOrder.quantity}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 🔥 Show hint when no items */}
              {items.length === 0 && (
                <p className="text-center text-muted-foreground text-sm mt-4">
                  Tap menu items to add
                </p>
              )}

              {/* Current order items */}
              {items.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider text-muted-foreground">
                    Current Order
                  </h3>

                  <div className="space-y-2">
                    {items.map((item: any) => {
                      const menuItemData = item.menuItem || {
                        id: item.id,
                        name: item.itemName,
                        price: item.price,
                      };

                      const itemName = item.menuItem?.name || item.itemName;
                      const itemPrice = item.menuItem?.price || item.price;

                      return (
                        <div
                          key={menuItemData.id}
                          className="flex items-center justify-between bg-card border rounded-xl p-4 hover:shadow-sm transition-shadow"
                        >
                          <div>
                            <p className="font-medium text-sm">{itemName}</p>
                            <p className="text-xs text-muted-foreground">
                              ₹{itemPrice} × {item.quantity}
                            </p>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-sm">
                              ₹{itemPrice * item.quantity}
                            </span>

                            <div className="flex gap-1">
                              <button
                                onClick={() =>
                                  onRemoveItem(order.id, menuItemData)
                                }
                                className="p-1.5 text-destructive hover:bg-destructive/10 rounded-lg"
                              >
                                <Minus className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() =>
                                  onAddItem(order.id, menuItemData)
                                }
                                className="p-1.5 text-success hover:bg-success/10 rounded-lg"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-between items-center mt-6 pt-4 border-t-2 border-dashed">
                    <span className="font-display font-bold text-lg">
                      Total
                    </span>
                    <span className="font-display font-bold text-2xl text-primary">
                      ₹{total}
                    </span>
                  </div>

                  <Button
                    onClick={async () => {
                      await onPreparedAndServed(order.id);
                      // 🔥 FORCE RE-OPEN PANEL
                      setForceUpdate((prev) => !prev);
                    }}
                    className="w-full mt-4 h-12 bg-primary hover:bg-primary/90 gap-2 rounded-xl text-base font-semibold"
                  >
                    <Receipt className="w-5 h-5" /> Preparied and served
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Active order */}
          {order && order.status === "PREPARED" && (
            <>
              <Button
                onClick={async () => {
                  await getBackToActive(order.id);
                }}
              >
                ← Back To menu
              </Button>
              {/* Menu categories */}

              {/* 🔥 Show hint when no items */}
              {items.length === 0 && (
                <p className="text-center text-muted-foreground text-sm mt-4">
                  Tap menu items to add
                </p>
              )}

              {/* Current order items */}
              {items.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider text-muted-foreground">
                    Current Order
                  </h3>

                  <div className="space-y-2">
                    {items.map((item: any) => {
                      const menuItemData = item.menuItem || {
                        id: item.id,
                        name: item.itemName,
                        price: item.price,
                      };

                      const itemName = item.menuItem?.name || item.itemName;
                      const itemPrice = item.menuItem?.price || item.price;

                      return (
                        <div
                          key={menuItemData.id}
                          className="flex items-center justify-between bg-card border rounded-xl p-4 hover:shadow-sm transition-shadow"
                        >
                          <div>
                            <p className="font-medium text-sm">{itemName}</p>
                            <p className="text-xs text-muted-foreground">
                              ₹{itemPrice} × {item.quantity}
                            </p>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-sm">
                              ₹{itemPrice * item.quantity}
                            </span>

                            <div className="flex gap-1">
                              <button
                                onClick={() =>
                                  onRemoveItem(order.id, menuItemData)
                                }
                                className="p-1.5 text-destructive hover:bg-destructive/10 rounded-lg"
                              >
                                <Minus className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() =>
                                  onAddItem(order.id, menuItemData)
                                }
                                className="p-1.5 text-success hover:bg-success/10 rounded-lg"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-between items-center mt-6 pt-4 border-t-2 border-dashed">
                    <span className="font-display font-bold text-lg">
                      Total
                    </span>
                    <span className="font-display font-bold text-2xl text-primary">
                      ₹{total}
                    </span>
                  </div>

                  <Button
                    onClick={async () => {
                      await onGenerateBill(order.id);

                      addNotification(
                        "Order Billed",
                        `Table T${tableNo} bill generated`,
                        "BILL",
                        {
                          tableNo,
                          orderId: order.id,
                          redirectTab: "orders",
                        }
                      );

                      setForceUpdate((prev) => !prev);
                    }}
                    className="w-full mt-4 h-12 bg-primary hover:bg-primary/90 gap-2 rounded-xl text-base font-semibold"
                  >
                    <Receipt className="w-5 h-5" /> Generate Bill
                  </Button>
                </div>
              )}
            </>
          )}

          {/* 🔥 BILLED STATE (FIXED) */}
          {order && order.status === "BILLED" && (
            <div>
              <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider text-muted-foreground">
                Bill Summary
              </h3>

              <div className="space-y-2 mb-4 bg-card rounded-xl p-4 border">
                {order.items.map((item: any) => (
                  <div
                    key={item.menuItem?.id || item.id}
                    className="flex justify-between text-sm py-1"
                  >
                    <span>
                      {item.menuItem?.name || item.itemName} × {item.quantity}
                    </span>
                    <span className="font-medium">
                      ₹{(item.menuItem?.price || item.price) * item.quantity}
                    </span>
                  </div>
                ))}
              </div>
              <Button
                onClick={() => setViewMode("ACTIVE")}
                variant="outline"
                className="w-full mb-4 rounded-xl"
              >
                Add More Items
              </Button>

              <div className="flex justify-between items-center pt-4 border-t-2 border-dashed mb-8">
                <span className="font-display font-bold text-lg">Total</span>
                <span className="font-display font-bold text-3xl text-primary">
                  ₹{total}
                </span>
              </div>

              <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">
                Collect Payment
              </h3>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { method: "cash", label: "Cash", icon: Banknote },
                  { method: "card", label: "Card", icon: CreditCard },
                  { method: "upi", label: "UPI", icon: Smartphone },
                ].map((p) => {
                  const isSelected = selectedMethod === p.method;

                  return (
                    <button
                      key={p.method}
                      onClick={() =>
                        setSelectedMethod(p.method as "cash" | "card" | "upi")
                      }
                      className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all duration-200 group
          
          ${
            isSelected
              ? "border-success bg-success/10 shadow-md" // ✅ SELECTED STATE
              : "border-gray-200 hover:border-success hover:bg-success/5"
          }
        `}
                    >
                      <div
                        className={`p-3 rounded-xl transition-colors
            ${
              isSelected
                ? "bg-success/20"
                : "bg-muted group-hover:bg-success/15"
            }
          `}
                      >
                        <p.icon
                          className={`w-6 h-6 transition-colors
              ${isSelected ? "text-success" : "group-hover:text-success"}
            `}
                        />
                      </div>

                      <span className="text-sm font-semibold">{p.label}</span>
                    </button>
                  );
                })}
              </div>
              <Button
                onClick={async () => {
                  await onCollectPayment(order.id, selectedMethod);
                  onCollectPayment;
                  addNotification(
                    "Payment Received",
                    `Table T${tableNo} paid via ${selectedMethod}`,
                    "BILL",
                    {
                      tableNo,
                      orderId: order.id,
                      redirectTab: "orders",
                    }
                  );
                  onClose(); // close panel
                }}
                className="w-full mt-6 h-12 bg-success text-white rounded-xl"
              >
                Payment Accepted
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
