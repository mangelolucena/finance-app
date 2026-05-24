import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

import LoginScreen from "./src/screens/LoginScreen";
import TransactionsScreen from "./src/screens/TransactionsScreen";

const TOKEN_KEY = "finance_app_token";

export default function App() {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);

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

  if (!token) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return <TransactionsScreen token={token} onLogout={handleLogout} />;
}