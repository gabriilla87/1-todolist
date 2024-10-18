import { ResponseType } from "api/todolists-api";
import { setAppError, setAppStatus } from "state/appSlice";
import { Dispatch } from "redux";

type ErrorUtilsDispatchType = Dispatch<ReturnType<typeof setAppError> | ReturnType<typeof setAppStatus>>;

export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: ErrorUtilsDispatchType) => {
  if (data.messages.length) {
    dispatch(setAppError({ error: data.messages[0] }));
  } else {
    dispatch(setAppError({ error: "Some error occurred" }));
  }
  dispatch(setAppStatus({ status: "failed" }));
};
