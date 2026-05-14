import { AppNotification } from "@/types/cafe";
import { Bell, ClipboardList, Receipt, Coffee, Tags } from "lucide-react";
import { API } from "@/services/api";

interface Props {
  notifications: AppNotification[];
  onNotificationClick: (notification: any) => void;
}
export interface NotificationItem {
  id: number;

  title: string;

  message: string;

  type: string;

  createdAt: string;

  tableNo?: number;

  orderId?: string;

  redirectTab?: string;
}

export default function NotificationPanel({
  notifications,
  onNotificationClick,
}: Props) {
  const getIcon = (type: string) => {
    switch (type) {
      case "ORDER":
        return <ClipboardList className="w-4 h-4 text-accent" />;

      case "BILL":
        return <Receipt className="w-4 h-4 text-green-600" />;

      case "MENU":
        return <Coffee className="w-4 h-4 text-primary" />;

      case "CATEGORY":
        return <Tags className="w-4 h-4 text-warning" />;

      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  return (
    <div className="rounded-3xl border bg-card p-5 shadow-sm min-h-[650px]">
      <div className="flex items-center gap-2 mb-5">
        <div className="p-2 rounded-xl bg-primary/10">
          <Bell className="w-5 h-5 text-primary" />
        </div>

        <div>
          <h2 className="font-display font-bold text-lg">Notifications</h2>

          <p className="text-xs text-muted-foreground">Recent activity</p>
        </div>
      </div>

      <div className="space-y-3 max-h-[650px] overflow-y-auto pr-1">
        {notifications.length === 0 && (
          <p className="text-sm text-muted-foreground">No notifications yet</p>
        )}

        {notifications.map((n) => (
          <button
            key={n.id}
            onClick={() => onNotificationClick(n)}
            className="
            w-full
            text-left
            rounded-3xl
            border
            bg-background/60
            p-4
            transition-all
            duration-200
            hover:shadow-lg
            hover:border-primary/30
            hover:-translate-y-1
            active:scale-[0.98]
          "
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">{getIcon(n.type)}</div>

              <div className="flex-1">
                <h3 className="text-sm font-semibold">{n.title}</h3>

                <p className="text-xs text-muted-foreground mt-1">
                  {n.message}
                </p>

                <span className="text-[10px] text-muted-foreground mt-2 block">
                  {new Date(n.createdAt).toLocaleDateString("en-GB")}{" "}
                  &nbsp;&nbsp;
                  {new Date(n.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
