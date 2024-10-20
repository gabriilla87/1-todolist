import { instance } from "common/instance/instance";
import { CommonResponse } from "common/types/types";
import { TodolistType } from "features/todolists/model/todolistsSlice.types";

export const todolistsAPI = {
  getTodolists() {
    return instance.get<TodolistType[]>("todo-lists");
  },
  createTodolist(title: string) {
    return instance.post<CommonResponse<{ item: TodolistType }>>("todo-lists", {
      title,
    });
  },
  deleteTodolist(todolistId: string) {
    return instance.delete<CommonResponse>(`todo-lists/${todolistId}`);
  },
  updateTodolistTitle(todolistId: string, title: string) {
    return instance.put<CommonResponse>(`todo-lists/${todolistId}`, {
      title,
    });
  },
};
