import {v1} from 'uuid';
import {Dispatch} from 'redux';
import {todoApi, TodolistType} from '../api/todolist-api';

export type RemoveTodoListAT = ReturnType<typeof removeTodolistAC>
export type AddTodoListAT = ReturnType<typeof addTodolistAC>

export type FilterValuesType = 'All' | 'Active' | 'Completed';

export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
}

export type ActionType = RemoveTodoListAT
    | AddTodoListAT
    | ReturnType<typeof changeTodoListTitleAC>
    | ReturnType<typeof changeTodoListFilterAC>
    | SetTodolistsActionType;

export const removeTodolistAC = (todoListID: string) => {
    return {type: 'REMOVE-TODOLIST', todoListID} as const
}
export const addTodolistAC = (title: string) => {
    return {type: 'ADD-TODOLIST', title, id: v1()} as const
}
export const changeTodoListTitleAC = (title: string, todoListID: string) => {
    return {type: 'CHANGE-TODOLIST-TITLE', title, todoListID} as const
}
export const changeTodoListFilterAC = (todoListID: string, newFilterValue: FilterValuesType) => {
    return {type: 'CHANGE-TODOLIST-FILTER', newFilterValue, todoListID} as const
}

const initialState: Array<TodolistDomainType> = [];

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: ActionType): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'SET-TODOLISTS':
            return action.todolists.map(tl => ({...tl, filter: 'All'}))
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.todoListID)
        case 'ADD-TODOLIST':
            const newTodoList: TodolistDomainType = {
                id: action.id,
                title: action.title,
                filter: 'All',
                addedDate: '',
                order: 0
            };
            return [...state, newTodoList]
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(tl => tl.id === action.todoListID ? {...tl, title: action.title} : tl)
        case  'CHANGE-TODOLIST-FILTER':
            return state.map(tl => tl.id === action.todoListID ? {...tl, filter: action.newFilterValue} : tl)
        default:
            return state
    }
}

export const setTodolistsAC = (todolists: TodolistType[]) => {
    return {
        type: 'SET-TODOLISTS',
        todolists
    } as const
}

export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>

//Thunks

export const fetchTodolistsTC = () => (dispatch: Dispatch) => {
    todoApi.getTodos()
        .then(res => {
            dispatch(setTodolistsAC(res.data))
        })
}