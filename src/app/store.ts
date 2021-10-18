import {combineReducers} from 'redux';
import thunk from 'redux-thunk';
import {appReducer} from '../features/Application';
import {authReducer} from "../features/Auth/authReducer";
import {configureStore} from "@reduxjs/toolkit";
import {tasksReducer, todolistsReducer} from "../features/TodolistsList";


export const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer
})

//export const store = createStore(rootReducer, applyMiddleware(thunk));

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunk),
})


// @ts-ignore
window.store = store;