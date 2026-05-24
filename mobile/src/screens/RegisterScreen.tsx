import { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

type Props = {
    onBackToLogin: () => void;
};

export default function RegisterScreen({ onBackToLogin }: Props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async () => {
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                Alert.alert("Register failed", data.message || "Something went wrong");
                return;
            }

            Alert.alert("Success", "Account created. You can now login.");
            onBackToLogin();
        } catch (error) {
            console.log(error);
            Alert.alert("Error", "Something went wrong");
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: "center", padding: 24, gap: 12 }}>
            <Text style={{ fontSize: 32, fontWeight: "bold" }}>Create Account</Text>

            <TextInput
                placeholder="Email"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                style={{ borderWidth: 1, borderRadius: 8, padding: 12 }}
            />

            <TextInput
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                style={{ borderWidth: 1, borderRadius: 8, padding: 12 }}
            />

            <Button title="Register" onPress={handleRegister} />
            <Button title="Back to Login" onPress={onBackToLogin} />
        </View>
    );
}