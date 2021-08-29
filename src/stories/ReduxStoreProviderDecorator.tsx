import React from 'react';
import {Provider} from 'react-redux';
import {AppRootStateType, RootReducerType} from '../app/store';
import {v1} from 'uuid';
import {combineReducers} from 'redux';
import {tasksReducer} from '../features/TodolistsList/tasks-reducer';
import {todolistsReducer} from '../features/TodolistsList/todolists-reducer';
import {TaskPriorities, TaskStatuses} from '../api/todolist-api';
import {appReducer} from '../app/app-reducer';
import thunk from "redux-thunk";
import {authReducer} from "../features/Login/authReducer";
import {HashRouter} from "react-router-dom";
import {configureStore} from '@reduxjs/toolkit';

const rootReducer: RootReducerType = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer
})

const initialGlobalState: AppRootStateType = {
    todolists: [
        {
            id: 'todolistId1',
            title: 'What to learn',
            filter: 'All',
            addedDate: '',
            order: 1,
            entityStatus: 'idle',
        },
        {
            id: 'todolistId2',
            title: 'What to buy',
            filter: 'All',
            addedDate: '',
            order: 0,
            entityStatus: 'loading',
        }
    ],
    tasks: {
        ['todolistId1']: [
            {
                id: v1(),
                title: 'HTML',
                status: TaskStatuses.Completed,
                todoListId: 'todolistId1',
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 1,
                description: '',
                priority: TaskPriorities.Low,
            },
            {
                id: v1(),
                status: TaskStatuses.New,
                title: 'React',
                todoListId: 'todolistId1',
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 0,
                description: '',
                priority: TaskPriorities.Low,
            }
        ],
        ['todolistId2']: [
            {
                id: v1(),
                status: TaskStatuses.Completed,
                title: 'Milk',
                todoListId: 'todolistId2',
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 1,
                description: '',
                priority: TaskPriorities.Low,
            },
            {
                id: v1(),
                status: TaskStatuses.New,
                title: 'Meet',
                todoListId: 'todolistId2',
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 1,
                description: '',
                priority: TaskPriorities.Low,
            },
        ]
    },
    app: {
        status: 'succeeded',
        isInitialized: true,
        error: null,
    },
    auth: {
        isLoggedIn: true,
    },
};


export const storyBookStore = configureStore({
    reducer: rootReducer,
    preloadedState: initialGlobalState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunk),
});


export const ReduxStoreProviderDecorator = (storyFn: () => React.ReactNode) => {
    return (
        <Provider store={storyBookStore}>
            <HashRouter>
                {storyFn()}
            </HashRouter>
        </Provider>)
}