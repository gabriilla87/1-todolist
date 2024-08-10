import {v1} from "uuid";
import {FilterValuesType, TodolistType} from "../App";
import {
    AddTodolistAC, ChangeTodolistFilterAC,
    ChangeTodolistTitleAC,
    RemoveTodolistAC,
    todolistReducer
} from "./todolist-reducer";

test('correct todolist should be removed', () => {
    let todolistId1 = v1();
    let todolistId2 = v1();

    const startState: Array<TodolistType> = [
        {id: todolistId1, title: "What to learn", filter: "all"},
        {id: todolistId2, title: "What to buy", filter: "all"}
    ]

    const endState = todolistReducer(startState, RemoveTodolistAC(todolistId1))

    expect(endState.length).toBe(1)
    expect(startState.length).toBe(2)
    expect(endState[0].id).toBe(todolistId2)
})

test('correct todolist should be added', () => {
    let todolistId1 = v1();
    let todolistId2 = v1();
    let newTodolistTitle = "New Todolist";

    const startState: Array<TodolistType> = [
        {id: todolistId1, title: "What to learn", filter: "all"},
        {id: todolistId2, title: "What to buy", filter: "all"}
    ]

    const endState = todolistReducer(startState, AddTodolistAC(newTodolistTitle))

    expect(endState.length).toBe(3)
    expect(startState.length).toBe(2)
    expect(endState[2].title).toBe(newTodolistTitle)
    expect(endState[2].filter).toBe("all")
})

test('correct todolist should change its name', () => {
    let todolistId1 = v1();
    let todolistId2 = v1();
    let newTodolistTitle = "New Todolist";

    const startState: Array<TodolistType> = [
        {id: todolistId1, title: "What to learn", filter: "all"},
        {id: todolistId2, title: "What to buy", filter: "all"}
    ]

    const action = ChangeTodolistTitleAC(todolistId2, newTodolistTitle)

    const endState = todolistReducer(startState, action)

    expect(endState.length).toBe(2)
    expect(endState[0].title).toBe("What to learn")
    expect(endState[1].title).toBe(newTodolistTitle)
    expect(startState[1].title).toBe("What to buy")
})

test('correct filter of todolist should be changed', () => {
    let todolistId1 = v1();
    let todolistId2 = v1();
    let newFilter: FilterValuesType = "active";

    const startState: Array<TodolistType> = [
        {id: todolistId1, title: "What to learn", filter: "all"},
        {id: todolistId2, title: "What to buy", filter: "all"}
    ]

    const action = ChangeTodolistFilterAC(todolistId2, newFilter)

    const endState = todolistReducer(startState, action)

    expect(endState.length).toBe(2)
    expect(endState[0].filter).toBe("all")
    expect(endState[1].filter).toBe(newFilter)
    expect(startState[1].filter).toBe("all")
})