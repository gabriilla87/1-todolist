import { createSlice, PayloadAction } from "@reduxjs/toolkit";

//thunks
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
    setIsInitialized(state, action: PayloadAction<{ isInitialize: boolean }>) {
      state.isInitialized = action.payload.isInitialize;
    },
  },
});

export const appReducer = slice.reducer;
export const { setAppStatus, setAppError, setIsInitialized } = slice.actions;

//types
export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";
export type AppInitialStateType = ReturnType<typeof slice.getInitialState>;
