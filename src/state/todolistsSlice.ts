import { FilterValuesType } from "app/App";
import { todolistsApi } from "api/todolists-api";
import { AppThunk } from "./store";
import { RequestStatusType, setAppStatus } from "state/appSlice";
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils";
import { AxiosError } from "axios";
import { fetchTasksTC } from "state/tasksSlice";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clearData } from "common/common.actions";

const todolistsSlice = createSlice({
  name: "todolist",
  initialState: [] as Array<TodolistDomainType>,
  reducers: {
    setTodolists(state, action: PayloadAction<{ todolists: TodolistType[] }>) {
      return action.payload.todolists.map((t) => ({ ...t, filter: "all", entityStatus: "idle" }));
    },
    removeTodolist(state, action: PayloadAction<{ todolistId: string }>) {
      const index = state.findIndex((tl) => tl.id === action.payload.todolistId);
      if (index !== -1) {
        state.splice(index, 1);
      }
    },
    addTodolist(state, action: PayloadAction<{ todolist: TodolistType }>) {
      state.unshift({ ...action.payload.todolist, filter: "all", entityStatus: "idle" });
    },
    changeTodolistTitle(state, action: PayloadAction<{ todolistId: string; title: string }>) {
      const todolist = state.find((tl) => tl.id === action.payload.todolistId);
      if (todolist) {
        todolist.title = action.payload.title;
      }
    },
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
    builder.addCase(clearData, () => {
      return [];
    });
  },
});

export const todolistsReducer = todolistsSlice.reducer;
export const {
  changeTodolistFilter,
  setTodolists,
  changeTodolistTitle,
  removeTodolist,
  addTodolist,
  changeTodolistEntityStatus,
} = todolistsSlice.actions;

//thunks
export const fetchTodolistsTC = (): AppThunk => async (dispatch) => {
  dispatch(setAppStatus({ status: "loading" }));
  try {
    const res = await todolistsApi.getTodolists();
    dispatch(setTodolists({ todolists: res.data }));
    dispatch(setAppStatus({ status: "succeeded" }));
    res.data.forEach((tl) => dispatch(fetchTasksTC(tl.id)));
  } catch (e) {
    handleServerNetworkError(e as AxiosError, dispatch);
  }
};

export const removeTodolistTC =
  (todolistId: string): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(changeTodolistEntityStatus({ todolistId, entityStatus: "loading" }));
      const res = await todolistsApi.deleteTodolist(todolistId);
      if (res.data.resultCode === 0) {
        dispatch(removeTodolist({ todolistId }));
        dispatch(setAppStatus({ status: "succeeded" }));
      } else {
        handleServerAppError(res.data, dispatch);
        dispatch(changeTodolistEntityStatus({ todolistId, entityStatus: "failed" }));
      }
    } catch (e) {
      handleServerNetworkError(e as AxiosError, dispatch);
      dispatch(changeTodolistEntityStatus({ todolistId, entityStatus: "failed" }));
    }
  };

export const addTodolistTC =
  (title: string): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(setAppStatus({ status: "loading" }));
      const res = await todolistsApi.createTodolist(title);
      if (res.data.resultCode === 0) {
        dispatch(addTodolist({ todolist: res.data.data.item }));
        dispatch(setAppStatus({ status: "succeeded" }));
      } else {
        handleServerAppError(res.data, dispatch);
      }
    } catch (e) {
      handleServerNetworkError(e as AxiosError, dispatch);
    }
  };

export const changeTodolistTitleTC =
  (todolistId: string, title: string): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(setAppStatus({ status: "loading" }));
      const res = await todolistsApi.updateTodolistTitle(todolistId, title);
      if (res.data.resultCode === 0) {
        dispatch(changeTodolistTitle({ todolistId, title }));
        dispatch(setAppStatus({ status: "succeeded" }));
      } else {
        handleServerAppError(res.data, dispatch);
      }
    } catch (e) {
      handleServerNetworkError(e as AxiosError, dispatch);
    }
  };

//types
export type TodolistType = {
  id: string;
  title: string;
  addedDate: string;
  order: number;
};

export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};
