import { Order, OrderItem, MenuItem } from "@/types/cafe";
import { Coffee, IndianRupee, ClipboardList, Users } from "lucide-react";

interface DashboardProps {
  tableCount: number;
  todaysOrders: Order[];
  menuItems: MenuItem[];
  todaysRevenue: number;
  getTotal: (items: OrderItem[]) => number;
  getActiveOrder: (tableNo: number) => Order | undefined;
  onStatClick?: (stat: string) => void;
}

export default function Dashboard({
  todaysOrders,
  tableCount,
  todaysRevenue,
  menuItems,
  getTotal,
  getActiveOrder,
  onStatClick,
}: DashboardProps) {
  const activeTables = Array.from(
    { length: tableCount },
    (_, i) => i + 1
  ).filter((t) => getActiveOrder(t));
  const totalOrders = todaysOrders.length;
  const paidOrders = todaysOrders.filter((o) => o.status === "PAID").length;
  const menuCount = menuItems.length;

  const stats = [
    {
      key: "menu",
      label: "Menu's",
      value: menuCount,
      icon: Coffee,
      accent: "from-success/20 to-success/5 border-success/20",
      iconBg: "bg-success/15 text-success",
    },
    {
      key: "orders",
      label: "Total Orders",
      value: totalOrders,
      icon: ClipboardList,
      accent: "from-accent/20 to-accent/5 border-accent/20",
      iconBg: "bg-accent/15 text-accent",
    },
    {
      key: "PAID",
      label: "Paid Orders",
      value: paidOrders,
      icon: Coffee,
      accent: "from-primary/20 to-primary/5 border-primary/20",
      iconBg: "bg-primary/15 text-primary",
    },
    {
      key: "active",
      label: "Active Tables",
      value: activeTables.length,
      icon: Users,
      accent: "from-warning/20 to-warning/5 border-warning/20",
      iconBg: "bg-warning/15 text-warning",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((s) => (
        <button
          key={s.key}
          onClick={() => {
            console.log("Clicked:", s.key);
            onStatClick?.(s.key);
          }}
          className={`relative overflow-hidden rounded-2xl p-4 border bg-gradient-to-br ${s.accent} backdrop-blur-sm transition-all hover:scale-[1.02] active:scale-95 text-left`}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className={`p-2 rounded-xl ${s.iconBg}`}>
              <s.icon className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-display">{s.value}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
        </button>
      ))}
    </div>
  );
}
