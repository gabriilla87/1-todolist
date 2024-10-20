import { setAppStatus } from "app/appSlice";
import { handleServerNetworkError } from "common/utils/handle-server-network-error";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clearData } from "common/actions/clearData/clearData";
import { handleServerAppError } from "common/utils/handle-server-app-error";
import { createAppAsyncThunk } from "common/utils/create-app-async-thunk";
import { LoginParamsType } from "features/auth/api/authAPI.types";
import { authAPI } from "features/auth/api/authAPI";
import { ResultCode } from "common/enums/enums";

//thunks
export const login = createAppAsyncThunk<undefined, LoginParamsType>("auth/login", async (args, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  dispatch(setAppStatus({ status: "loading" }));
  try {
    const res = await authAPI.login(args);
    if (res.data.resultCode === ResultCode.success) {
      dispatch(setIsLoggedIn({ value: true }));
      dispatch(setAppStatus({ status: "succeeded" }));
    } else {
      handleServerAppError(res.data, dispatch);
      return rejectWithValue(null);
    }
  } catch (e) {
    handleServerNetworkError(e, dispatch);
    return rejectWithValue(null);
  }
});
export const logout = createAppAsyncThunk("auth/logout", async (_, thunkAPI) => {
  const { dispatch } = thunkAPI;
  try {
    dispatch(setAppStatus({ status: "loading" }));
    const res = await authAPI.logout();
    if (res.data.resultCode === ResultCode.success) {
      dispatch(setIsLoggedIn({ value: false }));
      dispatch(clearData());
      dispatch(setAppStatus({ status: "succeeded" }));
    } else {
      handleServerAppError(res.data, dispatch);
    }
  } catch (e) {
    handleServerNetworkError(e, dispatch);
  }
});

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
    builder.addCase(login.fulfilled, () => {}).addCase(logout.fulfilled, () => {});
  },
});

export const authReducer = authSlice.reducer;
export const { setIsLoggedIn } = authSlice.actions;
