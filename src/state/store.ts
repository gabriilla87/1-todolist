import {applyMiddleware, combineReducers, legacy_createStore as createStore} from "redux";
import {TodolistsActionTypes, todolistsReducer} from "./todolists-reducer";
import {TasksActionTypes, tasksReducer} from "./tasks-reducer";
import {thunk, ThunkAction, ThunkDispatch} from "redux-thunk";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {AppActionsType, appReducer} from "./app-reducer";
import {AuthActionsType, authReducer} from "./auth-reducer";

const rootReducer = combineReducers({
    todolists: todolistsReducer,
    tasks: tasksReducer,
    app: appReducer,
    auth: authReducer
})

export const store = createStore(rootReducer, applyMiddleware(thunk) as any)

//custom hooks
export const useAppDispatch = () => useDispatch<AppThunkDispatch>();
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector

//types
export type AppRootActionTypes = TodolistsActionTypes | TasksActionTypes | AppActionsType | AuthActionsType
export type AppThunkDispatch = ThunkDispatch<AppRootStateType, any, AppRootActionTypes>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, AppRootActionTypes>
export type AppRootStateType = ReturnType<typeof rootReducer>

// @ts-ignore
window.store = store