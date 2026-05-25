import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import TransactionsScreen from "./src/screens/TransactionsScreen";
import AppDrawer from "./src/screens/AppDrawer";
import { NavigationContainer } from "@react-navigation/native";

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
      <AppDrawer token={token} onLogout={handleLogout} />
    </NavigationContainer>
  );
}