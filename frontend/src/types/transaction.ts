export type Transaction = {
    id: string;
    amount: string;
    type: "income" | "expense";
    description: string;
    transaction_date: string;
    category_name: string | null;
};