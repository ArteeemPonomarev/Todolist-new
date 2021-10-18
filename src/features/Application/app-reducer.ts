import {authApi} from "../../api/todolist-api";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {authActions} from "../Auth";
import {appActions} from "../CommonActions/App";


const initializeApp = createAsyncThunk('app/initializeApp', async (param, {dispatch}) => {
    const res = await authApi.autMe();
    if (res.data.resultCode === 0) {
        dispatch(authActions.setIsLoggedIn({value: true}))
    } else {

    }
})

export const asyncActions = {
    initializeApp
}


export const slice = createSlice({
    name: 'app',
    initialState: {
        status: 'idle',
        error: null,
        isInitialized: false
    } as InitialStateType,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(initializeApp.fulfilled, (state, action) => {
                state.isInitialized = true
            })
            .addCase(appActions.setAppStatus, (state, action) => {
                state.status = action.payload.status
            })
            .addCase(appActions.setAppError, (state, action) => {
                state.error = action.payload.error
            })
    }
})


//types
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

export type InitialStateType = {
    status: RequestStatusType
    error: string | null
    isInitialized: boolean
}



