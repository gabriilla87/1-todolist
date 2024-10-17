import { TasksStateType } from "app/App";
import { addTodolist, removeTodolist, setTodolists } from "state/todolistsSlice";
import { TaskPriorities, TaskStatuses, TaskType, todolistsApi } from "api/todolists-api";
import { AppThunk } from "./store";
import { RequestStatusType, setAppError, setAppStatus } from "state/appSlice";
import { AxiosError } from "axios";
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clearData } from "common/common.actions";

const slice = createSlice({
  name: "tasks",
  initialState: {} as TasksStateType,
  reducers: {
    setTasks(state, action: PayloadAction<{ todolistId: string; tasks: TaskType[] }>) {
      state[action.payload.todolistId] = action.payload.tasks.map((t) => ({ ...t, entityStatus: "idle" }));
    },
    removeTask(state, action: PayloadAction<{ todolistId: string; taskId: string }>) {
      const tasks = state[action.payload.todolistId];
      const index = tasks.findIndex((t) => t.id === action.payload.taskId);
      if (index !== -1) tasks.splice(index, 1);
    },
    addTask(state, action: PayloadAction<{ task: TaskType }>) {
      const tasks = state[action.payload.task.todoListId];
      tasks.unshift({ ...action.payload.task, entityStatus: "idle" });
    },
    updateTask(
      state,
      action: PayloadAction<{
        todolistId: string;
        taskId: string;
        fragment: UpdateTaskFragmentType;
      }>,
    ) {
      const tasks = state[action.payload.todolistId];
      const index = tasks.findIndex((t) => t.id === action.payload.taskId);
      if (index !== -1) {
        tasks[index] = { ...tasks[index], ...action.payload.fragment };
      }
    },
    changeTaskEntityStatus(
      state,
      action: PayloadAction<{
        todolistId: string;
        taskId: string;
        entityStatus: RequestStatusType;
      }>,
    ) {
      let task = state[action.payload.todolistId].find((t) => t.id === action.payload.taskId);
      if (task) {
        task.entityStatus = action.payload.entityStatus;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.fulfilled, (state, action) => {})
      .addCase(addTodolist, (state, action) => {
        state[action.payload.todolist.id] = [];
      })
      .addCase(setTodolists, (state, action) => {
        action.payload.todolists.forEach((tl) => {
          state[tl.id] = [];
        });
      })
      .addCase(removeTodolist, (state, action) => {
        delete state[action.payload.todolistId];
      })
      .addCase(clearData, () => {
        return {};
      });
  },
});

const fetchTasks = createAsyncThunk("tasks/fetchTasks", async (todolistId: string, thunkAPI) => {
  const { dispatch } = thunkAPI;
  dispatch(setAppStatus({ status: "loading" }));
  try {
    const res = await todolistsApi.getTasks(todolistId);
    if (!res.data.error) {
      dispatch(setTasks({ todolistId, tasks: res.data.items }));
      dispatch(setAppStatus({ status: "succeeded" }));
    } else {
      dispatch(setAppError({ error: res.data.error }));
      dispatch(setAppStatus({ status: "failed" }));
    }
  } catch (e) {
    handleServerNetworkError(e as AxiosError, dispatch);
  }
});

export const tasksReducer = slice.reducer;
export const { updateTask, changeTaskEntityStatus, removeTask, setTasks, addTask } = slice.actions;
export const tasksThunks = { fetchTasks };

//thunks
export const fetchTasksTC =
  (todolistId: string): AppThunk =>
  async (dispatch) => {
    dispatch(setAppStatus({ status: "loading" }));
    try {
      const res = await todolistsApi.getTasks(todolistId);
      if (!res.data.error) {
        dispatch(setTasks({ todolistId, tasks: res.data.items }));
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
      dispatch(changeTaskEntityStatus({ todolistId, taskId, entityStatus: "loading" }));
      dispatch(setAppStatus({ status: "loading" }));
      const res = await todolistsApi.deleteTask(todolistId, taskId);
      if (res.data.resultCode === 0) {
        dispatch(removeTask({ todolistId, taskId }));
        dispatch(changeTaskEntityStatus({ todolistId, taskId, entityStatus: "succeeded" }));
        dispatch(setAppStatus({ status: "succeeded" }));
      } else {
        handleServerAppError(res.data, dispatch);
        dispatch(changeTaskEntityStatus({ todolistId, taskId, entityStatus: "failed" }));
      }
    } catch (e) {
      handleServerNetworkError(e as AxiosError, dispatch);
      dispatch(changeTaskEntityStatus({ todolistId, taskId, entityStatus: "failed" }));
    }
  };

export const addTaskTC =
  (todolistId: string, title: string): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(setAppStatus({ status: "loading" }));
      const res = await todolistsApi.createTask(todolistId, title);
      if (res.data.resultCode === 0) {
        dispatch(addTask({ task: res.data.data.item }));
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
      dispatch(changeTaskEntityStatus({ todolistId, taskId, entityStatus: "loading" }));
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
          ...fragment,
        });
        if (res.data.resultCode === 0) {
          dispatch(updateTask({ todolistId, taskId, fragment }));
          dispatch(changeTaskEntityStatus({ todolistId, taskId, entityStatus: "succeeded" }));
          dispatch(setAppStatus({ status: "succeeded" }));
        } else {
          handleServerAppError(res.data, dispatch);
          dispatch(changeTaskEntityStatus({ todolistId, taskId, entityStatus: "failed" }));
        }
      }
    } catch (e) {
      handleServerNetworkError(e as AxiosError, dispatch);
      dispatch(changeTaskEntityStatus({ todolistId, taskId, entityStatus: "failed" }));
    }
  };

//types
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
