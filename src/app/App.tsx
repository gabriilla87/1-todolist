import React, { useEffect } from "react";
import "../App.css";
import {
  AppBar,
  Button,
  CircularProgress,
  Container,
  IconButton,
  LinearProgress,
  Toolbar,
  Typography,
} from "@mui/material";
import { Menu } from "@mui/icons-material";
import { ErrorSnackbar } from "../components/ErrorSnackbar";
import { useAppDispatch, useAppSelector } from "../state/store";
import { RequestStatusType } from "../state/app-reducer";
import { DomainTaskType } from "../state/tasks-reducer";
import { Outlet } from "react-router-dom";
import { initializeAppTC, logoutTC } from "../state/auth-reducer";
import { LogoutButton } from "../components/LogoutButton/LogoutButton";

export type FilterValuesType = "all" | "active" | "completed";

export type TasksStateType = {
  [key: string]: DomainTaskType[];
};

function App() {
  const status = useAppSelector<RequestStatusType>((state) => state.app.status);
  const isInitialized = useAppSelector<boolean>((state) => state.auth.isInitialized);
  const isLoggedIn = useAppSelector<boolean>((state) => state.auth.isLoggedIn);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initializeAppTC());
  }, [dispatch]);

  const logoutHandler = () => {
    dispatch(logoutTC());
  };

  if (!isInitialized) {
    return (
      <div style={{ position: "fixed", top: "30%", textAlign: "center", width: "100%" }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="App">
      <ErrorSnackbar />
      <AppBar position={"static"}>
        <Toolbar>
          <IconButton edge={"start"} color={"inherit"} aria-label={"menu"}>
            <Menu />
          </IconButton>
          <Typography variant={"h6"}>News</Typography>
          <Button color={"inherit"}>Login</Button>
          {isLoggedIn ? <LogoutButton onClick={logoutHandler} /> : null}
        </Toolbar>
        {status === "loading" && <LinearProgress />}
      </AppBar>
      <Container fixed>
        <Outlet />
      </Container>
    </div>
  );
}

export default App;
