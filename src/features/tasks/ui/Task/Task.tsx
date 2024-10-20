import React, { ChangeEvent, memo, useCallback } from "react";
import { removeTask, updateTask } from "features/tasks/model/tasksSlice";
import { Checkbox, IconButton } from "@mui/material";
import { EditableSpan } from "common/components/EditableSpan/EditableSpan";
import { Delete } from "@mui/icons-material";
import { useAppDispatch } from "app/store";
import { DomainTaskType, TaskStatuses } from "features/tasks/model/tasksSlice.types";

type Props = {
  task: DomainTaskType;
  todolistId: string;
  changeTaskStatus?: () => void;
  changeTaskTitle?: () => void;
  removeTask?: () => void;
};

export const Task = memo(({ todolistId, task, ...restProps }: Props) => {
  const dispatch = useAppDispatch();

  const onRemoveTaskHandler = useCallback(() => {
    dispatch(removeTask({ todolistId, taskId: task.id }));
  }, [dispatch, task.id, todolistId]);

  const onChangeTaskStatusHandler = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      dispatch(
        updateTask({
          todolistId,
          taskId: task.id,
          fragment: {
            status: e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New,
          },
        }),
      );
    },
    [dispatch, task.id, todolistId],
  );

  const onChangeTaskTitleHandler = useCallback(
    (title: string) => {
      dispatch(
        updateTask({
          todolistId,
          taskId: task.id,
          fragment: {
            title,
          },
        }),
      );
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
