import React, {ChangeEvent, memo, useCallback} from "react";
import {useDispatch} from "react-redux";
import {changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "./state/tasks-reducer";
import {Checkbox, IconButton} from "@mui/material";
import {EditableSpan} from "./EditableSpan";
import {Delete} from "@mui/icons-material";
import {TaskStatuses, TaskType} from "./api/todolists-api";

type TaskPT = {
    task: TaskType
    todolistId: string
    changeTaskStatus?: () => void
    changeTaskTitle?: () => void
    removeTask?: () => void
}

export const Task = memo(({todolistId, task, ...restProps}: TaskPT) => {
    const dispatch = useDispatch()

    const onRemoveTaskHandler = useCallback(() => {
        dispatch(removeTaskAC(task.id, todolistId))
    }, [dispatch, task.id, todolistId])

    const onChangeTaskStatusHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        dispatch(changeTaskStatusAC(todolistId, task.id, e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New))
    }, [dispatch, task.id, todolistId])

    const onChangeTaskTitleHandler = useCallback((title: string) => {
        dispatch(changeTaskTitleAC(todolistId, task.id, title))
    }, [dispatch, todolistId, task.id])


    return (
        <div className={task.status === TaskStatuses.Completed ? 'is-done' : ''}>
            <Checkbox checked={task.status === TaskStatuses.Completed} onChange={restProps.changeTaskStatus || onChangeTaskStatusHandler}/>
            <EditableSpan title={task.title} onChange={restProps.changeTaskTitle || onChangeTaskTitleHandler}/>
            <IconButton aria-label="delete" onClick={restProps.removeTask || onRemoveTaskHandler}>
                <Delete/>
            </IconButton>
        </div>
    )
})