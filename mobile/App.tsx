import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import HomeDashboardScreen from "./src/screens/Home/HomeDashboardScreen";
import AppDrawer from "./src/screens/AppDrawer";
import { NavigationContainer } from "@react-navigation/native";
import { Alert } from "react-native";

const TOKEN_KEY = "finance_app_token";

export default function App() {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  useEffect(() => {
    const loadToken = async () => {
      const savedToken = await SecureStore.getItemAsync(TOKEN_KEY);

      if (savedToken) {
        setToken(savedToken);
      }

      setLoading(false);
    };

    loadToken();
  }, []);

  const handleLogin = async (newToken: string) => {
    await SecureStore.setItemAsync(TOKEN_KEY, newToken);
    setToken(newToken);
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete account");
      }

      await SecureStore.deleteItemAsync(TOKEN_KEY);
      setToken("");
      setAuthMode("login");
      Alert.alert("Account deleted", "Your account has been deleted.");

    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      Alert.alert("Error", message);
    }
  }

  const showDeleteAccountAlert = async () => {
    Alert.alert(
      "Delete Account",
      "Are you sure?",
      [
        { text: "Cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: handleDeleteAccount,
        },
      ]
    );
  }

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    setToken("");
  };

  if (loading) return null;

  if (!token && authMode === "register") {
    return <RegisterScreen onBackToLogin={() => setAuthMode("login")} />;
  }

  if (!token) {
    return (
      <LoginScreen
        onLogin={handleLogin}
        onGoToRegister={() => setAuthMode("register")}
      />
    );
  }

  return (
    <NavigationContainer>
      <AppDrawer token={token}
        onLogout={handleLogout}
        onDeleteAccount={showDeleteAccountAlert} />
    </NavigationContainer>
  );
}