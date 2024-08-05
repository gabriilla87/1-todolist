import React, {useState} from 'react';
import './App.css';
import {TasksType, Todolist} from "./Todolist";
import {v1} from "uuid";
import {AddItemForm} from "./AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@mui/material";
import {Menu} from "@mui/icons-material";

export type FilterValuesType = "all" | "active" | "completed";
type TodolistType = {
    id: string
    title: string
    filter: FilterValuesType
}
type TasksStateType = {
    [key: string]: TasksType[]
}

function App() {

    const removeTask = (id: string, todolistId: string) => {
        tasksObj[todolistId] = tasksObj[todolistId].filter(t => (t.id !== id));
        setTasksObj({...tasksObj});
    };

    const addTask = (newTaskTitle: string, todolistId: string) => {
        let newTask = {id: v1(), title: newTaskTitle, isDone: false};
        tasksObj[todolistId] = [newTask, ...tasksObj[todolistId]];
        setTasksObj({...tasksObj});
        // setTitle('');
    }

    const changeTaskStatus = (taskId: string, isDone: boolean, todolistId: string) => {
        let task = tasksObj[todolistId].find(t => t.id === taskId);
        if (task) task.isDone = isDone;
        setTasksObj({...tasksObj});
    }

    const removeTodolist = (todolistId: string) => {
        let filteredTodolists = todolists.filter(tl => tl.id !== todolistId);
        setTodolists(filteredTodolists);

        delete tasksObj[todolistId];
        setTasksObj({...tasksObj})
    }

    const addTodolist = (title: string) => {
        const todolist: TodolistType = {
            id: v1(),
            filter: "all",
            title: title
        }
        setTodolists([todolist, ...todolists])
        setTasksObj({...tasksObj, [todolist.id]: []})
    }

    const changeTaskTitle = (taskId: string, title: string, todolistId: string) => {
        setTasksObj({
            ...tasksObj,
            [todolistId]: tasksObj[todolistId].map(t => t.id === taskId ? {...t, title: title} : t)
        })
    }

    const changeTodolistTitle = (title: string, todolistId: string) => {
        setTodolists(todolists.map(t => t.id === todolistId ? {...t, title: title} : t))
    }

    let todolistId1 = v1();
    let todolistId2 = v1();

    let [todolists, setTodolists] = useState<Array<TodolistType>>([
        {id: todolistId1, title: "What to learn", filter: 'all'},
        {id: todolistId2, title: "What to buy", filter: 'all'},
    ])

    let [tasksObj, setTasksObj] = useState<TasksStateType>({
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
                        let tasksForTodolist = tasksObj[tl.id];

                        if (tl.filter === "completed") {
                            tasksForTodolist = tasksObj[tl.id].filter(t => t.isDone);
                        }
                        if (tl.filter === "active") {
                            tasksForTodolist = tasksObj[tl.id].filter(t => !t.isDone);
                        }

                        const changeFilter = (value: FilterValuesType, todolistId: string) => {
                            let todolist = todolists.find(tl => tl.id === todolistId);
                            if (todolist) {
                                todolist.filter = value;
                                setTodolists([...todolists])
                            }
                        }

                        return <Grid item>
                            <Paper style={{padding: "10px"}}>
                                <Todolist
                                    key={tl.id}
                                    todolistId={tl.id}
                                    title={tl.title}
                                    filter={tl.filter}
                                    tasks={tasksForTodolist}

                                    removeTask={removeTask}
                                    changeFilter={changeFilter}
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

export default App;
