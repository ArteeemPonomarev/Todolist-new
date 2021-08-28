import {Dispatch} from 'redux';
import {todoApi, TodolistType} from '../../api/todolist-api';
import {RequestStatusType, setAppStatusAC} from '../../app/app-reducer';
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";


const initialState: Array<TodolistDomainType> = [];

const slice = createSlice({
    name: 'todolists',
    initialState,
    reducers: {
        removeTodolistAC (state, action: PayloadAction<{todoListID: string}>) {
            const index = state.findIndex(tl => tl.id === action.payload.todoListID);
            if (index > -1) {
                state.splice(index, 1);
            }
        },
        addTodolistAC (state, action: PayloadAction<{todolist: TodolistType}>) {
            state.unshift({...action.payload.todolist, filter: 'All', entityStatus: 'idle'})
        },
        changeTodoListTitleAC (state, action: PayloadAction<{title: string, todoListID: string}>) {
            const index = state.findIndex(tl => tl.id === action.payload.todoListID);
            state[index].title = action.payload.title;
        },
        changeTodoListFilterAC (state, action: PayloadAction<{todoListID: string, newFilterValue: FilterValuesType}>) {
            const index = state.findIndex(tl => tl.id === action.payload.todoListID);
            state[index].filter = action.payload.newFilterValue;
        },
        setTodolistsAC (state, action: PayloadAction<{todolists: TodolistType[]}>) {
            return action.payload.todolists.map(tl => ({...tl, filter: 'All', entityStatus: 'idle'}))
        },
        changeTodolistEntityStatusAC (state, action: PayloadAction<{todolistId: string, entityStatus: RequestStatusType}>) {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId);
            state[index].entityStatus = action.payload.entityStatus;
        }
    }
})

export const todolistsReducer = slice.reducer;

export const {
    addTodolistAC,
    removeTodolistAC,
    setTodolistsAC,
    changeTodolistEntityStatusAC,
    changeTodoListFilterAC,
    changeTodoListTitleAC } = slice.actions;

//Thunks
export const fetchTodolistsTC = () =>
    (dispatch: Dispatch) => {
        dispatch(setAppStatusAC({status: 'loading'}))
        todoApi.getTodos()
            .then(res => {
                dispatch(setTodolistsAC({todolists: res.data}))
                dispatch(setAppStatusAC({status: 'succeeded'}))
            })
            .catch((error) => {
                handleServerNetworkError(error, dispatch)
            })
    }
export const deleteTodolistTC = (todolistId: string) =>
    (dispatch: Dispatch) => {
        dispatch(setAppStatusAC({status: 'loading'}))
        dispatch(changeTodolistEntityStatusAC({todolistId, entityStatus: 'loading'}))
        todoApi.deleteTodo(todolistId)
            .then(res => {
                if (res.data.resultCode === 0) {
                    dispatch(removeTodolistAC({todoListID: todolistId}))
                    dispatch(setAppStatusAC({status: 'succeeded'}))
                } else {
                    handleServerAppError(res.data, dispatch)
                }
            })
            .catch((error) => {
                handleServerNetworkError(error, dispatch)
            })
    }
export const createTodolistTC = (title: string) =>
    (dispatch: Dispatch) => {
        dispatch(setAppStatusAC({status: 'loading'}))
        todoApi.createTodo(title)
            .then(res => {
                if (res.data.resultCode === 0) {
                    dispatch(addTodolistAC({todolist: res.data.data.item}))
                    dispatch(setAppStatusAC({status: 'succeeded'}))
                } else {
                    handleServerAppError(res.data, dispatch)
                }
            })
            .catch((error) => {
                handleServerNetworkError(error, dispatch)
            })
    }
export const updateTodolistTitleTC = (title: string, todolistId: string) =>
    (dispatch: Dispatch) => {
        dispatch(setAppStatusAC({status: 'loading'}))
        todoApi.updateTodoTitle(todolistId, title)
            .then((res) => {
                if (res.data.resultCode === 0) {
                    dispatch(changeTodoListTitleAC({title,todoListID: todolistId}))
                    dispatch(setAppStatusAC({status: 'succeeded'}))
                } else {
                    handleServerAppError(res.data, dispatch)
                }
            })
            .catch((error) => {
                handleServerNetworkError(error, dispatch)
            })
    }

//types
export type RemoveTodoListAT = ReturnType<typeof removeTodolistAC>;
export type FilterValuesType = 'All' | 'Active' | 'Completed';
export type TodolistDomainType = TodolistType & { filter: FilterValuesType, entityStatus: RequestStatusType };

