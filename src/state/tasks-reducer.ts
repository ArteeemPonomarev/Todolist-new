import {TasksStateType} from '../AppWithRedux';
import {v1} from 'uuid';
import {AddTodoListAT, RemoveTodoListAT, setTodolistsAC} from './todolists-reducer';
import {TaskPriorities, TaskStatuses, TaskType} from '../api/todolist-api';


export type ActionType = ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof changeTaskStatusAC>
    | ReturnType<typeof changeTaskTitleAC>
    | ReturnType<typeof setTodolistsAC>
    | AddTodoListAT
    | RemoveTodoListAT;

const initialState: TasksStateType = {};

export const tasksReducer = (state: TasksStateType = initialState, action: ActionType): TasksStateType => {
    switch (action.type) {
        case 'SET-TODOLISTS':
            const stateCopy = {...state}
            action.todolists.forEach(tl => {
                stateCopy[tl.id] = []
            })
            return stateCopy;
        case 'REMOVE_TASK':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].filter(task => task.id !== action.taskId)
            }
        case 'ADD_TASK':
            let newTask: TaskType = {
                id: v1(),
                title: action.title,
                status: TaskStatuses.New,
                todoListId: action.todolistId,
                startDate: '',
                addedDate: '',
                order: 0,
                priority: TaskPriorities.Low,
                deadline: '',
                description: ''
            }
            return {
                ...state,
                [action.todolistId]: [newTask, ...state[action.todolistId]]
            }
        case 'CHANGE_TASK_STATUS':
            let tasksWithNewStatus = state[action.todolistId].map(t => t.id === action.taskId ? {
                ...t,
                status: action.status
            } : {...t})
            return {
                ...state,
                [action.todolistId]: tasksWithNewStatus
            }
        case 'CHANGE_TASK_TITLE':
            let tasksWithNewTitle = state[action.todolistId].map(t => t.id === action.taskId ? {
                ...t,
                title: action.title
            } : {...t})
            return {
                ...state,
                [action.todolistId]: tasksWithNewTitle
            }
        case 'ADD-TODOLIST':
            return {
                ...state,
                [action.id]: []
            }
        case 'REMOVE-TODOLIST':
            let copyState = {...state};
            delete copyState[action.todoListID]
            return copyState
        default:
            return state
    }
}

export const removeTaskAC = (taskId: string, todolistId: string) => {
    return {
        type: 'REMOVE_TASK',
        taskId,
        todolistId
    } as const
}


export const addTaskAC = (title: string, todolistId: string) => {
    return {
        type: 'ADD_TASK',
        todolistId,
        title
    } as const
}


export const changeTaskStatusAC = (taskId: string, status: TaskStatuses, todolistId: string) => {
    return {
        type: 'CHANGE_TASK_STATUS',
        status,
        taskId,
        todolistId
    } as const
}

export const changeTaskTitleAC = (taskId: string, title: string, todolistId: string) => {
    return {
        type: 'CHANGE_TASK_TITLE',
        todolistId,
        taskId,
        title
    } as const
}