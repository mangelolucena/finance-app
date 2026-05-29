import { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    StyleSheet,
    Modal,
    TextInput,
    Pressable,
} from "react-native";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

type NetWorthItem = {
    id: string;
    name: string;
    type: "asset" | "liability";
    category: string;
    amount: string;
};

type Summary = {
    total_assets: string;
    total_liabilities: string;
    net_worth: string;
};

type Props = {
    token: string;
};

export default function NetWorthScreen({ token }: Props) {
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState<NetWorthItem[]>([]);
    const [summary, setSummary] = useState<Summary>({
        total_assets: "0",
        total_liabilities: "0",
        net_worth: "0",
    });
    const [modalVisible, setModalVisible] = useState(false);
const [name, setName] = useState("");
const [type, setType] = useState<"asset" | "liability">("asset");
const [category, setCategory] = useState("");
const [amount, setAmount] = useState("");
const [saving, setSaving] = useState(false);

    const fetchNetWorth = async () => {
        try {
            const response = await fetch(`${API_URL}/net-worth`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            console.log("Fetched net worth:", data);

            setItems(data.items || []);
            setSummary(data.summary || {
                total_assets: "0",
                total_liabilities: "0",
                net_worth: "0",
            });
        } catch (error) {
            console.log("Failed to fetch net worth:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddItem = async () => {
  try {
    setSaving(true);

    const response = await fetch(`${API_URL}/net-worth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        type,
        category,
        amount: Number(amount),
      }),
    });

    const data = await response.json();
    console.log("Created net worth item:", data);

    if (!response.ok) {
      throw new Error(data.message || "Failed to add net worth item");
    }

    setName("");
    setType("asset");
    setCategory("");
    setAmount("");
    setModalVisible(false);

    await fetchNetWorth();
  } catch (error) {
    console.log("Failed to add item:", error);
  } finally {
    setSaving(false);
  }
};

    useEffect(() => {
        fetchNetWorth();
    }, []);

    const formatCurrency = (value: string) => {
        return `₱${Number(value || 0).toLocaleString()}`;
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.label}>Total Net Worth</Text>
                <Text style={styles.netWorth}>
                    {formatCurrency(summary.net_worth)}
                </Text>

                <View style={styles.dashboardRow}>
  <View style={styles.dashboardCard}>
    <Text style={styles.dashboardLabel}>Assets</Text>
    <Text style={styles.assetAmount}>
      {formatCurrency(summary.total_assets)}
    </Text>
  </View>

  <View style={styles.dashboardCard}>
    <Text style={styles.dashboardLabel}>Liabilities</Text>
    <Text style={styles.liabilityAmount}>
      {formatCurrency(summary.total_liabilities)}
    </Text>
  </View>
</View>
            </View>

            <FlatList
                data={items}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <View>
                            <Text style={styles.itemName}>{item.name}</Text>
                            <Text style={styles.itemCategory}>
                                {item.category} • {item.type}
                            </Text>
                        </View>

                        <Text
                            style={
                                item.type === "asset"
                                    ? styles.asset
                                    : styles.liability
                            }
                        >
                            {formatCurrency(item.amount)}
                        </Text>
                    </View>
                )}
                ListEmptyComponent={
                    <Text style={styles.empty}>
                        No net worth items yet.
                    </Text>
                }
            />
            <Pressable
    style={styles.fab}
    onPress={() => setModalVisible(true)}
>
    <Text style={styles.fabText}>+</Text>
</Pressable>

<Modal
    visible={modalVisible}
    animationType="slide"
    transparent
>
    <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Net Worth Item</Text>

            <TextInput
                style={styles.input}
                placeholder="Name"
                value={name}
                onChangeText={setName}
            />

            <View style={styles.typeRow}>
                <Pressable
                    style={[
                        styles.typeButton,
                        type === "asset" && styles.activeTypeButton,
                    ]}
                    onPress={() => setType("asset")}
                >
                    <Text
                        style={[
                            styles.typeButtonText,
                            type === "asset" && styles.activeTypeButtonText,
                        ]}
                    >
                        Asset
                    </Text>
                </Pressable>

                <Pressable
                    style={[
                        styles.typeButton,
                        type === "liability" && styles.activeTypeButton,
                    ]}
                    onPress={() => setType("liability")}
                >
                    <Text
                        style={[
                            styles.typeButtonText,
                            type === "liability" &&
                                styles.activeTypeButtonText,
                        ]}
                    >
                        Liability
                    </Text>
                </Pressable>
            </View>

            <TextInput
                style={styles.input}
                placeholder="Category"
                value={category}
                onChangeText={setCategory}
            />

            <TextInput
                style={styles.input}
                placeholder="Amount"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
            />

            <Pressable
                style={styles.saveButton}
                onPress={handleAddItem}
                disabled={saving}
            >
                <Text style={styles.saveButtonText}>
                    {saving ? "Saving..." : "Save"}
                </Text>
            </Pressable>

            <Pressable
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
            >
                <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
        </View>
    </View>
</Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#F4F7F5",
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "700",
        marginBottom: 16,
    },
    card: {
        backgroundColor: "white",
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
    },
    label: {
        color: "#6B7280",
        marginBottom: 4,
    },
    netWorth: {
        fontSize: 32,
        fontWeight: "800",
        marginBottom: 16,
        color: "#166534",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    asset: {
        color: "#15803D",
        fontWeight: "700",
    },
    liability: {
        color: "#DC2626",
        fontWeight: "700",
    },
    item: {
        backgroundColor: "white",
        padding: 16,
        borderRadius: 12,
        marginBottom: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    itemName: {
        fontSize: 16,
        fontWeight: "700",
    },
    itemCategory: {
        color: "#6B7280",
        marginTop: 4,
        textTransform: "capitalize",
    },
    empty: {
        textAlign: "center",
        color: "#6B7280",
        marginTop: 24,
    },
    fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#166534",
    justifyContent: "center",
    alignItems: "center",
},
fabText: {
    color: "white",
    fontSize: 32,
    lineHeight: 36,
},
modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
},
modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
},
modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
},
input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
},
typeRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
},
typeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    alignItems: "center",
},
activeTypeButton: {
    backgroundColor: "#166534",
    borderColor: "#166534",
},
typeButtonText: {
    color: "#374151",
    fontWeight: "600",
},
activeTypeButtonText: {
    color: "white",
},
saveButton: {
    backgroundColor: "#166534",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 4,
},
saveButtonText: {
    color: "white",
    fontWeight: "700",
},
cancelButton: {
    padding: 14,
    alignItems: "center",
},
cancelButtonText: {
    color: "#6B7280",
    fontWeight: "600",
},
dashboardRow: {
  flexDirection: "row",
  gap: 12,
},

dashboardCard: {
  flex: 1,
  backgroundColor: "#F9FAFB",
  padding: 14,
  borderRadius: 14,
  borderWidth: 1,
  borderColor: "#E5E7EB",
},

dashboardLabel: {
  color: "#6B7280",
  fontSize: 13,
  marginBottom: 6,
},

assetAmount: {
  color: "#15803D",
  fontSize: 18,
  fontWeight: "800",
},

liabilityAmount: {
  color: "#DC2626",
  fontSize: 18,
  fontWeight: "800",
},
});