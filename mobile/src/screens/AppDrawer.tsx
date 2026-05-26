import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";

import { Ionicons } from "@expo/vector-icons";

import TransactionsScreen from "./TransactionsScreen";

const Drawer = createDrawerNavigator();

type Props = {
  token: string;
  onLogout: () => void;
  onDeleteAccount: () => void;
};

export default function AppDrawer({
  token,
  onLogout,
  onDeleteAccount,
}: Props) {
  return (
    <Drawer.Navigator
      drawerContent={(props) => (
        <DrawerContentScrollView {...props}>
          <DrawerItemList {...props} />

          <DrawerItem
            label="Logout"
            onPress={onLogout}
            icon={({ color, size }) => (
              <Ionicons
                name="log-out-outline"
                size={size}
                color={color}
              />
            )}
          />

          <DrawerItem
            label="Delete Account"
            onPress={onDeleteAccount}
            icon={({ color, size }) => (
              <Ionicons
                name="trash-outline"
                size={size}
                color={color}
              />
            )}
          />
        </DrawerContentScrollView>
      )}
    >
      <Drawer.Screen
        name="Transactions"
        options={{
          headerTitle: '',
          drawerIcon: ({ color, size }) => (
            <Ionicons
              name="wallet-outline"
              size={size}
              color={color}
            />
          ),
        }}
      >
        {(props) => (
          <TransactionsScreen
            {...props}
            token={token}
          />
        )}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
}