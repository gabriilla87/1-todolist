import React, { useCallback, useEffect } from "react";
import { Grid2 as Grid, Paper } from "@mui/material";
import { AddItemForm } from "common/components/AddItemForm/AddItemForm";
import { Todolist } from "features/todolists/ui/Todolist/Todolist";
import { useAppDispatch, useAppSelector } from "app/store";
import {
  addTodolist,
  changeTodolistFilter,
  changeTodolistTitle,
  fetchTodolists,
  removeTodolist,
} from "features/todolists/model/todolistsSlice";
import { FilterValuesType } from "app/App";
import { Navigate } from "react-router-dom";
import { TodolistDomainType } from "features/todolists/model/todolistsSlice.types";

type PropsType = {
  demo?: boolean;
};

export const TodolistsList: React.FC<PropsType> = ({ demo = false }: PropsType) => {
  const dispatch = useAppDispatch();
  const todolists = useAppSelector<Array<TodolistDomainType>>((state) => state.todolists);
  const isLoggedIn = useAppSelector<boolean>((state) => state.auth.isLoggedIn);

  useEffect(() => {
    if (demo) {
      return;
    }
    if (!isLoggedIn) {
      return;
    }
    dispatch(fetchTodolists());
  }, [demo, dispatch, isLoggedIn]);

  const removeTodolistHandler = useCallback(
    (todolistId: string) => {
      dispatch(removeTodolist(todolistId));
    },
    [dispatch],
  );

  const addTodolistHandler = useCallback(
    (title: string) => {
      dispatch(addTodolist(title));
    },
    [dispatch],
  );

  const changeTodolistTitleHandler = useCallback(
    (title: string, todolistId: string) => {
      dispatch(changeTodolistTitle({ todolistId, title }));
    },
    [dispatch],
  );

  const changeTodolistFilterHandler = useCallback(
    (filter: FilterValuesType, todolistId: string) => {
      dispatch(changeTodolistFilter({ todolistId, filter }));
    },
    [dispatch],
  );

  if (!isLoggedIn) {
    return <Navigate to={"/login"} />;
  }

  return (
    <>
      <Grid container style={{ padding: "20px" }}>
        <AddItemForm addItem={addTodolistHandler} />
      </Grid>
      <Grid container spacing={3}>
        {todolists.map((tl) => {
          return (
            <Grid key={tl.id}>
              <Paper style={{ padding: "10px" }}>
                <Todolist
                  todolist={tl}
                  demo={demo}
                  changeFilter={changeTodolistFilterHandler}
                  removeTodolist={removeTodolistHandler}
                  changeTodolistTitle={changeTodolistTitleHandler}
                />
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};
