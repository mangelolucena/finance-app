import { useState } from "react";
import LoginScreen from "../screens/LoginScreen";
import TransactionsScreen from "../screens/TransactionsScreen";

export default function App() {
  const [token, setToken] = useState("");

  if (!token) {
    return <LoginScreen onLogin={setToken} />;
  }

  return (
    <TransactionsScreen
      token={token}
      onLogout={() => setToken("")}
    />
  );
}
