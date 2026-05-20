type SummaryCardsProps = {
    totalIncome: number;
    totalExpenses: number;
    balance: number;
};

function SummaryCards({
    totalIncome,
    totalExpenses,
    balance,
}: SummaryCardsProps) {
    return (
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-white p-4 shadow">
                <p className="text-sm text-gray-500">Income</p>

                <p className="text-2xl font-bold text-green-600">
                    ₱{totalIncome}
                </p>
            </div>

            <div className="rounded-xl bg-white p-4 shadow">
                <p className="text-sm text-gray-500">Expenses</p>

                <p className="text-2xl font-bold text-red-600">
                    ₱{totalExpenses}
                </p>
            </div>

            <div className="rounded-xl bg-white p-4 shadow">
                <p className="text-sm text-gray-500">Balance</p>

                <p className="text-2xl font-bold text-gray-900">
                    ₱{balance}
                </p>
            </div>
        </div>
    );
}

export default SummaryCards;