import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Button,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

type Props = {
    onLogin: (token: string) => void;
    onGoToRegister: () => void;
};

export default function LoginScreen({
    onLogin,
    onGoToRegister,
}: Props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            const response = await fetch(
                `${API_URL}/auth/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Login failed");
                return;
            }

            onLogin(data.token);
        } catch (error) {
            console.log(error);
            alert("Something went wrong");
        }
    };

    return (
        <SafeAreaView
            style={{
                flex: 1,
                justifyContent: "center",
                padding: 24,
                gap: 12,
            }}
        >
            <Text
                style={{
                    fontSize: 32,
                    fontWeight: "bold",
                }}
            >
                Finance App
            </Text>

            <TextInput
                placeholder="Email"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                style={{
                    borderWidth: 1,
                    borderRadius: 8,
                    padding: 12,
                }}
            />

            <TextInput
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                style={{
                    borderWidth: 1,
                    borderRadius: 8,
                    padding: 12,
                }}
            />

            <Button
                title="Login"
                onPress={handleLogin}
            />
            <Button title="Create Account" onPress={onGoToRegister} />
        </SafeAreaView>
    );
}