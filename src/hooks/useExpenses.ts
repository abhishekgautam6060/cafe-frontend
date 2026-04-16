import { useState, useEffect } from "react";
import API from "@/services/api";

export interface Expense {
id?: number;
title: string;
amount: number;
category: string;
expense_date: string;
}

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch expenses
  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const res = await API.get("/expenses");
      setExpenses(res.data);
    } catch (err) {
      console.error("Error fetching expenses", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Add expense
  const addExpense = async (expense: Expense) => {
    try {
      const res = await API.post("/expenses", expense);
      setExpenses((prev) => [...prev, res.data]);
    } catch (err) {
      console.error("Error adding expense", err);
    }
  };

  // ✅ Delete expense
  const deleteExpense = async (id: number) => {
    try {
      await API.delete(`/expenses/${id}`);
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error("Error deleting expense", err);
    }
  };

  // ✅ Load on mount
  useEffect(() => {
    fetchExpenses();
  }, []);

  return {
    expenses,
    loading,
    addExpense,
    deleteExpense,
    fetchExpenses,
  };
}
