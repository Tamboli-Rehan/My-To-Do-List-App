import {
  createAsyncThunk,
  createSelector,
  createSlice,
  nanoid,
} from "@reduxjs/toolkit";
import Toast from "react-native-toast-message";
import { nowISO } from "../utils/date";

// Fetch seed data from JSONPlaceholder
export const fetchTodos = createAsyncThunk("todos/fetchTodos", async () => {
  // console.log("fetchTodos thunk called ✅");
  try {
    const res = await fetch("https://dummyjson.com/todos?limit=25");
    console.log("Response status:", res.status);
    const data = await res.json();
    console.log("API responded ✅", data.total, "items");
    const now = nowISO();
    return data.todos.map((t) => ({
      id: t.id,
      title: t.todo,
      completed: t.completed,
      created_at: now,
      updated_at: now,
    }));
  } catch (err) {
    console.error("❌ fetchTodos failed:", err);
    throw err;
  }
});

const initialState = {
  items: [],
  filter: "ALL",
  sort: "RECENT",
  loading: false,
  nextLocalId: 100000,
};
const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    setFilter(state, action) {
      state.filter = action.payload;
    },
    setSort(state, action) {
      state.sort = action.payload;
    },
    addTodo: {
      prepare(title) {
        const timestamp = nowISO();
        return { payload: { tempKey: nanoid(), title, timestamp } };
      },
      reducer(state, action) {
        const id = state.nextLocalId++;
        state.items.unshift({
          id,
          title: action.payload.title.trim(),
          completed: false,
          created_at: action.payload.timestamp,
          updated_at: action.payload.timestamp,
        });
      },
    },
    toggleTodo(state, action) {
      const t = state.items.find((i) => i.id === action.payload.id);
      if (t) {
        t.completed = !t.completed;
        t.updated_at = nowISO();
      }
    },
    deleteTodo(state, action) {
      state.items = state.items.filter((i) => i.id !== action.payload.id);
      Toast.show({
        type: "error",
        text1: "Todo deleted",
        visibilityTime: 4000,
      });
    },
    editTodo(state, action) {
      const t = state.items.find((i) => i.id === action.payload.id);
      if (t) {
        t.title = action.payload.title.trim();
        t.updated_at = nowISO();
      }
    },
    clearAll(state) {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load todos";
      });
  },
});
export const {
  setFilter,
  setSort,
  addTodo,
  toggleTodo,
  deleteTodo,
  editTodo,
  clearAll,
} = todosSlice.actions;

//selectors

const selectTodosState = (s) => s.todos;
export const selectCounts = createSelector([selectTodosState], (s) => {
  const total = s.items.length;
  const completed = s.items.filter((i) => i.completed).length;
  return { total, completed };
});

export const selectVisibleTodos = createSelector([selectTodosState], (s) => {
  let filtered = s.items;
  if (s.filter === "ACTIVE") filtered = filtered.filter((i) => !i.completed);
  if (s.filter === "DONE") filtered = filtered.filter((i) => i.completed);

  if (s.sort === "RECENT") {
    filtered = [...filtered].sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );
  } else {
    filtered = [...filtered].sort((a, b) => a.id - b.id);
  }
  return filtered;
});

export default todosSlice.reducer;
