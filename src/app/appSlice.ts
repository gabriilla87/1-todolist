import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { setIsLoggedIn } from "features/auth/model/authSlice";
import { handleServerAppError } from "common/utils/handle-server-app-error";
import { createAppAsyncThunk } from "common/utils/create-app-async-thunk";
import { handleServerNetworkError } from "common/utils/handle-server-network-error";
import { authAPI } from "features/auth/api/authAPI";
import { ResultCode } from "common/enums/enums";

//thunks
export const initializeApp = createAppAsyncThunk<{ value: true }>("app/initializeApp", async (_, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    const res = await authAPI.me();
    if (res.data.resultCode === ResultCode.success) {
      dispatch(setIsLoggedIn({ value: true }));
      return { value: true };
    } else {
      handleServerAppError(res.data, dispatch);
      return rejectWithValue(null);
    }
  } catch (e) {
    handleServerNetworkError(e, dispatch);
    return rejectWithValue(null);
  }
});

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
  },
  extraReducers: (builder) => {
    builder.addCase(initializeApp.fulfilled, (state, action) => {
      state.isInitialized = action.payload.value;
    });
  },
});

export const appReducer = slice.reducer;
export const { setAppStatus, setAppError } = slice.actions;

//types
export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";
export type AppInitialStateType = ReturnType<typeof slice.getInitialState>;
