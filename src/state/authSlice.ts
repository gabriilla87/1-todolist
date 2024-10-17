import { setAppStatus } from "state/appSlice";
import { authAPI, LoginParamsType } from "api/todolists-api";
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils";
import { AxiosError } from "axios";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Dispatch } from "redux";
import { clearData } from "common/common.actions";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
    isInitialized: false,
  },
  reducers: {
    setIsLoggedIn(state, action: PayloadAction<{ value: boolean }>) {
      state.isLoggedIn = action.payload.value;
    },
    setIsInitialized(state, action: PayloadAction<{ value: boolean }>) {
      state.isInitialized = action.payload.value;
    },
  },
});

export const authReducer = authSlice.reducer;
export const { setIsLoggedIn, setIsInitialized } = authSlice.actions;

// thunks
export const loginTC =
  ({ email, password, rememberMe, captcha = false }: LoginParamsType) =>
  async (dispatch: Dispatch) => {
    dispatch(setAppStatus({ status: "loading" }));
    try {
      const res = await authAPI.login(email, password, rememberMe, captcha);
      if (res.data.resultCode === 0) {
        dispatch(setIsLoggedIn({ value: true }));
        dispatch(setAppStatus({ status: "succeeded" }));
      } else {
        handleServerAppError(res.data, dispatch);
      }
    } catch (e) {
      handleServerNetworkError(e as AxiosError, dispatch);
    }
  };

export const initializeAppTC = () => async (dispatch: Dispatch) => {
  const res = await authAPI.me();
  if (res.data.resultCode === 0) {
    dispatch(setIsLoggedIn({ value: true }));
  } else {
    handleServerAppError(res.data, dispatch);
  }
  dispatch(setIsInitialized({ value: true }));
};

export const logoutTC = () => async (dispatch: Dispatch) => {
  dispatch(setAppStatus({ status: "loading" }));

  try {
    const res = await authAPI.logout();
    if (res.data.resultCode === 0) {
      dispatch(setIsLoggedIn({ value: false }));
      dispatch(clearData());
      dispatch(setAppStatus({ status: "succeeded" }));
    } else {
      handleServerAppError(res.data, dispatch);
    }
  } catch (e) {
    handleServerNetworkError(e as AxiosError, dispatch);
  }
};

// types
// export type AuthActionsType =
//     | ReturnType<typeof setIsLoggedInAC>
//     | ReturnType<typeof setAppStatus>
//     | ReturnType<typeof setAppError>
//     | ReturnType<typeof setIsInitializedAC>
