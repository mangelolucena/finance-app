import { useEffect, useState } from "react";
import { View, Text, FlatList, Button } from "react-native";
import { router } from "expo-router";

import { getToken, removeToken } from "../src/lib/auth";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

type Transaction = {
    id: string;
    description: string;
    amount: string;
};

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        const token = await getToken();

        if (!token) {
            router.replace("/");
            return;
        }

        const response = await fetch(`${API_URL}/transactions`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();

        setTransactions(data);
    };

    const handleLogout = async () => {
        await removeToken();

        router.replace("/");
    };

    return (
        <View style={{ flex: 1, padding: 24 }}>
            <Button title="Logout" onPress={handleLogout} />

            <Text
                style={{
                    fontSize: 28,
                    fontWeight: "bold",
                    marginVertical: 16,
                }}
            >
                Transactions
            </Text>

            <FlatList
                data={transactions}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View
                        style={{
                            borderWidth: 1,
                            padding: 16,
                            borderRadius: 8,
                            marginBottom: 12,
                        }}
                    >
                        <Text style={{ fontWeight: "bold" }}>
                            {item.description}
                        </Text>

                        <Text>₱{item.amount}</Text>
                    </View>
                )}
            />
        </View>
    );
}
