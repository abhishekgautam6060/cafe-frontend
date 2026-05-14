import { useState } from "react";
import { useOrders } from "@/hooks/useOrders";
import API from "@/services/api";
import Dashboard from "@/components/Dashboard";
import TableGrid from "@/components/TableGrid";
import OrderPanel from "@/components/OrderPanel";
import BottomNav, { TabKey } from "@/components/BottomNav";
import ProfilePage from "@/pages/ProfilePage";
import AllOrdersPage from "@/pages/AllOrdersPage";
import MenuPage from "@/pages/MenuPage";
import BillingPage from "@/pages/BillingPage";
import { Coffee, Bell, Home, ClipboardList, Receipt, User } from "lucide-react";
import { useEffect } from "react";
import { useProfile } from "@/hooks/useProfile";
import { hasAccess } from "@/utils/auth";
import KitchenOrdersPanel from "@/components/KitchenOrdersPanel";
import { MenuItem } from "@/types/cafe";
import NotificationPanel from "@/components/NotificationPanel";

const Index = () => {
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("home");
  const { profile } = useProfile();
  const name = localStorage.getItem("name") || "";
  const email = localStorage.getItem("email") || "";
  const role = localStorage.getItem("role") || "";
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [notifications, setNotifications] = useState([]);
  const [showMobileNotifications, setShowMobileNotifications] = useState(false);

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
    getBackToActive,
    getTotal,
    fetchOrders,
    preparedAndServed,
  } = useOrders();

  const fetchCafeConfig = async () => {
    try {
      const response = await API.get("/auth/config");

      setTableCount(response.data.tableCount);
      setCafeName(response.data.cafeName);
    } catch (error) {
      console.error("Error fetching cafe config", error);
    }
  };

  const addNotification = async (
    title: string,
    message: string,
    type: "ORDER" | "BILL" | "MENU" | "CATEGORY",
    extra?: {
      tableNo?: number;
      orderId?: string;
      redirectTab?: string;
    }
  ) => {
    try {
      const response = await API.post("/notifications", {
        title,
        message,
        type,

        tableNo: extra?.tableNo,

        orderId: extra?.orderId,

        redirectTab: extra?.redirectTab,
      });

      setNotifications((prev) => [response.data, ...prev]);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await API.get("/notifications");

      const sortedNotifications = response.data.sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setNotifications(sortedNotifications);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchMenuItems = async () => {
    try {
      const response = await API.get("/menu");

      setMenuItems(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchCafeConfig();
    fetchMenuItems();
    fetchNotifications();
  }, []);

  const handleStatClick = (stat: string) => {
    if (stat === "orders" || stat === "paid") setActiveTab("orders");
    if (stat === "menu") setActiveTab("menu");
  };

  const handleNotificationClick = (notification: any) => {
    console.log(notification);

    // MENU PAGE
    if (notification.type === "MENU" || notification.type === "CATEGORY") {
      setActiveTab("menu");

      setShowMobileNotifications(false);

      return;
    }

    // PAID ORDERS -> ORDERS TAB
    if (notification.title === "Payment Received") {
      setActiveTab("orders");

      setShowMobileNotifications(false);

      return;
    }

    // ACTIVE / PREPARED / BILLED
    if (notification.tableNo !== undefined) {
      setActiveTab("home");

      setSelectedTable(notification.tableNo);

      setShowMobileNotifications(false);

      return;
    }
  };

  const [tableCount, setTableCount] = useState(0);
  const [cafeName, setCafeName] = useState("");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}

      <header className="sticky top-0 z-40 bg-primary text-primary-foreground shadow-lg">
        <div className="relative w-full px-4 sm:px-6 h-16 flex items-center">
          {/* LEFT */}
          <div className="flex items-center gap-3 z-10">
            <div className="p-1.5 rounded-xl bg-primary-foreground/10 backdrop-blur-sm">
              <Coffee className="w-5 h-5" />
            </div>

            <h1 className="text-lg sm:text-xl font-display font-bold tracking-tight">
              {cafeName}
            </h1>
          </div>

          {/* DESKTOP NAV */}

          <div className="hidden md:flex absolute left-[52%] -translate-x-1/2 items-center gap-12">
            <button
              onClick={() => setActiveTab("home")}
              className={`flex items-center gap-2 text-[17px] font-semibold transition
        ${
          activeTab === "home"
            ? "text-white"
            : "text-primary-foreground/70 hover:text-white"
        }`}
            >
              <Home className="w-5 h-5" />
              Home
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              className={`flex items-center gap-2 text-[17px] font-semibold transition
        ${
          activeTab === "orders"
            ? "text-white"
            : "text-primary-foreground/70 hover:text-white"
        }`}
            >
              <ClipboardList className="w-5 h-5" />
              Orders
            </button>

            {(role === "ADMIN" || role === "MANAGER") && (
              <button
                onClick={() => setActiveTab("billing")}
                className={`flex items-center gap-2 text-[17px] font-semibold transition
        ${
          activeTab === "billing"
            ? "text-white"
            : "text-primary-foreground/70 hover:text-white"
        }`}
              >
                <Receipt className="w-4 h-4" />
                Billing
              </button>
            )}

            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-2 text-[17px] font-semibold transition
        ${
          activeTab === "profile"
            ? "text-white"
            : "text-primary-foreground/70 hover:text-white"
        }`}
            >
              <User className="w-4 h-4" />
              Profile
            </button>
          </div>

          {/* RIGHT */}
          <div className="ml-auto flex items-center gap-3 z-10">
            {/* MOBILE NOTIFICATION BUTTON */}
            <button
              onClick={() => setShowMobileNotifications(true)}
              className="md:hidden relative"
            >
              <Bell className="w-5 h-5" />
            </button>

            {/* DESKTOP NOTIFICATION ICON */}
            <button className="hidden md:block relative">
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      {activeTab === "home" && (
        <main className="w-full px-3 sm:px-6 xl:px-10 py-4 pb-24">
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_330px] gap-6">
            {/* LEFT SIDE */}
            <div className="space-y-6">
              <Dashboard
                tableCount={tableCount}
                menuItems={menuItems}
                todaysOrders={todaysOrders}
                todaysRevenue={todaysRevenue}
                getTotal={getTotal}
                getActiveOrder={getActiveOrder}
                onStatClick={handleStatClick}
              />
              <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6">
                {/* LEFT SIDE */}
                <TableGrid
                  tableCount={tableCount}
                  getActiveOrder={getActiveOrder}
                  getTotal={getTotal}
                  onSelectTable={setSelectedTable}
                />
                <KitchenOrdersPanel todaysOrders={todaysOrders} />
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="hidden xl:block space-y-6">
              <NotificationPanel
                notifications={notifications}
                onNotificationClick={handleNotificationClick}
              />
            </div>
          </div>
        </main>
      )}

      {activeTab === "orders" && <AllOrdersPage />}
      {activeTab === "billing" && hasAccess(["ADMIN", "MANAGER"]) && (
        <BillingPage />
      )}
      {activeTab === "profile" && <ProfilePage />}
      {activeTab === "menu" && <MenuPage addNotification={addNotification} />}

      {showMobileNotifications && (
        <div className="fixed inset-0 z-50 bg-black/40 xl:hidden">
          <div className="absolute right-0 top-0 h-full w-[90%] max-w-md bg-background shadow-2xl p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Notifications</h2>

              <button
                onClick={() => setShowMobileNotifications(false)}
                className="text-sm"
              >
                Close
              </button>
            </div>

            <NotificationPanel
              notifications={notifications}
              onNotificationClick={handleNotificationClick}
            />
          </div>
        </div>
      )}
      <div className="md:hidden">
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Order Panel Slide-over */}
      {selectedTable !== null && (
        <OrderPanel
          addNotification={addNotification}
          menuItems={menuItems}
          tableNo={selectedTable}
          order={getActiveOrder(selectedTable)}
          onClose={() => setSelectedTable(null)}
          onCreateOrder={createOrder}
          onAddItem={addItem}
          getBackToActive={getBackToActive}
          onRemoveItem={removeItem}
          onGenerateBill={generateBill}
          onAddMoreItem={addMoreItem}
          onCollectPayment={collectPayment}
          onPreparedAndServed={preparedAndServed}
          getTotal={getTotal}
        />
      )}
    </div>
  );
};

export default Index;
