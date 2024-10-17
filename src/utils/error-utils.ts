import { Dispatch } from "redux";
import { setAppError, setAppStatus } from "state/appSlice";
import { ResponseType } from "api/todolists-api";
import { AxiosError } from "axios";

type ErrorUtilsDispatchType = Dispatch<ReturnType<typeof setAppError> | ReturnType<typeof setAppStatus>>;

// generic function
export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: ErrorUtilsDispatchType) => {
  if (data.messages.length) {
    dispatch(setAppError({ error: data.messages[0] }));
  } else {
    dispatch(setAppError({ error: "Some error occurred" }));
  }
  dispatch(setAppStatus({ status: "failed" }));
};

export const handleServerNetworkError = (error: AxiosError, dispatch: ErrorUtilsDispatchType) => {
  dispatch(setAppError({ error: error.message }));
  dispatch(setAppStatus({ status: "failed" }));
};
