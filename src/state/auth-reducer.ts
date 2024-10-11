import { setAppStatus } from "./app-reducer";
import { authAPI, LoginParamsType } from "api/todolists-api";
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils";
import { AxiosError } from "axios";
import { clearTodolistsDataAC } from "./todolists-reducer";
import { clearTasksDataAC } from "./tasks-reducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Dispatch } from "redux";

const initialState = {
  isLoggedIn: false,
  isInitialized: false,
};

const slice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setIsLoggedInAC(state, action: PayloadAction<{ value: boolean }>) {
      state.isLoggedIn = action.payload.value;
    },
    setIsInitializedAC(state, action: PayloadAction<{ value: boolean }>) {
      state.isInitialized = action.payload.value;
    },
  },
});

export const authReducer = slice.reducer;
export const { setIsLoggedInAC, setIsInitializedAC } = slice.actions;

// thunks
export const loginTC = ({ email, password, rememberMe, captcha = false }: LoginParamsType) =>
  async (dispatch: Dispatch) => {
    dispatch(setAppStatus({ status: "loading" }));
    try {
      const res = await authAPI.login(email, password, rememberMe, captcha);
      if (res.data.resultCode === 0) {
        dispatch(setIsLoggedInAC({ value: true }));
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
    dispatch(setIsLoggedInAC({ value: true }));
  } else {
    handleServerAppError(res.data, dispatch);
  }
  dispatch(setIsInitializedAC({ value: true }));
};

export const logoutTC = () => async (dispatch: Dispatch) => {
  dispatch(setAppStatus({ status: "loading" }));

  try {
    const res = await authAPI.logout();
    if (res.data.resultCode === 0) {
      dispatch(setIsLoggedInAC({ value: false }));
      dispatch(clearTodolistsDataAC());
      dispatch(clearTasksDataAC());
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
