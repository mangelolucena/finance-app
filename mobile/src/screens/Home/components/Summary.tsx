import React from "react";
import { View, Text, StyleSheet } from "react-native";
import COLORS from "../../../constants/colors";
import { useTransactionStore } from "../../../store/useTransactionStore";


export const Summary = () => {

  const { transactions } = useTransactionStore();

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

  const summary = calculateSummary();
  return (
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
  );
};


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