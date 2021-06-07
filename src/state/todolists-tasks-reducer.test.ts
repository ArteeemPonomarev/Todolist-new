import {TasksStateType} from '../AppWithRedux';
import {tasksReducer} from './tasks-reducer';
import {addTodolistAC, TodolistDomainType, todolistsReducer} from './todolists-reducer';

test('ids should be equals', () => {
    const startTasksState: TasksStateType = {};
    const startTodolistsState: Array<TodolistDomainType> = [];
    const todolistId = '4135-2525v2-dsfxb24-dfb'

    const action = addTodolistAC("new todolist", todolistId);

    const endTasksState = tasksReducer(startTasksState, action)//{'qwqe-qwrq': []}
    const endTodolistsState = todolistsReducer(startTodolistsState, action)//[{id: 'qwqe-qwrq', title: 'new todolist', filter: 'all'}]

    const keys = Object.keys(endTasksState);
    const idFromTasks = keys[0];
    const idFromTodolists = endTodolistsState[0].id;

    expect(idFromTasks).toBe(action.todolistId);
    expect(idFromTodolists).toBe(action.todolistId);
});
