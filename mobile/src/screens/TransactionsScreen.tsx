import { useEffect, useState } from "react";
import { Button, FlatList, Text, View } from "react-native";
import { apiFetch } from "../api/api";
import { SafeAreaView } from "react-native-safe-area-context";

type Transaction = {
    id: string;
    description: string;
    amount: string;
    type: "income" | "expense";
    category_name: string | null;
};

type Props = {
    token: string;
    onLogout: () => void;
};

export default function TransactionsScreen({ token, onLogout }: Props) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    const fetchTransactions = async () => {
        const response = await apiFetch("/transactions", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();
        setTransactions(data);
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    return (
        <SafeAreaView style={{ flex: 1, padding: 24 }}>
            <Button title="Logout" onPress={onLogout} />

            <Text style={{ fontSize: 28, fontWeight: "bold", marginVertical: 16 }}>
                Transactions
            </Text>

            <FlatList
                data={transactions}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={{ padding: 16, borderWidth: 1, borderRadius: 8, marginBottom: 12 }}>
                        <Text style={{ fontWeight: "bold" }}>{item.description}</Text>
                        <Text>
                            {item.type} - ₱{item.amount} - {item.category_name}
                        </Text>
                    </View>
                )}
            />
        </SafeAreaView>
    );
}
