import { FilterValuesType } from "app/App";
import { todolistsApi } from "api/todolists-api";
import { AppThunk } from "./store";
import { RequestStatusType, setAppStatus } from "./app-reducer";
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils";
import { AxiosError } from "axios";
import { fetchTasksTC } from "./tasks-reducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: Array<TodolistDomainType> = [];

const slice = createSlice({
  name: "todolist",
  initialState: initialState,
  reducers: {
    setTodolistsAC(state, action: PayloadAction<{ todolists: TodolistType[] }>) {
      return action.payload.todolists.map((t) => ({ ...t, filter: "all", entityStatus: "idle" }));
    },
    removeTodolistAC(state, action: PayloadAction<{ todolistId: string }>) {
      return state.filter((el) => el.id !== action.payload.todolistId);
    },
    addTodolistAC(state, action: PayloadAction<{ todolist: TodolistType }>) {
      state.unshift({ ...action.payload.todolist, filter: "all", entityStatus: "idle" });
    },
    changeTodolistTitleAC(state, action: PayloadAction<{ todolistId: string, title: string }>) {
      const todolist = state.find(tl => tl.id === action.payload.todolistId);
      if (todolist) {
        todolist.title = action.payload.title;
      }
    },
    changeTodolistFilterAC(state, action: PayloadAction<{ todolistId: string, filter: FilterValuesType }>) {
      const todolist = state.find(tl => tl.id === action.payload.todolistId);
      if (todolist) {
        todolist.filter = action.payload.filter;
      }
    },
    changeTodolistEntityStatusAC(state, action: PayloadAction<{ todolistId: string, entityStatus: RequestStatusType }>){
      const todolist = state.find(tl => tl.id === action.payload.todolistId);
      if (todolist) {
        todolist.entityStatus = action.payload.entityStatus;
      }
    },
    clearTodolistsDataAC() {
      return []
    }
  }
});

export const todolistsReducer = slice.reducer
export const todolistsActions = slice.actions
export const {
  changeTodolistFilterAC,
  setTodolistsAC,
  changeTodolistTitleAC,
  removeTodolistAC,
  addTodolistAC,
  changeTodolistEntityStatusAC,
  clearTodolistsDataAC
} = slice.actions

//thunks
export const fetchTodolistsTC = (): AppThunk => async (dispatch) => {
  dispatch(setAppStatus({ status: "loading" }));
  try {
    const res = await todolistsApi.getTodolists();
    dispatch(setTodolistsAC({ todolists: res.data }));
    dispatch(setAppStatus({ status: "succeeded" }));
    res.data.forEach((tl) => dispatch(fetchTasksTC(tl.id)));
  } catch (e) {
    handleServerNetworkError(e as AxiosError, dispatch);
  }
};
export const removeTodolistTC = (todolistId: string): AppThunk => async (dispatch) => {
      try {
        dispatch(changeTodolistEntityStatusAC({ todolistId, entityStatus: "loading" }));
        const res = await todolistsApi.deleteTodolist(todolistId);
        if (res.data.resultCode === 0) {
          dispatch(removeTodolistAC({ todolistId }));
          dispatch(setAppStatus({ status: "succeeded" }));
        } else {
          handleServerAppError(res.data, dispatch);
          dispatch(changeTodolistEntityStatusAC({ todolistId, entityStatus: "failed" }));
        }
      } catch (e) {
        handleServerNetworkError(e as AxiosError, dispatch);
        dispatch(changeTodolistEntityStatusAC({ todolistId, entityStatus: "failed" }));
      }
    };
export const addTodolistTC = (title: string): AppThunk => async (dispatch) => {
      try {
        dispatch(setAppStatus({ status: "loading" }));
        const res = await todolistsApi.createTodolist(title);
        if (res.data.resultCode === 0) {
          dispatch(addTodolistAC({ todolist: res.data.data.item }));
          dispatch(setAppStatus({ status: "succeeded" }));
        } else {
          handleServerAppError(res.data, dispatch);
        }
      } catch (e) {
        handleServerNetworkError(e as AxiosError, dispatch);
      }
    };
export const changeTodolistTitleTC = (todolistId: string, title: string): AppThunk => async (dispatch) => {
      try {
        dispatch(setAppStatus({ status: "loading" }));
        const res = await todolistsApi.updateTodolistTitle(todolistId, title);
        if (res.data.resultCode === 0) {
          dispatch(changeTodolistTitleAC({ todolistId, title }));
          dispatch(setAppStatus({ status: "succeeded" }));
        } else {
          handleServerAppError(res.data, dispatch);
        }
      } catch (e) {
        handleServerNetworkError(e as AxiosError, dispatch);
      }
    };

//types
export type TodolistsActionTypes =
  | ReturnType<typeof removeTodolistAC>
  | ReturnType<typeof addTodolistAC>
  | ReturnType<typeof changeTodolistFilterAC>
  | ReturnType<typeof changeTodolistTitleAC>
  | ReturnType<typeof setTodolistsAC>
  | ReturnType<typeof changeTodolistEntityStatusAC>
  | ReturnType<typeof clearTodolistsDataAC>;

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

type TodolistInitialStateType = ReturnType<typeof slice.getInitialState>