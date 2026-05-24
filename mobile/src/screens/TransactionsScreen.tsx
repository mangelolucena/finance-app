import { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    Button,
    TextInput,
    Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
    token: string;
    onLogout: () => void;
};

type Transaction = {
    id: string;
    description: string;
    amount: string;
    type: "income" | "expense";
    category_name: string | null;
};

type Category = {
    id: string;
    name: string;
};

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function TransactionsScreen({ token, onLogout }: Props) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");

    const fetchTransactions = async () => {
        const response = await fetch(`${API_URL}/transactions`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();
        setTransactions(data);
    };

    const fetchCategories = async () => {
        const response = await fetch(`${API_URL}/categories/all`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();
        setCategories(data);
    };

    const handleAddTransaction = async () => {
        if (!description || !amount) {
            Alert.alert("Validation", "Description and amount are required");
            return;
        }

        if (categories.length === 0) {
            Alert.alert("No category", "Please add categories first");
            return;
        }

        const response = await fetch(`${API_URL}/transactions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                category_id: categories[0].id,
                amount: Number(amount),
                type: "expense",
                description,
                transaction_date: new Date(),
            }),
        });

        if (!response.ok) {
            Alert.alert("Error", "Failed to add transaction");
            return;
        }

        setDescription("");
        setAmount("");
        fetchTransactions();
    };

    useEffect(() => {
        fetchTransactions();
        fetchCategories();
    }, []);

    return (
        <SafeAreaView style={{ flex: 1, padding: 24 }}>
            <Button title="Logout" onPress={onLogout} />

            <Text style={{ fontSize: 28, fontWeight: "bold", marginVertical: 16 }}>
                Transactions
            </Text>

            <View style={{ gap: 12, marginBottom: 24 }}>
                <TextInput
                    placeholder="Description"
                    value={description}
                    onChangeText={setDescription}
                    style={{
                        borderWidth: 1,
                        borderRadius: 8,
                        padding: 12,
                    }}
                />

                <TextInput
                    placeholder="Amount"
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="numeric"
                    style={{
                        borderWidth: 1,
                        borderRadius: 8,
                        padding: 12,
                    }}
                />

                <Button title="Add Expense" onPress={handleAddTransaction} />
            </View>

            <FlatList
                data={transactions}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View
                        style={{
                            borderWidth: 1,
                            borderRadius: 8,
                            padding: 16,
                            marginBottom: 12,
                        }}
                    >
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