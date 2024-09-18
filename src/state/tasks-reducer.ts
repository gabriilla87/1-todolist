import {TasksStateType} from "../AppWithRedux";
import {v1} from "uuid";
import {AddTodolistAT, RemoveTodolistAT} from "./todolists-reducer";
import {TaskPriorities, TaskStatuses} from "../api/todolists-api";

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
        status: TaskStatuses
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
export const changeTaskStatusAC = (todolistId: string, taskId: string, status: TaskStatuses): ChangeTaskStatusAT => ({
    type: "CHANGE-TASK-STATUS",
    payload: {
        todolistId,
        taskId,
        status,
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

const initialState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialState, action: ActionTypes): TasksStateType => {
    switch (action.type) {
        case "REMOVE-TASK": {
            const {todolistId, taskId} = action.payload
            return {...state, [todolistId]: state[todolistId].filter(s => s.id !== taskId)}
        }
        case "ADD-TASK": {
            const {todolistId, title} = action.payload
            return {
                ...state, [todolistId]: [...state[todolistId],
                    {
                        id: v1(),
                        title,
                        status: TaskStatuses.New,
                        todoListId: todolistId,
                        addedDate: "",
                        order: 0,
                        deadline: "",
                        description: "",
                        priority: TaskPriorities.Low,
                        startDate: ""
                    }]
            }
        }
        case "CHANGE-TASK-STATUS": {
            const {todolistId, taskId, status} = action.payload
            return {...state, [todolistId]: state[todolistId].map(s => s.id === taskId ? {...s, status} : s)}
        }
        case "CHANGE-TASK-TITLE": {
            const {todolistId, taskId, title} = action.payload
            return {...state, [todolistId]: state[todolistId].map(s => s.id === taskId ? {...s, title} : s)}
        }
        case "ADD-TODOLIST": {
            return {...state, [action.payload.todolistId]: []}
        }
        case "REMOVE-TODOLIST": {
            const {todolistId} = action.payload
            const copyState = {...state}
            delete copyState[todolistId]
            return copyState
        }
        default:
            return state
    }
}