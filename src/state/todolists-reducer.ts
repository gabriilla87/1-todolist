import {FilterValuesType, TodolistType} from "../AppWithRedux";
import {v1} from "uuid";

export type RemoveTodolistAT = {
    type: 'REMOVE-TODOLIST',
    payload: {
        todolistId: string
    }
}
export type AddTodolistAT = {
    type: 'ADD-TODOLIST',
    payload: {
        title: string
        todolistId: string
    }
}
export type ChangeTodolistTitleAT = {
    type: 'CHANGE-TODOLIST-TITLE',
    payload: {
        title: string
        todolistId: string
    }
}
export type ChangeTodolistFilterAT = {
    type: 'CHANGE-TODOLIST-FILTER',
    payload: {
        todolistId: string
        filter: FilterValuesType
    }
}

type ActionTypes =
    RemoveTodolistAT
    | AddTodolistAT
    | ChangeTodolistFilterAT
    | ChangeTodolistTitleAT


const initialState: Array<TodolistType> = []

export const todolistsReducer = (state: Array<TodolistType> = initialState, action: ActionTypes): Array<TodolistType> => {
    switch (action.type) {
        case "REMOVE-TODOLIST": {
            const {todolistId} = action.payload
            return state.filter(el => el.id !== todolistId)
        }
        case "ADD-TODOLIST": {
            const {title, todolistId} = action.payload
            return [{id: todolistId, title, filter: "all"}, ...state]
        }
        case "CHANGE-TODOLIST-TITLE": {
            const {todolistId, title} = action.payload
            return state.map(el => el.id === todolistId ? {...el, title} : el)
        }
        case "CHANGE-TODOLIST-FILTER": {
            const {todolistId, filter} = action.payload
            return state.map(el => el.id === todolistId ? {...el, filter} : el)
        }
        default:
            return state
    }
}

export const removeTodolistAC = (todolistId: string): RemoveTodolistAT => {
    return {type: "REMOVE-TODOLIST", payload: {todolistId}}
}
export const addTodolistAC = (title: string): AddTodolistAT => {
    return {type: "ADD-TODOLIST", payload: {title, todolistId: v1()}}
}
export const changeTodolistTitleAC = (todolistId: string, title: string): ChangeTodolistTitleAT => {
    return {type: "CHANGE-TODOLIST-TITLE", payload: {todolistId, title}}
}
export const changeTodolistFilterAC = (todolistId: string, filter: FilterValuesType): ChangeTodolistFilterAT => {
    return {type: "CHANGE-TODOLIST-FILTER", payload: {todolistId, filter}}
}