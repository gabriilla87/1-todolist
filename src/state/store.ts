import { combineReducers } from "redux";
import { TodolistsActionTypes, todolistsReducer } from "./todolists-reducer";
import { TasksActionTypes, tasksReducer } from "./tasks-reducer";
import { thunk, ThunkAction, ThunkDispatch } from "redux-thunk";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AppActionsType, appReducer } from "./app-reducer";
import { authReducer } from "./auth-reducer";
import { configureStore } from "@reduxjs/toolkit";

const rootReducer = combineReducers({
  todolists: todolistsReducer,
  tasks: tasksReducer,
  app: appReducer,
  auth: authReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunk),
});

//custom hooks
export const useAppDispatch = () => useDispatch<AppThunkDispatch>();
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector;

//types
export type AppRootActionTypes = TodolistsActionTypes | TasksActionTypes | AppActionsType;
export type AppThunkDispatch = ThunkDispatch<AppRootStateType, any, AppRootActionTypes>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, AppRootActionTypes>;
export type AppRootStateType = ReturnType<typeof rootReducer>;

// @ts-ignore
window.store = store;
