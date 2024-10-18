import axios from "axios";
import { TodolistType } from "state/todolistsSlice";

const instance = axios.create({
  baseURL: "https://social-network.samuraijs.com/api/1.1/",
  withCredentials: true,
  headers: {
    "API-KEY": "51762684-c56c-44ab-a28d-b3e9baf8a66e",
  },
});

//api
export const todolistsApi = {
  getTodolists() {
    return instance.get<TodolistType[]>("todo-lists");
  },
  createTodolist(title: string) {
    return instance.post<ResponseType<{ item: TodolistType }>>("todo-lists", {
      title,
    });
  },
  deleteTodolist(todolistId: string) {
    return instance.delete<ResponseType>(`todo-lists/${todolistId}`);
  },
  updateTodolistTitle(todolistId: string, title: string) {
    return instance.put<ResponseType>(`todo-lists/${todolistId}`, {
      title,
    });
  },
  getTasks(todolistId: string) {
    return instance.get<GetTasksResponseType>(`todo-lists/${todolistId}/tasks`);
  },
  createTask(params: { todolistId: string; title: string }) {
    return instance.post<ResponseType<{ item: TaskType }>>(`todo-lists/${params.todolistId}/tasks`, {
      title: params.title,
    });
  },
  deleteTask(params: { todolistId: string; taskId: string }) {
    return instance.delete<ResponseType>(`todo-lists/${params.todolistId}/tasks/${params.taskId}`);
  },
  updateTask(todolistId: string, taskId: string, taskFragment: TaskFragmentType) {
    return instance.put<ResponseType<{ item: TaskType }>>(`todo-lists/${todolistId}/tasks/${taskId}`, taskFragment);
  },
};

export const authAPI = {
  login(email: string, password: string, rememberMe: boolean = false, captcha: boolean = false) {
    return instance.post<ResponseType<{ userId: number }>>("/auth/login", {
      email,
      password,
      rememberMe,
      captcha,
    } as LoginParamsType);
  },
  me() {
    return instance.get<ResponseType<AuthMeDataType>>("/auth/me");
  },
  logout() {
    return instance.delete<ResponseType>("auth/login");
  },
};

//types
export type ResponseType<D = {}> = {
  resultCode: number;
  messages: string[];
  data: D;
};

type AuthMeDataType = {
  id: number;
  email: string;
  login: string;
};

export enum TaskStatuses {
  New = 0,
  InProgress = 1,
  Completed = 2,
  Draft = 3,
}

export enum TaskPriorities {
  Low = 0,
  Middle = 1,
  Hi = 2,
  Urgently = 3,
  Later = 4,
}

export type TaskType = {
  description: string;
  title: string;
  status: TaskStatuses;
  priority: TaskPriorities;
  startDate: string;
  deadline: string;
  id: string;
  todoListId: string;
  order: number;
  addedDate: string;
};
type GetTasksResponseType = {
  error: string | null;
  totalCount: number;
  items: TaskType[];
};
export type TaskFragmentType = {
  title?: string;
  description?: string;
  status?: TaskStatuses;
  priority?: TaskPriorities;
  startDate?: string;
  deadline?: string;
};
export type LoginParamsType = {
  email: string;
  password: string;
  rememberMe?: boolean;
  captcha?: boolean;
};
