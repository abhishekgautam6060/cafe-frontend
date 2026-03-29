import { useState, useMemo } from "react";
import { useOrders } from "@/hooks/useOrders";
import { useExpenses } from "@/hooks/useExpenses";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  IndianRupee,
  TrendingUp,
  TrendingDown,
  PieChart,
  Plus,
  Trash2,
  Wallet,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function BillingPage() {
  const { todaysOrders = [], getTotal } = useOrders();
  const orders = todaysOrders || [];
  const { expenses, addExpense, deleteExpense } = useExpenses();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("other");
  const [period, setPeriod] = useState<"today" | "weekly" | "monthly">(
    "monthly"
  );

  const now = new Date();

  const filteredOrders = useMemo(() => {
    return (orders || []).filter((o) => {
      if (o.status !== "PAID") return false;

      const d = new Date(o.paidAt || o.createdAt);

      if (period === "today") {
        return d.toDateString() === now.toDateString();
      }

      if (period === "weekly") {
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
        return d >= weekAgo;
      }

      return (
        d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      );
    });
  }, [orders, period]);

  const totalRevenue = filteredOrders.reduce(
    (s, o) => s + (o.totalAmount || 0),
    0
  );

  const monthlyExpenses = useMemo(() => {
    return expenses.filter((e) => {
      const d = new Date(e.expense_date);
      return (
        d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      );
    });
  }, [expenses]);

  const totalExpenses = monthlyExpenses.reduce(
    (s, e) => s + Number(e.amount),
    0
  );

  const monthlyRevenue = useMemo(() => {
    return orders
      .filter((o) => {
        if (o.status !== "PAID") return false;
        const d = new Date(o.paidAt || o.createdAt);
        return (
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        );
      })
      .reduce((s, o) => s + (o.totalAmount || 0), 0);
  }, [orders]);

  const netProfit = monthlyRevenue - totalExpenses;

  // Monthly chart data (last 6 months)
  const chartData = useMemo(() => {
    const data = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = d.toLocaleString("en-IN", { month: "short" });
      const rev = orders
        .filter(
          (o) =>
            o.status === "PAID" &&
            new Date(o.paidAt || o.createdAt).getMonth() === d.getMonth() &&
            new Date(o.paidAt || o.createdAt).getFullYear() === d.getFullYear()
        )
        .reduce((s, o) => s + (o.totalAmount || 0), 0);
      const exp = expenses
        .filter(
          (e) =>
            new Date(e.expense_date).getMonth() === d.getMonth() &&
            new Date(e.expense_date).getFullYear() === d.getFullYear()
        )
        .reduce((s, e) => s + Number(e.amount), 0);
      data.push({ month, revenue: rev, expenses: exp, profit: rev - exp });
    }
    return data;
  }, [orders, expenses]);

  const handleAddExpense = async () => {
    if (!title || !amount) {
      toast.error("Fill all fields");
      return;
    }

    const payload = {
      title: title.trim(),
      amount: Number(amount),
      category,
      expense_date: new Date().toISOString().split("T")[0],
    };

    await addExpense(payload);

    setTitle("");
    setAmount("");
    setCategory("other");
    setOpen(false);

    toast.success("Expense added!");
  };

  const stats = [
    {
      label: "Monthly Revenue",
      value: `₹${monthlyRevenue.toLocaleString()}`,
      icon: IndianRupee,
      accent: "from-success/20 to-success/5 border-success/20",
      iconBg: "bg-success/15 text-success",
    },
    {
      label: "Monthly Expenses",
      value: `₹${totalExpenses.toLocaleString()}`,
      icon: TrendingDown,
      accent: "from-destructive/20 to-destructive/5 border-destructive/20",
      iconBg: "bg-destructive/15 text-destructive",
    },
    {
      label: "Net Profit",
      value: `₹${netProfit.toLocaleString()}`,
      icon: TrendingUp,
      accent: "from-primary/20 to-primary/5 border-primary/20",
      iconBg: "bg-primary/15 text-primary",
    },
    {
      label: "Avg Order Value",
      value: `₹${
        filteredOrders.length
          ? Math.round(totalRevenue / filteredOrders.length)
          : 0
      }`,
      icon: Wallet,
      accent: "from-accent/20 to-accent/5 border-accent/20",
      iconBg: "bg-accent/15 text-accent",
    },
  ];

  const categories = [
    "electricity",
    "water",
    "salary",
    "rent",
    "supplies",
    "other",
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24 space-y-6">
      <h1 className="text-2xl font-display font-bold flex items-center gap-2">
        <PieChart className="w-6 h-6 text-accent" />
        Billing & Profits
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`rounded-2xl p-4 border bg-gradient-to-br ${s.accent} backdrop-blur-sm`}
          >
            <div className={`p-2 rounded-xl ${s.iconBg} w-fit mb-2`}>
              <s.icon className="w-4 h-4" />
            </div>
            <p className="text-xl font-bold font-display">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Period filter */}
      <div className="flex gap-1.5 bg-secondary/60 rounded-xl p-1 w-fit">
        {(["today", "weekly", "monthly"] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors
              ${
                period === p
                  ? "bg-card shadow text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="bg-card border rounded-2xl p-4">
        <p className="text-sm font-medium mb-1">Revenue ({period})</p>
        <p className="text-2xl font-display font-bold">
          ₹{totalRevenue.toLocaleString()}
        </p>
        <p className="text-xs text-muted-foreground">
          {filteredOrders.length} paid orders
        </p>
      </div>

      {/* Monthly Profit Chart */}
      <div className="bg-card border rounded-2xl p-4 space-y-3">
        <p className="text-sm font-medium">Monthly Profit Trend</p>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
              />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11 }}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis
                tick={{ fontSize: 11 }}
                stroke="hsl(var(--muted-foreground))"
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid hsl(var(--border))",
                  background: "hsl(var(--card))",
                }}
                formatter={(value: number) => [`₹${value.toLocaleString()}`]}
              />
              <Bar
                dataKey="revenue"
                fill="hsl(var(--success))"
                radius={[4, 4, 0, 0]}
                name="Revenue"
              />
              <Bar
                dataKey="expenses"
                fill="hsl(var(--destructive))"
                radius={[4, 4, 0, 0]}
                name="Expenses"
              />
              <Bar
                dataKey="profit"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
                name="Profit"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Expenses Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-display font-bold">Expenses</h2>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="rounded-xl gap-1.5">
                <Plus className="w-4 h-4" /> Add Expense
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-2xl">
              <DialogHeader>
                <DialogTitle className="font-display">Add Expense</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <Input
                  placeholder="Expense title (e.g. Electricity Bill)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="rounded-xl"
                />
                <Input
                  type="number"
                  placeholder="Amount (₹)"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="rounded-xl"
                />
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c} value={c} className="capitalize">
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleAddExpense}
                  className="w-full rounded-xl"
                >
                  Add Expense
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {monthlyExpenses.length === 0 ? (
          <div className="bg-card border rounded-2xl p-8 text-center">
            <p className="text-muted-foreground text-sm">
              No expenses this month
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {monthlyExpenses.map((e) => (
              <div
                key={e.id}
                className="bg-card border rounded-2xl p-4 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-sm">{e.title}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {e.category} •{" "}
                    {new Date(e.expense_date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-destructive">
                    -₹{Number(e.amount).toLocaleString()}
                  </span>
                  <button
                    onClick={() => deleteExpense(e.id)}
                    className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
