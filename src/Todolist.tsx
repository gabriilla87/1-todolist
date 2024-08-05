import React, {ChangeEvent} from 'react';
import {FilterValuesType} from "./App";
import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";
import {Button, Checkbox, IconButton} from "@mui/material";
import {Delete} from "@mui/icons-material";

export type TasksType = {
    id: string
    title: string
    isDone: boolean
}

type TodolistPropsType = {
    todolistId: string
    title: string
    tasks: TasksType[]
    removeTask: (id: string, todolistId: string) => void
    changeFilter: (value: FilterValuesType, todolistId: string) => void
    addTask: (newTaskTitle: string,  todolistId: string) => void
    changeTaskStatus: (taskId: string, isDone: boolean,  todolistId: string) => void
    changeTaskTitle: (taskId: string, title: string,  todolistId: string) => void
    changeTodolistTitle: (title: string,  todolistId: string) => void
    filter: string
    removeTodolist: (todolistId: string) => void
}

export const Todolist = ({changeTodolistTitle, title, tasks, removeTask, changeFilter, changeTaskStatus, filter, todolistId, removeTodolist, changeTaskTitle, ...props}: TodolistPropsType) => {
    const onAllClickHandler = () => changeFilter("all", todolistId);
    const onActiveClickHandler = () => changeFilter("active", todolistId);
    const onCompletedClickHandler = () => changeFilter("completed", todolistId);
    const removeTodolistOnClickHandler = () => removeTodolist(todolistId);
    const addTask = (title: string) => {
        props.addTask(title, todolistId)
    };
    const onChangeTodolistTitle = (title: string) => changeTodolistTitle(title, todolistId);

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
                {tasks.map(t => {
                    const onRemoveTaskHandler = () => {
                        removeTask(t.id, todolistId)
                    }
                    const onChangeStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
                        changeTaskStatus(t.id, e.currentTarget.checked, todolistId)
                    }
                    const onChangeTitleHandler = (title: string,) => {
                        changeTaskTitle(t.id, title, todolistId)
                    }

                    return (
                        <div className={t.isDone ? 'is-done': ''} key={t.id}>
                            <Checkbox checked={t.isDone} onChange={onChangeStatusHandler}/>
                            <EditableSpan title={t.title} onChange={onChangeTitleHandler}/>
                            <IconButton aria-label="delete" onClick={onRemoveTaskHandler}>
                                <Delete/>
                            </IconButton>
                        </div>
                    )
                })}
            </div>
            <div>
                <Button variant={filter === 'all' ? 'contained': 'text'} onClick={onAllClickHandler}>All</Button>
                <Button color={"primary"} variant={filter === 'active' ? 'contained': 'text'} onClick={onActiveClickHandler}>Active</Button>
                <Button color={"secondary"} variant={filter === 'completed' ? 'contained': 'text'} onClick={onCompletedClickHandler}>Completed</Button>
            </div>
        </div>
    );
};


