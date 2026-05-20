type FilterType = "all" | "income" | "expense";

type TransactionFilterProps = {
    filterType: FilterType;
    onFilterChange: (filter: FilterType) => void;
};

function TransactionFilter({
    filterType,
    onFilterChange,
}: TransactionFilterProps) {
    return (
        <div className="mb-4 flex gap-2">
            <button
                className={`rounded-lg px-4 py-2 shadow ${filterType === "all"
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700"
                    }`}
                onClick={() => onFilterChange("all")}
            >
                All
            </button>

            <button
                className={`rounded-lg px-4 py-2 shadow ${filterType === "income"
                        ? "bg-green-600 text-white"
                        : "bg-white text-gray-700"
                    }`}
                onClick={() => onFilterChange("income")}
            >
                Income
            </button>

            <button
                className={`rounded-lg px-4 py-2 shadow ${filterType === "expense"
                        ? "bg-red-600 text-white"
                        : "bg-white text-gray-700"
                    }`}
                onClick={() => onFilterChange("expense")}
            >
                Expense
            </button>
        </div>
    );
}

export default TransactionFilter;