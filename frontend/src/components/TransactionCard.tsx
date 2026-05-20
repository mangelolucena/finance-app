type TransactionCardProps = {
    id: string;
    description: string;
    amount: string;
    type: "income" | "expense";
    category_name: string | null;
    onDelete: (id: string) => void;
};

function TransactionCard({
    id,
    description,
    amount,
    type,
    category_name,
    onDelete,
}: TransactionCardProps) {
    return (
        <div className="flex items-center justify-between rounded-xl bg-white p-4 shadow">
            <div>
                <strong className="text-gray-900">
                    {description}
                </strong>

                <p className="text-sm text-gray-500">
                    {type} - ₱{amount} - {category_name}
                </p>
            </div>

            <button
                className="rounded-lg bg-red-100 px-3 py-1 text-sm font-medium text-red-700 hover:bg-red-200"
                onClick={() => onDelete(id)}
            >
                Delete
            </button>
        </div>
    );
}

export default TransactionCard;