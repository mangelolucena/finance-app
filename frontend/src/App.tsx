import { useEffect, useState } from "react";

type Transaction = {
  id: string;
  amount: string;
  type: "income" | "expense";
  description: string;
  transaction_date: string;
  category_name: string | null;
};

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // useEffect(() => {
  //   fetch("http://localhost:3000/transactions")
  //     .then((res) => res.json())
  //     .then((data: Transaction[]) => setTransactions(data))
  //     .catch((error) => console.error(error));
  // }, []);

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

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-white p-4 shadow">
            <p className="text-sm text-gray-500">Income</p>
            <p className="text-2xl font-bold text-green-600">₱{totalIncome}</p>
          </div>

          <div className="rounded-xl bg-white p-4 shadow">
            <p className="text-sm text-gray-500">Expenses</p>
            <p className="text-2xl font-bold text-red-600">₱{totalExpenses}</p>
          </div>

          <div className="rounded-xl bg-white p-4 shadow">
            <p className="text-sm text-gray-500">Balance</p>
            <p className="text-2xl font-bold text-gray-900">₱{balance}</p>
          </div>
        </div>

        <div className="mb-6 rounded-xl bg-white p-4 shadow">
          <h2 className="mb-4 text-lg font-semibold">Add Transaction</h2>

          <div className="flex flex-col gap-3 md:flex-row">
            <input
              className="rounded-lg border border-gray-300 px-3 py-2"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <input
              className="rounded-lg border border-gray-300 px-3 py-2"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <button
              className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
              onClick={handleAddTransaction}
            >
              Add Transaction
            </button>
          </div>
        </div>

        <div className="mb-4 flex gap-2">
          <button
            className={`rounded-lg px-4 py-2 shadow ${filterType === "all"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700"
              }`}
            onClick={() => setFilterType("all")}>
            All
          </button>

          <button
            className={`rounded-lg px-4 py-2 shadow ${filterType === "income"
              ? "bg-green-600 text-white"
              : "bg-white text-gray-700"
              }`}
            onClick={() => setFilterType("income")}>
            Income
          </button>

          <button
            className={`rounded-lg px-4 py-2 shadow ${filterType === "expense"
              ? "bg-red-600 text-white"
              : "bg-white text-gray-700"
              }`}
            onClick={() => setFilterType("expense")}>
            Expense
          </button>
        </div>

        {loading && <p className="text-gray-500">Loading transactions...</p>}

        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && filteredTransactions.length === 0 && (
          <p className="text-gray-500">No transactions found.</p>
        )}

        <div className="space-y-3">
          {filteredTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between rounded-xl bg-white p-4 shadow"
            >
              <div>
                <strong className="text-gray-900">{transaction.description}</strong>
                <p className="text-sm text-gray-500">
                  {transaction.type} - ₱{transaction.amount} - {transaction.category_name}
                </p>
              </div>

              <button
                className="rounded-lg bg-red-100 px-3 py-1 text-sm font-medium text-red-700 hover:bg-red-200"
                onClick={() => handleDeleteTransaction(transaction.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default App;