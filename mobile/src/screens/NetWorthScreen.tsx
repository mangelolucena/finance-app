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
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";
import COLORS from "../constants/colors";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const assetCategories = [
  "Cash",
  "Bank Account",
  "Investment",
  "Vehicle",
  "Real Estate",
  "Business",
  "Other Asset",
];

const liabilityCategories = [
  "Credit Card",
  "Personal Loan",
  "Car Loan",
  "Mortgage",
  "Other Debt",
];

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

  const [showModal, setShowModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingItem, setEditingItem] = useState<NetWorthItem | null>(null);

  const [name, setName] = useState("");
  const [type, setType] = useState<"asset" | "liability">("asset");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [saving, setSaving] = useState(false);

  const filteredCategories =
    type === "asset" ? assetCategories : liabilityCategories;

  const fetchNetWorth = async () => {
    try {
      const response = await fetch(`${API_URL}/net-worth`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        Alert.alert("Error", "Failed to fetch net worth");
        return;
      }

      const data = await response.json();

      setItems(data.items || []);
      setSummary(
        data.summary || {
          total_assets: "0",
          total_liabilities: "0",
          net_worth: "0",
        }
      );
    } catch (error) {
      console.error("Fetch net worth error:", error);
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingItem(null);
    setName("");
    setType("asset");
    setCategory("");
    setAmount("");
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (item: NetWorthItem) => {
    setEditingItem(item);
    setName(item.name);
    setType(item.type);
    setCategory(item.category);
    setAmount(item.amount);
    setShowModal(true);
  };

  const closeModal = () => {
    resetForm();
    setShowModal(false);
  };

  const validateForm = () => {
    if (!name.trim()) {
      Alert.alert("Validation", "Name is required");
      return false;
    }

    if (!category.trim()) {
      Alert.alert("Validation", "Please select a category");
      return false;
    }

    if (!amount.trim()) {
      Alert.alert("Validation", "Amount is required");
      return false;
    }

    const numericAmount = Number(amount);

    if (Number.isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert("Validation", "Amount must be greater than 0");
      return false;
    }

    return true;
  };

  const handleSaveItem = async () => {
    if (!validateForm()) return;

    try {
      setSaving(true);

      const isEditing = Boolean(editingItem);

      const response = await fetch(
        isEditing
          ? `${API_URL}/net-worth/${editingItem?.id}`
          : `${API_URL}/net-worth`,
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: name.trim(),
            type,
            category,
            amount: Number(amount),
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        Alert.alert("Error", error.message || "Failed to save net worth item");
        return;
      }

      Alert.alert("Success", isEditing ? "Item updated" : "Item added");

      closeModal();
      await fetchNetWorth();
    } catch (error) {
      console.error("Save net worth error:", error);
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteItem = (id: string) => {
    Alert.alert(
      "Delete Item",
      "Are you sure you want to delete this net worth item?",
      [
        { text: "Cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await fetch(`${API_URL}/net-worth/${id}`, {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });

              if (!response.ok) {
                const error = await response.json();
                Alert.alert(
                  "Error",
                  error.message || "Failed to delete net worth item"
                );
                return;
              }

              Alert.alert("Success", "Item deleted");
              await fetchNetWorth();
            } catch (error) {
              console.error("Delete net worth error:", error);
              Alert.alert("Error", "An unexpected error occurred");
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    fetchNetWorth();
  }, []);

  const formatCurrency = (value: string) => {
    return `₱${Number(value || 0).toFixed(2)}`;
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
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.logo}>Net Worth</Text>
        </View>

        <View style={styles.summaryContainer}>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Net Worth</Text>
            <Text style={styles.balanceAmount}>
              {formatCurrency(summary.net_worth)}
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardLabel}>Assets</Text>
            <Text style={styles.incomeAmount}>
              {formatCurrency(summary.total_assets)}
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardLabel}>Liabilities</Text>
            <Text style={styles.expenseAmount}>
              {formatCurrency(summary.total_liabilities)}
            </Text>
          </View>
        </View>

        <FlatList
          scrollEnabled={false}
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.itemCard}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemName}>{item.name}</Text>

                <Text
                  style={[
                    styles.itemAmount,
                    item.type === "asset"
                      ? styles.incomeText
                      : styles.expenseText,
                  ]}
                >
                  {item.type === "asset" ? "+" : "-"}
                  {formatCurrency(item.amount)}
                </Text>
              </View>

              <Text style={styles.itemDescription}>
                {item.type} - {item.category}
              </Text>

              <View style={styles.actionContainer}>
                <TouchableOpacity
                  onPress={() => handleDeleteItem(item.id)}
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
              <Text style={styles.emptyText}>No net worth items yet</Text>
            </View>
          }
        />
      </ScrollView>

      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        presentationStyle="fullScreen"
        onRequestClose={closeModal}
      >
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {editingItem ? "Edit Net Worth Item" : "Add Net Worth"}
            </Text>

            <View>
              <TextInput
                placeholder="Name"
                value={name}
                onChangeText={setName}
                style={styles.input}
              />

              <TouchableOpacity
                onPress={() => setShowCategoryModal(true)}
                style={styles.dropdownButton}
              >
                <Text
                  style={[
                    styles.dropdownText,
                    !category && styles.placeholderText,
                  ]}
                >
                  {category || "Select Category"}
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
                      <Text style={styles.selectorTitle}>Select Category</Text>

                      <TouchableOpacity
                        onPress={() => setShowCategoryModal(false)}
                      >
                        <Text style={styles.closeIcon}>✕</Text>
                      </TouchableOpacity>
                    </View>

                    <FlatList
                      data={filteredCategories}
                      keyExtractor={(item) => item}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          onPress={() => {
                            setCategory(item);
                            setShowCategoryModal(false);
                          }}
                          style={[
                            styles.selectorItem,
                            category === item && styles.activeSelectorItem,
                          ]}
                        >
                          <Text
                            style={[
                              styles.selectorItemText,
                              category === item &&
                                styles.activeSelectorItemText,
                            ]}
                          >
                            {item}
                          </Text>
                        </TouchableOpacity>
                      )}
                    />
                  </View>
                </View>
              </Modal>

              <TextInput
                placeholder="Amount"
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
                style={styles.input}
              />

              <View style={styles.typeContainer}>
                {(["asset", "liability"] as const).map((option) => (
                  <TouchableOpacity
                    key={option}
                    onPress={() => {
                      setType(option);
                      setCategory("");
                    }}
                    style={[
                      styles.typeButton,
                      type === option && styles.activeTypeButton,
                    ]}
                  >
                    <Text
                      style={[
                        styles.typeButtonText,
                        type === option && styles.activeTypeButtonText,
                      ]}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                onPress={handleSaveItem}
                style={styles.primaryButton}
                disabled={saving}
              >
                <Text style={styles.primaryButtonText}>
                  {saving ? "Saving..." : editingItem ? "Update" : "Add"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Text style={styles.primaryButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        </KeyboardAvoidingView>
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
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  listContent: {
    paddingHorizontal: 8,
  },
  itemCard: {
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
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  itemName: {
    fontWeight: "bold",
    fontSize: 16,
    flex: 1,
  },
  itemAmount: {
    fontWeight: "600",
    fontSize: 16,
  },
  incomeText: {
    color: COLORS.income,
  },
  expenseText: {
    color: COLORS.expense,
  },
  itemDescription: {
    color: COLORS.muted,
    marginBottom: 12,
    textTransform: "lowercase",
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
    backgroundColor: COLORS.card,
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
  modalContainer: {
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
  dropdownButton: {
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#F9F9F9",
  },
  dropdownText: {
    color: "#000000",
    fontSize: 14,
  },
  placeholderText: {
    color: "#999999",
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
  typeContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  typeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
  },
  activeTypeButton: {
    backgroundColor: COLORS.primary,
  },
  typeButtonText: {
    fontWeight: "500",
    color: COLORS.text,
    textTransform: "capitalize",
  },
  activeTypeButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  primaryButton: {
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