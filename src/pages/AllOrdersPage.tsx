import { useState, useMemo } from "react";
import { useOrders } from "@/hooks/useOrders";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Receipt, Search, Filter } from "lucide-react";
import OrderDetailsPanel from "@/components/OrderDetailsPanel";

export default function AllOrdersPage() {
  const { todaysOrders, getTotal } = useOrders();
  const orders = todaysOrders || [];
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const filtered = useMemo(() => {
    let list = [...orders].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // ✅ STATUS FIX
    if (statusFilter !== "all") {
      list = list.filter((o) => o.status?.toLowerCase() === statusFilter);
    }

    // ✅ SEARCH FIX
    if (search) {
      const q = search.toLowerCase();

      list = list.filter(
        (o) =>
          (o.tableNo === 0 ? "takeaway" : `table ${o.tableNo}`)
            .toLowerCase()
            .includes(q) ||
          o.items?.some((i) => i.menuItem?.name?.toLowerCase().includes(q))
      );
    }

    return list;
  }, [orders, search, statusFilter]);

  const grouped = useMemo(() => {
    const groups: Record<string, typeof filtered> = {};
    filtered.forEach((o) => {
      const date = new Date(o.createdAt).toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      if (!groups[date]) groups[date] = [];
      groups[date].push(o);
    });
    return groups;
  }, [filtered]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24 space-y-5">
      <h1 className="text-2xl font-display font-bold flex items-center gap-2">
        <Receipt className="w-6 h-6 text-accent" />
        All Orders
      </h1>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search orders..."
            className="pl-9 rounded-xl"
          />
        </div>
      </div>

      <div className="flex gap-1.5 flex-wrap">
        {["all", "active", "billed", "paid"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors capitalize
              ${
                statusFilter === s
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
          >
            {s === "all" ? "All" : s}
          </button>
        ))}
      </div>

      {Object.keys(grouped).length === 0 ? (
        <div className="text-center py-16">
          <div className="inline-flex p-4 rounded-2xl bg-muted/50 mb-4">
            <Receipt className="w-10 h-10 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">No orders found</p>
        </div>
      ) : (
        Object.entries(grouped).map(([date, dateOrders]) => (
          <div key={date} className="space-y-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
              {date}
            </h3>
            {dateOrders.map((order) => (
              <button
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className="w-full bg-card border rounded-2xl p-4 flex items-center justify-between hover:shadow-md hover:border-primary/30 transition-all text-left"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm">
                      {order.tableNo === 0
                        ? "Takeaway"
                        : `Table ${order.tableNo}`}
                    </span>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm">
                        {order.tableNo === 0
                          ? "Takeaway"
                          : `Table ${order.tableNo}`}
                      </span>

                      {/* ✅ SINGLE STATUS BADGE */}
                      <span
                        className={`px-2 py-1 rounded-full text-[10px]
                        ${
                          order.status?.toLowerCase() === "paid"
                            ? "bg-green-100 text-green-700"
                            : order.status?.toLowerCase() === "billed"
                            ? "bg-gray-200 text-gray-700"
                            : "bg-yellow-100 text-yellow-700"
                        }
                      `}
                      >
                        {order.status?.toLowerCase()}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {order.items?.length || 0} items •{" "}
                    {new Date(order.createdAt).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {order.paymentMethod &&
                      ` • ${order.paymentMethod.toUpperCase()}`}
                  </p>
                </div>
                <span className="font-display font-bold text-lg">
                  ₹{getTotal(order.items)}
                </span>
              </button>
            ))}
            {selectedOrder && (
              <OrderDetailsPanel
                order={selectedOrder}
                onClose={() => setSelectedOrder(null)}
              />
            )}
          </div>
        ))
      )}
    </div>
  );
}
