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
  StyleSheet,
} from "react-native";
import Transaction from "../types/transaction";
import Category from "../types/category";
import FilterType from "../types/filterType";
import COLORS from "../constants/colors";
import { useTransactionStore } from "../store/useTransactionStore";

type Props = {
  token: string;
};

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

export default function HomeDashboardScreen({ token }: Props) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);

  const {
    filter,
    setFilter,
    selectedCategory,
    setSelectedCategory,
    transactionType,
    setTransactionType,
    editingId,
    setEditingId,
  } = useTransactionStore();

  const openAddModal = () => {
    setEditingId(null);
    setDescription("");
    setAmount("");
    setSelectedCategory("");
    setTransactionType("expense");
    setShowTransactionModal(true);
  };

  const openEditModal = (transaction: Transaction) => {
    setEditingId(transaction.id);
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
      const body = JSON.stringify({
        category_id: selectedCategory,
        amount: Number(amount),
        type: transactionType,
        description,
        transaction_date: new Date(),
      });

      if (editingId) {
        const response = await fetch(`${API_URL}/transactions/${editingId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body,
        });

        if (!response.ok) {
          const error = await response.json();
          Alert.alert("Error", error.message || "Failed to update transaction");
          return;
        }

        Alert.alert("Success", "Transaction updated");
      } else {
        const response = await fetch(`${API_URL}/transactions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body,
        });

        if (!response.ok) {
          const error = await response.json();
          Alert.alert("Error", error.message || "Failed to add transaction");
          return;
        }

        Alert.alert("Success", "Transaction added");
      }

      handleCancelEdit();
      setShowTransactionModal(false);
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
        { text: "Cancel" },
        {
          text: "Delete",
          onPress: async () => {
            try {
              const response = await fetch(`${API_URL}/transactions/${id}`, {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });

              if (!response.ok) {
                const error = await response.json();
                Alert.alert(
                  "Error",
                  error.message || "Failed to delete transaction"
                );
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

  const handleCancelEdit = () => {
    setEditingId(null);
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
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.logo}>PesoTrack</Text>
        </View>

        <View style={styles.summaryContainer}>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Balance</Text>
            <Text style={styles.balanceAmount}>
              ₱{summary.balance.toFixed(2)}
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardLabel}>Income</Text>
            <Text style={styles.incomeAmount}>
              ₱{summary.income.toFixed(2)}
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardLabel}>Expenses</Text>
            <Text style={styles.expenseAmount}>
              ₱{summary.expenses.toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={styles.filterContainer}>
          {(["all", "income", "expense"] as FilterType[]).map((f) => (
            <TouchableOpacity
              key={f}
              onPress={() => setFilter(f)}
              style={[
                styles.filterButton,
                filter === f && styles.activeFilterButton,
              ]}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  filter === f && styles.activeFilterButtonText,
                ]}
              >
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          scrollEnabled={false}
          data={filteredTransactions}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.transactionCard}>
              <View style={styles.transactionHeader}>
                <Text style={styles.categoryName}>{item.category_name}</Text>

                <Text
                  style={[
                    styles.transactionAmount,
                    item.type === "income"
                      ? styles.incomeText
                      : styles.expenseText,
                  ]}
                >
                  {item.type === "income" ? "+" : "-"}₱{item.amount}
                </Text>
              </View>

              <Text style={styles.transactionDescription}>
                {item.type} - {item.description}
              </Text>

              <Text style={styles.transactionDate}>
                {new Date(item.transaction_date).toLocaleDateString()}
              </Text>

              <View style={styles.actionContainer}>
                <TouchableOpacity
                  onPress={() => handleDeleteTransaction(item.id)}
                  style={styles.deleteButton}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => openEditModal(item)}
                  style={styles.editButton}
                >
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No transactions yet</Text>
            </View>
          }
        />
      </ScrollView>

      <Modal
        visible={showTransactionModal}
        transparent
        animationType="fade"
        presentationStyle="fullScreen"
        onRequestClose={closeTransactionModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.transactionModalContainer}>
            <Text style={styles.modalTitle}>
              {editingId ? "Edit Transaction" : "Add Transaction"}
            </Text>

            <View style={styles.formCard}>
              <TextInput
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
                style={styles.input}
              />

              <TextInput
                placeholder="Amount"
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
                style={styles.input}
              />

              <View style={styles.dropdownRow}>
                <View style={styles.dropdownColumn}>
                  <TouchableOpacity
                    onPress={() => setShowCategoryModal(true)}
                    style={styles.dropdownButton}
                  >
                    <Text
                      style={[
                        styles.dropdownText,
                        !selectedCategory && styles.placeholderText,
                      ]}
                    >
                      {selectedCategory
                        ? categories.find((c) => c.id === selectedCategory)
                          ?.name || "Select Category"
                        : "Select Category"}
                    </Text>
                  </TouchableOpacity>

                  <Modal
                    visible={showCategoryModal}
                    transparent
                    animationType="none"
                    onRequestClose={() => setShowCategoryModal(false)}
                  >
                    <View style={styles.modalOverlay}>
                      <View style={styles.bottomSheet}>
                        <View style={styles.modalHeader}>
                          <Text style={styles.selectorTitle}>
                            Select Category
                          </Text>

                          <TouchableOpacity
                            onPress={() => setShowCategoryModal(false)}
                          >
                            <Text style={styles.closeIcon}>✕</Text>
                          </TouchableOpacity>
                        </View>

                        <FlatList
                          data={filteredCategories}
                          keyExtractor={(item) => item.id}
                          scrollEnabled={filteredCategories.length > 5}
                          style={styles.selectorList}
                          renderItem={({ item }) => (
                            <TouchableOpacity
                              onPress={() => {
                                setSelectedCategory(item.id);
                                setShowCategoryModal(false);
                              }}
                              style={[
                                styles.selectorItem,
                                selectedCategory === item.id &&
                                styles.activeSelectorItem,
                              ]}
                            >
                              <Text
                                style={[
                                  styles.selectorItemText,
                                  selectedCategory === item.id &&
                                  styles.activeSelectorItemText,
                                ]}
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

                <View style={styles.dropdownColumn}>
                  <TouchableOpacity
                    onPress={() => setShowTypeModal(true)}
                    style={styles.dropdownButton}
                  >
                    <Text style={styles.typeText}>{transactionType}</Text>
                  </TouchableOpacity>

                  <Modal
                    visible={showTypeModal}
                    transparent
                    animationType="none"
                    onRequestClose={() => setShowTypeModal(false)}
                  >
                    <View style={styles.modalOverlay}>
                      <View style={styles.bottomSheet}>
                        <View style={styles.modalHeader}>
                          <Text style={styles.selectorTitle}>Select Type</Text>

                          <TouchableOpacity
                            onPress={() => setShowTypeModal(false)}
                          >
                            <Text style={styles.closeIcon}>✕</Text>
                          </TouchableOpacity>
                        </View>

                        <View>
                          {["expense", "income"].map((type) => (
                            <TouchableOpacity
                              key={type}
                              onPress={() => {
                                setTransactionType(
                                  type as "income" | "expense"
                                );
                                setShowTypeModal(false);

                                if (type !== transactionType) {
                                  setSelectedCategory("");
                                }
                              }}
                              style={[
                                styles.selectorItem,
                                transactionType === type &&
                                styles.activeSelectorItem,
                              ]}
                            >
                              <Text
                                style={[
                                  styles.selectorItemText,
                                  styles.capitalizeText,
                                  transactionType === type &&
                                  styles.activeSelectorItemText,
                                ]}
                              >
                                {type}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>
                    </View>
                  </Modal>
                </View>
              </View>

              <View style={styles.formActionRow}>
                <TouchableOpacity
                  onPress={handleAddTransaction}
                  style={styles.primaryButton}
                >
                  <Text style={styles.primaryButtonText}>
                    {editingId ? "Update" : "Add"}
                  </Text>
                </TouchableOpacity>

                {editingId && (
                  <TouchableOpacity
                    onPress={handleCancelEdit}
                    style={styles.primaryButton}
                  >
                    <Text style={styles.primaryButtonText}>Cancel</Text>
                  </TouchableOpacity>
                )}
              </View>

              <TouchableOpacity
                onPress={closeTransactionModal}
                style={styles.closeButton}
              >
                <Text style={styles.primaryButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <TouchableOpacity onPress={openAddModal} style={styles.fab}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  logo: {
    fontSize: 30,
    fontWeight: "800",
    color: COLORS.primaryDark,
  },
  summaryContainer: {
    justifyContent: "space-between",
    marginBottom: 24,
    gap: 12,
    paddingHorizontal: 8,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    elevation: 3,
  },
  cardLabel: {
    color: COLORS.muted,
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text,
  },
  incomeAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.income,
  },
  expenseAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.expense,
  },
  filterContainer: {
    marginTop: 20,
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#E5E7EB",
  },
  activeFilterButton: {
    backgroundColor: COLORS.primary,
  },
  filterButtonText: {
    fontWeight: "500",
    color: COLORS.text,
    textTransform: "capitalize",
  },
  activeFilterButtonText: {
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  listContent: {
    paddingHorizontal: 8,
  },
  transactionCard: {
    marginVertical: 6,
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    elevation: 3,
  },
  transactionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  categoryName: {
    fontWeight: "bold",
    fontSize: 16,
    flex: 1,
  },
  transactionAmount: {
    fontWeight: "600",
    fontSize: 16,
  },
  incomeText: {
    color: COLORS.income,
  },
  expenseText: {
    color: COLORS.expense,
  },
  transactionDescription: {
    color: COLORS.muted,
    marginBottom: 12,
    textTransform: "lowercase",
  },
  transactionDate: {
    color: "#999999",
    fontSize: 12,
  },
  actionContainer: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "flex-end",
  },
  deleteButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: COLORS.dangerBg,
  },
  deleteButtonText: {
    color: COLORS.dangerText,
    fontWeight: "600",
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: "#E5E7EB",
  },
  editButtonText: {
    color: COLORS.text,
    fontWeight: "600",
  },
  emptyContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 32,
    alignItems: "center",
  },
  emptyText: {
    color: "#999999",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  transactionModalContainer: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  formCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#F9F9F9",
  },
  dropdownRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  dropdownColumn: {
    flex: 1,
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#F9F9F9",
    justifyContent: "center",
  },
  dropdownText: {
    color: "#000000",
    fontSize: 14,
  },
  placeholderText: {
    color: "#999999",
  },
  typeText: {
    color: "#000000",
    fontSize: 14,
    textTransform: "capitalize",
  },
  bottomSheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingVertical: 12,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  selectorTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  closeIcon: {
    fontSize: 18,
    color: COLORS.primary,
  },
  selectorList: {
    maxHeight: 300,
  },
  selectorItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
    backgroundColor: "#FFFFFF",
  },
  activeSelectorItem: {
    backgroundColor: COLORS.primaryLight,
  },
  selectorItemText: {
    fontSize: 16,
    color: "#000000",
    fontWeight: "400",
  },
  activeSelectorItemText: {
    color: COLORS.primary,
    fontWeight: "600",
  },
  capitalizeText: {
    textTransform: "capitalize",
  },
  formActionRow: {
    flexDirection: "row",
    gap: 8,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
    marginTop: 10,
  },
  fab: {
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
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },
  fabText: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "600",
  },
});