import { useEffect, useLayoutEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import { addTodo, editTodo } from "../Store/todoSlice"; // adjust path if needed
import { useThemeToggle } from "../theme/themeContext";

export default function AddTodoScreen({ navigation, route }) {
  const dispatch = useDispatch();
  const { theme } = useThemeToggle();
  const { mode, id } = route.params || {}; // mode: "add" | "edit"
  const existingTodo = useSelector((s) =>
    s.todos.items.find((t) => t.id === id)
  );

  const [title, setTitle] = useState("");

  // if edit mode, load todo into input
  useEffect(() => {
    if (mode === "edit" && existingTodo) {
      setTitle(existingTodo.title);
    }
  }, [mode, existingTodo]);

  // update header title
  useLayoutEffect(() => {
    navigation.setOptions({
      title: mode === "edit" ? "Edit Todo" : "Add Todo",
    });
  }, [navigation, mode]);

  const handleSave = () => {
    if (!title.trim()) return;

    if (mode === "edit" && existingTodo) {
      dispatch(editTodo({ id, title }));
      Toast.show({
        type: "success",
        text1: "Todo updated",
        visibilityTime: 4000,
      });
    } else {
      dispatch(addTodo(title));
      Toast.show({
        type: "success",
        text1: "Todo added",
        visibilityTime: 4000,
      });
    }

    navigation.goBack();
  };

  return (
    <View
      style={[styles.container, , { backgroundColor: theme.colors.background }]}
    >
      <Text style={[styles.label, { color: theme.colors.text }]}>
        {mode === "edit" ? "Update your todo:" : "Enter a new todo:"}
      </Text>
      <TextInput
        style={[
          styles.input,
          { borderColor: theme.colors.border, color: theme.colors.text },
        ]}
        value={title}
        onChangeText={setTitle}
        placeholder="e.g. Buy groceries"
        placeholderTextColor={theme.colors.placeholder}
      />

      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: theme.colors.background,
            borderColor: theme.colors.border,
          },
        ]}
        onPress={handleSave}
      >
        <Text style={[styles.buttonText, { color: theme.colors.primary }]}>
          {mode === "edit" ? "Update" : "Add"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 12,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    // backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
  },
  buttonText: {
    // color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
