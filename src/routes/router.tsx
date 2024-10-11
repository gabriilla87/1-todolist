import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../app/App";
import { TodolistsList } from "../features/TodolistsList/TodolistsList";
import React from "react";
import { Login } from "../features/Login/Login";
import { ErrorPage } from "../features/ErrorPage/ErrorPage";

export const PATH = {
  LOGIN_PAGE: "/login",
  TODOLISTS_PAGE: "/todolists",
  ERROR_PAGE: "/404",
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Navigate to={PATH.ERROR_PAGE} />,
    children: [
      {
        index: true,
        element: <Navigate to={PATH.TODOLISTS_PAGE} />,
      },
      {
        path: PATH.LOGIN_PAGE,
        element: <Login />,
      },
      {
        path: PATH.TODOLISTS_PAGE,
        element: <TodolistsList />,
      },
    ],
  },
  {
    path: PATH.ERROR_PAGE,
    element: <ErrorPage />,
  },
]);
