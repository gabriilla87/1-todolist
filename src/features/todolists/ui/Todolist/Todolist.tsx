import React, { memo, useCallback } from "react";
import { FilterValuesType } from "app/App";
import { AddItemForm } from "common/components/AddItemForm/AddItemForm";
import { EditableSpan } from "common/components/EditableSpan/EditableSpan";
import { Button, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { addTask } from "features/tasks/model/tasksSlice";
import { useAppDispatch, useAppSelector } from "app/store";
import { Task } from "features/tasks/ui/Task/Task";
import { DomainTaskType, TaskStatuses } from "features/tasks/model/tasksSlice.types";
import { TodolistDomainType } from "features/todolists/model/todolistsSlice.types";

type Props = {
  todolist: TodolistDomainType;
  changeFilter: (value: FilterValuesType, todolistId: string) => void;
  changeTodolistTitle: (title: string, todolistId: string) => void;
  removeTodolist: (todolistId: string) => void;
  demo?: boolean;
};

export const Todolist: React.FC<Props> = memo(({ demo = false, ...props }: Props) => {
  const { todolist, changeTodolistTitle, changeFilter, removeTodolist } = props;

  const tasks = useAppSelector<Array<DomainTaskType>>((state) => state.tasks[todolist.id]);
  const dispatch = useAppDispatch();

  let tasksForTodolist = [...tasks];

  if (todolist.filter === "completed") {
    tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.Completed);
  }
  if (todolist.filter === "active") {
    tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.New);
  }

  const onAllClickHandler = useCallback(() => {
    changeFilter("all", todolist.id);
  }, [changeFilter, todolist.id]);
  const onActiveClickHandler = useCallback(() => {
    changeFilter("active", todolist.id);
  }, [changeFilter, todolist.id]);
  const onCompletedClickHandler = useCallback(() => {
    changeFilter("completed", todolist.id);
  }, [changeFilter, todolist.id]);
  const removeTodolistOnClickHandler = useCallback(() => {
    removeTodolist(todolist.id);
  }, [removeTodolist, todolist.id]);
  const onChangeTodolistTitle = useCallback(
    (title: string) => {
      changeTodolistTitle(title, todolist.id);
    },
    [changeTodolistTitle, todolist.id],
  );
  const addTaskHandler = useCallback(
    (title: string) => {
      dispatch(addTask({ todolistId: todolist.id, title }));
    },
    [dispatch, todolist.id],
  );

  const isDisabled = todolist.entityStatus === "loading";

  return (
    <div>
      <h3>
        <EditableSpan title={todolist.title} onChange={onChangeTodolistTitle} disabled={isDisabled} />
        <IconButton aria-label={"delete"} onClick={removeTodolistOnClickHandler} disabled={isDisabled}>
          <Delete />
        </IconButton>
      </h3>
      <AddItemForm addItem={addTaskHandler} disabled={isDisabled} />
      <div>
        {tasksForTodolist.map((t) => (
          <Task key={t.id} task={t} todolistId={todolist.id} />
        ))}
      </div>
      <div>
        <Button variant={todolist.filter === "all" ? "contained" : "text"} onClick={onAllClickHandler}>
          All
        </Button>
        <Button
          color={"primary"}
          variant={todolist.filter === "active" ? "contained" : "text"}
          onClick={onActiveClickHandler}
        >
          Active
        </Button>
        <Button
          color={"secondary"}
          variant={todolist.filter === "completed" ? "contained" : "text"}
          onClick={onCompletedClickHandler}
        >
          Completed
        </Button>
      </div>
    </div>
  );
});
