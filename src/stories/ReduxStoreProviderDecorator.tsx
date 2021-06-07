import React from 'react';
import {Provider} from 'react-redux';
import {AppRootStateType, store} from '../state/store';
import {v1} from 'uuid';
import {combineReducers, createStore} from 'redux';
import {tasksReducer} from '../state/tasks-reducer';
import {todolistsReducer} from '../state/todolists-reducer';
import {TaskPriorities, TaskStatuses} from '../api/todolist-api';

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer
})

const initialGlobalState = {
    todolists: [
        {
            id: 'todolistId1', title: 'What to learn', filter: 'All', addedDate: '',
            order: 1
        },
        {
            id: 'todolistId2', title: 'What to buy', filter: 'All', addedDate: '',
            order: 0
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
    }
};

export const storyBookStore = createStore(rootReducer, initialGlobalState as AppRootStateType);


export const ReduxStoreProviderDecorator = (storyFn: () => React.ReactNode) => {
    return <Provider store={storyBookStore}>{storyFn()}</Provider>
}