import {Dispatch} from "redux";
import {setAppError, setAppStatus} from "../state/app-reducer";
import {ResponseType} from "../api/todolists-api"
import {AxiosError} from "axios";

type ErrorUtilsDispatchType = Dispatch<ReturnType<typeof setAppError> | ReturnType<typeof setAppStatus>>

// generic function
export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: ErrorUtilsDispatchType) => {
    if (data.messages.length) {
        dispatch(setAppError(data.messages[0]))
    } else {
        dispatch(setAppError('Some error occurred'))
    }
    dispatch(setAppStatus('failed'))
}

export const handleServerNetworkError = (error: AxiosError, dispatch: ErrorUtilsDispatchType) => {
    dispatch(setAppError(error.message))
    dispatch(setAppStatus('failed'))
}