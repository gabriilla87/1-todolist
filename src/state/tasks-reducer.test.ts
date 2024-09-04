import {v1} from "uuid";
import {TasksStateType} from "../AppWithRedux";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, tasksReducer} from "./tasks-reducer";
import {addTodolistAC, removeTodolistAC} from "./todolists-reducer";

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

    const endState = tasksReducer(startState, removeTaskAC(taskId1, todolistId1))

    expect(endState[todolistId1].length).toBe(1)
    expect(endState[todolistId2].length).toBe(2)
    expect(startState[todolistId1].length).toBe(2)
    expect(endState[todolistId1][0].title).toBe("JS")
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

    const endState = tasksReducer(startState, addTaskAC(todolistId1, newTaskTitle))

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

    const endState = tasksReducer(startState, changeTaskStatusAC(todolistId1, taskId1, taskIsDone))

    expect(endState[todolistId1].length).toBe(2)
    expect(startState[todolistId1].length).toBe(2)
    expect(endState[todolistId1][0].isDone).toBe(true)
})

test("task title should be changed in the correct task in the correct todolist", () => {
    const todolistId1 = v1()
    const todolistId2 = v1()
    const taskId1 = v1()
    const taskId2 = v1()
    const newTaskTitle = "Todolist title"

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

    const endState = tasksReducer(startState, changeTaskTitleAC(todolistId1, taskId1, newTaskTitle))

    expect(endState[todolistId1].length).toBe(2)
    expect(startState[todolistId1].length).toBe(2)
    expect(endState[todolistId1][0].title).toBe(newTaskTitle)
})

test('new array should be added when new todolist is added', () => {
    const todolistId1 = v1()
    const todolistId2 = v1()
    const taskId1 = v1()
    const taskId2 = v1()

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

    const action = addTodolistAC('new todolist')

    const endState = tasksReducer(startState, action)


    const keys = Object.keys(endState)
    const newKey = keys.find(k => k != todolistId1 && k != todolistId2)
    if (!newKey) {
        throw Error('new key should be added')
    }

    expect(keys.length).toBe(3)
    expect(endState[newKey]).toEqual([])
})

test('property with todolistId should be deleted', () => {
    const todolistId1 = v1()
    const todolistId2 = v1()
    const taskId1 = v1()
    const taskId2 = v1()

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

    const action = removeTodolistAC(todolistId2)

    const endState = tasksReducer(startState, action)


    const keys = Object.keys(endState)

    expect(keys.length).toBe(1)
    expect(endState[todolistId2]).not.toBeDefined()
})