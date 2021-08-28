import {Dispatch} from 'redux'
import {setAppStatusAC} from '../../app/app-reducer'
import {authApi, LoginParamsType} from "../../api/todolist-api";
import {handleServerAppError} from "../../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState = {
    isLoggedIn: false
}

const slice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setIsLoggedInAC (state, action: PayloadAction<{value: boolean}>) {
            state.isLoggedIn = action.payload.value;
        }
    }
})

export const authReducer = slice.reducer;
export const {setIsLoggedInAC} = slice.actions;

// thunks
export const loginTC = (data: LoginParamsType) => async (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const response = await authApi.login(data);
        if (response.data.resultCode === 0) {
            dispatch(setIsLoggedInAC({value: true}));
            dispatch(setAppStatusAC({status: 'succeeded'}))
        } else {
            handleServerAppError(response.data, dispatch);
        }
    } catch(error) {
        handleServerAppError(error, dispatch)
    }
}

export const logOutTC = () => async (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const response = await authApi.logout();
        if (response.data.resultCode === 0) {
            dispatch(setIsLoggedInAC({value: false}));
            dispatch(setAppStatusAC({status: 'succeeded'}))
        } else {
            handleServerAppError(response.data, dispatch);
        }
    } catch(error) {
        handleServerAppError(error, dispatch)
    }
}


