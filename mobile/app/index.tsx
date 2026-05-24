import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { router } from "expo-router";

import LoginScreen from "../src/screens/LoginScreen";
import { getToken } from "../src/lib/auth";

export default function IndexPage() {
    const [checkingToken, setCheckingToken] = useState(true);

    useEffect(() => {
        const checkToken = async () => {
            const token = await getToken();

            if (token) {
                router.replace("/transactions");
                return;
            }

            setCheckingToken(false);
        };

        checkToken();
    }, []);

    if (checkingToken) {
        return (
            <View style={{ flex: 1, justifyContent: "center" }}>
                <ActivityIndicator />
            </View>
        );
    }

    return <LoginScreen />;
}