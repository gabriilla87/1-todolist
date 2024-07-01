import React, {ChangeEvent, useState} from 'react';
import './App.css';
import {TasksType, Todolist} from "./Todolist";
import {v1} from "uuid";

export type FilterValuesType = "all" | "active" | "completed";

function App() {
    let [tasks, setTasks] = useState<Array<TasksType>>([
        {id: v1(), title: "HTML&CSS", isDone: true},
        {id: v1(), title: "JS", isDone: true},
        {id: v1(), title: "ReactJS", isDone: false},
        {id: v1(), title: "Rest API", isDone: false},
        {id: v1(), title: "GraphQL", isDone: false},
    ]);
    let [filter, setFilter] = useState<FilterValuesType>("all")
    let [title, setTitle] = useState<string>('')

    const removeTask = (id: string) => {
        let filteredTasks = tasks.filter(t => (t.id !== id));
        setTasks(filteredTasks);
    };

    const addTitle = (event: ChangeEvent<HTMLInputElement>) => {
        setTitle(event.currentTarget.value)
    }

    const addTask = () => {
        let newTask = {id: v1(), title: title, isDone: false};
        let newTasks = [newTask, ...tasks];
        setTasks(newTasks);
        setTitle('');
    }


    let tasksForTodolist = tasks;
    if (filter === "completed") {
        tasksForTodolist = tasks.filter(t => t.isDone);
    }
    if (filter === "active") {
        tasksForTodolist = tasks.filter(t => !t.isDone);
    }

    const changeFilter = (nameButton: FilterValuesType) => {
        setFilter(nameButton);
    }

    return (
        <div className="App">
            <Todolist title={"What to learn"}
                      tasks={tasksForTodolist}
                      removeTask={removeTask}
                      changeFilter={changeFilter}
                      addTask={addTask}
                      addTitle={addTitle}
                      inputValue={title}
            />
        </div>
    );
}

export default App;
