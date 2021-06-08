import {TasksStateType} from '../AppWithRedux';
import {v1} from 'uuid';
import {AddTodoListAT, RemoveTodoListAT, setTodolistsAC} from './todolists-reducer';
import {TaskPriorities, TaskStatuses, TaskType, todoApi} from '../api/todolist-api';
import { Dispatch } from 'redux';


export type ActionType = ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof changeTaskStatusAC>
    | ReturnType<typeof changeTaskTitleAC>
    | ReturnType<typeof setTodolistsAC>
    | ReturnType<typeof setTasksAC>
    | AddTodoListAT
    | RemoveTodoListAT;

const initialState: TasksStateType = {};

export const tasksReducer = (state: TasksStateType = initialState, action: ActionType): TasksStateType => {
    switch (action.type) {
        case 'SET_TASKS':
            return {...state, [action.todolistId]: action.tasks}
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
            return {
                ...state,
                [action.todolistId]: [action.task, ...state[action.todolistId]]
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
                [action.todolistId]: []
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


export const addTaskAC = (task: TaskType, todolistId: string) => {
    return {
        type: 'ADD_TASK',
        todolistId,
        task
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

export const setTasksAC = (tasks: Array<TaskType>, todolistId: string) => {
    return {
        type: 'SET_TASKS',
        todolistId,
        tasks
    } as const
}
//Thunks

export const fetchTasksTC = (todolistId: string) => (dispatch: Dispatch) => {
    todoApi.getTasks(todolistId)
        .then(res => {
            dispatch(setTasksAC(res.data.items, todolistId))
        })
}

export const removeTaskTC = (todolistId: string, taskId: string) => (dispatch: Dispatch) => {
    todoApi.deleteTask(todolistId, taskId)
        .then(res => {
            dispatch(removeTaskAC(taskId, todolistId))
        })
}

export const createTaskTC = (todolistId: string, title: string) => (dispatch: Dispatch) => {
    todoApi.createTask(todolistId, title)
        .then(res => {
            dispatch(addTaskAC(res.data.data.item,todolistId))
        })
}