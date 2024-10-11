import React from "react";
import { Provider } from "react-redux";
import { combineReducers} from "redux";
import { tasksReducer } from "state/tasks-reducer";
import { todolistsReducer } from "state/todolists-reducer";
import { appReducer } from "state/app-reducer";
import { thunk } from "redux-thunk";
import { configureStore } from "@reduxjs/toolkit";

const rootReducer = combineReducers({
  tasks: tasksReducer,
  todolists: todolistsReducer,
  app: appReducer,
});

// const initialGlobalState = {
//   todolists: [
//     { id: "todolistId1", title: "What to learn", filter: "all", addedDate: "", order: 0, entityStatus: "idle" },
//     { id: "todolistId2", title: "What to buy", filter: "all", addedDate: "", order: 0, entityStatus: "loading" },
//   ],
//   tasks: {
//     ["todolistId1"]: [
//       {
//         id: v1(),
//         title: "HTML&CSS",
//         status: TaskStatuses.Completed,
//         todoListId: "todolistId1",
//         addedDate: "",
//         order: 0,
//         deadline: "",
//         description: "",
//         priority: TaskPriorities.Low,
//         startDate: "",
//         entityStatus: "idle",
//       },
//       {
//         id: v1(),
//         title: "JS",
//         status: TaskStatuses.Completed,
//         todoListId: "todolistId1",
//         addedDate: "",
//         order: 0,
//         deadline: "",
//         description: "",
//         priority: TaskPriorities.Low,
//         startDate: "",
//         entityStatus: "idle",
//       },
//     ],
//     ["todolistId2"]: [
//       {
//         id: v1(),
//         title: "Milk",
//         status: TaskStatuses.Completed,
//         todoListId: "todolistId2",
//         addedDate: "",
//         order: 0,
//         deadline: "",
//         description: "",
//         priority: TaskPriorities.Low,
//         startDate: "",
//         entityStatus: "idle",
//       },
//       {
//         id: v1(),
//         title: "React Book",
//         status: TaskStatuses.Completed,
//         todoListId: "todolistId2",
//         addedDate: "",
//         order: 0,
//         deadline: "",
//         description: "",
//         priority: TaskPriorities.Low,
//         startDate: "",
//         entityStatus: "idle",
//       },
//     ],
//   },
//   app: {
//     error: "",
//     status: "idle",
//   },
//   auth: {
//     isLoggedIn: false,
//     isInitialized: false,
//   },
// };

// @ts-ignore
export const storyBookStore = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunk),
});

export const ReduxStoreProviderDecorator = (storyFn: () => React.ReactNode) => {
  return <Provider store={storyBookStore}>{storyFn()}</Provider>;
};
