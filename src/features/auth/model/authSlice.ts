import { setAppStatus, setIsInitialized } from "app/appSlice";
import { handleServerNetworkError } from "common/utils/handle-server-network-error";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clearData } from "common/actions/clearData/clearData";
import { handleServerAppError } from "common/utils/handle-server-app-error";
import { createAppAsyncThunk } from "common/utils/create-app-async-thunk";
import { LoginParamsType } from "features/auth/api/authAPI.types";
import { authAPI } from "features/auth/api/authAPI";
import { ResultCode } from "common/enums/enums";

//slice
const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
  },
  reducers: {
    setIsLoggedIn(state, action: PayloadAction<{ value: boolean }>) {
      state.isLoggedIn = action.payload.value;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
      })
      .addCase(initializeApp.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
      });
  },
});

//thunks
export const login = createAppAsyncThunk<{ isLoggedIn: boolean }, LoginParamsType>(
  `${authSlice.name}/login`,
  async (args, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    dispatch(setAppStatus({ status: "loading" }));
    try {
      const res = await authAPI.login(args);
      if (res.data.resultCode === ResultCode.Success) {
        dispatch(setIsLoggedIn({ value: true }));
        dispatch(setAppStatus({ status: "succeeded" }));
        return { isLoggedIn: true };
      } else {
        const isShowGlobalError = !res.data.fieldsErrors.length;
        handleServerAppError(res.data, dispatch, isShowGlobalError);
        return rejectWithValue(res.data);
      }
    } catch (e) {
      handleServerNetworkError(e, dispatch);
      return rejectWithValue(null);
    }
  },
);
export const logout = createAppAsyncThunk<{ isLoggedIn: boolean }, undefined>("auth/logout", async (_, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    dispatch(setAppStatus({ status: "loading" }));
    const res = await authAPI.logout();
    if (res.data.resultCode === ResultCode.Success) {
      dispatch(clearData());
      dispatch(setAppStatus({ status: "succeeded" }));
      return { isLoggedIn: false };
    } else {
      handleServerAppError(res.data, dispatch);
      return rejectWithValue(null);
    }
  } catch (e) {
    handleServerNetworkError(e, dispatch);
    return rejectWithValue(null);
  }
});
export const initializeApp = createAppAsyncThunk<{ isLoggedIn: true }, undefined>(
  "app/initializeApp",
  async (_, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      const res = await authAPI.me();
      if (res.data.resultCode === ResultCode.Success) {
        return { isLoggedIn: true };
      } else {
        handleServerAppError(res.data, dispatch, false);
        return rejectWithValue(null);
      }
    } catch (e) {
      handleServerNetworkError(e, dispatch);
      return rejectWithValue(null);
    } finally {
      dispatch(setIsInitialized({ isInitialize: true }));
    }
  },
);

export const authReducer = authSlice.reducer;
export const { setIsLoggedIn } = authSlice.actions;
