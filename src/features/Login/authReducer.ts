import { Dispatch } from 'redux'
import { SetAppErrorType, SetAppStatusType, setAppStatusAC } from '../../app/app-reducer'
import {authApi, LoginParamsType} from "../../api/todolist-api";
import {handleServerAppError} from "../../utils/error-utils";

const initialState = {
    isLoggedIn: false
}
type InitialStateType = typeof initialState

export const authReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'login/SET-IS-LOGGED-IN':
            return {...state, isLoggedIn: action.value}
        default:
            return state
    }
}

// actions
export const setIsLoggedInAC = (value: boolean) =>
    ({type: 'login/SET-IS-LOGGED-IN', value} as const)

// thunks
export const loginTC = (data: LoginParamsType) => async (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    try {
        const response = await authApi.login(data);
        if (response.data.resultCode === 0) {
            dispatch(setIsLoggedInAC(true));
            dispatch(setAppStatusAC('succeeded'))
        } else {
            handleServerAppError(response.data, dispatch);
        }
    } catch(error) {
        handleServerAppError(error, dispatch)
    }
}

export const logOutTC = () => async (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    try {
        const response = await authApi.logout();
        if (response.data.resultCode === 0) {
            dispatch(setIsLoggedInAC(false));
            dispatch(setAppStatusAC('succeeded'))
        } else {
            handleServerAppError(response.data, dispatch);
        }
    } catch(error) {
        handleServerAppError(error, dispatch)
    }
}

// types
type ActionsType = ReturnType<typeof setIsLoggedInAC> | SetAppErrorType | SetAppStatusType;
