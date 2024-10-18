import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Dispatch } from "redux";
import { authAPI } from "api/todolists-api";
import { setIsLoggedIn } from "state/authSlice";
import { handleServerAppError } from "utils/handle-server-app-error";

const slice = createSlice({
  name: "app",
  initialState: {
    status: "idle" as RequestStatusType,
    error: null as string | null,
    isInitialized: false,
  },
  reducers: {
    setAppStatus(state, action: PayloadAction<{ status: RequestStatusType }>) {
      state.status = action.payload.status;
    },
    setAppError(state, action: PayloadAction<{ error: string | null }>) {
      state.error = action.payload.error;
    },
    setIsInitialized(state, action: PayloadAction<{ value: boolean }>) {
      state.isInitialized = action.payload.value;
    },
  },
});

export const appReducer = slice.reducer;
export const { setAppStatus, setAppError, setIsInitialized } = slice.actions;

export const initializeAppTC = () => async (dispatch: Dispatch) => {
  const res = await authAPI.me();
  if (res.data.resultCode === 0) {
    dispatch(setIsLoggedIn({ value: true }));
  } else {
    handleServerAppError(res.data, dispatch);
  }
  dispatch(setIsInitialized({ value: true }));
};

//types
export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";
export type AppInitialStateType = ReturnType<typeof slice.getInitialState>;
