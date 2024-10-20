import { UpdateTaskFragment } from "features/tasks/api/tasksAPI.types";
import { RequestStatusType } from "app/appSlice";

export type DomainTaskType = TaskType & {
  entityStatus: RequestStatusType;
};

export type RemoveTaskData = {
  todolistId: string;
  taskId: string;
};

export type UpdateTaskData = {
  todolistId: string;
  taskId: string;
  fragment: UpdateTaskFragment;
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
