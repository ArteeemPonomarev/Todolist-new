import {tasksReducer, TasksStateType} from './tasks-reducer';
import {addTodolistAC, TodolistDomainType, todolistsReducer} from './todolists-reducer';

test('ids should be equals', () => {
    const startTasksState: TasksStateType = {};
    const startTodolistsState: Array<TodolistDomainType> = [];


    const action = addTodolistAC({
        id:'1',
        order: 0,
        addedDate:'',
        title: 'new todo'
    });

    const endTasksState = tasksReducer(startTasksState, action)//{'qwqe-qwrq': []}
    const endTodolistsState = todolistsReducer(startTodolistsState, action)//[{id: 'qwqe-qwrq', title: 'new todolist', filter: 'all'}]

    const keys = Object.keys(endTasksState);
    const idFromTasks = keys[0];
    const idFromTodolists = endTodolistsState[0].id;

    expect(idFromTasks).toBe(action.todolist.id);
    expect(idFromTodolists).toBe(action.todolist.id);
});
