import React, {memo, useCallback} from 'react';
import {FilterValuesType} from "./AppWithRedux";
import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";
import {Button, IconButton} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {addTaskAC} from "./state/tasks-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./state/store";
import {Task} from "./Task";

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

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

    console.log("Todolist is called")

    const tasks = useSelector<AppRootStateType, Array<TaskType>>(state => state.tasks[todolistId])
    const dispatch = useDispatch()

    let tasksForTodolist = [...tasks];

    if (filter === "completed") {
        tasksForTodolist = tasks.filter(t => t.isDone);
    }
    if (filter === "active") {
        tasksForTodolist = tasks.filter(t => !t.isDone);
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
        dispatch(addTaskAC(todolistId, title))
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
                                                 todolistId={todolistId}
                                                 taskId={t.id}
                                                 title={t.title}
                                                 isDone={t.isDone}
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