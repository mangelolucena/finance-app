type Transaction = {
  id: string;
  description: string;
  amount: string;
  type: "income" | "expense";
  category_id: string;
  category_name: string | null;
  transaction_date: string;
};

export default Transaction;