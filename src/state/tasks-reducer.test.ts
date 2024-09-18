import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, tasksReducer} from './tasks-reducer';
import {TasksStateType} from '../App';
import {addTodolistAC, removeTodolistAC} from './todolists-reducer';
import {TaskPriorities, TaskStatuses} from "../api/todolists-api";

let startState: TasksStateType = {};
beforeEach(() => {
    startState = {
        "todolistId1": [
            {
                id: "1",
                title: "CSS",
                status: TaskStatuses.New,
                todoListId: "todolistId1",
                addedDate: "",
                order: 0,
                deadline: "",
                description: "",
                priority: TaskPriorities.Low,
                startDate: ""
            },
            {
                id: "2",
                title: "JS",
                status: TaskStatuses.New,
                todoListId: "todolistId1",
                addedDate: "",
                order: 0,
                deadline: "",
                description: "",
                priority: TaskPriorities.Low,
                startDate: ""
            },
            {
                id: "3",
                title: "React",
                status: TaskStatuses.New,
                todoListId: "todolistId1",
                addedDate: "",
                order: 0,
                deadline: "",
                description: "",
                priority: TaskPriorities.Low,
                startDate: ""
            }
        ],
        "todolistId2": [
            {
                id: "1",
                title: "bread",
                status: TaskStatuses.New,
                todoListId: "todolistId2",
                addedDate: "",
                order: 0,
                deadline: "",
                description: "",
                priority: TaskPriorities.Low,
                startDate: ""
            },
            {
                id: "2",
                title: "milk",
                status: TaskStatuses.New,
                todoListId: "todolistId2",
                addedDate: "",
                order: 0,
                deadline: "",
                description: "",
                priority: TaskPriorities.Low,
                startDate: ""
            },
            {
                id: "3",
                title: "tea",
                status: TaskStatuses.New,
                todoListId: "todolistId2",
                addedDate: "",
                order: 0,
                deadline: "",
                description: "",
                priority: TaskPriorities.Low,
                startDate: ""
            }
        ]
    };
});

test('correct task should be deleted from correct array', () => {
    const action = removeTaskAC("2", "todolistId2");

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId1"].length).toBe(3);
    expect(endState["todolistId2"].length).toBe(2);
    expect(endState["todolistId2"].every(t => t.id != "2")).toBeTruthy();
});
test('correct task should be added to correct array', () => {
    const action = addTaskAC("todolistId2", "juce");

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId1"].length).toBe(3);
    expect(endState["todolistId2"].length).toBe(4);
    expect(endState["todolistId2"][0].id).toBeDefined();
    expect(endState["todolistId2"][3].title).toBe("juce");
    expect(endState["todolistId2"][0].status).toBe(TaskStatuses.New);
});
test('status of specified task should be changed', () => {
    const action = changeTaskStatusAC("todolistId2", "2", TaskStatuses.Completed);

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId1"][1].status).toBe(TaskStatuses.New);
    expect(endState["todolistId2"][1].status).toBe(TaskStatuses.Completed);
});
test('title of specified task should be changed', () => {
    const action = changeTaskTitleAC("todolistId2", "2", "yogurt", );

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId1"][1].title).toBe("JS");
    expect(endState["todolistId2"][1].title).toBe("yogurt");
    expect(endState["todolistId2"][0].title).toBe("bread");
});
test('new array should be added when new todolist is added', () => {
    const action = addTodolistAC("new todolist");

    const endState = tasksReducer(startState, action)


    const keys = Object.keys(endState);
    const newKey = keys.find(k => k != "todolistId1" && k != "todolistId2");
    if (!newKey) {
        throw Error("new key should be added")
    }

    expect(keys.length).toBe(3);
    expect(endState[newKey]).toEqual([]);
});
test('propertry with todolistId should be deleted', () => {
    const action = removeTodolistAC("todolistId2");

    const endState = tasksReducer(startState, action)

    const keys = Object.keys(endState);

    expect(keys.length).toBe(1);
    expect(endState["todolistId2"]).not.toBeDefined();
});
