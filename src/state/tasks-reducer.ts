import {TasksStateType} from "../App";
import {v1} from "uuid";
import {AddTodolistAT, RemoveTodolistAT} from "./todolists-reducer";

type RemoveTaskAT = {
    type: "REMOVE-TASK"
    payload: {
        taskId: string
        todolistId: string
    }
}
type AddTaskAT = {
    type: "ADD-TASK"
    payload: {
        todolistId: string
        title: string
    }
}
type ChangeTaskStatusAT = {
    type: "CHANGE-TASK-STATUS"
    payload: {
        todolistId: string
        taskId: string
        isDone: boolean
    }
}
type ChangeTaskTitleAT = {
    type: "CHANGE-TASK-TITLE"
    payload: {
        todolistId: string
        taskId: string
        title: string
    }
}

type ActionTypes = RemoveTaskAT | AddTaskAT | ChangeTaskStatusAT | ChangeTaskTitleAT | AddTodolistAT | RemoveTodolistAT

export const removeTaskAC = (taskId: string, todolistId: string): RemoveTaskAT => ({
    type: "REMOVE-TASK",
    payload: {
        taskId,
        todolistId
    }
})
export const addTaskAC = (todolistId: string, title: string): AddTaskAT => ({
    type: "ADD-TASK",
    payload: {
        todolistId,
        title
    }
})
export const changeTaskStatusAC = (todolistId: string, taskId: string, isDone: boolean): ChangeTaskStatusAT => ({
    type: "CHANGE-TASK-STATUS",
    payload: {
        todolistId,
        taskId,
        isDone,
    }
})
export const changeTaskTitleAC = (todolistId: string, taskId: string, title: string): ChangeTaskTitleAT => ({
    type: "CHANGE-TASK-TITLE",
    payload: {
        todolistId,
        taskId,
        title,
    }
})

export const tasksReducer = (state: TasksStateType, action: ActionTypes): TasksStateType => {
    switch (action.type) {
        case "REMOVE-TASK": {
            const {todolistId, taskId} = action.payload
            return {...state, [todolistId]: state[todolistId].filter(s => s.id !== taskId)}
        }
        case "ADD-TASK": {
            const {todolistId, title} = action.payload
            return {...state, [todolistId]: [...state[todolistId], {id: v1(), title, isDone: false}]}
        }
        case "CHANGE-TASK-STATUS": {
            const {todolistId, taskId, isDone} = action.payload
            return {...state, [todolistId]: state[todolistId].map(s => s.id === taskId ? {...s, isDone} : s)}
        }
        case "CHANGE-TASK-TITLE": {
            const {todolistId, taskId, title} = action.payload
            return {...state, [todolistId]: state[todolistId].map(s => s.id === taskId ? {...s, title} : s)}
        }
        case "ADD-TODOLIST": {
            debugger
            const {title, todolistId} = action.payload
            return {...state, [todolistId]: []}
        }
        case "REMOVE-TODOLIST": {
            const {todolistId} = action.payload
            const copyState = {...state}
            delete copyState[todolistId]
            return copyState
        }
        default:
            throw new Error("Wrong action type")
    }
}