import {FilterValuesType} from "../app/App";
import {todolistsApi} from "../api/todolists-api";
import {AppThunk} from "./store";

const initialState: Array<TodolistDomainType> = []

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: TodolistsActionTypes): Array<TodolistDomainType> => {
    switch (action.type) {
        case "SET-TODOLISTS":
            return action.todolists.map(t => ({...t, filter: "all"}))
        case "REMOVE-TODOLIST":
            return state.filter(el => el.id !== action.todolistId)
        case "ADD-TODOLIST":
            return [{...action.todolist, filter: "all"}, ...state]
        case "CHANGE-TODOLIST-TITLE":
            return state.map(el => el.id === action.todolistId ? {...el, title: action.title} : el)
        case "CHANGE-TODOLIST-FILTER":
            return state.map(el => el.id === action.todolistId ? {...el, filter: action.filter} : el)
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

//thunks
export const fetchTodolistsTC = (): AppThunk => async dispatch => {
    try {
        const res = await todolistsApi.getTodolists()
        dispatch(setTodolistsAC(res.data))
    } catch (e) {
        throw new Error(`${e}`)
    }
}
export const removeTodolistTC = (todolistId: string): AppThunk => async dispatch => {
    try {
        await todolistsApi.deleteTodolist(todolistId)
        dispatch(removeTodolistAC(todolistId))
    } catch (e) {
        throw new Error(`${e}`)
    }
}
export const addTodolistTC = (title: string): AppThunk => async dispatch => {
    try {
        const res = await todolistsApi.createTodolist(title)
        dispatch(addTodolistAC(res.data.data.item))
    } catch (e) {
        throw new Error(`${e}`)
    }
}
export const changeTodolistTitleTC = (todolistId: string, title: string): AppThunk => async dispatch => {
    try {
        await todolistsApi.updateTodolistTitle(todolistId, title)
        dispatch(changeTodolistTitleAC(todolistId, title))
    } catch (e) {
        throw new Error(`${e}`)
    }
}

//types
export type TodolistsActionTypes =
    ReturnType<typeof removeTodolistAC>
    | ReturnType<typeof addTodolistAC>
    | ReturnType<typeof changeTodolistFilterAC>
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof setTodolistsAC>

export type TodolistType = {
    id: string
    title: string
    addedDate: string
    order: number
}

export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
}