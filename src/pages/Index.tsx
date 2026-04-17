import { useState } from "react";
import { useOrders } from "@/hooks/useOrders";
import { useAuth } from "@/hooks/useAuth";
import Dashboard from "@/components/Dashboard";
import TableGrid from "@/components/TableGrid";
import OrderPanel from "@/components/OrderPanel";
import BottomNav, { TabKey } from "@/components/BottomNav";
import ProfilePage from "@/pages/ProfilePage";
import AllOrdersPage from "@/pages/AllOrdersPage";
import MenuPage from "@/pages/MenuPage";
import BillingPage from "@/pages/BillingPage";
import { Coffee } from "lucide-react";
import { useEffect } from "react";
import { useProfile } from "@/hooks/useProfile";
import { hasAccess } from "@/utils/auth";

const Index = () => {
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("home");
  const { profile } = useProfile();
  const name = JSON.parse(localStorage.getItem("name"));
  const email = JSON.parse(localStorage.getItem("email"));

  const {
    todaysOrders,
    todaysRevenue,
    getActiveOrder,
    createOrder,
    addItem,
    removeItem,
    generateBill,
    collectPayment,
    addMoreItem,
    getTotal,
    fetchOrders,
  } = useOrders();

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatClick = (stat: string) => {
    if (stat === "orders" || stat === "paid") setActiveTab("orders");
    if (stat === "menu") setActiveTab("menu");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-primary text-primary-foreground shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-xl bg-primary-foreground/10 backdrop-blur-sm">
              <Coffee className="w-5 h-5" />
            </div>
            <h1 className="text-lg sm:text-xl font-display font-bold tracking-tight">
              {/* {name || "Café Manager
              "} */}
              {name}
            </h1>
          </div>
          <span className="text-xs text-primary-foreground/60 truncate max-w-[150px]">
            {email || ""}
          </span>
        </div>
      </header>

      {/* Content */}
      {activeTab === "home" && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-6">
          <Dashboard
            todaysOrders={todaysOrders}
            todaysRevenue={todaysRevenue}
            getTotal={getTotal}
            getActiveOrder={getActiveOrder}
            onStatClick={handleStatClick}
          />
          <TableGrid
            getActiveOrder={getActiveOrder}
            getTotal={getTotal}
            onSelectTable={setSelectedTable}
          />
        </main>
      )}

      {activeTab === "orders" && <AllOrdersPage />}
      {activeTab === "billing" && hasAccess(["ADMIN"]) && <BillingPage />}
      {activeTab === "profile" && <ProfilePage />}
      {activeTab === "menu" && <MenuPage />}

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Order Panel Slide-over */}
      {selectedTable !== null && (
        <OrderPanel
          tableNo={selectedTable}
          order={getActiveOrder(selectedTable)}
          onClose={() => setSelectedTable(null)}
          onCreateOrder={createOrder}
          onAddItem={addItem}
          onRemoveItem={removeItem}
          onGenerateBill={generateBill}
          onAddMoreItem={addMoreItem}
          onCollectPayment={collectPayment}
          getTotal={getTotal}
        />
      )}
    </div>
  );
};

export default Index;
