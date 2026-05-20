import type { Transaction } from "../types/transaction";


type TransactionCardProps = {
    transaction: Transaction;
    onDelete: (id: string) => void;
    onEdit: (transaction: Transaction) => void;
};

function TransactionCard({
    transaction,
    onDelete,
    onEdit,
}: TransactionCardProps) {
    const { id, description, amount, type, category_name } = transaction;

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
            <div className="flex gap-2">
                <button
                    className="rounded-lg bg-red-100 px-3 py-1 text-sm font-medium text-red-700 hover:bg-red-200"
                    onClick={() => onDelete(id)}
                >
                    Delete
                </button>
                <button
                    className="rounded-lg bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-200"
                    onClick={() => onEdit(transaction)}
                >
                    Edit
                </button>
            </div>
        </div>
    );
}

export default TransactionCard;