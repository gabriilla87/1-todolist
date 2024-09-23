import {TasksStateType} from "../app/App";
import {addTodolistAC, removeTodolistAC, TodolistType} from "./todolists-reducer";
import {TaskFragmentType, TaskPriorities, TaskStatuses, TaskType, todolistsApi} from "../api/todolists-api";
import {AppThunk} from "./store";

const initialState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialState, action: TasksActionTypes): TasksStateType => {
    switch (action.type) {
        case "SET-TASKS":
            return {...state, [action.todolistId]: [...action.tasks]}
        case "REMOVE-TASK":
            return {...state, [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId)}
        case "ADD-TASK":
            return {...state, [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]}
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

//thunks
export const fetchTasksTC = (todolistId: string): AppThunk =>
    async dispatch => {
        try {
            const res = await todolistsApi.getTasks(todolistId)
            dispatch(setTasksAC(todolistId, res.data.items))
        } catch (e) {
            throw new Error(`${e}`)
        }
    }

export const removeTaskTC = (todolistId: string, taskId: string): AppThunk =>
    async dispatch => {
        try {
            await todolistsApi.deleteTask(todolistId, taskId)
            dispatch(removeTaskAC(taskId, todolistId))
        } catch (e) {
            throw new Error(`${e}`)
        }
    }

export const addTaskTC = (todolistId: string, title: string): AppThunk =>
    async dispatch => {
        try {
            const res = await todolistsApi.createTask(todolistId, title)
            dispatch(addTaskAC(res.data.data.item))
        } catch (e) {
            throw new Error(`${e}`)
        }
    }

export const updateTaskTC = (todolistId: string, taskId: string, fragment: UpdateTaskFragmentType): AppThunk =>
    async (dispatch, getState) => {
        try {
            const currentTask = getState().tasks[todolistId].find(t => t.id === taskId)
            if (currentTask) {
                const {title, deadline, description, priority, startDate, status} = currentTask
                await todolistsApi.updateTask(todolistId, taskId, {
                    title,
                    description,
                    status,
                    priority,
                    startDate,
                    deadline,
                    ...fragment
                })
                dispatch(updateTaskAC(todolistId, taskId, fragment))
            }
        } catch (e) {
            throw new Error(`${e}`)
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
type UpdateTaskFragmentType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}