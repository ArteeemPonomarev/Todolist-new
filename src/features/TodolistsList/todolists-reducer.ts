import {todoApi} from '../../api/todolist-api';
import {RequestStatusType} from '../Application/app-reducer';
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {appActions} from '../CommonActions/App';
import {ThunkError} from '../../utils/types';
import {TodolistType} from '../../api/types';
import {handleAsyncServerAppError, handleAsyncServerNetworkError} from '../../utils/error-utils';

const {setAppStatus} = appActions

export const fetchTodolistsTC = createAsyncThunk<{ todolists: TodolistType[] }, undefined, ThunkError>('todolists/fetchTodolists', async (param, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({status: 'loading'}))
    try {
        const res = await todoApi.getTodos();

        thunkAPI.dispatch(setAppStatus({status: 'succeeded'}))
        return {todolists: res.data}

    } catch (error) {
        return handleAsyncServerNetworkError(error, thunkAPI)
    }
})
export const deleteTodolistTC = createAsyncThunk<{ id: string }, string, ThunkError>('todolists/removeTodolist', async (todolistId, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({status: 'loading'}))
    thunkAPI.dispatch(changeTodolistEntityStatus({todolistId, entityStatus: 'loading'}))
    try {
        const res = await todoApi.deleteTodo(todolistId)
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatus({status: 'succeeded'}))
            return {id: todolistId}
        } else {
            return handleAsyncServerAppError(res.data, thunkAPI, false)
        }
    } catch (error) {
        return handleAsyncServerNetworkError(error, thunkAPI, false)
    }
})

export const createTodolistTC = createAsyncThunk<{ todolist: TodolistType }, string, ThunkError>
('todolists/createTodolist', async (title, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({status: 'loading'}))
    try {
        const res = await todoApi.createTodo(title)
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatus({status: 'succeeded'}))
            return {todolist: res.data.data.item}
        } else {
            return handleAsyncServerAppError(res.data, thunkAPI, false)
        }
    } catch (error) {
        return handleAsyncServerNetworkError(error, thunkAPI, false)
    }
})

export const updateTodolistTitleTC = createAsyncThunk('todolists/changeTodolistTitle', async (param: { id: string, title: string }, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({status: 'loading'}))
    try {
        const res = await todoApi.updateTodoTitle(param.id, param.title)
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatus({status: 'succeeded'}))
            return {id: param.id, title: param.title}
        } else {
            return handleAsyncServerAppError(res.data, thunkAPI)
        }
    } catch (error) {
        return handleAsyncServerNetworkError(error, thunkAPI, false)
    }
})

export const asyncActions = {
    fetchTodolistsTC,
    deleteTodolistTC,
    createTodolistTC,
    updateTodolistTitleTC
}

export const slice = createSlice({
    name: 'todolists',
    initialState: [] as Array<TodolistDomainType>,
    reducers: {
        changeTodolistFilter(state, action: PayloadAction<{ todoListID: string, newFilterValue: FilterValuesType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todoListID);
            state[index].filter = action.payload.newFilterValue;
        },
        changeTodolistEntityStatus(state, action: PayloadAction<{ todolistId: string, entityStatus: RequestStatusType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId);
            state[index].entityStatus = action.payload.entityStatus;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchTodolistsTC.fulfilled, (state, action) => {
                return action.payload.todolists.map((tl) => ({...tl, filter: 'All', entityStatus: 'idle'}))
            })
            .addCase(deleteTodolistTC.fulfilled, (state, action) => {
                const index = state.findIndex(tl => tl.id === action.payload.id)
                if (index > -1) {
                    state.splice(index, 1)
                }
            })
            .addCase(createTodolistTC.fulfilled, (state, action) => {
                state.unshift({...action.payload.todolist, filter: 'All', entityStatus: 'idle'})
            })
            .addCase(updateTodolistTitleTC.fulfilled, (state, action) => {
                const index = state.findIndex(tl => tl.id === action.payload.id)
                state[index].title = action.payload.title
            })
    }
})


export const {changeTodolistFilter, changeTodolistEntityStatus} = slice.actions

//types
export type FilterValuesType = 'All' | 'Active' | 'Completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType,
    entityStatus: RequestStatusType
};


//Thunks
// export const fetchTodolistsTC = () =>
//     (dispatch: Dispatch) => {
//         dispatch(setAppStatusAC({status: 'loading'}))
//         todoApi.getTodos()
//             .then(res => {
//                 dispatch(setTodolistsAC({todolists: res.data}))
//                 dispatch(setAppStatusAC({status: 'succeeded'}))
//             })
//             .catch((error) => {
//                 handleServerNetworkError(error, dispatch)
//             })
//     }
// export const deleteTodolistTC = (todolistId: string) =>
//     (dispatch: Dispatch) => {
//         dispatch(setAppStatusAC({status: 'loading'}))
//         dispatch(changeTodolistEntityStatusAC({todolistId, entityStatus: 'loading'}))
//         todoApi.deleteTodo(todolistId)
//             .then(res => {
//                 if (res.data.resultCode === 0) {
//                     dispatch(removeTodolistAC({todoListID: todolistId}))
//                     dispatch(setAppStatusAC({status: 'succeeded'}))
//                 } else {
//                     handleServerAppError(res.data, dispatch)
//                 }
//             })
//             .catch((error) => {
//                 handleServerNetworkError(error, dispatch)
//             })
//     }
// export const createTodolistTC = (title: string) =>
//     (dispatch: Dispatch) => {
//         dispatch(setAppStatusAC({status: 'loading'}))
//         todoApi.createTodo(title)
//             .then(res => {
//                 if (res.data.resultCode === 0) {
//                     dispatch(addTodolistAC({todolist: res.data.data.item}))
//                     dispatch(setAppStatusAC({status: 'succeeded'}))
//                 } else {
//                     handleServerAppError(res.data, dispatch)
//                 }
//             })
//             .catch((error) => {
//                 handleServerNetworkError(error, dispatch)
//             })
//     }
// export const updateTodolistTitleTC = (title: string, todolistId: string) =>
//     (dispatch: Dispatch) => {
//         dispatch(setAppStatusAC({status: 'loading'}))
//         todoApi.updateTodoTitle(todolistId, title)
//             .then((res) => {
//                 if (res.data.resultCode === 0) {
//                     dispatch(changeTodoListTitleAC({title, todoListID: todolistId}))
//                     dispatch(setAppStatusAC({status: 'succeeded'}))
//                 } else {
//                     handleServerAppError(res.data, dispatch)
//                 }
//             })
//             .catch((error) => {
//                 handleServerNetworkError(error, dispatch)
//             })
//     }