import {Dispatch} from 'redux';
import {todoApi, TodolistType} from '../../api/todolist-api';


const initialState: Array<TodolistDomainType> = [];

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: ActionsType): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'SET-TODOLISTS':
            return action.todolists.map(tl => ({...tl, filter: 'All'}))
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.todoListID)
        case 'ADD-TODOLIST':
            return [{...action.todolist, filter: 'Active'}, ...state]
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


//Thunks
export const fetchTodolistsTC = () => (dispatch: Dispatch<ActionsType>) => {
    todoApi.getTodos()
        .then(res => {
            dispatch(setTodolistsAC(res.data))
        })
}
export const deleteTodolistTC = (todolistId: string) => (dispatch: Dispatch<ActionsType>) => {
    todoApi.deleteTodo(todolistId)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(removeTodolistAC(todolistId))
            }
        })
}
export const createTodolistTC = (title: string) => (dispatch: Dispatch<ActionsType>) => {
    todoApi.createTodo(title)
        .then(res => {
            dispatch(addTodolistAC(title, res.data.data.item))
        })
}
export const updateTodolistTC = (title: string, todolistId: string) => (dispatch: Dispatch<ActionsType>) => {
    todoApi.updateTodoTitle(todolistId, title)
        .then(() => {
            dispatch(changeTodoListTitleAC(title, todolistId))
        })
}

//types
export type RemoveTodoListAT = ReturnType<typeof removeTodolistAC>;
export type AddTodoListAT = ReturnType<typeof addTodolistAC>;
export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>
export type FilterValuesType = 'All' | 'Active' | 'Completed';
export type TodolistDomainType = TodolistType & { filter: FilterValuesType };

export type ActionsType = ReturnType<typeof changeTodoListTitleAC>
    | ReturnType<typeof changeTodoListFilterAC>
    | RemoveTodoListAT
    | AddTodoListAT
    | SetTodolistsActionType;
