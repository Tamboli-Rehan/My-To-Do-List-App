import { useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import EmptyState from "../components/EmptyState";
import TodoItem from "../components/ToDoItem";
import {
  deleteTodo,
  fetchTodos,
  selectCounts,
  selectVisibleTodos,
  setFilter,
  setSort,
  toggleTodo,
} from "../Store/todoSlice";
import { colors } from "../theme/colors";
import { useThemeToggle } from "../theme/themeContext";

export default function MainScreen() {
  const nav = useNavigation();
  const dispatch = useDispatch();
  const { theme } = useThemeToggle();

  const items = useSelector(selectVisibleTodos);
  const { total, completed } = useSelector(selectCounts);
  const { loading, filter, sort } = useSelector((s) => s.todos);

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  const handleToggle = useCallback(
    (id) => dispatch(toggleTodo({ id })),
    [dispatch]
  );
  const handleDelete = useCallback(
    (id) => dispatch(deleteTodo({ id })),
    [dispatch]
  );
  const handleEdit = useCallback(
    (id) => nav.navigate("AddTodo", { mode: "edit", id }),
    [nav]
  );

  const header = useMemo(
    () => (
      <View
        style={[styles.toolbar, { backgroundColor: theme.colors.background }]}
      >
        <Text style={[styles.counts, { color: theme.colors.text }]}>
          Total: {total} • Done: {completed}
        </Text>
        <View style={styles.row}>
          <Segmented
            value={filter}
            options={[
              { label: "All", value: "ALL" },
              { label: "Active", value: "ACTIVE" },
              { label: "Done", value: "DONE" },
            ]}
            onChange={(v) => dispatch(setFilter(v))}
          />
          <Segmented
            value={sort}
            options={[
              { label: "Recent", value: "RECENT" },
              { label: "ID", value: "ID" },
            ]}
            onChange={(v) => dispatch(setSort(v))}
          />
        </View>
      </View>
    ),
    [completed, total, filter, sort, dispatch, theme]
  );

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {loading && items.length === 0 ? (
        <View style={{ padding: 24 }}>
          <ActivityIndicator />
        </View>
      ) : null}

      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ gap: 12, padding: 16 }}
        ListHeaderComponent={header}
        ListEmptyComponent={<EmptyState />}
        renderItem={({ item }) => (
          <TodoItem
            item={item}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        )}
        removeClippedSubviews
        initialNumToRender={10}
        windowSize={10}
        getItemLayout={(_, index) => ({
          length: 76,
          offset: 76 * index,
          index,
        })}
      />

      <FloatingAction
        onPress={() => nav.navigate("AddTodo", { mode: "add" })}
      />
    </View>
  );
}

function Segmented({ value, options, onChange }) {
  const { theme } = useThemeToggle();
  return (
    <View
      style={[
        segmented.container,
        {
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.background,
        },
      ]}
    >
      {options.map((opt) => (
        <Pressable
          key={opt.value}
          style={[segmented.item, value === opt.value && segmented.active]}
          onPress={() => onChange(opt.value)}
        >
          <Text
            style={[
              segmented.label,
              value === opt.value && segmented.labelActive,
            ]}
          >
            {opt.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

function FloatingAction({ onPress }) {
  const { theme } = useThemeToggle();
  return (
    <Pressable
      onPress={onPress}
      style={[fab.btn, { backgroundColor: theme.colors.floatingIcon }]}
    >
      <Text style={[fab.label, { color: theme.colors.background }]}>＋</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  toolbar: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8, gap: 12 },
  counts: { fontWeight: "700" },
  row: { flexDirection: "row", gap: 12, alignItems: "center" },
});

const segmented = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: 999,
    borderWidth: 1,
    padding: 2,
  },
  item: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  active: {
    backgroundColor: "#161616",
  },
  label: { color: colors.muted, fontSize: 12, fontWeight: "600" },
  labelActive: { color: colors.fg },
});

const fab = StyleSheet.create({
  btn: {
    position: "absolute",
    right: 20,
    bottom: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  label: { fontSize: 28, lineHeight: 28 },
});
