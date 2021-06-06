import {FilterValuesType, TodoListType} from '../AppWithRedux';
import {v1} from 'uuid';

export type RemoveTodoListAT = ReturnType<typeof removeTodolistAC>

export type AddTodoListAT = ReturnType<typeof addTodolistAC>


export type ActionType = RemoveTodoListAT
    | AddTodoListAT
    | ReturnType<typeof changeTodoListTitleAC>
    | ReturnType<typeof changeTodoListFilterAC>;

export const removeTodolistAC = (todoListID: string) => {
    return {type: 'REMOVE-TODOLIST', todoListID} as const
}
export const addTodolistAC = (title: string) => {
    return {type: 'ADD-TODOLIST', title, id: v1()} as const
}
export const changeTodoListTitleAC = (title: string, todoListID: string) => {
    return {type: 'CHANGE-TODOLIST-TITLE', title, todoListID} as const
}
export const changeTodoListFilterAC = (todoListID: string, newFilterValue: FilterValuesType) => {
    return {type: 'CHANGE-TODOLIST-FILTER', newFilterValue, todoListID} as const
}

const initialState: Array<TodoListType> = [];

export const todolistsReducer = (state: Array<TodoListType> = initialState, action: ActionType): Array<TodoListType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.todoListID)
        case 'ADD-TODOLIST':
            const newTodoList: TodoListType = {
                id: action.id,
                title: action.title,
                filter: 'All'
            };
            return [...state, newTodoList]
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(tl => tl.id === action.todoListID ? {...tl, title: action.title} : tl)
        case  'CHANGE-TODOLIST-FILTER':
            return state.map(tl => tl.id === action.todoListID ? {...tl, filter: action.newFilterValue} : tl)
        default:
            return state
    }
}