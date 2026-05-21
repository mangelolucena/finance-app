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
    validationErrors?: {
        description?: string;
        amount?: string;
        category?: string;
    };
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
    validationErrors = {},
}: AddTransactionFormProps) {
    return (
        <div className="mb-6 rounded-xl bg-white p-4 shadow">

            <h2 className="mb-4 text-lg font-semibold">
                {isEditing ? "Edit Transaction" : "Add Transaction"}
            </h2>

            <div className="flex flex-col gap-3 md:flex-row">
                <div className="flex-1">
                    <input
                        className={`w-full rounded-lg border px-3 py-2 ${validationErrors.description ? "border-red-500 bg-red-50" : "border-gray-300"}`}
                        placeholder="Description"
                        value={description}
                        onChange={(e) => onDescriptionChange(e.target.value)}
                    />
                    {validationErrors.description && (
                        <p className="mt-1 text-sm text-red-600">{validationErrors.description}</p>
                    )}
                </div>

                <div className="flex-1">
                    <input
                        className={`w-full rounded-lg border px-3 py-2 ${validationErrors.amount ? "border-red-500 bg-red-50" : "border-gray-300"}`}
                        placeholder="Amount"
                        value={amount}
                        onChange={(e) => onAmountChange(e.target.value)}
                    />
                    {validationErrors.amount && (
                        <p className="mt-1 text-sm text-red-600">{validationErrors.amount}</p>
                    )}
                </div>

                <div className="flex-1">
                    <select
                        className={`w-full rounded-lg border px-3 py-2 ${validationErrors.category ? "border-red-500 bg-red-50" : "border-gray-300"}`}
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
                    {validationErrors.category && (
                        <p className="mt-1 text-sm text-red-600">{validationErrors.category}</p>
                    )}
                </div>
                <div className="flex-1">
                    <select
                        className="w-full flex-1 rounded-lg border border-gray-300 px-3 py-2  "
                        value={transactionType}
                        onChange={(e) =>
                            onTransactionTypeChange(e.target.value as "income" | "expense")
                        }
                    >
                        <option value="expense">Expense</option>
                        <option value="income">Income</option>
                    </select>
                </div>
                <div className="flex-1">
                    <button
                        className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
                        onClick={onSubmit}
                    >
                        {isEditing ? "Update" : "Add"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddTransactionForm;