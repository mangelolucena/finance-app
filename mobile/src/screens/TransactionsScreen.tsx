import {
    View,
    Text,
    FlatList,
    Button,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useEffect, useState } from "react";

type Props = {
    token: string;
    onLogout: () => void;
};

type Transaction = {
    id: number;
    description: string;
    amount: string;
    type: string;
};

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function TransactionsScreen({
    token,
    onLogout,
}: Props) {
    const [transactions, setTransactions] =
        useState<Transaction[]>([]);

    const fetchTransactions = async () => {
        try {
            const response = await fetch(
                `${API_URL}/transactions`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            setTransactions(data);
        } catch (error) {
            console.log(error);
            alert("Failed to fetch transactions");
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    return (
        <SafeAreaView
            style={{
                flex: 1,
                padding: 24,
            }}
        >
            <Button
                title="Logout"
                onPress={onLogout}
            />

            <Text
                style={{
                    fontSize: 28,
                    fontWeight: "bold",
                    marginVertical: 16,
                }}
            >
                Transaction
            </Text>

            <FlatList
                data={transactions}
                keyExtractor={(item) =>
                    item.id.toString()
                }
                renderItem={({ item }) => (
                    <View
                        style={{
                            borderWidth: 1,
                            borderRadius: 8,
                            padding: 16,
                            marginBottom: 12,
                        }}
                    >
                        <Text
                            style={{
                                fontWeight: "bold",
                            }}
                        >
                            {item.description}
                        </Text>

                        <Text>
                            {item.type} - ₱
                            {item.amount}
                        </Text>
                    </View>
                )}
            />
        </SafeAreaView>
    );
}