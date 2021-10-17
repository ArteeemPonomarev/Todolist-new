import {fetchTasksTC, removeTaskTC, tasksReducer, TasksStateType, updateTaskAC} from './tasks-reducer';

import {addTodolistAC, removeTodolistAC, setTodolistsAC} from './todolists-reducer';
import {TaskPriorities, TaskStatuses} from '../../api/todolist-api';

let startState: TasksStateType = {};

beforeEach(() => {
    startState = {
        'todolistId1': [
            {
                id: '1',
                title: 'CSS',
                status: TaskStatuses.New,
                todoListId: 'todolistId1',
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 1,
                description: '',
                priority: TaskPriorities.Low
            },
            {
                id: '2',
                title: 'JS',
                status: TaskStatuses.Completed,
                todoListId: 'todolistId1',
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 1,
                description: '',
                priority: TaskPriorities.Low
            },
            {
                id: '3',
                title: 'React',
                status: TaskStatuses.New,
                todoListId: 'todolistId1',
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 1,
                description: '',
                priority: TaskPriorities.Low
            }
        ],
        'todolistId2': [
            {
                id: '1',
                title: 'bread',
                status: TaskStatuses.New,
                todoListId: 'todolistId2',
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 1,
                description: '',
                priority: TaskPriorities.Low
            },
            {
                id: '2',
                title: 'milk',
                status: TaskStatuses.Completed,
                todoListId: 'todolistId2',
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 1,
                description: '',
                priority: TaskPriorities.Low
            },
            {
                id: '3',
                title: 'tea',
                status: TaskStatuses.New,
                todoListId: 'todolistId2',
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 1,
                description: '',
                priority: TaskPriorities.Low
            }
        ]
    }
})

test('correct task should be deleted from correct array', () => {

    const param = {taskId: '2', todolistId: 'todolistId2'}
    const action = removeTaskTC.fulfilled(param, 'requestId', param);

    const endState = tasksReducer(startState, action)

    expect(endState).toEqual({
        'todolistId1': [
            {
                id: '1',
                title: 'CSS',
                status: TaskStatuses.New,
                todoListId: 'todolistId1',
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 1,
                description: '',
                priority: TaskPriorities.Low
            },
            {
                id: '2',
                title: 'JS',
                status: TaskStatuses.Completed,
                todoListId: 'todolistId1',
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 1,
                description: '',
                priority: TaskPriorities.Low
            },
            {
                id: '3',
                title: 'React',
                status: TaskStatuses.New,
                todoListId: 'todolistId1',
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 1,
                description: '',
                priority: TaskPriorities.Low
            }
        ],
        'todolistId2': [
            {
                id: '1',
                title: 'bread',
                status: TaskStatuses.New,
                todoListId: 'todolistId2',
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 1,
                description: '',
                priority: TaskPriorities.Low
            },
            {
                id: '3',
                title: 'tea',
                status: TaskStatuses.New,
                todoListId: 'todolistId2',
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 1,
                description: '',
                priority: TaskPriorities.Low
            }
        ]
    });

});

test('correct task should be added to correct array', () => {

    const action = addTaskTC({task: {
        todoListId: 'todolistId2',
        title: 'juice',
        status: TaskStatuses.New,
        addedDate: '',
        deadline: '',
        description: '',
        priority: TaskPriorities.Low,
        order: 0,
        startDate: '',
        id: 'exists'
    }});

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId1'].length).toBe(3);
    expect(endState['todolistId2'].length).toBe(4);
    expect(endState['todolistId2'][0].id).toBeDefined();
    expect(endState['todolistId2'][0].title).toBe('juice');
    expect(endState['todolistId2'][0].status).toBe(TaskStatuses.New);
})

test('status of specified task should be changed', () => {

    const action = updateTaskAC({taskId: '2', model: {status: TaskStatuses.New}, todolistId: 'todolistId2'});

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId2'][1].status).toBe(TaskStatuses.New);
    expect(endState['todolistId1'][1].status).toBe(TaskStatuses.Completed);
});

test('title of specified task should be changed', () => {

    const action = updateTaskAC({taskId: '2', model: {title: 'Redux'}, todolistId: 'todolistId1'});

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId1'][1].title).toBe('Redux');
    expect(endState['todolistId2'][1].title).toBe('milk');
});

test('new array should be added when new todolist is added', () => {

    const action = addTodolistAC({todolist: {
        id: 'id exist',
        addedDate: '',
        order: 0,
        title: 'new todo'
    }});

    const endState = tasksReducer(startState, action)

    const keys = Object.keys(endState);
    const newKey = keys.find(k => k != 'todolistId1' && k != 'todolistId2');
    if (!newKey) {
        throw Error('new key should be added')
    }

    expect(keys.length).toBe(3);
    expect(endState[newKey]).toEqual([]);
});

test('property with todolistId should be deleted', () => {

    const action = removeTodolistAC({todoListID: 'todolistId2'});

    const endState = tasksReducer(startState, action)

    const keys = Object.keys(endState);

    expect(keys.length).toBe(1);
    expect(endState['todolistId2']).not.toBeDefined();
});

test('empty arrays should be added when we set todolists', () => {
    const action = setTodolistsAC({todolists: [
        {id: '1', title: 'What to learn', addedDate: '', order: 1},
        {id: '2', title: 'What to buy', addedDate: '', order: 0}
    ]})

    const endState = tasksReducer({}, action);

    const keys = Object.keys(endState);

    expect(keys.length).toBe(2);
    expect(endState['1']).toStrictEqual([]);
    expect(endState['2']).toStrictEqual([]);
})

test('tasks should be added for todolist', () => {
    //const action = setTasksAC({tasks: startState['todolistId1'], todolistId: 'todolistId1'})
    const action = fetchTasksTC.fulfilled({tasks: startState['todolistId1'], todolistId: 'todolistId1'}, 'requestId', 'todolistId1')

    const endState = tasksReducer({
        'todolistId2': [],
        'todolistId1': []
    }, action);


    expect(endState['todolistId1'].length).toBe(3);
    expect(endState['todolistId2'].length).toBe(0);
})








