import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Button,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

type Props = {
    onLogin: (token: string) => void;
    onGoToRegister: () => void;
};

type FormErrors = {
    email?: string;
    password?: string;
};

export default function LoginScreen({
    onLogin,
    onGoToRegister,
}: Props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);

    const validateForm = () => {
        const newErrors: FormErrors = {};

        const trimmedEmail = email.trim();

        if (!trimmedEmail) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(trimmedEmail)) {
            newErrors.email = "Enter a valid email";
        }

        if (!password) {
            newErrors.password = "Password is required";
        } else if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async () => {
        if (!validateForm()) return;

        try {
            setLoading(true);

            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email.trim(),
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Login failed");
                return;
            }

            onLogin(data.token);
        } catch (error) {
            console.log(error);
            alert("Something went wrong");
        } finally {
            setLoading(false);
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
                PesoTrack
            </Text>

            <View>
                <TextInput
                    placeholder="Email"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={(value) => {
                        setEmail(value);
                        setErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    style={{
                        borderWidth: 1,
                        borderRadius: 8,
                        padding: 12,
                        borderColor: errors.email ? "red" : "#ccc",
                    }}
                />

                {errors.email && (
                    <Text style={{ color: "red", marginTop: 4 }}>
                        {errors.email}
                    </Text>
                )}
            </View>

            <View>
                <TextInput
                    placeholder="Password"
                    secureTextEntry
                    value={password}
                    onChangeText={(value) => {
                        setPassword(value);
                        setErrors((prev) => ({ ...prev, password: undefined }));
                    }}
                    style={{
                        borderWidth: 1,
                        borderRadius: 8,
                        padding: 12,
                        borderColor: errors.password ? "red" : "#ccc",
                    }}
                />

                {errors.password && (
                    <Text style={{ color: "red", marginTop: 4 }}>
                        {errors.password}
                    </Text>
                )}
            </View>

            {loading ? (
                <ActivityIndicator />
            ) : (
                <Button title="Login" onPress={handleLogin} />
            )}

            <Button
                title="Create Account"
                onPress={onGoToRegister}
                disabled={loading}
            />
        </SafeAreaView>
    );
}