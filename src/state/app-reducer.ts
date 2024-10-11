import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  status: "idle" as RequestStatusType,
  error: null as string | null
};

const slice = createSlice({
  name: "app",
  initialState: initialState,
  reducers: {
    setAppStatus(state, action: PayloadAction<{status: RequestStatusType}>) {
      state.status = action.payload.status
    },
    setAppError(state, action: PayloadAction<{error: string | null}>) {
      state.error = action.payload.error
    }
  }
});

export const appReducer = slice.reducer
export const {setAppStatus, setAppError} = slice.actions

//types
export type AppActionsType = ReturnType<typeof setAppStatus> | ReturnType<typeof setAppError>;
export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";
export type AppInitialStateType = ReturnType<typeof slice.getInitialState>
