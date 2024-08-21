import React, {useReducer} from 'react';
import './App.css';
import {Todolist} from "./Todolist";
import {v1} from "uuid";
import {AddItemForm} from "./AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@mui/material";
import {Menu} from "@mui/icons-material";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, tasksReducer} from "./state/tasks-reducer";
import {
    addTodolistAC,
    changeTodolistFilterAC,
    changeTodolistTitleAC,
    removeTodolistAC,
    todolistsReducer
} from "./state/todolists-reducer";

export type FilterValuesType = "all" | "active" | "completed";
// export type TodolistType = {
//     id: string
//     title: string
//     filter: FilterValuesType
// }
// export type TasksStateType = {
//     [key: string]: TasksType[]
// }

function AppWithUseReducer() {

    let todolistId1 = v1();
    let todolistId2 = v1();


    const [todolists, dispatchToTodolistsReducer] = useReducer(todolistsReducer, [
        {id: todolistId1, title: "What to learn", filter: 'all'},
        {id: todolistId2, title: "What to buy", filter: 'all'},
    ])

    const [tasks, dispatchToTasksReducer] = useReducer(tasksReducer, {
        [todolistId1]: [
            {id: v1(), title: "HTML&CSS", isDone: true},
            {id: v1(), title: "JS", isDone: true},
            {id: v1(), title: "ReactJS", isDone: false},
        ],
        [todolistId2]: [
            {id: v1(), title: "Book", isDone: true},
            {id: v1(), title: "Milk", isDone: true},
        ]
    })

    const removeTask = (taskId: string, todolistId: string) => {
        dispatchToTasksReducer(removeTaskAC(taskId, todolistId))
    };

    const addTask = (newTaskTitle: string, todolistId: string) => {
        dispatchToTasksReducer(addTaskAC(todolistId, newTaskTitle))
    }

    const changeTaskTitle = (taskId: string, title: string, todolistId: string) => {
        dispatchToTasksReducer(changeTaskTitleAC(todolistId, taskId, title))
    }

    const changeTaskStatus = (taskId: string, isDone: boolean, todolistId: string) => {
        dispatchToTasksReducer(changeTaskStatusAC(todolistId, taskId, isDone))
    }


    const removeTodolist = (todolistId: string) => {
        dispatchToTodolistsReducer(removeTodolistAC(todolistId))
        dispatchToTasksReducer(removeTodolistAC(todolistId))
    }

    const addTodolist = (title: string) => {
        const action = addTodolistAC(title)
        dispatchToTodolistsReducer(action)
        dispatchToTasksReducer(action)
    }

    const changeTodolistTitle = (title: string, todolistId: string) => {
        dispatchToTodolistsReducer(changeTodolistTitleAC(todolistId, title))
    }

    const changeTodolistFilter = (value: FilterValuesType, todolistId: string) => {
        dispatchToTodolistsReducer(changeTodolistFilterAC(todolistId, value))
    }

    return (
        <div className="App">
            <AppBar position={"static"}>
                <Toolbar>
                    <IconButton edge={"start"} color={"inherit"} aria-label={"menu"}>
                        <Menu/>
                    </IconButton>
                    <Typography variant={"h6"}>
                        News
                    </Typography>
                    <Button color={"inherit"}>Login</Button>
                </Toolbar>
            </AppBar>
            <Container fixed>
                <Grid container style={{padding: "20px"}}>
                    <AddItemForm addItem={addTodolist}/>
                </Grid>
                <Grid container spacing={3}>
                    {todolists.map(tl => {
                        let tasksForTodolist = tasks[tl.id];

                        if (tl.filter === "completed") {
                            tasksForTodolist = tasks[tl.id].filter(t => t.isDone);
                        }
                        if (tl.filter === "active") {
                            tasksForTodolist = tasks[tl.id].filter(t => !t.isDone);
                        }

                        return <Grid item key={tl.id}>
                            <Paper style={{padding: "10px"}}>
                                <Todolist
                                    todolistId={tl.id}
                                    title={tl.title}
                                    filter={tl.filter}
                                    tasks={tasksForTodolist}

                                    removeTask={removeTask}
                                    changeFilter={changeTodolistFilter}
                                    addTask={addTask}
                                    changeTaskStatus={changeTaskStatus}
                                    changeTaskTitle={changeTaskTitle}
                                    removeTodolist={removeTodolist}
                                    changeTodolistTitle={changeTodolistTitle}
                                />
                            </Paper>
                        </Grid>
                    })}
                </Grid>
            </Container>
        </div>
    );
}

export default AppWithUseReducer;
