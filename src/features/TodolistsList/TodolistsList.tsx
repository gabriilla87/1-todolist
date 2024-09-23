import React, {useCallback, useEffect} from 'react';
import {Grid, Paper} from "@mui/material";
import {AddItemForm} from "../../components/AddItemForm/AddItemForm";
import {Todolist} from "./Todolist/Todolist";
import {useAppDispatch, useAppSelector} from "../../state/store";
import {
    addTodolistTC, changeTodolistFilterAC,
    changeTodolistTitleTC, fetchTodolistsTC,
    removeTodolistTC,
    TodolistDomainType
} from "../../state/todolists-reducer";
import {FilterValuesType} from "../../app/App";

export const TodolistsList: React.FC = () => {
    const dispatch = useAppDispatch()
    const todolists = useAppSelector<Array<TodolistDomainType>>(state => state.todolists)

    useEffect(() => {
        dispatch(fetchTodolistsTC())
    }, []);

    const removeTodolist = useCallback((todolistId: string) => {
        dispatch(removeTodolistTC(todolistId))
    }, [dispatch])

    const addTodolist = useCallback((title: string) => {
        dispatch(addTodolistTC(title))
    }, [dispatch])

    const changeTodolistTitle = useCallback((title: string, todolistId: string) => {
        dispatch(changeTodolistTitleTC(todolistId, title))
    }, [dispatch])

    const changeTodolistFilter = useCallback((value: FilterValuesType, todolistId: string) => {
        dispatch(changeTodolistFilterAC(todolistId, value))
    }, [dispatch])

    return (
        <>
            <Grid container style={{padding: "20px"}}>
                <AddItemForm addItem={addTodolist}/>
            </Grid>
            <Grid container spacing={3}>
                {todolists.map(tl => {
                    return (
                        <Grid item key={tl.id}>
                            <Paper style={{padding: "10px"}}>
                                <Todolist
                                    todolistId={tl.id}
                                    title={tl.title}
                                    filter={tl.filter}

                                    changeFilter={changeTodolistFilter}
                                    removeTodolist={removeTodolist}
                                    changeTodolistTitle={changeTodolistTitle}
                                />
                            </Paper>
                        </Grid>
                    )
                })}
            </Grid>
        </>
    );
};