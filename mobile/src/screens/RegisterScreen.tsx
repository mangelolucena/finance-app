import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Button,
    Alert,
    ActivityIndicator,
} from "react-native";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

type Props = {
    onBackToLogin: () => void;
};

type FormErrors = {
    email?: string;
    password?: string;
    confirmPassword?: string;
};

export default function RegisterScreen({
    onBackToLogin,
}: Props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

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
            newErrors.password =
                "Password must be at least 6 characters";
        }

        if (!confirmPassword) {
            newErrors.confirmPassword =
                "Confirm password is required";
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword =
                "Passwords do not match";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async () => {
        if (!validateForm()) return;

        try {
            setLoading(true);

            const response = await fetch(
                `${API_URL}/auth/register`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: email.trim(),
                        password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                Alert.alert(
                    "Register failed",
                    data.message || "Something went wrong"
                );
                return;
            }

            Alert.alert(
                "Success",
                "Account created. You can now login."
            );

            onBackToLogin();
        } catch (error) {
            console.log(error);
            Alert.alert("Error", "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View
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
                Create Account
            </Text>

            <View>
                <TextInput
                    placeholder="Email"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={(value) => {
                        setEmail(value);
                        setErrors((prev) => ({
                            ...prev,
                            email: undefined,
                        }));
                    }}
                    style={{
                        borderWidth: 1,
                        borderRadius: 8,
                        padding: 12,
                        borderColor: errors.email
                            ? "red"
                            : "#ccc",
                    }}
                />

                {errors.email && (
                    <Text
                        style={{
                            color: "red",
                            marginTop: 4,
                        }}
                    >
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
                        setErrors((prev) => ({
                            ...prev,
                            password: undefined,
                        }));
                    }}
                    style={{
                        borderWidth: 1,
                        borderRadius: 8,
                        padding: 12,
                        borderColor: errors.password
                            ? "red"
                            : "#ccc",
                    }}
                />

                {errors.password && (
                    <Text
                        style={{
                            color: "red",
                            marginTop: 4,
                        }}
                    >
                        {errors.password}
                    </Text>
                )}
            </View>

            <View>
                <TextInput
                    placeholder="Confirm Password"
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={(value) => {
                        setConfirmPassword(value);
                        setErrors((prev) => ({
                            ...prev,
                            confirmPassword: undefined,
                        }));
                    }}
                    style={{
                        borderWidth: 1,
                        borderRadius: 8,
                        padding: 12,
                        borderColor: errors.confirmPassword
                            ? "red"
                            : "#ccc",
                    }}
                />

                {errors.confirmPassword && (
                    <Text
                        style={{
                            color: "red",
                            marginTop: 4,
                        }}
                    >
                        {errors.confirmPassword}
                    </Text>
                )}
            </View>

            {loading ? (
                <ActivityIndicator />
            ) : (
                <Button
                    title="Register"
                    onPress={handleRegister}
                />
            )}

            <Button
                title="Back to Login"
                onPress={onBackToLogin}
                disabled={loading}
            />
        </View>
    );
}