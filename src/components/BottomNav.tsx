import { Home, Receipt, PieChart, User } from "lucide-react";
import { hasAccess } from "@/utils/auth";

export type TabKey = "home" | "orders" | "billing" | "profile" | "menu";

interface BottomNavProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

const tabs: { key: TabKey; label: string; icon: typeof Home }[] = [
  { key: "home", label: "Home", icon: Home },
  { key: "orders", label: "Orders", icon: Receipt },
  { key: "billing", label: "Billing", icon: PieChart },
  { key: "profile", label: "Profile", icon: User },
];

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const filteredTabs = tabs.filter((t) => {
    if (t.key === "billing") {
      return hasAccess(["ADMIN", "CASHIER"]); // 🔥 restrict
    }
    // if (t.key === "profile") {
    //   return hasAccess(["ADMIN"]);
    // }
    return true;
  });
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-t border-border/60 safe-area-bottom">
      <div className="max-w-lg mx-auto flex items-center justify-around py-2 px-2">
        {filteredTabs.map((t) => {
          const active = activeTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => onTabChange(t.key)}
              className={`flex flex-col items-center gap-0.5 py-1.5 px-4 rounded-xl transition-all duration-200
                ${
                  active
                    ? "text-primary scale-105"
                    : "text-muted-foreground hover:text-foreground"
                }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-colors ${
                  active ? "bg-primary/10" : ""
                }`}
              >
                <t.icon className="w-5 h-5" strokeWidth={active ? 2.5 : 2} />
              </div>
              <span className="text-[10px] font-medium">{t.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
