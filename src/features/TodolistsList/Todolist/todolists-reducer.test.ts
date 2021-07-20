import {
    addTodolistAC,
    FilterValuesType,
    removeTodolistAC,
    setTodolistsAC,
    TodolistDomainType,
    todolistsReducer
} from '../todolists-reducer';
import {v1} from 'uuid';
import {TodolistType} from "../../../api/todolist-api";


let todolistId1: string;
let todolistId2: string;
let startState: Array<TodolistDomainType> = [];

beforeEach(() => {
    todolistId1 = v1();
    todolistId2 = v1();

    startState = [
        {
            id: todolistId1, title: 'What to learn', filter: 'All', addedDate: '',
            order: 1, entityStatus: 'idle'
        },
        {
            id: todolistId2, title: 'What to buy', filter: 'All', addedDate: '',
            order: 0, entityStatus: 'idle'
        }
    ]
})

test('correst todolist should be added', () => {
    const newTodolist: TodolistType = {
        title: 'New todolist',
        id: '3',
        order: 0,
        addedDate: ''
    }

    const endState = todolistsReducer(startState, addTodolistAC(newTodolist));

    expect(endState.length).toBe(3);
    expect(endState[0].title).toBe('New todolist');
    expect(endState[0].filter).toBe('All')
})


test('correct todolist should be removed', () => {

    const endState = todolistsReducer(startState, removeTodolistAC(todolistId1))

    expect(endState.length).toBe(1);
    expect(endState[0].id).toBe(todolistId2);
});


test('correct todolist should change its name', () => {

    let newTodolistTitle = 'New Todolist';

    const action = {
        type: 'CHANGE-TODOLIST-TITLE' as const,
        todoListID: todolistId2,
        title: newTodolistTitle
    };

    const endState = todolistsReducer(startState, action);

    expect(endState[0].title).toBe('What to learn');
    expect(endState[1].title).toBe(newTodolistTitle);
});


test('correct filter of todolist should be changed', () => {

    let newFilter: FilterValuesType = 'Completed';

    const action = {
        type: 'CHANGE-TODOLIST-FILTER' as const,
        todoListID: todolistId2,
        newFilterValue: newFilter
    };

    const endState = todolistsReducer(startState, action);

    expect(endState[0].filter).toBe('All');
    expect(endState[1].filter).toBe(newFilter);
});

test('todolists should be set to the state', () => {
    const action = setTodolistsAC(startState);

    const endState = todolistsReducer([], action);

    expect(endState.length).toBe(2)
})




