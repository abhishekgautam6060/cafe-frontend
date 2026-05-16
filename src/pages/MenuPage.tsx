import { MenuItem } from "@/types/cafe";
import API from "@/services/api";
import { useEffect, useState } from "react";
import { hasAccess } from "@/utils/auth";
import { Pencil, Trash2 } from "lucide-react";

interface MenuPageProps {
  addNotification: (
    title: string,
    message: string,
    type: "ORDER" | "BILL" | "MENU" | "CATEGORY",
    extra?: any
  ) => void;
}

interface Category {
  id: number;
  name: string;
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

  const [categories, setCategories] = useState<Category[]>([]);

  const [activeCategory, setActiveCategory] = useState("ALL");

  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const [showItemModal, setShowItemModal] = useState(false);

  const [newCategory, setNewCategory] = useState("");

  const [itemName, setItemName] = useState("");

  const [itemPrice, setItemPrice] = useState("");

  const [selectedCategory, setSelectedCategory] = useState<number | string>("");

  useEffect(() => {
    fetchMenuItems();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await API.get("/categories");

      setCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  const createCategory = async () => {
    try {
      if (!newCategory.trim()) return;

      await API.post("/categories", {
        name: newCategory,
      });

      fetchCategories();

      setShowCategoryModal(false);

      setNewCategory("");

      await createNotification(
        "New Category",
        `${newCategory} category created`,
        "CATEGORY"
      );
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
        category: {
          id: Number(selectedCategory),
        },
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
    } catch (error) {
      console.error("Failed to fetch menu items:", error);
    }
  };

  const deleteMenuItem = async (id: number) => {
    try {
      await API.delete(`/menu/${id}`);

      fetchMenuItems();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteCategory = async (id: number) => {
    try {
      await API.delete(`/categories/${id}`);

      fetchCategories();

      setActiveCategory("ALL");
    } catch (error) {
      console.error(error);
    }
  };

  const editCategory = async (category: Category) => {
    try {
      const updated = prompt("Edit category", category.name);

      if (!updated) return;

      await API.put(`/categories/${category.id}`, {
        name: updated,
      });

      fetchCategories();
    } catch (error) {
      console.error(error);
    }
  };

  const editMenuItem = async (item: MenuItem) => {
    try {
      const updatedName = prompt("Item name", item.name);

      if (!updatedName) return;

      const updatedPrice = prompt("Item price", item.price.toString());

      if (!updatedPrice) return;

      await API.put(`/menu/${item.id}`, {
        name: updatedName,
        price: Number(updatedPrice),
        category: item.category,
      });

      fetchMenuItems();
    } catch (error) {
      console.error(error);
    }
  };

  const filteredItems =
    activeCategory === "ALL"
      ? menuItems
      : menuItems.filter((i) => i.category?.name === activeCategory);

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
        {/* ALL BUTTON */}
        <button
          onClick={() => setActiveCategory("ALL")}
          className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap
      ${activeCategory === "ALL" ? "bg-primary text-white" : "bg-muted"}`}
        >
          ALL
        </button>

        {categories.map((c) => (
          <div key={c.id} className="group flex items-center gap-2">
            {/* CATEGORY BUTTON */}
            <button
              onClick={() => setActiveCategory(c.name)}
              className={`px-5 py-3 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all duration-200
      ${
        c.name === activeCategory
          ? "bg-primary text-white shadow-md"
          : "bg-muted hover:bg-muted/70"
      }`}
            >
              {c.name}
            </button>

            {/* ACTION BUTTONS */}
            {hasAccess(["ADMIN", "MANAGER"]) && (
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                {/* EDIT */}
                <button
                  onClick={() => editCategory(c)}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border shadow-sm hover:bg-blue-50 hover:border-blue-200 transition"
                >
                  <Pencil size={16} className="text-blue-600" />
                </button>

                {/* DELETE */}
                <button
                  onClick={() => deleteCategory(c.id)}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border shadow-sm hover:bg-red-50 hover:border-red-200 transition"
                >
                  <Trash2 size={16} className="text-red-500" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="group relative border border-border/60 rounded-3xl p-5 bg-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            {/* ACTION BUTTONS */}
            {hasAccess(["ADMIN", "MANAGER"]) && (
              <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                <button
                  onClick={() => editMenuItem(item)}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border shadow-sm hover:bg-blue-50 hover:border-blue-200 transition"
                >
                  <Pencil size={16} className="text-blue-600" />
                </button>

                <button
                  onClick={() => deleteMenuItem(item.id)}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border shadow-sm hover:bg-red-50 hover:border-red-200 transition"
                >
                  <Trash2 size={16} className="text-red-500" />
                </button>
              </div>
            )}

            <h3 className="text-lg font-semibold tracking-tight">
              {item.name}
            </h3>

            <p className="text-xl font-bold mt-3 text-primary">₹{item.price}</p>

            <p className="text-sm mt-3 text-muted-foreground">
              {item.category?.name}
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
                <option key={c.id} value={c.id}>
                  {c.name}
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
