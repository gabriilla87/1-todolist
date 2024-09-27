import {TasksStateType} from "../app/App";
import {addTodolistAC, removeTodolistAC, TodolistType} from "./todolists-reducer";
import {TaskFragmentType, TaskPriorities, TaskStatuses, TaskType, todolistsApi} from "../api/todolists-api";
import {AppThunk} from "./store";
import {RequestStatusType, setAppError, setAppStatus} from "./app-reducer";
import {AxiosError} from "axios";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";

const initialState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialState, action: TasksActionTypes): TasksStateType => {
    switch (action.type) {
        case "SET-TASKS":
            return {...state, [action.todolistId]: action.tasks.map(t => ({...t, entityStatus: "idle"}))}
        case "REMOVE-TASK":
            return {...state, [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId)}
        case "ADD-TASK":
            return {
                ...state,
                [action.task.todoListId]: [{...action.task, entityStatus: "idle"}, ...state[action.task.todoListId]]
            }
        case "UPDATE-TASK":
            return (
                {
                    ...state,
                    [action.todolistId]: state[action.todolistId].map(t => t.id === action.taskId
                        ? {...t, ...action.fragment}
                        : t)
                }
            )
        case "SET-TODOLISTS": {
            const copyState = {...state}
            action.todolists.forEach(t => {
                copyState[t.id] = []
            })
            return copyState
        }
        case "ADD-TODOLIST":
            return {...state, [action.todolist.id]: []}
        case "REMOVE-TODOLIST": {
            const copyState = {...state}
            delete copyState[action.todolistId]
            return copyState
        }
        case "CHANGE-TASK-ENTITY-STATUS":
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(t => t.id === action.taskId
                    ? {...t, entityStatus: action.status}
                    : t)
            }
        default:
            return state
    }
}

//actions
export const setTodolistsAC = (todolists: TodolistType[]) => ({
    type: "SET-TODOLISTS", todolists
}) as const
export const removeTaskAC = (taskId: string, todolistId: string) => ({
    type: "REMOVE-TASK",
    taskId,
    todolistId
}) as const
export const addTaskAC = (task: TaskType) => ({
    type: "ADD-TASK",
    task
}) as const
export const updateTaskAC = (todolistId: string, taskId: string, fragment: TaskFragmentType) => ({
    type: "UPDATE-TASK",
    todolistId,
    taskId,
    fragment
}) as const
export const setTasksAC = (todolistId: string, tasks: TaskType[]) => ({
    type: "SET-TASKS",
    todolistId,
    tasks
}) as const
export const changeTaskEntityStatusAC = (todolistId: string, taskId: string, status: RequestStatusType) => ({
    type: "CHANGE-TASK-ENTITY-STATUS", todolistId, taskId, status
}) as const

//thunks
export const fetchTasksTC = (todolistId: string): AppThunk =>
    async dispatch => {
        dispatch(setAppStatus("loading"))
        try {
            const res = await todolistsApi.getTasks(todolistId)
            if (!res.data.error) {
                dispatch(setTasksAC(todolistId, res.data.items))
                dispatch(setAppStatus("succeeded"))
            } else {
                dispatch(setAppError(res.data.error))
                dispatch(setAppStatus("failed"))
            }
        } catch (e) {
            handleServerNetworkError(e as AxiosError, dispatch)
        }
    }

export const removeTaskTC = (todolistId: string, taskId: string): AppThunk =>
    async dispatch => {
        try {
            dispatch(changeTaskEntityStatusAC(todolistId, taskId, "loading"))
            dispatch(setAppStatus("loading"))
            const res = await todolistsApi.deleteTask(todolistId, taskId)
            if (res.data.resultCode === 0) {
                dispatch(removeTaskAC(taskId, todolistId))
                dispatch(changeTaskEntityStatusAC(todolistId, taskId, "succeeded"))
                dispatch(setAppStatus("succeeded"))
            } else {
                handleServerAppError(res.data, dispatch)
                dispatch(changeTaskEntityStatusAC(todolistId, taskId, "failed"))
            }
        } catch (e) {
            handleServerNetworkError(e as AxiosError, dispatch)
            dispatch(changeTaskEntityStatusAC(todolistId, taskId, "failed"))
        }
    }

export const addTaskTC = (todolistId: string, title: string): AppThunk =>
    async dispatch => {
        try {
            dispatch(setAppStatus("loading"))
            const res = await todolistsApi.createTask(todolistId, title)
            if (res.data.resultCode === 0) {
                dispatch(addTaskAC(res.data.data.item))
                dispatch(setAppStatus("succeeded"))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        } catch (e) {
            handleServerNetworkError(e as AxiosError, dispatch)
        }
    }

export const updateTaskTC = (todolistId: string, taskId: string, fragment: UpdateTaskFragmentType): AppThunk =>
    async (dispatch, getState) => {
        try {
            dispatch(changeTaskEntityStatusAC(todolistId, taskId, "loading"))
            dispatch(setAppStatus("loading"))
            const currentTask = getState().tasks[todolistId].find(t => t.id === taskId)
            if (currentTask) {
                const {title, deadline, description, priority, startDate, status} = currentTask
                const res = await todolistsApi.updateTask(todolistId, taskId, {
                    title,
                    description,
                    status,
                    priority,
                    startDate,
                    deadline,
                    ...fragment
                })
                if (res.data.resultCode === 0) {
                    dispatch(updateTaskAC(todolistId, taskId, fragment))
                    dispatch(changeTaskEntityStatusAC(todolistId, taskId, "succeeded"))
                    dispatch(setAppStatus("succeeded"))
                } else {
                    handleServerAppError(res.data, dispatch)
                    dispatch(changeTaskEntityStatusAC(todolistId, taskId, "failed"))
                }
            }
        } catch (e) {
            handleServerNetworkError(e as AxiosError, dispatch)
            dispatch(changeTaskEntityStatusAC(todolistId, taskId, "failed"))
        }


    }

//types
export type TasksActionTypes =
    ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof updateTaskAC>
    | ReturnType<typeof setTodolistsAC>
    | ReturnType<typeof setTasksAC>
    | ReturnType<typeof addTodolistAC>
    | ReturnType<typeof removeTodolistAC>
    | ReturnType<typeof changeTaskEntityStatusAC>

type UpdateTaskFragmentType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}

export type DomainTaskType = TaskType & {
    entityStatus: RequestStatusType
}