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
import { ErrorSnackbar } from "common/components/ErrorSnackbar/ErrorSnackbar";
import { useAppDispatch, useAppSelector } from "app/store";
import { initializeApp, RequestStatusType } from "app/appSlice";
import { Outlet } from "react-router-dom";
import { logout } from "features/auth/model/authSlice";
import { LogoutButton } from "features/auth/ui/LogoutButton/LogoutButton";
import { DomainTaskType } from "features/tasks/model/tasksSlice.types";

export type FilterValuesType = "all" | "active" | "completed";

export type TasksStateType = {
  [key: string]: DomainTaskType[];
};

function App() {
  const status = useAppSelector<RequestStatusType>((state) => state.app.status);
  const isInitialized = useAppSelector<boolean>((state) => state.app.isInitialized);
  const isLoggedIn = useAppSelector<boolean>((state) => state.auth.isLoggedIn);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initializeApp());
  }, [dispatch]);

  const logoutHandler = () => {
    dispatch(logout());
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
