import React, {memo, useCallback, useEffect} from 'react';
import {FilterValuesType} from "../../../app/App";
import {AddItemForm} from "../../../components/AddItemForm/AddItemForm";
import {EditableSpan} from "../../../components/EditableSpan/EditableSpan";
import {Button, IconButton} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {addTaskTC, fetchTasksTC} from "../../../state/tasks-reducer";
import {useAppDispatch, useAppSelector} from "../../../state/store";
import {Task} from "./Task/Task";
import {TaskStatuses, TaskType} from "../../../api/todolists-api";

type TodolistPropsType = {
    todolistId: string
    title: string
    changeFilter: (value: FilterValuesType, todolistId: string) => void
    changeTodolistTitle: (title: string, todolistId: string) => void
    filter: string
    removeTodolist: (todolistId: string) => void
}

export const Todolist = memo(({
                                  changeTodolistTitle,
                                  title,
                                  changeFilter,
                                  filter,
                                  todolistId,
                                  removeTodolist
                              }: TodolistPropsType) => {

    const tasks = useAppSelector<Array<TaskType>>(state => state.tasks[todolistId])
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(fetchTasksTC(todolistId))
    }, [dispatch, todolistId]);

    let tasksForTodolist = [...tasks];

    if (filter === "completed") {
        tasksForTodolist = tasks.filter(t => t.status === TaskStatuses.Completed);
    }
    if (filter === "active") {
        tasksForTodolist = tasks.filter(t => t.status === TaskStatuses.New);
    }

    const onAllClickHandler = useCallback(() => {
        changeFilter("all", todolistId)
    }, [changeFilter, todolistId]);
    const onActiveClickHandler = useCallback(() => {
        changeFilter("active", todolistId)
    }, [changeFilter, todolistId]);
    const onCompletedClickHandler = useCallback(() => {
        changeFilter("completed", todolistId)
    }, [changeFilter, todolistId]);
    const removeTodolistOnClickHandler = useCallback(() => {
        removeTodolist(todolistId)
    }, [removeTodolist, todolistId]);
    const onChangeTodolistTitle = useCallback((title: string) => {
        changeTodolistTitle(title, todolistId)
    }, [changeTodolistTitle, todolistId]);
    const addTask = useCallback((title: string) => {
        dispatch(addTaskTC(todolistId, title))
    }, [dispatch, todolistId])

    return (
        <div>
            <h3>
                <EditableSpan title={title} onChange={onChangeTodolistTitle}/>
                <IconButton aria-label="delete" onClick={removeTodolistOnClickHandler}>
                    <Delete/>
                </IconButton>
            </h3>
            <AddItemForm addItem={addTask}/>
            <div>
                {tasksForTodolist.map(t => <Task key={t.id}
                                                 task={t}
                                                 todolistId={todolistId}
                />)}
            </div>
            <div>
                <Button variant={filter === 'all' ? 'contained' : 'text'} onClick={onAllClickHandler}>All</Button>
                <Button color={"primary"} variant={filter === 'active' ? 'contained' : 'text'}
                        onClick={onActiveClickHandler}>Active</Button>
                <Button color={"secondary"} variant={filter === 'completed' ? 'contained' : 'text'}
                        onClick={onCompletedClickHandler}>Completed</Button>
            </div>
        </div>
    );
});