import React, { ChangeEvent, memo, useCallback } from "react";
import { DomainTaskType, removeTaskTC, updateTaskTC } from "../../../../state/tasks-reducer";
import { Checkbox, IconButton } from "@mui/material";
import { EditableSpan } from "../../../../components/EditableSpan/EditableSpan";
import { Delete } from "@mui/icons-material";
import { TaskStatuses } from "../../../../api/todolists-api";
import { useAppDispatch } from "../../../../state/store";

type TaskPT = {
  task: DomainTaskType;
  todolistId: string;
  changeTaskStatus?: () => void;
  changeTaskTitle?: () => void;
  removeTask?: () => void;
};

export const Task = memo(({ todolistId, task, ...restProps }: TaskPT) => {
  const dispatch = useAppDispatch();

  const onRemoveTaskHandler = useCallback(() => {
    dispatch(removeTaskTC(todolistId, task.id));
  }, [dispatch, task.id, todolistId]);

  const onChangeTaskStatusHandler = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      dispatch(
        updateTaskTC(todolistId, task.id, {
          status: e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New,
        }),
      );
    },
    [dispatch, task.id, todolistId],
  );

  const onChangeTaskTitleHandler = useCallback(
    (title: string) => {
      dispatch(updateTaskTC(todolistId, task.id, { title }));
    },
    [dispatch, todolistId, task.id],
  );

  const isDisabled = task.entityStatus === "loading";

  return (
    <div className={task.status === TaskStatuses.Completed ? "is-done" : ""}>
      <Checkbox
        checked={task.status === TaskStatuses.Completed}
        onChange={restProps.changeTaskStatus || onChangeTaskStatusHandler}
        disabled={isDisabled}
      />
      <EditableSpan
        title={task.title}
        onChange={restProps.changeTaskTitle || onChangeTaskTitleHandler}
        disabled={isDisabled}
      />
      <IconButton aria-label={"delete"} onClick={restProps.removeTask || onRemoveTaskHandler} disabled={isDisabled}>
        <Delete />
      </IconButton>
    </div>
  );
});
