import { FilterValuesType } from "app/App";
import { todolistsAPI } from "features/todolists/api/todolistsAPI";
import { RequestStatusType, setAppStatus } from "app/appSlice";
import { handleServerNetworkError } from "common/utils/handle-server-network-error";
import { AxiosError } from "axios";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clearData } from "common/actions/clearData/clearData";
import { fetchTasks } from "features/tasks/model/tasksSlice";
import { handleServerAppError } from "common/utils/handle-server-app-error";
import { createAppAsyncThunk } from "common/utils/create-app-async-thunk";
import { ChangeTodosTitleData, TodolistDomainType, TodolistType } from "features/todolists/model/todolistsSlice.types";
import { ResultCode } from "common/enums/enums";

//thunks
export const fetchTodolists = createAppAsyncThunk<{ todolists: TodolistType[] }>(
  "todolists/fetchTodolists",
  async (_, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    dispatch(setAppStatus({ status: "loading" }));
    try {
      const res = await todolistsAPI.getTodolists();
      const todolists = res.data;
      dispatch(setAppStatus({ status: "succeeded" }));
      res.data.forEach((tl) => dispatch(fetchTasks(tl.id)));
      return { todolists };
    } catch (e) {
      handleServerNetworkError(e as AxiosError, dispatch);
      return rejectWithValue(null);
    }
  },
);

export const removeTodolist = createAppAsyncThunk<{ todolistId: string }, string>(
  "todolists/removeTodolist",
  async (todolistId, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      dispatch(changeTodolistEntityStatus({ todolistId, entityStatus: "loading" }));
      const res = await todolistsAPI.deleteTodolist(todolistId);
      if (res.data.resultCode === ResultCode.success) {
        dispatch(setAppStatus({ status: "succeeded" }));
        return { todolistId };
      } else {
        handleServerAppError(res.data, dispatch);
        dispatch(changeTodolistEntityStatus({ todolistId, entityStatus: "failed" }));
        return rejectWithValue(null);
      }
    } catch (e) {
      handleServerNetworkError(e as AxiosError, dispatch);
      dispatch(changeTodolistEntityStatus({ todolistId, entityStatus: "failed" }));
      return rejectWithValue(null);
    }
  },
);

export const addTodolist = createAppAsyncThunk<{ todolist: TodolistType }, string>(
  "todolists/addTodolist",
  async (title: string, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      dispatch(setAppStatus({ status: "loading" }));
      const res = await todolistsAPI.createTodolist(title);
      if (res.data.resultCode === ResultCode.success) {
        const todolist = res.data.data.item;
        dispatch(setAppStatus({ status: "succeeded" }));
        return { todolist };
      } else {
        handleServerAppError(res.data, dispatch);
        return rejectWithValue(null);
      }
    } catch (e) {
      handleServerNetworkError(e as AxiosError, dispatch);
      return rejectWithValue(null);
    }
  },
);

export const changeTodolistTitle = createAppAsyncThunk<ChangeTodosTitleData, ChangeTodosTitleData>(
  "todolists/changeTodolistTitle",
  async (params, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    const { todolistId, title } = params;
    try {
      dispatch(setAppStatus({ status: "loading" }));
      const res = await todolistsAPI.updateTodolistTitle(todolistId, title);
      if (res.data.resultCode === ResultCode.success) {
        dispatch(setAppStatus({ status: "succeeded" }));
        return { todolistId, title };
      } else {
        handleServerAppError(res.data, dispatch);
        return rejectWithValue(null);
      }
    } catch (e) {
      handleServerNetworkError(e as AxiosError, dispatch);
      return rejectWithValue(null);
    }
  },
);

//slice
const todolistsSlice = createSlice({
  name: "todolist",
  initialState: [] as Array<TodolistDomainType>,
  reducers: {
    changeTodolistFilter(state, action: PayloadAction<{ todolistId: string; filter: FilterValuesType }>) {
      const todolist = state.find((tl) => tl.id === action.payload.todolistId);
      if (todolist) {
        todolist.filter = action.payload.filter;
      }
    },
    changeTodolistEntityStatus(
      state,
      action: PayloadAction<{
        todolistId: string;
        entityStatus: RequestStatusType;
      }>,
    ) {
      const todolist = state.find((tl) => tl.id === action.payload.todolistId);
      if (todolist) {
        todolist.entityStatus = action.payload.entityStatus;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodolists.fulfilled, (_, action) => {
        return action.payload.todolists.map((t) => ({ ...t, filter: "all", entityStatus: "idle" }));
      })
      .addCase(removeTodolist.fulfilled, (state, action) => {
        const index = state.findIndex((tl) => tl.id === action.payload.todolistId);
        if (index !== -1) {
          state.splice(index, 1);
        }
      })
      .addCase(addTodolist.fulfilled, (state, action) => {
        state.unshift({ ...action.payload.todolist, filter: "all", entityStatus: "idle" });
      })
      .addCase(changeTodolistTitle.fulfilled, (state, action) => {
        const todolist = state.find((tl) => tl.id === action.payload.todolistId);
        if (todolist) {
          todolist.title = action.payload.title;
        }
      })
      .addCase(clearData, () => {
        return [];
      });
  },
});

export const todolistsReducer = todolistsSlice.reducer;
export const { changeTodolistFilter, changeTodolistEntityStatus } = todolistsSlice.actions;
