import { todolistsReducer } from "features/todolists/model/todolistsSlice";
import { tasksReducer } from "features/tasks/model/tasksSlice";
import { ThunkDispatch } from "redux-thunk";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { appReducer } from "app/appSlice";
import { authReducer } from "features/auth/model/authSlice";
import { configureStore, UnknownAction } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    todolists: todolistsReducer,
    tasks: tasksReducer,
    app: appReducer,
    auth: authReducer,
  },
});

//custom hooks
export const useAppDispatch = () => useDispatch<AppThunkDispatch>();
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector;

//types
export type AppThunkDispatch = ThunkDispatch<AppRootStateType, any, UnknownAction>;
export type AppRootStateType = ReturnType<typeof store.getState>;

// @ts-ignore
window.store = store;
