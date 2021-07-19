import {Dispatch} from 'redux';
import {todoApi, TodolistType} from '../../api/todolist-api';
import {
    RequestStatusType,
    setAppErrorAC,
    SetAppErrorType,
    setAppStatusAC,
    SetAppStatusType
} from '../../app/app-reducer';


const initialState: Array<TodolistDomainType> = [];

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: ActionsType): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'CHANGE-TODOLIST-ENTITY-STATUS':
            return state.map(tl => tl.id === action.todolistId ? {...tl, entityStatus: action.entityStatus} : tl)
        case 'SET-TODOLISTS':
            return action.todolists.map(tl => ({...tl, filter: 'All', entityStatus: 'idle'}))
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.todoListID)
        case 'ADD-TODOLIST':
            return [{...action.todolist, filter: 'Active', entityStatus: 'idle'}, ...state]
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(tl => tl.id === action.todoListID ? {...tl, title: action.title} : tl)
        case  'CHANGE-TODOLIST-FILTER':
            return state.map(tl => tl.id === action.todoListID ? {...tl, filter: action.newFilterValue} : tl)
        default:
            return state
    }
}

//Action Creators
export const removeTodolistAC = (todoListID: string) =>
    ({type: 'REMOVE-TODOLIST', todoListID} as const)
export const addTodolistAC = (title: string, todolist: TodolistType) =>
    ({type: 'ADD-TODOLIST', title, todolist} as const)
export const changeTodoListTitleAC = (title: string, todoListID: string) =>
    ({type: 'CHANGE-TODOLIST-TITLE', title, todoListID} as const)
export const changeTodoListFilterAC = (todoListID: string, newFilterValue: FilterValuesType) =>
    ({type: 'CHANGE-TODOLIST-FILTER', newFilterValue, todoListID} as const)
export const setTodolistsAC = (todolists: TodolistType[]) =>
    ({type: 'SET-TODOLISTS', todolists} as const)
export const changeTodolistEntityStatusAC = (todolistId: string, entityStatus: RequestStatusType) =>
    ({type: 'CHANGE-TODOLIST-ENTITY-STATUS', todolistId, entityStatus} as const)


//Thunks
export const fetchTodolistsTC = () =>
    (dispatch: Dispatch<ActionsType | SetAppStatusType>) => {
        dispatch(setAppStatusAC('loading'))
        todoApi.getTodos()
            .then(res => {
                dispatch(setTodolistsAC(res.data))
                dispatch(setAppStatusAC('succeeded'))
            })
    }
export const deleteTodolistTC = (todolistId: string) =>
    (dispatch: Dispatch<ActionsType | SetAppStatusType>) => {
        dispatch(setAppStatusAC('loading'))
        dispatch(changeTodolistEntityStatusAC(todolistId, 'loading'))
        todoApi.deleteTodo(todolistId)
            .then(res => {
                if (res.data.resultCode === 0) {
                    dispatch(removeTodolistAC(todolistId))
                    dispatch(setAppStatusAC('succeeded'))
                }
            })
    }
export const createTodolistTC = (title: string) =>
    (dispatch: Dispatch<ActionsType | SetAppStatusType | SetAppErrorType>) => {
        todoApi.createTodo(title)
            .then(res => {
                if (res.data.resultCode === 0) {
                    dispatch(addTodolistAC(title, res.data.data.item))
                    dispatch(setAppStatusAC('succeeded'))
                } else {
                    if (res.data.messages.length) {
                        dispatch(setAppErrorAC(res.data.messages[0]))
                    }
                    dispatch(setAppStatusAC('failed'))
                }
            })
    }
export const updateTodolistTitleTC = (title: string, todolistId: string) =>
    (dispatch: Dispatch<ActionsType | SetAppStatusType | SetAppErrorType>) => {
        dispatch(setAppStatusAC('loading'))
        todoApi.updateTodoTitle(todolistId, title)
            .then((res) => {
                if (res.data.resultCode === 0) {
                    dispatch(changeTodoListTitleAC(title, todolistId))
                    dispatch(setAppStatusAC('succeeded'))
                } else {
                    if (res.data.messages.length) {
                        dispatch(setAppErrorAC(res.data.messages[0]))
                    }
                    dispatch(setAppStatusAC('failed'))
                }
            })
    }

//types
export type RemoveTodoListAT = ReturnType<typeof removeTodolistAC>;
export type AddTodoListAT = ReturnType<typeof addTodolistAC>;
export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>
export type FilterValuesType = 'All' | 'Active' | 'Completed';
export type TodolistDomainType = TodolistType & { filter: FilterValuesType, entityStatus: RequestStatusType };

export type ActionsType = ReturnType<typeof changeTodoListTitleAC>
    | ReturnType<typeof changeTodoListFilterAC>
    | ReturnType<typeof changeTodolistEntityStatusAC>
    | RemoveTodoListAT
    | AddTodoListAT
    | SetTodolistsActionType;
