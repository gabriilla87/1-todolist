import { TasksStateType } from "app/App";
import { addTodolist, TodolistDomainType, todolistsReducer } from "state/todolistsSlice";
import { tasksReducer } from "state/tasksSlice";

test("ids should be equals", () => {
  const startTasksState: TasksStateType = {};
  const startTodolistsState: Array<TodolistDomainType> = [];

  const action = addTodolist({ todolist: { title: "What to learn", addedDate: "", order: 0, id: "todolistId1" } });

  const endTasksState = tasksReducer(startTasksState, action);
  const endTodolistsState = todolistsReducer(startTodolistsState, action);

  const keys = Object.keys(endTasksState);
  const idFromTasks = keys[0];
  const idFromTodolists = endTodolistsState[0].id;

  expect(idFromTasks).toBe(action.payload.todolist.id);
  expect(idFromTodolists).toBe(action.payload.todolist.id);
});
