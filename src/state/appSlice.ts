import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "app",
  initialState: {
    status: "idle" as RequestStatusType,
    error: null as string | null,
  },
  reducers: {
    setAppStatus(state, action: PayloadAction<{ status: RequestStatusType }>) {
      state.status = action.payload.status;
    },
    setAppError(state, action: PayloadAction<{ error: string | null }>) {
      state.error = action.payload.error;
    },
  },
});

export const appReducer = slice.reducer;
export const { setAppStatus, setAppError } = slice.actions;

//types
export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";
export type AppInitialStateType = ReturnType<typeof slice.getInitialState>;
