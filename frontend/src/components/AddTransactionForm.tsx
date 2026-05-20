import type { Category } from "../types/category";

type AddTransactionFormProps = {
    description: string;
    amount: string;
    onDescriptionChange: (value: string) => void;
    onAmountChange: (value: string) => void;
    onSubmit: () => void;
    categories: Category[];
    selectedCategoryId: string;
    onCategoryChange: (value: string) => void;
    transactionType: "income" | "expense"
    onTransactionTypeChange: (value: "income" | "expense") => void;
    isEditing?: boolean;
};



function AddTransactionForm({
    description,
    amount,
    onDescriptionChange,
    onAmountChange,
    onSubmit,
    selectedCategoryId,
    onCategoryChange,
    categories,
    transactionType,
    onTransactionTypeChange,
    isEditing = false,
}: AddTransactionFormProps) {
    return (
        <div className="mb-6 rounded-xl bg-white p-4 shadow">

            <h2 className="mb-4 text-lg font-semibold">
                {isEditing ? "Edit Transaction" : "Add Transaction"}
            </h2>

            <div className="flex flex-col gap-3 md:flex-row">
                <input
                    className="rounded-lg border border-gray-300 px-3 py-2"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => onDescriptionChange(e.target.value)}
                />

                <input
                    className="rounded-lg border border-gray-300 px-3 py-2"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => onAmountChange(e.target.value)}
                />
                <select
                    className="rounded-lg border border-gray-300 px-3 py-2"
                    value={selectedCategoryId}
                    onChange={(e) => onCategoryChange(e.target.value)}
                >
                    <option value="">Select Category</option>

                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
                <select
                    className="rounded-lg border border-gray-300 px-3 py-2"
                    value={transactionType}
                    onChange={(e) =>
                        onTransactionTypeChange(e.target.value as "income" | "expense")
                    }
                >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                </select>

                <button
                    className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
                    onClick={onSubmit}
                >
                    {isEditing ? "Update" : "Add"}
                </button>
            </div>
        </div>
    );
}

export default AddTransactionForm;