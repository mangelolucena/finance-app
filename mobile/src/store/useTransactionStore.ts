import { create } from "zustand";
import Transaction from "../types/transaction";

type FilterType = "all" | "income" | "expense";

type TransactionStore = {
  filter: FilterType;
  setFilter: (filter: FilterType) => void;

  selectedCategory: string;
  setSelectedCategory: (categoryId: string) => void;

  transactionType: "income" | "expense";
  setTransactionType: (type: "income" | "expense") => void;

  editingId: string | null;
  setEditingId: (id: string | null) => void;

  transactions: Transaction[];
  setTransactions: (transactions: Transaction[]) => void;

};

export const useTransactionStore = create<TransactionStore>((set) => ({
  filter: "all",
  setFilter: (filter) => set({ filter }),

  selectedCategory: "",
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),

  transactionType: "expense",
  setTransactionType: (transactionType) => set({ transactionType }),

  editingId: null,
  setEditingId: (editingId) => set({ editingId }),

  transactions: [],
  setTransactions: (transactions) => set({ transactions }),

}));