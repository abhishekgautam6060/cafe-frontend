import { MenuItem } from "@/types/cafe";
import API from "@/services/api";
import { useEffect, useState } from "react";
import { hasAccess } from "@/utils/auth";

interface MenuPageProps {
  addNotification: (
    title: string,
    message: string,
    type: "ORDER" | "BILL" | "MENU" | "CATEGORY",
    extra?: any
  ) => void;
}
const createNotification = async (
  title: string,
  message: string,
  type: string
) => {
  try {
    await API.post("/notifications", {
      title,
      message,
      type,
    });
  } catch (error) {
    console.error(error);
  }
};

export default function MenuPage({ addNotification }: MenuPageProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  const [categories, setCategories] = useState<string[]>([]);

  const [activeCategory, setActiveCategory] = useState("");

  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const [showItemModal, setShowItemModal] = useState(false);

  const [newCategory, setNewCategory] = useState("");

  const [itemName, setItemName] = useState("");

  const [itemPrice, setItemPrice] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const createCategory = async () => {
    try {
      if (!newCategory.trim()) return;

      setCategories((prev) => [...prev, newCategory]);

      setShowCategoryModal(false);
      setNewCategory("");
    } catch (error) {
      console.error(error);
    }
  };

  const createMenuItem = async () => {
    try {
      if (!itemName || !itemPrice || !selectedCategory) return;

      await API.post("/menu", {
        name: itemName,
        price: Number(itemPrice),
        category: selectedCategory,
      });

      fetchMenuItems();

      setItemName("");
      setItemPrice("");
      setSelectedCategory("");

      setShowItemModal(false);
      await createNotification(
        "New Menu Item",
        `${itemName} added to ${selectedCategory}`,
        "MENU"
      );
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMenuItems = async () => {
    try {
      // Explicitly type the response data as MenuItem[]
      const response = await API.get<MenuItem[]>("/menu");

      setMenuItems(response.data);

      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set<string>(response.data.map((i) => i.category))
      );

      setCategories(uniqueCategories);

      if (uniqueCategories.length > 0) {
        setActiveCategory(uniqueCategories[0]);
      }
    } catch (error) {
      console.error("Failed to fetch menu items:", error);
    }
  };

  const filteredItems = menuItems.filter((i) => i.category === activeCategory);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 pb-24">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-4">Menu</h1>

      {hasAccess(["ADMIN", "MANAGER"]) && (
        <div className="flex gap-3 mb-5">
          <button
            onClick={() => setShowCategoryModal(true)}
            className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium"
          >
            + Add Category
          </button>

          <button
            onClick={() => setShowItemModal(true)}
            className="px-4 py-2 rounded-xl bg-accent text-white text-sm font-medium"
          >
            + Add Item
          </button>
        </div>
      )}

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
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-card rounded-2xl p-6 w-[90%] max-w-md">
            <h2 className="text-xl font-bold mb-4">Create Category</h2>

            <input
              type="text"
              placeholder="Category Name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full border rounded-xl px-4 py-3 mb-4 bg-background"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowCategoryModal(false)}
                className="px-4 py-2 rounded-xl bg-muted"
              >
                Cancel
              </button>

              <button
                onClick={createCategory}
                className="px-4 py-2 rounded-xl bg-primary text-white"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* item model  */}

      {showItemModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-card rounded-2xl p-6 w-[90%] max-w-md">
            <h2 className="text-xl font-bold mb-4">Add Menu Item</h2>

            <input
              type="text"
              placeholder="Item Name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="w-full border rounded-xl px-4 py-3 mb-3 bg-background"
            />

            <input
              type="number"
              placeholder="Price"
              value={itemPrice}
              onChange={(e) => setItemPrice(e.target.value)}
              className="w-full border rounded-xl px-4 py-3 mb-3 bg-background"
            />

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full border rounded-xl px-4 py-3 mb-4 bg-background"
            >
              <option value="">Select Category</option>

              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowItemModal(false)}
                className="px-4 py-2 rounded-xl bg-muted"
              >
                Cancel
              </button>

              <button
                onClick={createMenuItem}
                className="px-4 py-2 rounded-xl bg-primary text-white"
              >
                Add Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
