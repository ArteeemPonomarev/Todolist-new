import {TasksStateType, TaskType} from '../AppWithRedux';
import {v1} from 'uuid';
import {AddTodoListAT, RemoveTodoListAT} from './todolists-reducer';

type RemoveTaskActionType = {
    type: "REMOVE_TASK"
    taskId: string
    todolistId: string
}

type AddTaskActionType = {
    type: "ADD_TASK"
    title: string
    todolistId: string
}

type ChangeTaskStatusType = {
    type: 'CHANGE_TASK_STATUS'
    todolistId: string
    taskId: string
    isDone: boolean
}

type ChangeTaskTitleType = {
    type: 'CHANGE_TASK_TITLE'
    todolistId: string
    taskId: string
    title: string
}

export type ActionType = RemoveTaskActionType
    | AddTaskActionType
    | ChangeTaskStatusType
    | ChangeTaskTitleType
    | AddTodoListAT
    | RemoveTodoListAT;

const initialState: TasksStateType = {

};

export const tasksReducer = (state: TasksStateType = initialState, action: ActionType): TasksStateType => {
    switch(action.type) {
        case 'REMOVE_TASK':
           return {
               ...state,
               [action.todolistId]: state[action.todolistId].filter(task => task.id !== action.taskId)}
        case 'ADD_TASK':
            let newTask: TaskType = {
                id: v1(),
                title: action.title,
                isDone: false
            }
            return {
                ...state,
                [action.todolistId]: [newTask, ...state[action.todolistId]]}
        case 'CHANGE_TASK_STATUS':
            let tasksWithNewStatus = state[action.todolistId].map(t => t.id === action.taskId ? {...t, isDone: action.isDone} : {...t})
            return {
                ...state,
                [action.todolistId]: tasksWithNewStatus}
        case 'CHANGE_TASK_TITLE':
            let tasksWithNewTitle = state[action.todolistId].map(t => t.id === action.taskId ? {...t, title: action.title} : {...t})
            return {
                ...state,
                [action.todolistId]: tasksWithNewTitle}
        case 'ADD-TODOLIST':
            return {
                ...state,
                [action.id]: []}
        case 'REMOVE-TODOLIST':
            let copyState = {...state};
            delete copyState[action.todoListID]
            return copyState
        default:
            return state
    }
}

export const removeTaskAC = (taskId: string, todolistId: string): RemoveTaskActionType => {
    return {
        type: 'REMOVE_TASK',
        taskId,
        todolistId
    } as const
}

export const addTaskAC = (title: string, todolistId: string): AddTaskActionType => {
    return {
        type: 'ADD_TASK',
        todolistId,
        title
    } as const
}

export const changeTaskStatusAC = (taskId: string, isDone: boolean, todolistId: string): ChangeTaskStatusType => {
    return {
        type: 'CHANGE_TASK_STATUS',
        isDone,
        taskId,
        todolistId
    } as const
}

export const changeTaskTitleAC = (taskId: string, title: string, todolistId: string): ChangeTaskTitleType => {
    return {
        type: 'CHANGE_TASK_TITLE',
        todolistId,
        taskId,
        title
    } as const
}