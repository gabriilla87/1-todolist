import { setAppStatus } from "state/appSlice";
import { authAPI, LoginParamsType } from "api/todolists-api";
import { handleServerNetworkError } from "utils/handle-server-network-error";
import { AxiosError } from "axios";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Dispatch } from "redux";
import { clearData } from "common/common.actions";
import { handleServerAppError } from "utils/handle-server-app-error";

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
});

export const authReducer = authSlice.reducer;
export const { setIsLoggedIn } = authSlice.actions;

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
