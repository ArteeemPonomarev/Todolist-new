import {TasksStateType, TodoListType} from '../AppWithRedux';
import {tasksReducer} from './tasks-reducer';
import {addTodolistAC, todolistsReducer} from './todolists-reducer';

test('ids should be equals', () => {
    const startTasksState: TasksStateType = {};
    const startTodolistsState: Array<TodoListType> = [];

    const action = addTodolistAC("new todolist");

    const endTasksState = tasksReducer(startTasksState, action)//{'qwqe-qwrq': []}
    const endTodolistsState = todolistsReducer(startTodolistsState, action)//[{id: 'qwqe-qwrq', title: 'new todolist', filter: 'all'}]

    const keys = Object.keys(endTasksState);
    const idFromTasks = keys[0];
    const idFromTodolists = endTodolistsState[0].id;

    expect(idFromTasks).toBe(action.id);
    expect(idFromTodolists).toBe(action.id);
});
