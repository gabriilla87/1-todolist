import {
  addTaskAC,
  changeTaskEntityStatusAC,
  removeTaskAC,
  setTasksAC,
  tasksReducer,
  updateTaskAC,
} from "state/tasks-reducer";
import { TasksStateType } from "app/App";
import { addTodolistAC, removeTodolistAC, setTodolistsAC } from "state/todolists-reducer";
import { TaskPriorities, TaskStatuses } from "api/todolists-api";

let startState: TasksStateType = {};
beforeEach(() => {
  startState = {
    todolistId1: [
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
        startDate: "",
        entityStatus: "idle",
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
        startDate: "",
        entityStatus: "idle",
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
        startDate: "",
        entityStatus: "idle",
      },
    ],
    todolistId2: [
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
        startDate: "",
        entityStatus: "idle",
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
        startDate: "",
        entityStatus: "idle",
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
        startDate: "",
        entityStatus: "idle",
      },
    ],
  };
});

test("correct task should be deleted from correct array", () => {
  const action = removeTaskAC({ taskId: "2", todolistId: "todolistId2" });

  const endState = tasksReducer(startState, action);

  expect(endState["todolistId1"].length).toBe(3);
  expect(endState["todolistId2"].length).toBe(2);
  expect(endState["todolistId2"].every((t) => t.id != "2")).toBeTruthy();
});
test("correct task should be added to correct array", () => {
  const action = addTaskAC({ task: startState["todolistId1"][0] });

  const endState = tasksReducer(
    {
      todolistId1: [],
      todolistId2: [],
    },
    action,
  );

  expect(endState["todolistId1"].length).toBe(1);
  expect(endState["todolistId2"].length).toBe(0);
  expect(endState["todolistId1"][0].title).toBe("CSS");
});
test("status of specified task should be changed", () => {
  const action = updateTaskAC({ todolistId: "todolistId2", taskId: "2", fragment: { status: TaskStatuses.Completed }});

  const endState = tasksReducer(startState, action);

  expect(endState["todolistId1"][1].status).toBe(TaskStatuses.New);
  expect(endState["todolistId2"][1].status).toBe(TaskStatuses.Completed);
});
test("title of specified task should be changed", () => {
  const action = updateTaskAC({ todolistId: "todolistId2", taskId: "2", fragment: { title: "yogurt" }});

  const endState = tasksReducer(startState, action);

  expect(endState["todolistId1"][1].title).toBe("JS");
  expect(endState["todolistId2"][1].title).toBe("yogurt");
  expect(endState["todolistId2"][0].title).toBe("bread");
});
test("new array should be added when new todolist is added", () => {
  const action = addTodolistAC({ todolist: { title: "What to play", addedDate: "", order: 0, id: "todolistId3" }});

  const endState = tasksReducer(startState, action);

  const keys = Object.keys(endState);
  const newKey = keys.find((k) => k != "todolistId1" && k != "todolistId2");
  if (!newKey) {
    throw Error("new key should be added");
  }

  expect(keys.length).toBe(3);
  expect(endState[newKey]).toEqual([]);
});
test("propertry with todolistId should be deleted", () => {
  const action = removeTodolistAC({ todolistId: "todolistId2" });

  const endState = tasksReducer(startState, action);

  const keys = Object.keys(endState);

  expect(keys.length).toBe(1);
  expect(endState["todolistId2"]).not.toBeDefined();
});
test("empty array should be added to every todolists", () => {
  const action = setTodolistsAC({ todolists: [
    { id: "1", title: "What to learn", addedDate: "", order: 0 },
    { id: "2", title: "What to buy", addedDate: "", order: 0 },
  ] });

  const endState = tasksReducer({}, action);

  const keys = Object.keys(endState);

  expect(keys.length).toBe(2);
  expect(endState["1"]).toStrictEqual([]);
  expect(endState["2"]).toStrictEqual([]);
});
test("tasks should be sets to the correct todolist", () => {
  const action = setTasksAC({ todolistId: "todolistId1", tasks: startState["todolistId1"] });

  const endState = tasksReducer(
    {
      todolistId1: [],
      todolistId2: [],
    },
    action,
  );

  expect(endState["todolistId1"].length).toBe(3);
  expect(endState["todolistId2"].length).toBe(0);
});
test("entityTest should be changed to the correct value", () => {
  const endState = tasksReducer(startState, changeTaskEntityStatusAC({ todolistId: "todolistId1", taskId: "1", entityStatus: "loading" }));

  expect(endState["todolistId1"][0].entityStatus).toBe("loading");
});
