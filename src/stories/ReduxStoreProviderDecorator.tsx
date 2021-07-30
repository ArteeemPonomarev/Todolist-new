import React from 'react';
import {Provider} from 'react-redux';
import {AppRootStateType} from '../app/store';
import {v1} from 'uuid';
import {applyMiddleware, combineReducers, createStore} from 'redux';
import {tasksReducer} from '../features/TodolistsList/tasks-reducer';
import {todolistsReducer} from '../features/TodolistsList/todolists-reducer';
import {TaskPriorities, TaskStatuses} from '../api/todolist-api';
import {appReducer} from '../app/app-reducer';
import thunk from "redux-thunk";

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer
})

 const initialGlobalState = {
    todolists: [
        {
            id: 'todolistId1', title: 'What to learn', filter: 'All', addedDate: '',
            order: 1, entityStatus: 'idle'
        },
        {
            id: 'todolistId2', title: 'What to buy', filter: 'All', addedDate: '',
            order: 0, entityStatus: 'loading'
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
                priority: TaskPriorities.Low
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
                priority: TaskPriorities.Low
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
                priority: TaskPriorities.Low
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
                priority: TaskPriorities.Low
            }
        ]
    },
    app: {status: 'idle', error: null}
};

export const storyBookStore = createStore(rootReducer, initialGlobalState as AppRootStateType, applyMiddleware(thunk));


export const ReduxStoreProviderDecorator = (storyFn: () => React.ReactNode) => {
    return <Provider store={storyBookStore}>{storyFn()}</Provider>
}