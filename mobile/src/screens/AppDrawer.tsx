import { View, Text, Image, StyleSheet } from "react-native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import HomeDashboardScreen from "./Home/HomeDashboardScreen";
import NetWorthScreen from "./NetWorthScreen";

const Drawer = createDrawerNavigator();

type Props = {
  token: string;
  onLogout: () => void;
  onDeleteAccount: () => void;
};

function CustomDrawerContent(props: any) {
  const { onLogout, onDeleteAccount } = props;

  return (
     <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#FFF7F8",
      }}
      edges={["top"]}
    >
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.drawerContent}
    >
      <View style={styles.brandCard}>
        <Image
          source={require("../../assets/icon.png")}
          style={styles.brandImage}
          resizeMode="contain"
        />

        <Text style={styles.brandTitle}>PiggyPal</Text>
        <Text style={styles.brandSubtitle}>Your money's best friend</Text>
      </View>

      <Text style={styles.sectionLabel}>Overview</Text>

      <DrawerItemList {...props} />

      <View style={styles.divider} />

      <Text style={styles.sectionLabel}>Account</Text>

      <DrawerItem
        label="Logout"
        onPress={onLogout}
        labelStyle={styles.drawerLabel}
        icon={({ size }) => (
          <Ionicons name="log-out-outline" size={size} color="#718096" />
        )}
      />

      <DrawerItem
        label="Delete Account"
        onPress={onDeleteAccount}
        labelStyle={styles.deleteLabel}
        icon={({ size }) => (
          <Ionicons name="trash-outline" size={size} color="#DC2626" />
        )}
      />
    </DrawerContentScrollView>
    </SafeAreaView>
  );
}

export default function AppDrawer({
  token,
  onLogout,
  onDeleteAccount,
}: Props) {
  return (
    <Drawer.Navigator
      drawerContent={(props) => (
        <CustomDrawerContent
          {...props}
          onLogout={onLogout}
          onDeleteAccount={onDeleteAccount}
        />
      )}
      screenOptions={{
        headerTitle: "",
        headerTintColor: "#5F7D44",
        drawerStyle: {
          backgroundColor: "#FFF7F8",
          width: 300,
        },
        drawerActiveBackgroundColor: "#FCE7EC",
        drawerActiveTintColor: "#5F7D44",
        drawerInactiveTintColor: "#718096",
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: "700",
          marginLeft: -8,
        },
        drawerItemStyle: {
          borderRadius: 18,
          marginHorizontal: 12,
          marginVertical: 4,
          paddingVertical: 4,
        },
      }}
    >
      <Drawer.Screen
        name="Home"
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      >
        {(props) => <HomeDashboardScreen {...props} token={token} />}
      </Drawer.Screen>

      <Drawer.Screen
        name="Net Worth"
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="wallet-outline" size={size} color={color} />
          ),
        }}
      >
        {(props) => <NetWorthScreen {...props} token={token} />}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    paddingTop: 12,
  },
  brandCard: {
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 18,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#F4D7DD",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    elevation: 3,
  },
  brandImage: {
    width: 76,
    height: 76,
    marginBottom: 10,
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#5F7D44",
  },
  brandSubtitle: {
    marginTop: 4,
    color: "#718096",
    fontSize: 13,
    textAlign: "center",
  },
  sectionLabel: {
    marginHorizontal: 24,
    marginBottom: 8,
    marginTop: 4,
    fontSize: 12,
    fontWeight: "800",
    color: "#E98FA3",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  divider: {
    height: 1,
    backgroundColor: "#F4D7DD",
    marginHorizontal: 24,
    marginVertical: 16,
  },
  drawerLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#718096",
  },
  deleteLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#DC2626",
  },
});