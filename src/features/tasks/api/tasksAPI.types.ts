import { TaskPriorities, TaskStatuses, TaskType } from "features/tasks/model/tasksSlice.types";

export type GetTasksResponseType = {
  error: string | null;
  totalCount: number;
  items: TaskType[];
};

export type UpdateTaskFragment = {
  title?: string;
  description?: string;
  status?: TaskStatuses;
  priority?: TaskPriorities;
  startDate?: string;
  deadline?: string;
};
