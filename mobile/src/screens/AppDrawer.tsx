import {
    createDrawerNavigator,
    DrawerContentScrollView,
    DrawerItemList,
    DrawerItem,
} from "@react-navigation/drawer";

import TransactionsScreen from "./TransactionsScreen";

const Drawer = createDrawerNavigator();

type Props = {
    token: string;
    onLogout: () => void;
    onDeleteAccount: () => void;
};

export default function AppDrawer({ token, onLogout, onDeleteAccount }: Props) {
    return (
        <Drawer.Navigator
            drawerContent={(props) => (
                <DrawerContentScrollView {...props}>
                    <DrawerItemList {...props} />

                    <DrawerItem
                        label="Logout"
                        onPress={onLogout}
                    />
                    <DrawerItem
                        label="Delete Account"
                        onPress={onDeleteAccount}
                    />
                </DrawerContentScrollView>
            )}
        >
            <Drawer.Screen name="Transactions">
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