import { Order, OrderItem } from '@/types/cafe';
import { Badge } from '@/components/ui/badge';
import { Receipt } from 'lucide-react';

interface OrderHistoryProps {
  orders: Order[];
  getTotal: (items: OrderItem[]) => number;
}

export default function OrderHistory({ orders, getTotal }: OrderHistoryProps) {
  const sorted = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div>
      <h2 className="text-xl font-display font-bold mb-5 flex items-center gap-2">
        <Receipt className="w-5 h-5 text-accent" />
        Today's Orders
      </h2>
      {sorted.length === 0 ? (
        <div className="text-center py-16">
          <div className="inline-flex p-4 rounded-2xl bg-muted/50 mb-4">
            <Receipt className="w-10 h-10 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">No orders today yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map(order => (
            <div key={order.id} className="bg-card border rounded-2xl p-5 flex items-center justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="font-bold text-base">{order.tableNo === 0 ? 'Takeaway' : `Table ${order.tableNo}`}</span>
                  <Badge
                    variant={order.status === 'paid' ? 'default' : order.status === 'billed' ? 'secondary' : 'outline'}
                    className={`rounded-full text-xs ${order.status === 'paid' ? 'bg-success text-success-foreground' : ''}`}
                  >
                    {order.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {order.items.length} items • {new Date(order.createdAt).toLocaleTimeString()}
                  {order.paymentMethod && ` • ${order.paymentMethod.toUpperCase()}`}
                </p>
              </div>
              <span className="font-display font-bold text-xl">₹{getTotal(order.items)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
