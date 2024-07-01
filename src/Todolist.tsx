import React, {ChangeEvent} from 'react';
import {FilterValuesType} from "./App";

export type TasksType = {
    id: string
    title: string
    isDone: boolean
}

type TodolistPropsType = {
    title: string
    tasks: TasksType[]
    removeTask: (id: string) => void
    changeFilter: (filter: FilterValuesType) => void
    addTask: () => void
    addTitle: (event: ChangeEvent<HTMLInputElement>) => void
    inputValue: string
}

export const Todolist = ({title, tasks, removeTask, changeFilter, addTask, addTitle, inputValue}: TodolistPropsType) => {

    return (
        <div>
            <h3>{title}</h3>
            <div>
                <input value={inputValue} onChange={addTitle}/>
                <button onClick={addTask}>+</button>
            </div>
            <ul>
                {tasks.map(t => {
                    return (
                        <li key={t.id}>
                            <button onClick={() => removeTask(t.id)}>x</button>
                            <input type={"checkbox"} checked={t.isDone} readOnly/>
                            <span>{t.title}</span>
                        </li>
                    )
                })}
            </ul>
            <div>
                <button onClick={() => changeFilter("all")}>All</button>
                <button onClick={() => changeFilter("active")}>Active</button>
                <button onClick={() => changeFilter("completed")}>Completed</button>
            </div>
        </div>
    );
};
