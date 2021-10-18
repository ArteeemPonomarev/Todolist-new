import {authApi} from "../../api/todolist-api";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {FieldErrorType, LoginParamsType} from '../../api/types';
import {handleAsyncServerAppError, handleAsyncServerNetworkError} from "../../utils/error-utils";
import {appActions} from "../CommonActions/App";

const {setAppStatus} = appActions;


export const login = createAsyncThunk<undefined, LoginParamsType,
    { rejectValue: { errors: Array<string>, fieldsErrors?: Array<FieldErrorType> } }>('auth/login', async (param, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({status: 'loading'}))
    try {
        const response = await authApi.login(param);
        if (response.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatus({status: 'succeeded'}))
            return {isLoggedIn: true};
        } else {
            return handleAsyncServerAppError(response.data, thunkAPI)
        }
    } catch (error) {
        return handleAsyncServerNetworkError(error, thunkAPI)
    }
})

export const logout = createAsyncThunk('auth/logout', async (param, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({status: 'loading'}))
    try {
        const res = await authApi.logout()
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatus({status: 'succeeded'}))
            return
        } else {
            return handleAsyncServerAppError(res.data, thunkAPI)
        }
    } catch (error) {
        return handleAsyncServerNetworkError(error, thunkAPI)
    }
})

export const asyncActions = {
    login,
    logout
}


export const slice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false
    },
    reducers: {
        setIsLoggedIn(state, action: PayloadAction<{ value: boolean }>) {
            state.isLoggedIn = action.payload.value;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.fulfilled, (state) => {
                state.isLoggedIn = true;
            })
            .addCase(logout.fulfilled, (state) => {
                state.isLoggedIn = false
            })
    }
})

export const authReducer = slice.reducer;
export const {setIsLoggedIn} = slice.actions;



// thunks

// export const _loginTC = (data: LoginParamsType) => async (dispatch: Dispatch) => {
//     dispatch(setAppStatusAC({status: 'loading'}))
//     try {
//         const response = await authApi.login(data);
//         if (response.data.resultCode === 0) {
//             dispatch(setIsLoggedInAC({value: true}));
//             dispatch(setAppStatusAC({status: 'succeeded'}))
//         } else {
//             handleServerAppError(response.data, dispatch);
//         }
//     } catch(error) {
//         handleServerAppError(error, dispatch)
//     }
// }

// export const logOutTC = () => async (dispatch: Dispatch) => {
//     dispatch(setAppStatus({status: 'loading'}))
//     try {
//         const response = await authApi.logout();
//         if (response.data.resultCode === 0) {
//             dispatch(setIsLoggedInAC({value: false}));
//             dispatch(setAppStatus({status: 'succeeded'}))
//         } else {
//             handleServerAppError(response.data, dispatch);
//         }
//     } catch (error) {
//         handleServerAppError(error, dispatch)
//     }
// }


