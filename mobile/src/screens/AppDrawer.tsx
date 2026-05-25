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
};

export default function AppDrawer({ token, onLogout }: Props) {
    return (
        <Drawer.Navigator
            drawerContent={(props) => (
                <DrawerContentScrollView {...props}>
                    <DrawerItemList {...props} />

                    <DrawerItem
                        label="Logout"
                        onPress={onLogout}
                    />
                </DrawerContentScrollView>
            )}
        >
            <Drawer.Screen name="Transactions">
                {(props) => (
                    <TransactionsScreen
                        {...props}
                        token={token}
                        onLogout={onLogout}
                    />
                )}
            </Drawer.Screen>
        </Drawer.Navigator>
    );
}