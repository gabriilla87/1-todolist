import { TasksStateType } from "app/App";
import { addTodolist, removeTodolist, setTodolists } from "state/todolistsSlice";
import { TaskPriorities, TaskStatuses, TaskType, todolistsApi } from "api/todolists-api";
import { RequestStatusType, setAppError, setAppStatus } from "state/appSlice";
import { AxiosError } from "axios";
import { handleServerNetworkError } from "utils/handle-server-network-error";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clearData } from "common/common.actions";
import { createAppAsyncThunk } from "utils/create-app-async-thunk";
import { handleServerAppError } from "utils/handle-server-app-error";

//thunks
export const fetchTasks = createAppAsyncThunk<{ tasks: TaskType[]; todolistId: string }, string>(
  "tasks/fetchTasks",
  async (todolistId: string, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    let tasks = [];
    dispatch(setAppStatus({ status: "loading" }));
    try {
      const res = await todolistsApi.getTasks(todolistId);
      if (!res.data.error) {
        tasks = res.data.items;
        dispatch(setAppStatus({ status: "succeeded" }));
        return { tasks, todolistId };
      } else {
        dispatch(setAppError({ error: res.data.error }));
        dispatch(setAppStatus({ status: "failed" }));
        return rejectWithValue(null);
      }
    } catch (e) {
      handleServerNetworkError(e, dispatch);
      return rejectWithValue(null);
    }
  },
);

export const addTask = createAppAsyncThunk<{ task: TaskType }, { todolistId: string; title: string }>(
  "tasks/addTask",
  async (params, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    let task: TaskType;
    try {
      dispatch(setAppStatus({ status: "loading" }));
      const res = await todolistsApi.createTask(params);
      if (res.data.resultCode === 0) {
        task = res.data.data.item;
        dispatch(setAppStatus({ status: "succeeded" }));
        return { task };
      } else {
        handleServerAppError(res.data, dispatch);
        return rejectWithValue(null);
      }
    } catch (e) {
      handleServerNetworkError(e as AxiosError, dispatch);
      return rejectWithValue(null);
    }
  },
);

export const removeTask = createAppAsyncThunk<RemoveTaskData, RemoveTaskData>(
  "tasks/removeTask",
  async (params, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    const { taskId, todolistId } = params;
    try {
      dispatch(changeTaskEntityStatus({ todolistId, taskId, entityStatus: "loading" }));
      dispatch(setAppStatus({ status: "loading" }));
      const res = await todolistsApi.deleteTask(params);
      if (res.data.resultCode === 0) {
        dispatch(changeTaskEntityStatus({ todolistId, taskId, entityStatus: "succeeded" }));
        dispatch(setAppStatus({ status: "succeeded" }));
        return { todolistId, taskId };
      } else {
        handleServerAppError(res.data, dispatch);
        dispatch(changeTaskEntityStatus({ todolistId, taskId, entityStatus: "failed" }));
        return rejectWithValue(null);
      }
    } catch (e) {
      handleServerNetworkError(e, dispatch);
      dispatch(changeTaskEntityStatus({ todolistId, taskId, entityStatus: "failed" }));
      return rejectWithValue(null);
    }
  },
);

export const updateTask = createAppAsyncThunk<UpdateTaskData, UpdateTaskData>(
  "tasks/updateTask",
  async (params, thunkAPI) => {
    const { dispatch, rejectWithValue, getState } = thunkAPI;
    const { todolistId, taskId, fragment } = params;
    try {
      dispatch(changeTaskEntityStatus({ todolistId, taskId, entityStatus: "loading" }));
      dispatch(setAppStatus({ status: "loading" }));
      const currentTask = getState().tasks[todolistId].find((t) => t.id === taskId);
      if (!currentTask) {
        dispatch(setAppError({ error: "Task not found" }));
        return rejectWithValue(null);
      }
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
        dispatch(changeTaskEntityStatus({ todolistId, taskId, entityStatus: "succeeded" }));
        dispatch(setAppStatus({ status: "succeeded" }));
        return { todolistId, taskId, fragment };
      } else {
        handleServerAppError(res.data, dispatch);
        dispatch(changeTaskEntityStatus({ todolistId, taskId, entityStatus: "failed" }));
        return rejectWithValue(null);
      }
    } catch (e) {
      handleServerNetworkError(e as AxiosError, dispatch);
      dispatch(changeTaskEntityStatus({ todolistId, taskId, entityStatus: "failed" }));
      return rejectWithValue(null);
    }
  },
);

//slice
const tasksSlice = createSlice({
  name: "tasks",
  initialState: {} as TasksStateType,
  reducers: {
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
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state[action.payload.todolistId] = action.payload.tasks.map((t) => ({ ...t, entityStatus: "idle" }));
      })
      .addCase(addTask.fulfilled, (state, action) => {
        const tasks = state[action.payload.task.todoListId];
        tasks.unshift({ ...action.payload.task, entityStatus: "idle" });
      })
      .addCase(removeTask.fulfilled, (state, action) => {
        const tasks = state[action.payload.todolistId];
        const index = tasks.findIndex((t) => t.id === action.payload.taskId);
        if (index !== -1) tasks.splice(index, 1);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const tasks = state[action.payload.todolistId];
        const index = tasks.findIndex((t) => t.id === action.payload.taskId);
        if (index !== -1) {
          tasks[index] = { ...tasks[index], ...action.payload.fragment };
        }
      })
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

export const tasksReducer = tasksSlice.reducer;
export const { changeTaskEntityStatus } = tasksSlice.actions;
export const tasksThunks = { fetchTasks, addTask };

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

type RemoveTaskData = {
  todolistId: string;
  taskId: string;
};

type UpdateTaskData = {
  todolistId: string;
  taskId: string;
  fragment: UpdateTaskFragmentType;
};
