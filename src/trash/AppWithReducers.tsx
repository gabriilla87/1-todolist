import React, {useReducer} from 'react';
import '../App.css';
import {Todolist} from '../features/TodolistsList/Todolist/Todolist';
import {v1} from 'uuid';
import {AddItemForm} from '../components/AddItemForm/AddItemForm';
import {AppBar, Button, Container, Grid, Paper, Toolbar, Typography} from "@mui/material";
import IconButton from "@mui/material/IconButton/IconButton";
import {Menu} from "@mui/icons-material";
import {
    addTodolistAC,
    changeTodolistFilterAC, changeTodolistTitleAC,
    removeTodolistAC,
    todolistsReducer
} from "../state/todolists-reducer";
import {removeTaskAC, tasksReducer, updateTaskAC} from "../state/tasks-reducer";
import {TaskPriorities, TaskStatuses} from "../api/todolists-api";


export type FilterValuesType = "all" | "active" | "completed";
// export type TodolistType = {
//     id: string
//     title: string
//     filter: FilterValuesType
// }
//
// export type TasksStateType = {
//     [key: string]: Array<TaskType>
// }


function AppWithReducers() {
    let todolistId1 = v1();
    let todolistId2 = v1();

    // let iTodolists: Array<TodolistType> = []
    //
    // function initTodolists(): Array<TodolistType> {
    //     return ([
    //         {id: todolistId1, title: "What to learn", filter: "all"},
    //         {id: todolistId2, title: "What to buy", filter: "all"}
    //     ])
    // }
    //
    // let [todolists, dispatchToTodolistsReducer] = useReducer<Reducer<Array<TodolistType>, ActionsType>>(todolistsReducer, iTodolists, initTodolists)

    let [todolists, dispatchToTodolistsReducer] = useReducer(todolistsReducer, [
        {
            id: todolistId1,
            title: "What to learn",
            filter: "all",
            order: 0,
            addedDate: ""
        },
        {
            id: todolistId2,
            title: "What to buy",
            filter: "all",
            order: 0,
            addedDate: ""
        }
    ])

    let [tasks, dispatchToTasksReducer] = useReducer(tasksReducer, {
        [todolistId1]: [
            {
                id: v1(),
                title: "HTML&CSS",
                status: TaskStatuses.Completed,
                todoListId: todolistId1,
                addedDate: "",
                order: 0,
                deadline: "",
                description: "",
                priority: TaskPriorities.Low,
                startDate: ""
            },
            {
                id: v1(),
                title: "JS",
                status: TaskStatuses.Completed,
                todoListId: todolistId1,
                addedDate: "",
                order: 0,
                deadline: "",
                description: "",
                priority: TaskPriorities.Low,
                startDate: ""
            }
        ],
        [todolistId2]: [
            {
                id: v1(),
                title: "Milk",
                status: TaskStatuses.Completed,
                todoListId: todolistId2,
                addedDate: "",
                order: 0,
                deadline: "",
                description: "",
                priority: TaskPriorities.Low,
                startDate: ""
            },
            {
                id: v1(),
                title: "React Book",
                status: TaskStatuses.Completed,
                todoListId: todolistId2,
                addedDate: "",
                order: 0,
                deadline: "",
                description: "",
                priority: TaskPriorities.Low,
                startDate: ""
            }
        ]
    });


    function removeTask(id: string, todolistId: string) {
        dispatchToTasksReducer(removeTaskAC(id, todolistId))
    }

    // function addTask(title: string, todolistId: string) {
    //     dispatchToTasksReducer(addTaskAC(title, todolistId))
    // }

    function changeTaskStatus(id: string, status: TaskStatuses, todolistId: string) {
        dispatchToTasksReducer(updateTaskAC(todolistId, id, {status}))
    }

    function changeTaskTitle(id: string, newTitle: string, todolistId: string) {
        dispatchToTasksReducer(updateTaskAC(todolistId, id, {title: newTitle}))
    }


    function changeFilter(value: FilterValuesType, todolistId: string) {
        dispatchToTodolistsReducer(changeTodolistFilterAC(todolistId, value))
    }

    function removeTodolist(id: string) {
        const action = removeTodolistAC(id)
        dispatchToTodolistsReducer(action)
        dispatchToTasksReducer(action)
    }

    function changeTodolistTitle(id: string, title: string) {
        dispatchToTodolistsReducer(changeTodolistTitleAC(id, title))
    }

    function addTodolist(title: string) {
        const action = addTodolistAC({title: "What to play", addedDate:"", order: 0, id: "todolistId1"})
        dispatchToTodolistsReducer(action)
        dispatchToTasksReducer(action)
    }

    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu />
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
            <Container fixed>
                <Grid container style={{padding: "20px"}}>
                    <AddItemForm addItem={addTodolist}/>
                </Grid>
                <Grid container spacing={3}>
                    {
                        todolists.map(tl => {
                            let allTodolistTasks = tasks[tl.id];
                            let tasksForTodolist = allTodolistTasks;

                            if (tl.filter === "active") {
                                tasksForTodolist = allTodolistTasks.filter(t => t.status === TaskStatuses.New);
                            }
                            if (tl.filter === "completed") {
                                tasksForTodolist = allTodolistTasks.filter(t => t.status === TaskStatuses.Completed );
                            }

                            return <Grid key={tl.id} item>
                                <Paper style={{padding: "10px"}}>
                                    <Todolist
                                        key={tl.id}
                                        title={tl.title}
                                        todolistId={tl.id}
                                        filter={tl.filter}
                                        changeTodolistTitle={changeTodolistTitle}
                                        changeFilter={changeFilter}
                                        removeTodolist={removeTodolist}
                                    />
                                </Paper>
                            </Grid>
                        })
                    }
                </Grid>
            </Container>
        </div>
    );
}

export default AppWithReducers;
