import {Dispatch} from "redux"
import {authApi} from "../api/todolist-api";
import {setIsLoggedInAC} from "../features/Login/authReducer";
import {handleServerAppError} from "../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as string | null,
    isInitialized: false
}

export type InitialStateType = typeof initialState;

const slice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setAppStatusAC(state, action: PayloadAction<{status: RequestStatusType}>) {
            state.status = action.payload.status;
        },
        setAppErrorAC(state, action: PayloadAction<{error: string | null}>) {
            state.error = action.payload.error;
        },
        setInitializedApp(state, action: PayloadAction<{isInitialized: boolean}>) {
            state.isInitialized = action.payload.isInitialized;
        }
    }
})

export const appReducer = slice.reducer;
export const {setAppStatusAC, setAppErrorAC, setInitializedApp} = slice.actions;


//thunks
export const initializeApp = () => async (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const response = await authApi.autMe();
        if (response.data.resultCode === 0) {
            dispatch(setIsLoggedInAC({value: true}))
            dispatch(setAppStatusAC({status: 'succeeded'}))
        } else {
            handleServerAppError(response.data, dispatch);
        }
    } catch (error) {
        handleServerAppError(error, dispatch)
    } finally {
        dispatch(setInitializedApp({isInitialized: true}))
    }
}

//types
export type SetAppStatusType = ReturnType<typeof setAppStatusAC>
export type SetAppErrorType = ReturnType<typeof setAppErrorAC>
