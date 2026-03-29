import { TABLE_COUNT, Order, OrderItem } from '@/types/cafe';
import { UtensilsCrossed, Sparkles, ShoppingBag } from 'lucide-react';

interface TableGridProps {
  getActiveOrder: (tableNo: number) => Order | undefined;
  getTotal: (items: OrderItem[]) => number;
  onSelectTable: (tableNo: number) => void;
}

export default function TableGrid({ getActiveOrder, getTotal, onSelectTable }: TableGridProps) {
  const tables = Array.from({ length: TABLE_COUNT }, (_, i) => i + 1);
  const takeawayOrder = getActiveOrder(0);

  return (
    <div>
      {/* Takeaway Button */}
      <div className="mb-6">
        <button
          onClick={() => onSelectTable(0)}
          className={`w-full group relative rounded-2xl p-5 border-2 transition-all duration-200 hover:shadow-lg flex items-center gap-4
            ${takeawayOrder
              ? takeawayOrder.status === 'billed'
                ? 'border-warning bg-gradient-to-r from-warning/10 to-warning/5 shadow-warning/10 shadow-md'
                : 'border-accent bg-gradient-to-r from-accent/10 to-accent/5 shadow-accent/10 shadow-md'
              : 'border-border bg-card hover:border-primary/40 hover:shadow-md'
            }`}
        >
          <div className={`p-3 rounded-xl transition-colors ${takeawayOrder ? 'bg-accent/15' : 'bg-muted group-hover:bg-primary/10'}`}>
            <ShoppingBag className={`w-6 h-6 ${takeawayOrder ? 'text-accent' : 'text-muted-foreground group-hover:text-primary'}`} />
          </div>
          <div className="text-left">
            <span className="font-bold text-lg">Takeaway</span>
            <p className="text-xs text-muted-foreground">No table — grab & go</p>
          </div>
          {takeawayOrder && (
            <span className="ml-auto text-sm font-medium text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
              ₹{getTotal(takeawayOrder.items)}
            </span>
          )}
          {takeawayOrder?.status === 'billed' && (
            <span className="absolute -top-1.5 -right-1.5 bg-warning text-warning-foreground text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm animate-pulse">
              BILL
            </span>
          )}
        </button>
      </div>

      <h2 className="text-xl font-display font-bold mb-5 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-accent" />
        Tables
      </h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4">
        {tables.map(t => {
          const order = getActiveOrder(t);
          const hasOrder = !!order;
          const isBilled = order?.status === 'billed';

          return (
            <button
              key={t}
              onClick={() => onSelectTable(t)}
              className={`group relative rounded-2xl p-5 border-2 transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95 flex flex-col items-center gap-2
                ${isBilled
                  ? 'border-warning bg-gradient-to-b from-warning/10 to-warning/5 shadow-warning/10 shadow-md'
                  : hasOrder
                    ? 'border-accent bg-gradient-to-b from-accent/10 to-accent/5 shadow-accent/10 shadow-md'
                    : 'border-border bg-card hover:border-primary/40 hover:shadow-md'
                }`}
            >
              <div className={`p-2 rounded-xl transition-colors ${hasOrder ? 'bg-accent/15' : 'bg-muted group-hover:bg-primary/10'}`}>
                <UtensilsCrossed className={`w-6 h-6 ${hasOrder ? 'text-accent' : 'text-muted-foreground group-hover:text-primary'}`} />
              </div>
              <span className="font-bold text-lg">T{t}</span>
              {order && (
                <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
                  ₹{getTotal(order.items)}
                </span>
              )}
              {isBilled && (
                <span className="absolute -top-1.5 -right-1.5 bg-warning text-warning-foreground text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm animate-pulse">
                  BILL
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
