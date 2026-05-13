import { Order } from "@/types/cafe";
import { ChefHat, Clock3 } from "lucide-react";

interface KitchenOrdersPanelProps {
  todaysOrders: Order[];
}

interface ItemSummary {
  name: string;
  total: number;
  pending: number;
  tables: number[];
}

export default function KitchenOrdersPanel({
  todaysOrders,
}: KitchenOrdersPanelProps) {
  // ACTIVE ORDERS ONLY
  const activeOrders = todaysOrders.filter(
    (order: any) => order?.status === "ACTIVE"
  );

  // GROUP ITEMS
  const groupedItems: Record<string, ItemSummary> = {};

  activeOrders.forEach((order: any) => {
    order.items.forEach((item: any) => {
      const itemName = item.menuItem?.name || item.itemName || "Unknown Item";

      if (!groupedItems[itemName]) {
        groupedItems[itemName] = {
          name: itemName,
          total: 0,
          pending: 0,
          tables: [],
        };
      }

      groupedItems[itemName].total += item.quantity;
      groupedItems[itemName].pending += item.quantity;

      // ✅ ADD TABLE NUMBER
      if (!groupedItems[itemName].tables.includes(order.tableNo)) {
        groupedItems[itemName].tables.push(order.tableNo);
      }
    });
  });

  const items = Object.values(groupedItems);

  return (
    <div className="sticky top-20 h-fit">
      <div className="rounded-3xl border bg-card p-5 shadow-sm">
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-2xl bg-orange-100">
            <ChefHat className="w-5 h-5 text-orange-600" />
          </div>

          <div>
            <h2 className="font-bold text-lg">Kitchen Live Orders</h2>

            <p className="text-sm text-muted-foreground">
              Active preparing items
            </p>
          </div>
        </div>

        {/* EMPTY */}
        {items.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">
            No active kitchen orders
          </div>
        )}

        {/* GRID ITEMS */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 max-h-[70vh] overflow-y-auto pr-1">
          {items.map((item) => (
            <div
              key={item.name}
              className="group rounded-2xl border bg-background p-4 hover:border-orange-300 hover:shadow-md transition-all duration-200"
            >
              {/* TOP */}
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-sm leading-tight line-clamp-2">
                  {item.name}
                </h3>
              </div>

              {/* STATUS */}
              <div className="mt-4 flex items-center justify-between rounded-xl bg-orange-50 px-3 py-2">
                <div className="flex items-center gap-1.5">
                  <Clock3 className="w-3.5 h-3.5 text-orange-600" />
                  <span className="text-[11px] font-medium text-orange-700"></span>
                </div>

                <span className="text-sm font-bold text-orange-700">
                  {item.pending}
                </span>
              </div>

              <div className="flex flex-wrap gap-1">
                {item.tables.map((tableNo) => (
                  <span
                    key={tableNo}
                    className="px-2 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-semibold"
                  >
                    {tableNo === 0 ? "Takeaway" : `T${tableNo}`}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
