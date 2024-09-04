import React, {ChangeEvent, memo, useCallback} from "react";
import {useDispatch} from "react-redux";
import {changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "./state/tasks-reducer";
import {Checkbox, IconButton} from "@mui/material";
import {EditableSpan} from "./EditableSpan";
import {Delete} from "@mui/icons-material";

type TaskPT = {
    taskId: string
    todolistId: string
    isDone: boolean
    title: string
}

export const Task = memo(({taskId, todolistId, isDone, title}: TaskPT) => {
    const dispatch = useDispatch()

    const onRemoveTaskHandler = useCallback(() => {
        dispatch(removeTaskAC(taskId, todolistId))
    }, [dispatch, taskId, todolistId])

    const onChangeTaskStatusHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        dispatch(changeTaskStatusAC(todolistId, taskId, e.currentTarget.checked))
    }, [dispatch, taskId, todolistId])

    const onChangeTaskTitleHandler = useCallback((title: string,) => {
        dispatch(changeTaskTitleAC(todolistId, taskId, title))
    }, [dispatch, todolistId, taskId])


    return (
        <div className={isDone ? 'is-done' : ''}>
            <Checkbox checked={isDone} onChange={onChangeTaskStatusHandler}/>
            <EditableSpan title={title} onChange={onChangeTaskTitleHandler}/>
            <IconButton aria-label="delete" onClick={onRemoveTaskHandler}>
                <Delete/>
            </IconButton>
        </div>
    )
})