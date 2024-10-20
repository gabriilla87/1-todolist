import { FilterValuesType } from "app/App";
import { RequestStatusType } from "app/appSlice";

export type TodolistType = {
  id: string;
  title: string;
  addedDate: string;
  order: number;
};

export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};

export type ChangeTodosTitleData = {
  todolistId: string;
  title: string;
};
