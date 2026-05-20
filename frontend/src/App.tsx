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
    <main style={{ padding: 24 }}>

      <div style={{ marginBottom: 16 }}>
        <button onClick={() => setFilterType("all")}>All</button>
        <button onClick={() => setFilterType("income")}>Income</button>
        <button onClick={() => setFilterType("expense")}>Expense</button>
      </div>
      <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
        <div>
          <strong>Income</strong>
          <p>₱{totalIncome}</p>
        </div>

        <div>
          <strong>Expenses</strong>
          <p>₱{totalExpenses}</p>
        </div>

        <div>
          <strong>Balance</strong>
          <p>₱{balance}</p>
        </div>
      </div>
      <h1>Finance App</h1>
      <div style={{ marginBottom: 24 }}>
        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <button onClick={handleAddTransaction}>
          Add Transaction
        </button>
      </div>
      {loading && <p>Loading transactions...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && filteredTransactions.length === 0 && (
        <p>No transactions found.</p>
      )}
      {filteredTransactions.map((transaction) => (
        <div key={transaction.id}>
          <strong>{transaction.description}</strong>
          <p>
            {transaction.type} - ₱{transaction.amount} -{" "}
            {transaction.category_name}
          </p>

          <button onClick={() => handleDeleteTransaction(transaction.id)}>
            Delete
          </button>
        </div>
      ))}
    </main>
  );
}

export default App;