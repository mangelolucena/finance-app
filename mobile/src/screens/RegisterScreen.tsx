import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

type Props = {
  onBackToLogin: () => void;
};

type FormErrors = {
  email?: string;
  password?: string;
  confirmPassword?: string;
};

export default function RegisterScreen({ onBackToLogin }: Props) {
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
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/auth/register`, {
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
        Alert.alert("Register failed", data.message || "Something went wrong");
        return;
      }

      Alert.alert("Success", "Account created. You can now login.");
      onBackToLogin();
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Something went wrong");
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
                width: 92,
                height: 92,
                marginBottom: 14,
              }}
              resizeMode="contain"
            />

            <Text
              style={{
                fontSize: 32,
                fontWeight: "800",
                color: "#5F7D44",
              }}
            >
              Join PiggyPal
            </Text>

            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: "#374151",
                marginTop: 10,
              }}
            >
              Start Your Money Journey 🐷
            </Text>

            <Text
              style={{
                marginTop: 6,
                color: "#718096",
                fontSize: 15,
                textAlign: "center",
              }}
            >
              Track spending. Build wealth.
            </Text>
          </View>

          <InputField
            label="Email"
            placeholder="you@example.com"
            value={email}
            error={errors.email}
            keyboardType="email-address"
            onChangeText={(value) => {
              setEmail(value);
              setErrors((prev) => ({
                ...prev,
                email: undefined,
              }));
            }}
          />

          <InputField
            label="Password"
            placeholder="Enter your password"
            value={password}
            error={errors.password}
            secureTextEntry
            onChangeText={(value) => {
              setPassword(value);
              setErrors((prev) => ({
                ...prev,
                password: undefined,
              }));
            }}
          />

          <InputField
            label="Confirm Password"
            placeholder="Confirm your password"
            value={confirmPassword}
            error={errors.confirmPassword}
            secureTextEntry
            onChangeText={(value) => {
              setConfirmPassword(value);
              setErrors((prev) => ({
                ...prev,
                confirmPassword: undefined,
              }));
            }}
          />

          <Pressable
            onPress={handleRegister}
            disabled={loading}
            style={{
              height: 56,
              borderRadius: 18,
              backgroundColor: loading ? "#A3C58A" : "#7BA05B",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 8,
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
                Register
              </Text>
            )}
          </Pressable>

          <Pressable
            onPress={onBackToLogin}
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
              Back to Login
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

type InputFieldProps = {
  label: string;
  placeholder: string;
  value: string;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address";
  onChangeText: (value: string) => void;
};

function InputField({
  label,
  placeholder,
  value,
  error,
  secureTextEntry,
  keyboardType = "default",
  onChangeText,
}: InputFieldProps) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text
        style={{
          marginBottom: 6,
          color: "#5F7D44",
          fontWeight: "600",
        }}
      >
        {label}
      </Text>

      <TextInput
        placeholder={placeholder}
        autoCapitalize="none"
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        value={value}
        onChangeText={onChangeText}
        style={{
          borderWidth: 1,
          borderRadius: 16,
          padding: 15,
          borderColor: error ? "#DC2626" : "#F4D7DD",
          backgroundColor: "#FFFDFD",
          fontSize: 16,
        }}
      />

      {error && (
        <Text
          style={{
            color: "#DC2626",
            marginTop: 6,
            fontSize: 13,
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );
}