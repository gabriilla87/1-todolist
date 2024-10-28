import { todolistsReducer } from "features/todolists/model/todolistsSlice";
import { tasksReducer } from "features/tasks/model/tasksSlice";
import { appReducer } from "app/appSlice";
import { authReducer } from "features/auth/model/authSlice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    todolists: todolistsReducer,
    tasks: tasksReducer,
    app: appReducer,
    auth: authReducer,
  },
});

//types
export type AppThunkDispatch = typeof store.dispatch;
export type AppRootStateType = ReturnType<typeof store.getState>;

// @ts-ignore
window.store = store;
