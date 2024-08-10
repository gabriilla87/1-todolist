import {TasksStateType} from "../App";
import {v1} from "uuid";

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

type ActionTypes = RemoveTaskAT | AddTaskAT | ChangeTaskStatusAT

export const RemoveTaskAC = (taskId: string, todolistId: string): RemoveTaskAT => ({
    type: "REMOVE-TASK",
    payload: {
        taskId,
        todolistId
    }
})
export const AddTaskAC = (todolistId: string, title: string): AddTaskAT => ({
    type: "ADD-TASK",
    payload: {
        todolistId,
        title
    }
})
export const ChangeTaskStatusAC = (todolistId: string, taskId: string, isDone: boolean): ChangeTaskStatusAT => ({
    type: "CHANGE-TASK-STATUS",
    payload: {
        todolistId,
        taskId,
        isDone,
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
        case "CHANGE-TASK-STATUS":
            const {todolistId, taskId, isDone} = action.payload
            return {...state, [todolistId]: state[todolistId].map(s => s.id === taskId ? {...s, isDone} : s)}
        default:
            throw new Error("Wrong action type")
    }
}