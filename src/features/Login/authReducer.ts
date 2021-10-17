import {Dispatch} from 'redux'
import {setAppStatusAC} from '../../app/app-reducer'
import {authApi, LoginParamsType} from "../../api/todolist-api";
import {handleServerAppError} from "../../utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";



export const loginTC = createAsyncThunk<{isLoggedIn: boolean}, LoginParamsType, {}>('auth/login', async (param, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const response = await authApi.login(param);
        if (response.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
            return {isLoggedIn: true};
        } else {
            handleServerAppError(response.data, thunkAPI.dispatch);
            return thunkAPI.rejectWithValue({errors: response.data.messages, fieldsErrors: response.data.fieldsError});
        }
    } catch (error) {
        handleServerAppError(error, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue({errors: [error.message], fieldsErrors: undefined});
    }
})

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

const slice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false
    },
    reducers: {
        setIsLoggedInAC(state, action: PayloadAction<{ value: boolean }>) {
            state.isLoggedIn = action.payload.value;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loginTC.fulfilled, (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn;
        })
    }
})

export const authReducer = slice.reducer;
export const {setIsLoggedInAC} = slice.actions;

// thunks


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
    } catch (error) {
        handleServerAppError(error, dispatch)
    }
}


