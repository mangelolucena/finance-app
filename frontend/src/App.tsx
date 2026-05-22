import { useEffect, useState } from "react";
import TransactionCard from "./components/TransactionCard";
import AddTransactionForm from "./components/AddTransactionForm";
import SummaryCards from "./components/SummaryCards";
import TransactionFilter from "./components/TransactionFilter";
import LoginForm from "./components/LoginForm";
import type { Transaction } from "./types/transaction";
import type { Category } from "./types/category";

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [editingTransactionId, setEditingTransactionId] = useState<string | null>(null);
  const [transactionType, setTransactionType] =
    useState<"income" | "expense">("expense");
  const [validationErrors, setValidationErrors] = useState<{
    description?: string;
    amount?: string;
    category?: string;
  }>({});
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || "";
  });

  const fetchInitialData = async () => {
    try {
      setLoading(true);

      const transactionsResponse = await fetch(
        "http://localhost:3000/transactions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      );

      if (!transactionsResponse.ok) {
        throw new Error("Failed to fetch transactions");
      }

      const transactionsData: Transaction[] =
        await transactionsResponse.json();

      setTransactions(transactionsData);

      const categoriesResponse = await fetch(
        "http://localhost:3000/categories/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!categoriesResponse.ok) {
        throw new Error("Failed to fetch categories");
      }

      const categoriesData: Category[] =
        await categoriesResponse.json();

      setCategories(categoriesData);
    } catch (error) {
      setError("Something went wrong while loading data.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (!token) return;
    fetchInitialData();
  }, [token]);

  const validateForm = (): boolean => {
    const errors: typeof validationErrors = {};

    if (!description.trim()) {
      errors.description = "Description is required";
    }

    if (!amount) {
      errors.amount = "Amount is required";
    } else if (isNaN(Number(amount)) || Number(amount) <= 0) {
      errors.amount = "Amount must be a valid positive number";
    }

    if (!selectedCategoryId) {
      errors.category = "Please select a category";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddTransaction = async () => {
    if (!validateForm()) {
      showToast("Please fill all the fields", "error");
      return;
    }
    if (editingTransactionId) {
      try {
        await fetch(`http://localhost:3000/transactions/${editingTransactionId}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            category_id: selectedCategoryId,
            amount: Number(amount),
            type: transactionType,
            description,
            transaction_date: new Date(),
          }),
        });
        setEditingTransactionId(null);
        setValidationErrors({});
        setDescription("");
        setAmount("");
        setSelectedCategoryId("");
        setValidationErrors({});
        fetchInitialData();
        showToast("Transaction updated successfully", "success");
      } catch (error) {
        console.error(error);
        showToast("Failed to update transaction", "error");
      }
    } else {
      // existing POST logic here
      try {
        const response = await fetch("http://localhost:3000/transactions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            category_id: selectedCategoryId,
            amount: Number(amount),
            type: transactionType,
            description,
            transaction_date: new Date(),
          }),
        });

        const newTransaction = await response.json();

        const selectedCategory = categories.find(
          (category) => category.id === selectedCategoryId
        );

        const transactionWithCategoryName = {
          ...newTransaction,
          category_name: selectedCategory?.name ?? null,
        };

        setTransactions((prev) => [transactionWithCategoryName, ...prev]);

        setDescription("");
        setAmount("");
        setSelectedCategoryId("");
        setValidationErrors({});
        fetchInitialData();
        showToast("Transaction added successfully", "success");
      } catch (error) {
        console.error(error);
        showToast("Failed to add transaction", "error");
      }
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      await fetch(`http://localhost:3000/transactions/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTransactions((prev) =>
        prev.filter((transaction) => transaction.id !== id)
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleStartEdit = (transaction: Transaction) => {
    setEditingTransactionId(transaction.id);
    setDescription(transaction.description);
    setAmount(transaction.amount);
    setTransactionType(transaction.type);
    setSelectedCategoryId(transaction.category_id);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    setTransactions([]);
  };

  const totalIncome = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((sum, transaction) => sum + Number(transaction.amount), 0);

  const totalExpenses = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((sum, transaction) => sum + Number(transaction.amount), 0);

  const balance = totalIncome - totalExpenses;

  const filteredTransactions =
    filterType === "all"
      ? transactions
      : transactions.filter((transaction) => transaction.type === filterType);

  if (!token) {
    return (
      <LoginForm
        onLogin={(newToken) => {
          localStorage.setItem("token", newToken);
          setToken(newToken);
        }}
      />
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Finance App</h1>
          <button
            className="rounded-lg bg-gray-900 px-4 py-2 text-white hover:bg-gray-700"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
        {toast && (
          <div className={`mb-4 rounded-lg p-4 text-white ${toast.type === "success" ? "bg-green-500" : "bg-red-500"}`}>
            {toast.message}
          </div>
        )}

        <SummaryCards
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
          balance={balance}
        />
        {editingTransactionId && (
          <p className="mb-4 text-sm text-blue-600">
            Editing transaction: {editingTransactionId}
          </p>
        )}
        <AddTransactionForm
          description={description}
          amount={amount}
          onDescriptionChange={setDescription}
          onAmountChange={setAmount}
          onSubmit={handleAddTransaction}
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onCategoryChange={setSelectedCategoryId}
          transactionType={transactionType}
          onTransactionTypeChange={setTransactionType}
          isEditing={!!editingTransactionId}
          validationErrors={validationErrors}
        />

        <TransactionFilter
          filterType={filterType}
          onFilterChange={setFilterType}
        />

        {loading && <p className="text-gray-500">Loading transactions...</p>}

        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && filteredTransactions.length === 0 && (
          <p className="text-gray-500">No transactions found.</p>
        )}
        <div className="space-y-3">
          {filteredTransactions.map((transaction) => (
            <TransactionCard
              key={transaction.id}
              transaction={transaction}
              onDelete={handleDeleteTransaction}
              onEdit={handleStartEdit}
            />
          ))}
        </div>
      </div>
    </main>
  );
}

export default App;