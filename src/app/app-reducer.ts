import {Dispatch} from "redux"
import {authApi} from "../api/todolist-api";
import {setIsLoggedInAC} from "../features/Login/authReducer";
import {handleServerAppError} from "../utils/error-utils";

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
    status: 'loading' as RequestStatusType,
    error: null as string | null,
    isInitialized: false
}

export type InitialStateType = typeof initialState

export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case 'APP/SET-ERROR':
            return {...state, error: action.error}
        case 'APP/SET-INITIALIZE':
            return {...state, isInitialized: action.isInitialized}
        default:
            return state
    }
}

//Action creators
export const setAppStatusAC = (status: RequestStatusType) =>
    ({type: 'APP/SET-STATUS', status} as const)
export const setAppErrorAC = (error: string | null) =>
    ({type: 'APP/SET-ERROR', error} as const)
export const setInitializedApp = (isInitialized: boolean) =>
    ({type: 'APP/SET-INITIALIZE', isInitialized} as const)


//thunks
export const initializeApp = () => async (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    try {
        const response = await authApi.autMe();
        if (response.data.resultCode === 0) {
            dispatch(setIsLoggedInAC(true))
            dispatch(setAppStatusAC('succeeded'))
        } else {
            handleServerAppError(response.data, dispatch);
        }
    } catch (error) {
        handleServerAppError(error, dispatch)
    } finally {
        dispatch(setInitializedApp(true))
    }
}

//types
export type SetAppStatusType = ReturnType<typeof setAppStatusAC>
export type SetAppErrorType = ReturnType<typeof setAppErrorAC>

type ActionsType = SetAppStatusType
    | SetAppErrorType
    | ReturnType<typeof setIsLoggedInAC>
    | ReturnType<typeof setInitializedApp>;