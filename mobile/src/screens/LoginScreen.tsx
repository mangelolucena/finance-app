import { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import { apiFetch } from "../api/api";

type LoginScreenProps = {
    onLogin: (token: string) => void;
};

export default function LoginScreen({ onLogin }: LoginScreenProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        const response = await apiFetch("/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Login failed");
            return;
        }

        onLogin(data.token);
    };

    return (
        <View style={{ flex: 1, padding: 24, justifyContent: "center", gap: 12 }}>
            <Text style={{ fontSize: 28, fontWeight: "bold" }}>Finance App</Text>

            <TextInput
                placeholder="Email"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                style={{ borderWidth: 1, padding: 12, borderRadius: 8 }}
            />

            <TextInput
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                style={{ borderWidth: 1, padding: 12, borderRadius: 8 }}
            />

            <Button title="Login" onPress={handleLogin} />
        </View>
    );
}
