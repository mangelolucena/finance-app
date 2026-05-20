import { useEffect, useState } from "react";
import TransactionCard from "./components/TransactionCard";
import AddTransactionForm from "./components/AddTransactionForm";
import SummaryCards from "./components/SummaryCards";
import TransactionFilter from "./components/TransactionFilter";
import type { Transaction } from "./types/transaction";

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);

        await new Promise((resolve) => setTimeout(resolve, 1000));

        const response = await fetch("http://localhost:3000/transactions");

        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }

        const data: Transaction[] = await response.json();
        setTransactions(data);
      } catch (error) {
        setError("Something went wrong while loading transactions.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const handleAddTransaction = async () => {
    try {
      const response = await fetch("http://localhost:3000/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: "36dba13f-f67f-4c64-94a1-7ec8dd29353c",
          category_id: "98d0729d-fea8-4d75-bd02-d185979c7b66",
          amount: Number(amount),
          type: "expense",
          description,
          transaction_date: new Date(),
        }),
      });

      const newTransaction = await response.json();

      setTransactions((prev) => [newTransaction, ...prev]);

      setDescription("");
      setAmount("");

    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      await fetch(`http://localhost:3000/transactions/${id}`, {
        method: "DELETE",
      });

      setTransactions((prev) =>
        prev.filter((transaction) => transaction.id !== id)
      );
    } catch (error) {
      console.error(error);
    }
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

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">Finance App</h1>

        <SummaryCards
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
          balance={balance}
        />

        <AddTransactionForm
          description={description}
          amount={amount}
          onDescriptionChange={setDescription}
          onAmountChange={setAmount}
          onSubmit={handleAddTransaction}
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
              id={transaction.id}
              description={transaction.description}
              amount={transaction.amount}
              type={transaction.type}
              category_name={transaction.category_name}
              onDelete={handleDeleteTransaction}
            />
          ))}
        </div>
      </div>
    </main>
  );
}

export default App;