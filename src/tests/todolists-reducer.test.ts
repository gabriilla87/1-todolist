import {
    addTodolistAC, changeTodolistEntityStatusAC,
    changeTodolistFilterAC,
    changeTodolistTitleAC,
    removeTodolistAC, setTodolistsAC, TodolistDomainType,
    todolistsReducer
} from '../state/todolists-reducer';
import {v1} from 'uuid';
import {FilterValuesType} from '../app/App';

let todolistId1: string;
let todolistId2: string;
let startState: Array<TodolistDomainType> = [];

beforeEach(() => {
    todolistId1 = v1();
    todolistId2 = v1();
    startState = [
        {id: todolistId1, title: "What to learn", filter: "all", addedDate: "", order: 0, entityStatus: "idle"},
        {id: todolistId2, title: "What to buy", filter: "all", addedDate: "", order: 0, entityStatus: "idle"}
    ]
})

test('correct todolist should be removed', () => {
    const endState = todolistsReducer(startState, removeTodolistAC(todolistId1))

    expect(endState.length).toBe(1);
    expect(endState[0].id).toBe(todolistId2);
});
test('correct todolist should be added', () => {
    const action =  addTodolistAC({title: "What to play", addedDate:"", order: 0, id: "todolistId1"});

    const endState = todolistsReducer(startState, action)

    expect(endState.length).toBe(3);
    expect(endState[0].title).toBe("What to play");
    expect(endState[0].filter).toBe("all");
});
test('correct todolist should change its name', () => {
    let newTodolistTitle = "New Todolist";

    const action = changeTodolistTitleAC(todolistId2, newTodolistTitle);

    const endState = todolistsReducer(startState, action);

    expect(endState[0].title).toBe("What to learn");
    expect(endState[1].title).toBe(newTodolistTitle);
});
test('correct filter of todolist should be changed', () => {
    let newFilter: FilterValuesType = "completed";

    const action = changeTodolistFilterAC(todolistId2, newFilter);

    const endState = todolistsReducer(startState, action);

    expect(endState[0].filter).toBe("all");
    expect(endState[1].filter).toBe(newFilter);
});
test('todolists should be added', () => {
    const action = setTodolistsAC(startState)

    const endState = todolistsReducer([], action);

    expect(endState.length).toBe(2);
});
test('entityStatus should be changed to the correct value', () => {
    const endState = todolistsReducer(startState, changeTodolistEntityStatusAC(todolistId1, "loading"))

    expect(endState[0].entityStatus).toBe("loading")
})

