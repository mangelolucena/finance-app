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
});