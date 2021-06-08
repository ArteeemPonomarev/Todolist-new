import {Dispatch} from 'redux';
import {todoApi, TodolistType} from '../api/todolist-api';

export type RemoveTodoListAT = ReturnType<typeof removeTodolistAC>;

export type AddTodoListAT = ReturnType<typeof addTodolistAC>;

export type FilterValuesType = 'All' | 'Active' | 'Completed';

export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
}

export type ActionType = RemoveTodoListAT
    | AddTodoListAT
    | ReturnType<typeof changeTodoListTitleAC>
    | ReturnType<typeof changeTodoListFilterAC>
    | SetTodolistsActionType;


const initialState: Array<TodolistDomainType> = [];

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: ActionType): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'SET-TODOLISTS':
            return action.todolists.map(tl => ({...tl, filter: 'All'}))
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.todoListID)
        case 'ADD-TODOLIST':
            return [{...action.todolist, filter: 'Active'}, ...state]
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(tl => tl.id === action.todoListID ? {...tl, title: action.title} : tl)
        case  'CHANGE-TODOLIST-FILTER':
            return state.map(tl => tl.id === action.todoListID ? {...tl, filter: action.newFilterValue} : tl)
        default:
            return state
    }
}

export const removeTodolistAC = (todoListID: string) => {
    return {
        type: 'REMOVE-TODOLIST',
        todoListID
    } as const
}
export const addTodolistAC = (title: string, todolist: TodolistType) => {
    return {
        type: 'ADD-TODOLIST',
        title,
        todolist
    } as const
}
export const changeTodoListTitleAC = (title: string, todoListID: string) => {
    return {
        type: 'CHANGE-TODOLIST-TITLE',
        title,
        todoListID
    } as const
}
export const changeTodoListFilterAC = (todoListID: string, newFilterValue: FilterValuesType) => {
    return {
        type: 'CHANGE-TODOLIST-FILTER',
        newFilterValue,
        todoListID
    } as const
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

export const deleteTodolistTC = (todolistId: string) => (dispatch: Dispatch) => {
    todoApi.deleteTodo(todolistId)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(removeTodolistAC(todolistId))
            }
        })
}

export const createTodolistTC = (title: string) => (dispatch: Dispatch) => {
    todoApi.createTodo(title)
        .then(res => {
            dispatch(addTodolistAC(title, res.data.data.item))
        })
}

export const updateTodolistTC = (title: string, todolistId: string) => (dispatch: Dispatch) => {
    todoApi.updateTodoTitle(todolistId, title)
        .then(() => {
            dispatch(changeTodoListTitleAC(title, todolistId))
        })
}