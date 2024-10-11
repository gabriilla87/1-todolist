import { TasksStateType } from "app/App";
import { addTodolistAC, removeTodolistAC, setTodolistsAC, todolistsActions } from "./todolists-reducer";
import { TaskPriorities, TaskStatuses, TaskType, todolistsApi } from "api/todolists-api";
import { AppThunk } from "./store";
import { RequestStatusType, setAppError, setAppStatus } from "./app-reducer";
import { AxiosError } from "axios";
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: TasksStateType = {};

const slice = createSlice({
  name: "tasks",
  initialState: initialState,
  reducers: {
    setTasksAC(state, action: PayloadAction<{ todolistId: string, tasks: TaskType[] }>) {
      state[action.payload.todolistId] = action.payload.tasks.map((t) => ({ ...t, entityStatus: "idle" }));
    },
    removeTaskAC(state, action: PayloadAction<{ todolistId: string, taskId: string }>) {
      const tasks = state[action.payload.todolistId];
      const index = tasks.findIndex(t => t.id === action.payload.taskId);
      if (index !== -1) tasks.splice(index, 1);
    },
    addTaskAC(state, action: PayloadAction<{ task: TaskType }>) {
      state[action.payload.task.todoListId].unshift({ ...action.payload.task, entityStatus: "idle" });
    },
    updateTaskAC(state, action: PayloadAction<{
      todolistId: string,
      taskId: string,
      fragment: UpdateTaskFragmentType
    }>) {
      debugger
      const tasks = state[action.payload.todolistId]
      const index = tasks.findIndex(t => t.id === action.payload.taskId)
      if (index !== -1) {
        tasks[index] = {...tasks[index], ...action.payload.fragment}
      }
      debugger
      const test = tasks
    },
    changeTaskEntityStatusAC(state, action: PayloadAction<{
      todolistId: string,
      taskId: string,
      entityStatus: RequestStatusType
    }>) {
      let task = state[action.payload.todolistId].find(t => t.id === action.payload.taskId);
      if (task) {
        task.entityStatus = action.payload.entityStatus;
      }
    },
    clearTasksDataAC() {
      return {};
    }
  },
  extraReducers: builder => {
    builder
      .addCase(todolistsActions.addTodolistAC, (state, action) => {
        state[action.payload.todolist.id] = [];
      })
      .addCase(todolistsActions.setTodolistsAC, (state, action) => {
        action.payload.todolists.forEach((tl) => {
          state[tl.id] = []
        })
      })
      .addCase(todolistsActions.removeTodolistAC, (state, action) => {
        delete state[action.payload.todolistId]
      })
  }
});

export const tasksReducer = slice.reducer
export const tasksActions = slice.actions
export const {
  updateTaskAC,
  changeTaskEntityStatusAC,
  removeTaskAC,
  setTasksAC,
  clearTasksDataAC,
  addTaskAC
} = slice.actions

//thunks
export const fetchTasksTC =
  (todolistId: string): AppThunk =>
    async (dispatch) => {
      dispatch(setAppStatus({ status: "loading" }));
      try {
        const res = await todolistsApi.getTasks(todolistId);
        if (!res.data.error) {
          dispatch(setTasksAC({ todolistId, tasks: res.data.items }));
          dispatch(setAppStatus({ status: "succeeded" }));
        } else {
          dispatch(setAppError({ error: res.data.error }));
          dispatch(setAppStatus({ status: "failed" }));
        }
      } catch (e) {
        handleServerNetworkError(e as AxiosError, dispatch);
      }
    };

export const removeTaskTC =
  (todolistId: string, taskId: string): AppThunk =>
    async (dispatch) => {
      try {
        dispatch(changeTaskEntityStatusAC({ todolistId, taskId, entityStatus: "loading" }));
        dispatch(setAppStatus({ status: "loading" }));
        const res = await todolistsApi.deleteTask(todolistId, taskId);
        if (res.data.resultCode === 0) {
          dispatch(removeTaskAC({ todolistId, taskId }));
          dispatch(changeTaskEntityStatusAC({ todolistId, taskId, entityStatus: "succeeded" }));
          dispatch(setAppStatus({ status: "succeeded" }));
        } else {
          handleServerAppError(res.data, dispatch);
          dispatch(changeTaskEntityStatusAC({ todolistId, taskId, entityStatus: "failed" }));
        }
      } catch (e) {
        handleServerNetworkError(e as AxiosError, dispatch);
        dispatch(changeTaskEntityStatusAC({ todolistId, taskId, entityStatus: "failed" }));
      }
    };

export const addTaskTC =
  (todolistId: string, title: string): AppThunk =>
    async (dispatch) => {
      try {
        dispatch(setAppStatus({ status: "loading" }));
        const res = await todolistsApi.createTask(todolistId, title);
        if (res.data.resultCode === 0) {
          dispatch(addTaskAC({ task: res.data.data.item }));
          dispatch(setAppStatus({ status: "succeeded" }));
        } else {
          handleServerAppError(res.data, dispatch);
        }
      } catch (e) {
        handleServerNetworkError(e as AxiosError, dispatch);
      }
    };

export const updateTaskTC =
  (todolistId: string, taskId: string, fragment: UpdateTaskFragmentType): AppThunk =>
    async (dispatch, getState) => {
      try {
        debugger
        dispatch(changeTaskEntityStatusAC({ todolistId, taskId, entityStatus: "loading" }));
        dispatch(setAppStatus({ status: "loading" }));
        const currentTask = getState().tasks[todolistId].find((t) => t.id === taskId);
        if (currentTask) {
          const { title, deadline, description, priority, startDate, status } = currentTask;
          const res = await todolistsApi.updateTask(todolistId, taskId, {
            title,
            description,
            status,
            priority,
            startDate,
            deadline,
            ...fragment
          });
          if (res.data.resultCode === 0) {
            debugger
            dispatch(updateTaskAC({ todolistId, taskId, fragment }));
            dispatch(changeTaskEntityStatusAC({ todolistId, taskId, entityStatus: "succeeded" }));
            dispatch(setAppStatus({ status: "succeeded" }));
          } else {
            handleServerAppError(res.data, dispatch);
            dispatch(changeTaskEntityStatusAC({ todolistId, taskId, entityStatus: "failed" }));
          }
        }
      } catch (e) {
        handleServerNetworkError(e as AxiosError, dispatch);
        dispatch(changeTaskEntityStatusAC({ todolistId, taskId, entityStatus: "failed" }));
      }
    };

//types
export type TasksActionTypes =
  | ReturnType<typeof removeTaskAC>
  | ReturnType<typeof addTaskAC>
  | ReturnType<typeof updateTaskAC>
  | ReturnType<typeof setTodolistsAC>
  | ReturnType<typeof setTasksAC>
  | ReturnType<typeof addTodolistAC>
  | ReturnType<typeof removeTodolistAC>
  | ReturnType<typeof changeTaskEntityStatusAC>
  | ReturnType<typeof clearTasksDataAC>;

type UpdateTaskFragmentType = {
  title?: string;
  description?: string;
  status?: TaskStatuses;
  priority?: TaskPriorities;
  startDate?: string;
  deadline?: string;
};

export type DomainTaskType = TaskType & {
  entityStatus: RequestStatusType;
};
