import {FilterValuesType, TodoListType} from '../App';
import {v1} from 'uuid';

export type RemoveTodoListAT = {
    type: "REMOVE-TODOLIST"
    todoListID: string
}

export type AddTodoListAT = {
    type: "ADD-TODOLIST"
    title: string
    id: string
}

type ChangeTodoListTitleAT = {
    type: "CHANGE-TODOLIST-TITLE"
    title: string
    todoListID: string
}

type ChangeTodoListFilterAT = {
    type: "CHANGE-TODOLIST-FILTER"
    newFilterValue: FilterValuesType
    todoListID: string
}

export type ActionType = RemoveTodoListAT | AddTodoListAT | ChangeTodoListTitleAT | ChangeTodoListFilterAT;

export const RemoveTodolistAC = (todoListID: string): RemoveTodoListAT => {
    return { type: 'REMOVE-TODOLIST', todoListID}
}
export const AddTodolistAC = (title: string): AddTodoListAT => {
    return { type: 'ADD-TODOLIST', title, id: v1()}
}
export const ChangeTodoListTitleAC = (title: string, todoListID: string): ChangeTodoListTitleAT => {
    return { type: "CHANGE-TODOLIST-TITLE", title, todoListID}
}
export const ChangeTodoListFilterAC = (todoListID: string, newFilterValue: FilterValuesType) => {
    return { type: "CHANGE-TODOLIST-FILTER", newFilterValue, todoListID}
}


export const todolistsReducer = (todoLists: Array<TodoListType>, action: ActionType): Array<TodoListType> => {
    switch(action.type) {
        case 'REMOVE-TODOLIST':
            return todoLists.filter(tl => tl.id !== action.todoListID)
        case 'ADD-TODOLIST':
            const newTodoList: TodoListType = {
                id: action.id,
                title: action.title,
                filter: 'All'
            };
            return [...todoLists, newTodoList]
        case 'CHANGE-TODOLIST-TITLE':
            return todoLists.map(tl => tl.id === action.todoListID ? {...tl, title: action.title} : tl)
        case  "CHANGE-TODOLIST-FILTER":
            return todoLists.map(tl => tl.id === action.todoListID ? {...tl, filter: action.newFilterValue} : tl)
        default:
            return todoLists
    }
}