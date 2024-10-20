import { instance } from "common/instance/instance";
import { GetTasksResponseType, UpdateTaskFragment } from "features/tasks/api/tasksAPI.types";
import { CommonResponse } from "common/types/types";
import { TaskType } from "features/tasks/model/tasksSlice.types";

export const tasksAPI = {
  getTasks(todolistId: string) {
    return instance.get<GetTasksResponseType>(`todo-lists/${todolistId}/tasks`);
  },
  createTask(params: { todolistId: string; title: string }) {
    return instance.post<CommonResponse<{ item: TaskType }>>(`todo-lists/${params.todolistId}/tasks`, {
      title: params.title,
    });
  },
  deleteTask(params: { todolistId: string; taskId: string }) {
    return instance.delete<CommonResponse>(`todo-lists/${params.todolistId}/tasks/${params.taskId}`);
  },
  updateTask(todolistId: string, taskId: string, taskFragment: UpdateTaskFragment) {
    return instance.put<CommonResponse<{ item: TaskType }>>(`todo-lists/${todolistId}/tasks/${taskId}`, taskFragment);
  },
};
