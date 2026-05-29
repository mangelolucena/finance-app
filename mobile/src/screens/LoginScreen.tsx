import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
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

export default function LoginScreen({ onLogin, onGoToRegister }: Props) {
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
        backgroundColor: "#FFF7F8",
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{
          flex: 1,
          justifyContent: "center",
          padding: 24,
        }}
      >
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 32,
            padding: 28,
            borderWidth: 1,
            borderColor: "#F4D7DD",
            shadowColor: "#000",
            shadowOpacity: 0.08,
            shadowRadius: 16,
            shadowOffset: {
              width: 0,
              height: 8,
            },
            elevation: 4,
          }}
        >
          <View
            style={{
              alignItems: "center",
              marginBottom: 24,
            }}
          >
            <Image
              source={require("../../assets/icon.png")}
              style={{
                width: 96,
                height: 96,
                marginBottom: 14,
              }}
              resizeMode="contain"
            />

            <Text
              style={{
                fontSize: 34,
                fontWeight: "800",
                color: "#5F7D44",
              }}
            >
              PiggyPal
            </Text>

            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: "#374151",
                marginTop: 10,
              }}
            >
              Welcome Back 👋
            </Text>

            <Text
              style={{
                marginTop: 6,
                color: "#718096",
                fontSize: 15,
                textAlign: "center",
              }}
            >
              Your money's best friend.
            </Text>
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text
              style={{
                marginBottom: 6,
                color: "#5F7D44",
                fontWeight: "600",
              }}
            >
              Email
            </Text>

            <TextInput
              placeholder="you@example.com"
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
                borderRadius: 16,
                padding: 15,
                borderColor: errors.email ? "#DC2626" : "#F4D7DD",
                backgroundColor: "#FFFDFD",
                fontSize: 16,
              }}
            />

            {errors.email && (
              <Text
                style={{
                  color: "#DC2626",
                  marginTop: 6,
                  fontSize: 13,
                }}
              >
                {errors.email}
              </Text>
            )}
          </View>

          <View style={{ marginBottom: 22 }}>
            <Text
              style={{
                marginBottom: 6,
                color: "#5F7D44",
                fontWeight: "600",
              }}
            >
              Password
            </Text>

            <TextInput
              placeholder="Enter your password"
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
                borderRadius: 16,
                padding: 15,
                borderColor: errors.password ? "#DC2626" : "#F4D7DD",
                backgroundColor: "#FFFDFD",
                fontSize: 16,
              }}
            />

            {errors.password && (
              <Text
                style={{
                  color: "#DC2626",
                  marginTop: 6,
                  fontSize: 13,
                }}
              >
                {errors.password}
              </Text>
            )}
          </View>

          <Pressable
            onPress={handleLogin}
            disabled={loading}
            style={{
              height: 56,
              borderRadius: 18,
              backgroundColor: loading ? "#A3C58A" : "#7BA05B",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text
                style={{
                  color: "#FFFFFF",
                  fontWeight: "700",
                  fontSize: 17,
                }}
              >
                Login
              </Text>
            )}
          </Pressable>

          <Pressable
            onPress={onGoToRegister}
            disabled={loading}
            style={{
              alignItems: "center",
              paddingVertical: 10,
            }}
          >
            <Text
              style={{
                color: "#E98FA3",
                fontWeight: "700",
              }}
            >
              Create an account
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}