import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text, TouchableOpacity } from "react-native";
import Toast from "react-native-toast-message";
import AddTodoScreen from "../screens/AddTodoScreen";
import MainScreen from "../screens/MainScreen";
import { DarkBWTheme, LightTheme } from "../theme/theme";
import { ThemeProvider, useThemeToggle } from "../theme/themeContext";

const Stack = createNativeStackNavigator();

function Navigator() {
  const { isDark, setIsDark } = useThemeToggle();

  return (
    <NavigationContainer theme={isDark ? DarkBWTheme : LightTheme}>
      <Stack.Navigator>
        <Stack.Screen
          name="Main"
          component={MainScreen}
          options={{
            title: "TODOs",
            headerRight: () => (
              <TouchableOpacity
                onPress={() => setIsDark(!isDark)}
                style={{
                  paddingHorizontal: 10,
                  flexDirection: "row",
                  alignItems: "center",
                  width: 120,
                }}
              >
                <Text style={{ fontSize: 18, color: isDark ? "#FFF" : "#000" }}>
                  {isDark ? "☀️" : "🌙"}
                </Text>
                <Text style={{ color: isDark ? "#ffffffff" : "#000000ff" }}>
                  {isDark ? "Switch to Light" : "Switch to Dark"}
                </Text>
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="AddTodo"
          component={AddTodoScreen}
          options={({ route }) => ({
            title: route.params?.mode === "edit" ? "Edit TODO" : "Add TODO",
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function RootNavigator() {
  return (
    <ThemeProvider>
      <Navigator />
      <Toast />
    </ThemeProvider>
  );
}
