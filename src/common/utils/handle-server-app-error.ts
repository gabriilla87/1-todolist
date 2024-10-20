import { setAppError, setAppStatus } from "app/appSlice";
import { Dispatch } from "redux";
import { CommonResponse } from "common/types/types";

type ErrorUtilsDispatchType = Dispatch<ReturnType<typeof setAppError> | ReturnType<typeof setAppStatus>>;

export const handleServerAppError = <T>(data: CommonResponse<T>, dispatch: ErrorUtilsDispatchType) => {
  if (data.messages.length) {
    dispatch(setAppError({ error: data.messages[0] }));
  } else {
    dispatch(setAppError({ error: "Some error occurred" }));
  }
  dispatch(setAppStatus({ status: "failed" }));
};
