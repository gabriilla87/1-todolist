import {FilterValuesType} from "../app/App";
import {todolistsApi} from "../api/todolists-api";
import {AppThunk} from "./store";
import {RequestStatusType, setAppStatus} from "./app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {AxiosError} from "axios";
import {fetchTasksTC} from "./tasks-reducer";

const initialState: Array<TodolistDomainType> = []

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: TodolistsActionTypes): Array<TodolistDomainType> => {
    switch (action.type) {
        case "SET-TODOLISTS":
            return action.todolists.map(t => ({...t, filter: "all", entityStatus: "idle"}))
        case "REMOVE-TODOLIST":
            return state.filter(el => el.id !== action.todolistId)
        case "ADD-TODOLIST":
            return [{...action.todolist, filter: "all", entityStatus: "idle"}, ...state]
        case "CHANGE-TODOLIST-TITLE":
            return state.map(el => el.id === action.todolistId ? {...el, title: action.title} : el)
        case "CHANGE-TODOLIST-FILTER":
            return state.map(el => el.id === action.todolistId ? {...el, filter: action.filter} : el)
        case "CHANGE-TODOLIST-ENTITY-STATUS":
            return state.map(el => el.id === action.todolistId ? {...el, entityStatus: action.status} : el)
        case "TODOLISTS/CLEAR-DATA":
            return []
        default:
            return state
    }
}

//actions
export const setTodolistsAC = (todolists: TodolistType[]) => ({
    type: "SET-TODOLISTS",
    todolists
}) as const
export const removeTodolistAC = (todolistId: string) => ({
    type: "REMOVE-TODOLIST",
    todolistId
}) as const
export const addTodolistAC = (todolist: TodolistType) => ({
    type: "ADD-TODOLIST",
    todolist
}) as const
export const changeTodolistTitleAC = (todolistId: string, title: string) => ({
    type: "CHANGE-TODOLIST-TITLE",
    todolistId,
    title
}) as const
export const changeTodolistFilterAC = (todolistId: string, filter: FilterValuesType) => ({
    type: "CHANGE-TODOLIST-FILTER",
    todolistId,
    filter
}) as const
export const changeTodolistEntityStatusAC = (todolistId: string, status: RequestStatusType) => ({
    type: 'CHANGE-TODOLIST-ENTITY-STATUS', todolistId, status
}) as const
export const clearTodolistsDataAC = () => ({
    type: "TODOLISTS/CLEAR-DATA"
}) as const

//thunks
export const fetchTodolistsTC = (): AppThunk => async dispatch => {
    dispatch(setAppStatus("loading"))
    try {
        const res = await todolistsApi.getTodolists()
        dispatch(setTodolistsAC(res.data))
        dispatch(setAppStatus("succeeded"))
        res.data.forEach(tl => dispatch(fetchTasksTC(tl.id)))
    } catch (e) {
        handleServerNetworkError(e as AxiosError, dispatch)
    }
}
export const removeTodolistTC = (todolistId: string): AppThunk => async dispatch => {
    try {
        dispatch(changeTodolistEntityStatusAC(todolistId, "loading"))
        const res = await todolistsApi.deleteTodolist(todolistId)
        if (res.data.resultCode === 0) {
            dispatch(removeTodolistAC(todolistId))
            dispatch(setAppStatus("succeeded"))
        } else {
            handleServerAppError(res.data, dispatch)
            dispatch(changeTodolistEntityStatusAC(todolistId, "failed"))
        }
    } catch (e) {
        handleServerNetworkError(e as AxiosError, dispatch)
        dispatch(changeTodolistEntityStatusAC(todolistId, "failed"))
    }
}
export const addTodolistTC = (title: string): AppThunk => async dispatch => {
    try {
        dispatch(setAppStatus("loading"))
        const res = await todolistsApi.createTodolist(title)
        if (res.data.resultCode === 0) {
            dispatch(addTodolistAC(res.data.data.item))
            dispatch(setAppStatus("succeeded"))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (e) {
        handleServerNetworkError(e as AxiosError, dispatch)
    }
}
export const changeTodolistTitleTC = (todolistId: string, title: string): AppThunk => async dispatch => {
    try {
        dispatch(setAppStatus("loading"))
        const res = await todolistsApi.updateTodolistTitle(todolistId, title)
        if (res.data.resultCode === 0) {
            dispatch(changeTodolistTitleAC(todolistId, title))
            dispatch(setAppStatus("succeeded"))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (e) {
        handleServerNetworkError(e as AxiosError, dispatch)
    }
}

//types
export type TodolistsActionTypes =
    ReturnType<typeof removeTodolistAC>
    | ReturnType<typeof addTodolistAC>
    | ReturnType<typeof changeTodolistFilterAC>
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof setTodolistsAC>
    | ReturnType<typeof changeTodolistEntityStatusAC>
    | ReturnType<typeof clearTodolistsDataAC>

export type TodolistType = {
    id: string
    title: string
    addedDate: string
    order: number
}

export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}