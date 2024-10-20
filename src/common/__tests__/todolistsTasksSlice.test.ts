import { TasksStateType } from "app/App";
import { addTodolist, TodolistDomainType, todolistsReducer } from "features/todolists/model/todolistsSlice";
import { tasksReducer } from "features/tasks/model/tasksSlice";
import { TestAction } from "common/types/types";

test("ids should be equals", () => {
  const startTasksState: TasksStateType = {};
  const startTodolistsState: Array<TodolistDomainType> = [];

  const action: TestAction<typeof addTodolist.fulfilled> = {
    type: addTodolist.fulfilled.type,
    payload: {
      todolist: {
        title: "What to learn",
        addedDate: "",
        order: 0,
        id: "todolistId1",
      },
    },
  };

  const endTasksState = tasksReducer(startTasksState, action);
  const endTodolistsState = todolistsReducer(startTodolistsState, action);

  const keys = Object.keys(endTasksState);
  const idFromTasks = keys[0];
  const idFromTodolists = endTodolistsState[0].id;

  expect(idFromTasks).toBe(action.payload.todolist.id);
  expect(idFromTodolists).toBe(action.payload.todolist.id);
});
