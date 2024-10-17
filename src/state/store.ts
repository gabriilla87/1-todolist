import { todolistsReducer } from "state/todolistsSlice";
import { tasksReducer } from "state/tasksSlice";
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { appReducer } from "state/appSlice";
import { authReducer } from "state/authSlice";
import { configureStore } from "@reduxjs/toolkit";

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
export type AppThunkDispatch = ThunkDispatch<AppRootStateType, any, any>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, any>;
export type AppRootStateType = ReturnType<typeof store.getState>;

// @ts-ignore
window.store = store;
