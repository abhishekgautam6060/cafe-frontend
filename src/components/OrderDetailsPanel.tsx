import { X, Clock3, Receipt } from "lucide-react";

interface Props {
  order: any;
  onClose: () => void;
}

export default function OrderDetailsPanel({ order, onClose }: Props) {
  if (!order) return null;

  const total = order.items.reduce(
    (sum: number, item: any) =>
      sum + (item.menuItem?.price || item.price || 0) * item.quantity,
    0
  );

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-end"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md h-full bg-background shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="sticky top-0 z-10 bg-primary text-primary-foreground p-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">
              {order.tableNo === 0
                ? "Takeaway Order"
                : `Table ${order.tableNo}`}
            </h2>

            <p className="text-xs opacity-80 mt-1">Order Details</p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-5 space-y-5">
          {/* STATUS */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status</span>

            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold uppercase
              ${
                order.status?.toLowerCase() === "paid"
                  ? "bg-green-100 text-green-700"
                  : order.status?.toLowerCase() === "billed"
                  ? "bg-gray-200 text-gray-700"
                  : "bg-yellow-100 text-yellow-700"
              }
            `}
            >
              {order.status}
            </span>
          </div>

          {/* TIME */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock3 className="w-4 h-4" />

              <span className="text-sm">Order Time</span>
            </div>

            <span className="text-sm font-medium">
              {new Date(order.createdAt).toLocaleString("en-IN")}
            </span>
          </div>

          {/* ITEMS */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Receipt className="w-4 h-4" />

              <h3 className="font-semibold">Ordered Items</h3>
            </div>

            <div className="space-y-3">
              {order.items.map((item: any, index: number) => {
                const itemName = item.menuItem?.name || item.itemName;

                const itemPrice = item.menuItem?.price || item.price;

                return (
                  <div key={index} className="rounded-2xl border bg-card p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{itemName}</h4>

                        <p className="text-xs text-muted-foreground mt-1">
                          ₹{itemPrice} × {item.quantity}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-bold">
                          ₹{itemPrice * item.quantity}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* TOTAL */}
          <div className="pt-5 border-t-2 border-dashed flex items-center justify-between">
            <span className="font-bold text-lg">Total</span>

            <span className="font-bold text-2xl text-primary">₹{total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
