import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  Modal,
} from "react-native";

const COLORS = {
  background: "#ECFDF5",
  card: "#FFFFFF",
  primary: "#059669",
  primaryDark: "#064E3B",
  primaryLight: "#D1FAE5",
  income: "#10B981",
  expense: "#EF4444",
  text: "#111827",
  muted: "#6B7280",
  border: "#D1FAE5",
  dangerBg: "#FEE2E2",
  dangerText: "#DC2626",
};

type Props = {
  token: string;
};

type Transaction = {
  id: string;
  description: string;
  amount: string;
  type: "income" | "expense";
  category_id: string;
  category_name: string | null;
  transaction_date: string;
};

type Category = {
  id: string;
  name: string;
};

type FilterType = "all" | "income" | "expense";
const incomeCategoryNames = [
  "Salary",
  "Freelance",
  "Business",
  "Investment",
  "Allowance",
  "Bonus",
  "Gift",
  "Refund",
  "Other Income",
];

const expenseCategoryNames = [
  "Food",
  "Transportation",
  "Bills",
  "Rent",
  "Groceries",
  "Shopping",
  "Health",
  "Entertainment",
  "Education",
  "Travel",
  "Insurance",
  "Debt Payment",
  "Savings",
  "Donation",
  "Family Support",
  "Personal Care",
  "Subscriptions",
  "Other Expense",
];

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function TransactionsScreen({ token }: Props) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [transactionType, setTransactionType] = useState<"income" | "expense">(
    "expense"
  );
  const [filter, setFilter] = useState<FilterType>("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);

  const openAddModal = () => {
    setEditingId(null);
    setEditingTransaction(null);
    setDescription("");
    setAmount("");
    setSelectedCategory("");
    setTransactionType("expense");
    setShowTransactionModal(true);
  };

  const openEditModal = (transaction: Transaction) => {
    setEditingId(transaction.id);
    setEditingTransaction(transaction);
    setDescription(transaction.description);
    setAmount(transaction.amount);
    setSelectedCategory(transaction.category_id);
    setTransactionType(transaction.type);
    setShowTransactionModal(true);
  };

  const closeTransactionModal = () => {
    handleCancelEdit();
    setShowTransactionModal(false);
  };

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`${API_URL}/transactions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error("Failed to fetch transactions:", response.status);
        return;
      }

      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error("Fetch transactions error:", error);
    }
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

    if (!selectedCategory) {
      Alert.alert("Validation", "Please select a category");
      return;
    }

    try {
      if (editingId) {
        // Update existing transaction
        const response = await fetch(
          `${API_URL}/transactions/${editingId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              category_id: selectedCategory,
              amount: Number(amount),
              type: transactionType,
              description,
              transaction_date: new Date(),
            }),
          }
        );

        if (!response.ok) {
          const error = await response.json();
          Alert.alert("Error", error.message || "Failed to update transaction");
          console.error("Update error:", error);
          return;
        }

        Alert.alert("Success", "Transaction updated");
        setEditingId(null);
        setEditingTransaction(null);
      } else {
        // Create new transaction
        const response = await fetch(`${API_URL}/transactions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            category_id: selectedCategory,
            amount: Number(amount),
            type: transactionType,
            description,
            transaction_date: new Date(),
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          Alert.alert("Error", error.message || "Failed to add transaction");
          console.error("Create error:", error);
          return;
        }

        Alert.alert("Success", "Transaction added");
      }

      setDescription("");
      setAmount("");
      setSelectedCategory("");
      setTransactionType("expense");
      fetchTransactions();
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "An unexpected error occurred");
    }
  };

  const handleDeleteTransaction = (id: string) => {
    Alert.alert(
      "Delete Transaction",
      "Are you sure you want to delete this transaction?",
      [
        { text: "Cancel", onPress: () => { } },
        {
          text: "Delete",
          onPress: async () => {
            try {
              const response = await fetch(
                `${API_URL}/transactions/${id}`,
                {
                  method: "DELETE",
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              if (!response.ok) {
                const error = await response.json();
                Alert.alert("Error", error.message || "Failed to delete transaction");
                console.error("Delete error:", error);
                return;
              }

              Alert.alert("Success", "Transaction deleted");
              fetchTransactions();
            } catch (error) {
              console.error("Delete error:", error);
              Alert.alert("Error", "An unexpected error occurred");
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingId(transaction.id);
    setEditingTransaction(transaction);
    setDescription(transaction.description);
    setAmount(transaction.amount);
    setSelectedCategory(transaction.category_id);
    setTransactionType(transaction.type);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingTransaction(null);
    setDescription("");
    setAmount("");
    setSelectedCategory("");
    setTransactionType("expense");
  };

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, []);

  const calculateSummary = () => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const expenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    return {
      income,
      expenses,
      balance: income - expenses,
    };
  };

  const getFilteredTransactions = () => {
    if (filter === "all") return transactions;
    return transactions.filter((t) => t.type === filter);
  };

  const filteredCategories = categories.filter((category) => {
    if (transactionType === "income") {
      return incomeCategoryNames.includes(category.name);
    }

    return expenseCategoryNames.includes(category.name);
  });

  const summary = calculateSummary();
  const filteredTransactions = getFilteredTransactions();

  return (
    <View
      style={{ flex: 1, backgroundColor: COLORS.background }}>

      <ScrollView
        style={{ flex: 1, paddingHorizontal: 20, paddingTop: 12 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
            paddingHorizontal: 8,
          }}
        >
          <Text style={{ fontSize: 30, fontWeight: "800", color: COLORS.primaryDark }}>
            PesoTrack
          </Text>
        </View>

        {/* Summary Cards */}

        <View
          style={{
            justifyContent: "space-between",
            marginBottom: 24,
            gap: 12,
            paddingHorizontal: 8,
          }}
        >
          <View
            style={{
              backgroundColor: COLORS.card,
              borderRadius: 20,
              padding: 18,
              shadowColor: "#000",
              shadowOpacity: 0.06,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 6 },
              elevation: 3,
            }}
          >
            <Text style={{ color: "#666", marginBottom: 8 }}>
              Balance
            </Text>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                color: "#1a1a2e",
              }}
            >
              ₱{summary.balance.toFixed(2)}
            </Text>
          </View>
          {/* Income Card */}
          <View
            style={{
              backgroundColor: COLORS.card,
              borderRadius: 20,
              padding: 18,
              shadowColor: "#000",
              shadowOpacity: 0.06,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 6 },
              elevation: 3,
            }}
          >
            <Text style={{ color: "#666", marginBottom: 8 }}>
              Income
            </Text>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                color: "#10b981",
              }}
            >
              ₱{summary.income.toFixed(2)}
            </Text>
          </View>

          {/* Expenses Card */}
          <View
            style={{
              backgroundColor: COLORS.card,
              borderRadius: 20,
              padding: 18,
              shadowColor: "#000",
              shadowOpacity: 0.06,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 6 },
              elevation: 3,
            }}
          >
            <Text style={{ color: "#666", marginBottom: 8 }}>
              Expenses
            </Text>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                color: "#ef4444",
              }}
            >
              ₱{summary.expenses.toFixed(2)}
            </Text>
          </View>

          {/* Balance Card */}

        </View>



        {/* Filter Buttons */}
        <View
          style={{
            marginTop: 20,
            flexDirection: "row",
            gap: 8,
            marginBottom: 16,
            paddingHorizontal: 8,
          }}
        >
          {(["all", "income", "expense"] as FilterType[]).map(
            (f) => (
              <TouchableOpacity
                key={f}
                onPress={() => setFilter(f)}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 8,
                  backgroundColor:
                    filter === f
                      ? "#3b82f6"
                      : "#e5e7eb",
                }}
              >
                <Text
                  style={{
                    fontWeight:
                      filter === f ? "bold" : "500",
                    color:
                      filter === f ? "white" : "#1a1a2e",
                    textTransform: "capitalize",
                  }}
                >
                  {f}
                </Text>
              </TouchableOpacity>
            )
          )}
        </View>

        {/* Transactions List */}
        <FlatList

          scrollEnabled={false}
          data={filteredTransactions}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 8 }}
          renderItem={({ item }) => (
            <View
              style={{
                marginVertical: 6,
                backgroundColor: COLORS.card,
                borderRadius: 20,
                padding: 18,
                shadowColor: "#000",
                shadowOpacity: 0.06,
                shadowRadius: 12,
                shadowOffset: { width: 0, height: 6 },
                elevation: 3,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 8,
                }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 16,
                    flex: 1,
                  }}
                >
                  {item.category_name}
                </Text>
                <Text
                  style={{
                    fontWeight: "600",
                    fontSize: 16,
                    color: item.type === "income" ? COLORS.income : COLORS.expense
                  }}
                >
                  {item.type === "income" ? "+" : "-"}₱
                  {item.amount}
                </Text>

              </View>
              <Text
                style={{
                  color: "#666",
                  marginBottom: 12,
                  textTransform: "lowercase",
                }}
              >
                {item.type} - {item.description}
              </Text>
              <Text
                style={{
                  color: "#999",
                  fontSize: 12,
                }}
              >
                {new Date(item.transaction_date).toLocaleDateString()}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  gap: 8,
                  justifyContent: "flex-end",
                }}
              >
                <TouchableOpacity
                  onPress={() =>
                    handleDeleteTransaction(item.id)
                  }
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 6,
                    backgroundColor: "#fee2e2",
                  }}
                >
                  <Text
                    style={{
                      color: "#dc2626",
                      fontWeight: "600",
                    }}
                  >
                    Delete
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => openEditModal(item)}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 6,
                    backgroundColor: "#e5e7eb",
                  }}
                >
                  <Text
                    style={{
                      color: "#1a1a2e",
                      fontWeight: "600",
                    }}
                  >
                    Edit
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View
              style={{
                backgroundColor: "white",
                borderRadius: 8,
                padding: 32,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#999", fontSize: 16 }}>
                No transactions yet
              </Text>
            </View>
          }
        />

      </ScrollView>
      <Modal
        visible={showTransactionModal}
        transparent
        animationType="slide"
        presentationStyle='fullScreen'
        onRequestClose={closeTransactionModal}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.45)",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: COLORS.card,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: 20,
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 16 }}>
              {editingId ? "Edit Transaction" : "Add Transaction"}
            </Text>



            {/* Add Transaction Section */}
            <View
              style={{
                backgroundColor: COLORS.card,
                borderRadius: 20,
                padding: 18,
                shadowColor: "#000",
                shadowOpacity: 0.06,
                shadowRadius: 12,
                shadowOffset: { width: 0, height: 6 },
                elevation: 3,
              }}
            >
              <TextInput
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
                style={{
                  borderWidth: 1,
                  borderColor: "#ddd",
                  borderRadius: 8,
                  padding: 12,
                  marginBottom: 12,
                  backgroundColor: "#f9f9f9",
                }}
              />

              <TextInput
                placeholder="Amount"
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
                style={{
                  borderWidth: 1,
                  borderColor: "#ddd",
                  borderRadius: 8,
                  padding: 12,
                  marginBottom: 12,
                  backgroundColor: "#f9f9f9",
                }}
              />

              <View
                style={{
                  flexDirection: "row",
                  gap: 12,
                  marginBottom: 12,
                }}
              >
                {/* Category Dropdown */}
                <View style={{ flex: 1 }}>
                  <TouchableOpacity
                    onPress={() => setShowCategoryModal(true)}
                    style={{
                      borderWidth: 1,
                      borderColor: "#ddd",
                      borderRadius: 8,
                      padding: 12,
                      backgroundColor: "#f9f9f9",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: selectedCategory ? "#000" : "#999",
                        fontSize: 14,
                      }}
                    >
                      {selectedCategory
                        ? categories.find(
                          (c) => c.id === selectedCategory
                        )?.name || "Select Category"
                        : "Select Category"}
                    </Text>
                  </TouchableOpacity>

                  {/* Category Modal */}
                  <Modal
                    visible={showCategoryModal}
                    transparent
                    animationType="slide"
                    onRequestClose={() =>
                      setShowCategoryModal(false)
                    }
                  >
                    <View
                      style={{
                        flex: 1,
                        backgroundColor: "rgba(0,0,0,0.5)",
                        justifyContent: "flex-end",
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: "white",
                          borderTopLeftRadius: 12,
                          borderTopRightRadius: 12,
                          paddingVertical: 12,
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent:
                              "space-between",
                            alignItems: "center",
                            paddingHorizontal: 16,
                            paddingBottom: 12,
                            borderBottomWidth: 1,
                            borderBottomColor: "#eee",
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 16,
                              fontWeight: "bold",
                            }}
                          >
                            Select Category
                          </Text>
                          <TouchableOpacity
                            onPress={() =>
                              setShowCategoryModal(false)
                            }
                          >
                            <Text
                              style={{
                                fontSize: 18,
                                color: "#3b82f6",
                              }}
                            >
                              ✕
                            </Text>
                          </TouchableOpacity>
                        </View>
                        <FlatList
                          data={filteredCategories}
                          keyExtractor={(item) => item.id}
                          scrollEnabled={
                            filteredCategories.length > 5
                          }
                          style={{
                            maxHeight: 300,
                          }}
                          renderItem={({ item }) => (
                            <TouchableOpacity
                              onPress={() => {
                                setSelectedCategory(
                                  item.id
                                );
                                setShowCategoryModal(
                                  false
                                );
                              }}
                              style={{
                                paddingHorizontal: 16,
                                paddingVertical: 12,
                                borderBottomWidth: 1,
                                borderBottomColor:
                                  "#eee",
                                backgroundColor:
                                  selectedCategory ===
                                    item.id
                                    ? "#eff6ff"
                                    : "white",
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 16,
                                  color:
                                    selectedCategory ===
                                      item.id
                                      ? "#3b82f6"
                                      : "#000",
                                  fontWeight:
                                    selectedCategory ===
                                      item.id
                                      ? "600"
                                      : "400",
                                }}
                              >
                                {item.name}
                              </Text>
                            </TouchableOpacity>
                          )}
                        />
                      </View>
                    </View>
                  </Modal>
                </View>

                {/* Type Dropdown */}
                <View style={{ flex: 1 }}>
                  <TouchableOpacity
                    onPress={() => setShowTypeModal(true)}
                    style={{
                      borderWidth: 1,
                      borderColor: "#ddd",
                      borderRadius: 8,
                      padding: 12,
                      backgroundColor: "#f9f9f9",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: "#000",
                        fontSize: 14,
                        textTransform: "capitalize",
                      }}
                    >
                      {transactionType}
                    </Text>
                  </TouchableOpacity>

                  {/* Type Modal */}
                  <Modal
                    visible={showTypeModal}
                    transparent
                    animationType="slide"
                    onRequestClose={() =>
                      setShowTypeModal(false)
                    }
                  >
                    <View
                      style={{
                        flex: 1,
                        backgroundColor: "rgba(0,0,0,0.5)",
                        justifyContent: "flex-end",
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: "white",
                          borderTopLeftRadius: 12,
                          borderTopRightRadius: 12,
                          paddingVertical: 12,
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent:
                              "space-between",
                            alignItems: "center",
                            paddingHorizontal: 16,
                            paddingBottom: 12,
                            borderBottomWidth: 1,
                            borderBottomColor: "#eee",
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 16,
                              fontWeight: "bold",
                            }}
                          >
                            Select Type
                          </Text>
                          <TouchableOpacity
                            onPress={() =>
                              setShowTypeModal(false)
                            }
                          >
                            <Text
                              style={{
                                fontSize: 18,
                                color: "#3b82f6",
                              }}
                            >
                              ✕
                            </Text>
                          </TouchableOpacity>
                        </View>
                        <View>
                          {["expense", "income"].map(
                            (type) => (
                              <TouchableOpacity
                                key={type}
                                onPress={() => {
                                  setTransactionType(
                                    type as
                                    | "income"
                                    | "expense"
                                  );
                                  setShowTypeModal(
                                    false
                                  );
                                  if (type !== transactionType) {
                                    setSelectedCategory("");
                                  }
                                }}
                                style={{
                                  paddingHorizontal:
                                    16,
                                  paddingVertical: 12,
                                  borderBottomWidth: 1,
                                  borderBottomColor:
                                    "#eee",
                                  backgroundColor:
                                    transactionType ===
                                      type
                                      ? "#eff6ff"
                                      : "white",
                                }}
                              >
                                <Text
                                  style={{
                                    fontSize: 16,
                                    color:
                                      transactionType ===
                                        type
                                        ? "#3b82f6"
                                        : "#000",
                                    fontWeight:
                                      transactionType ===
                                        type
                                        ? "600"
                                        : "400",
                                    textTransform:
                                      "capitalize",
                                  }}
                                >
                                  {type}
                                </Text>
                              </TouchableOpacity>
                            )
                          )}
                        </View>
                      </View>
                    </View>
                  </Modal>
                </View>
              </View>

              <View style={{ flexDirection: "row", gap: 8 }}>
                <TouchableOpacity
                  onPress={handleAddTransaction}
                  style={{
                    flex: 1,
                    backgroundColor: COLORS.primary,
                    borderRadius: 16,
                    padding: 14,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      fontSize: 16,
                    }}
                  >
                    {editingId ? "Update" : "Add"}
                  </Text>
                </TouchableOpacity>
                {editingId && (
                  <TouchableOpacity
                    onPress={handleCancelEdit}
                    style={{
                      flex: 1,
                      backgroundColor: COLORS.primary,
                      borderRadius: 16,
                      padding: 14,
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{ color: "white", fontWeight: "bold", fontSize: 16 }}
                    >
                      Cancel
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              <TouchableOpacity
                onPress={closeTransactionModal}
                style={{
                  backgroundColor: COLORS.primary,
                  borderRadius: 16,
                  padding: 14,
                  alignItems: "center",
                  marginTop: 10,
                }}>
                <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <TouchableOpacity
        onPress={openAddModal}
        style={{
          position: "absolute",
          right: 24,
          bottom: 32,
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: COLORS.primary,
          alignItems: "center",
          justifyContent: "center",
          elevation: 6,
          shadowColor: "#000",
          shadowOpacity: 0.2,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
        }}
      >
        <Text style={{ color: "white", fontSize: 32, fontWeight: "600" }}>+</Text>
      </TouchableOpacity>
    </View>

  );
}