import {setAppError, setAppStatus} from "./app-reducer";
import {authAPI, LoginParamsType} from "../api/todolists-api";
import {AppThunk} from "./store";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {AxiosError} from "axios";

const initialState = {
    isLoggedIn: false,
    isInitialized: false
}

export const authReducer = (state: InitialStateType = initialState, action: AuthActionsType): InitialStateType => {
    switch (action.type) {
        case 'login/SET-IS-LOGGED-IN':
            return {...state, isLoggedIn: action.value}
        case "login/SET-IS-INITIALIZED":
            return {...state, isInitialized: action.value}
        default:
            return state
    }
}
// actions
export const setIsLoggedInAC = (value: boolean) => ({
    type: 'login/SET-IS-LOGGED-IN', value
}) as const
export const setIsInitializedAC = (value: boolean) => ({
    type: 'login/SET-IS-INITIALIZED', value
}) as const

// thunks
export const loginTC = ({email, password, rememberMe = false, captcha = false}: LoginParamsType): AppThunk =>
    async dispatch => {
        dispatch(setAppStatus('loading'))
        try {
            const res = await authAPI.login(email, password, rememberMe, captcha)
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC(true))
                dispatch(setAppStatus('succeeded'))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        } catch (e) {
            handleServerNetworkError(e as AxiosError, dispatch)
        }
    }

export const initializeAppTC = (): AppThunk => async dispatch => {
    const res = await authAPI.me()
    if (res.data.resultCode === 0) {
        dispatch(setIsLoggedInAC(true))
    } else {
        handleServerAppError(res.data, dispatch)
    }
    dispatch(setIsInitializedAC(true))
}

export const logoutTC = (): AppThunk => async dispatch => {
    dispatch(setAppStatus('loading'))

    try {
        const res = await authAPI.logout()
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC(false))
            dispatch(setAppStatus('succeeded'))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (e) {
        handleServerNetworkError(e as AxiosError, dispatch)
    }
}

// types
export type AuthActionsType =
    | ReturnType<typeof setIsLoggedInAC>
    | ReturnType<typeof setAppStatus>
    | ReturnType<typeof setAppError>
    | ReturnType<typeof setIsInitializedAC>
type InitialStateType = typeof initialState