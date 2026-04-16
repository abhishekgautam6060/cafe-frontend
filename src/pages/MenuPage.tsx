import { MENU_ITEMS } from "@/types/cafe";
import { useState } from "react";

const categories = [...new Set(MENU_ITEMS.map((i) => i.category))];

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  const filteredItems = MENU_ITEMS.filter((i) => i.category === activeCategory);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 pb-24">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-4">Menu</h1>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto mb-4">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActiveCategory(c)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap
              ${c === activeCategory ? "bg-primary text-white" : "bg-muted"}`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="border rounded-xl p-4 bg-card hover:shadow-md transition"
          >
            <h3 className="font-semibold">{item.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">₹{item.price}</p>
            <p className="text-xs mt-2 text-muted-foreground">
              {item.category}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
