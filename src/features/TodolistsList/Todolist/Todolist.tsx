import React, {memo, useCallback} from 'react';
import {FilterValuesType} from "../../../app/App";
import {AddItemForm} from "../../../components/AddItemForm/AddItemForm";
import {EditableSpan} from "../../../components/EditableSpan/EditableSpan";
import {Button, IconButton} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {addTaskTC, DomainTaskType} from "../../../state/tasks-reducer";
import {useAppDispatch, useAppSelector} from "../../../state/store";
import {Task} from "./Task/Task";
import {TaskStatuses} from "../../../api/todolists-api";
import {TodolistDomainType} from "../../../state/todolists-reducer";

type TodolistPropsType = {
    todolist: TodolistDomainType
    changeFilter: (value: FilterValuesType, todolistId: string) => void
    changeTodolistTitle: (title: string, todolistId: string) => void
    removeTodolist: (todolistId: string) => void
    demo?: boolean
}

export const Todolist: React.FC<TodolistPropsType> = memo(({demo = false, ...props}: TodolistPropsType) => {
    const {todolist, changeTodolistTitle, changeFilter, removeTodolist} = props

    const tasks = useAppSelector<Array<DomainTaskType>>(state => state.tasks[todolist.id])
    const dispatch = useAppDispatch()

    let tasksForTodolist = [...tasks];

    if (todolist.filter === "completed") {
        tasksForTodolist = tasks.filter(t => t.status === TaskStatuses.Completed);
    }
    if (todolist.filter === "active") {
        tasksForTodolist = tasks.filter(t => t.status === TaskStatuses.New);
    }

    const onAllClickHandler = useCallback(() => {
        changeFilter("all", todolist.id)
    }, [changeFilter, todolist.id]);
    const onActiveClickHandler = useCallback(() => {
        changeFilter("active", todolist.id)
    }, [changeFilter, todolist.id]);
    const onCompletedClickHandler = useCallback(() => {
        changeFilter("completed", todolist.id)
    }, [changeFilter, todolist.id]);
    const removeTodolistOnClickHandler = useCallback(() => {
        removeTodolist(todolist.id)
    }, [removeTodolist, todolist.id]);
    const onChangeTodolistTitle = useCallback((title: string) => {
        changeTodolistTitle(title, todolist.id)
    }, [changeTodolistTitle, todolist.id]);
    const addTask = useCallback((title: string) => {
        dispatch(addTaskTC(todolist.id, title))
    }, [dispatch, todolist.id])

    const isDisabled = todolist.entityStatus === "loading"

    return (
        <div>
            <h3>
                <EditableSpan title={todolist.title} onChange={onChangeTodolistTitle} disabled={isDisabled}/>
                <IconButton aria-label={"delete"}
                            onClick={removeTodolistOnClickHandler}
                            disabled={isDisabled}
                >
                    <Delete/>
                </IconButton>
            </h3>
            <AddItemForm addItem={addTask} disabled={isDisabled}/>
            <div>
                {tasksForTodolist.map(t => <Task key={t.id}
                                                 task={t}
                                                 todolistId={todolist.id}
                />)}
            </div>
            <div>
                <Button variant={todolist.filter === 'all' ? 'contained' : 'text'} onClick={onAllClickHandler}>All</Button>
                <Button color={"primary"} variant={todolist.filter === 'active' ? 'contained' : 'text'}
                        onClick={onActiveClickHandler}>Active</Button>
                <Button color={"secondary"} variant={todolist.filter === 'completed' ? 'contained' : 'text'}
                        onClick={onCompletedClickHandler}>Completed</Button>
            </div>
        </div>
    );
});