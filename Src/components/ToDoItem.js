import { MaterialIcons } from "@expo/vector-icons";
import { memo, useCallback } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const TodoItem = memo(({ item, onToggle, onDelete, onEdit }) => {
  const handleToggle = useCallback(
    () => onToggle(item.id),
    [onToggle, item.id]
  );
  const handleDelete = useCallback(
    () => onDelete(item.id),
    [onDelete, item.id]
  );
  const handleEdit = useCallback(() => onEdit(item.id), [onEdit, item.id]);

  return (
    <View style={styles.container}>
      <Pressable
        onPress={handleToggle}
        style={[styles.checkbox, item.completed && styles.checkboxOn]}
      >
        {item.completed && (
          <MaterialIcons name="check" size={18} color="#fff" />
        )}
      </Pressable>

      <Pressable onPress={handleEdit} style={styles.content}>
        <Text
          style={[styles.title, item.completed && styles.done]}
          numberOfLines={2}
        >
          {item.title}
        </Text>
        <Text style={styles.meta}>
          Updated {new Date(item.updated_at).toLocaleString()}
        </Text>
      </Pressable>

      <Pressable onPress={handleDelete} style={styles.deleteBtn}>
        <MaterialIcons name="delete" size={20} color="#fff" />
      </Pressable>
    </View>
  );
});

export default TodoItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 10,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2, // Android shadow
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  checkboxOn: {
    backgroundColor: "#000",
    borderColor: "#000",
  },
  content: {
    flex: 1,
  },
  title: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
  done: {
    textDecorationLine: "line-through",
    color: "#888",
  },
  meta: {
    color: "#666",
    fontSize: 12,
    marginTop: 2,
  },
  deleteBtn: {
    backgroundColor: "#e53935",
    padding: 8,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
});
