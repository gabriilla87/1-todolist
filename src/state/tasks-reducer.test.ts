import {v1} from "uuid";
import {TasksStateType} from "../App";
import {AddTaskAC, ChangeTaskStatusAC, RemoveTaskAC, tasksReducer} from "./tasks-reducer";

test("correct task should be removed from correct todolist", () => {
    const todolistId1 = v1()
    const todolistId2 = v1()
    const taskId1 = v1()
    const taskId2 = v1()

    const startState: TasksStateType = {
        [todolistId1]: [
            {id: taskId1, title: "HTML&CSS", isDone: true},
            {id: taskId2, title: "JS", isDone: true},
        ],
        [todolistId2]: [
            {id: taskId1, title: "Book", isDone: true},
            {id: taskId2, title: "Milk", isDone: true},
        ]
    }

    const endState = tasksReducer(startState, RemoveTaskAC(taskId2, todolistId1))

    expect(endState[todolistId1].length).toBe(1)
    expect(startState[todolistId1].length).toBe(2)
    expect(endState[todolistId1][0].title).toBe("HTML&CSS")
})

test("task should be added to the correct todolist", () => {
    const todolistId1 = v1()
    const todolistId2 = v1()
    const taskId1 = v1()
    const taskId2 = v1()
    const newTaskTitle = "New task"

    const startState: TasksStateType = {
        [todolistId1]: [
            {id: taskId1, title: "HTML&CSS", isDone: true},
            {id: taskId2, title: "JS", isDone: true},
        ],
        [todolistId2]: [
            {id: taskId1, title: "Book", isDone: true},
            {id: taskId2, title: "Milk", isDone: true},
        ]
    }

    const endState = tasksReducer(startState, AddTaskAC(todolistId1, newTaskTitle))

    expect(endState[todolistId1].length).toBe(3)
    expect(startState[todolistId1].length).toBe(2)
    expect(endState[todolistId1][2].title).toBe(newTaskTitle)
})

test("task status should be changed in the correct task in the correct todolist", () => {
    const todolistId1 = v1()
    const todolistId2 = v1()
    const taskId1 = v1()
    const taskId2 = v1()
    const taskIsDone = true

    const startState: TasksStateType = {
        [todolistId1]: [
            {id: taskId1, title: "HTML&CSS", isDone: false},
            {id: taskId2, title: "JS", isDone: true},
        ],
        [todolistId2]: [
            {id: taskId1, title: "Book", isDone: true},
            {id: taskId2, title: "Milk", isDone: true},
        ]
    }

    const endState = tasksReducer(startState, ChangeTaskStatusAC(todolistId1, taskId1, taskIsDone))

    expect(endState[todolistId1].length).toBe(2)
    expect(startState[todolistId1].length).toBe(2)
    expect(endState[todolistId1][0].isDone).toBe(true)
})