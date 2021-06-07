import React, {useCallback, useEffect} from 'react';
import {AddItemForm} from './AddItemForm';
import EditableSpan from './EditableSpan';
import {Button, IconButton} from '@material-ui/core';
import {Delete} from '@material-ui/icons';
import {Task} from './Task';
import {TaskStatuses, TaskType} from './api/todolist-api';
import {FilterValuesType} from './state/todolists-reducer';
import {fetchTasksTC} from './state/tasks-reducer';
import {useDispatch} from 'react-redux';


type TodoListPropsType = {
    id: string
    title: string
    todoListFilter: FilterValuesType
    tasks: Array<TaskType>
    addTask: (title: string, todoListID: string) => void
    changeFilterValue: (newFilterValue: FilterValuesType, todoListID: string) => void
    removeTask: (taskId: string, todoListID: string) => void
    changeTaskStatus: (taskId: string, status: TaskStatuses, todoListID: string) => void
    removeTodoList: (todoListID: string) => void
    changeTaskTitle: (taskId: string, title: string, todoListID: string) => void
    changeTodoListTitle: (title: string, todoListID: string) => void
};


export const TodoList = React.memo((props: TodoListPropsType) => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchTasksTC(props.id))
    }, [])

    function getTasksForTodoList(): Array<TaskType> {
        switch (props.todoListFilter) {
            case 'Active':
                return props.tasks.filter(t => t.status === TaskStatuses.New)
            case 'Completed':
                return props.tasks.filter(t => t.status === TaskStatuses.Completed)
            default:
                return props.tasks
        }
    }

    const removeTask = useCallback((taskId: string) => {
        props.removeTask(taskId, props.id)
    }, [props.removeTask, props.id]);

    const changeStatus = useCallback((taskId: string, status: TaskStatuses) => {
        props.changeTaskStatus(taskId, status, props.id)
    }, [props.changeTaskStatus, props.id]);

    const changeTaskTitle = useCallback((taskId: string, title: string) => {
        props.changeTaskTitle(taskId, title, props.id)
    }, [props.changeTaskStatus, props.id]);

    const addTask = useCallback((title: string) => {
        props.addTask(title, props.id);
    }, [props.id, props.addTask])

    const removeTodoList = useCallback(() => {
        props.removeTodoList(props.id)
    }, [props.removeTodoList, props.id]);

    const changeTodoListTitle = useCallback((title: string) => {
        props.changeTodoListTitle(title, props.id)
    }, [props.changeTodoListTitle, props.id]);


    //Switchers for Tasks, All, Active, Completed
    const setAllFilterValue = useCallback(() => {
        props.changeFilterValue('All', props.id)
    }, [props.changeFilterValue, props.id]);

    const setActiveFilterValue = useCallback(() => {
        props.changeFilterValue('Active', props.id)
    }, [props.changeFilterValue, props.id]);

    const setCompletedFilterValue = useCallback(() => {
        props.changeFilterValue('Completed', props.id)
    }, [props.changeFilterValue, props.id]);


    const styleButton = {
        marginRight: '5px'
    };

    return (
        <div>
            <h3>
                <EditableSpan title={props.title} changeTitle={changeTodoListTitle}/>
                <IconButton onClick={removeTodoList}>
                    <Delete/>
                </IconButton>
            </h3>

            <AddItemForm addItem={addTask}/>
            <ul style={{listStyle: 'none', padding: '0px'}}>
                {getTasksForTodoList().map(t => {
                    return (<Task key={t.id}
                                  task={t}
                                  changeStatus={changeStatus}
                                  changeTaskTitle={changeTaskTitle}
                                  removeTask={removeTask}/>)
                })
                }
            </ul>
            <div>
                <Button
                    style={styleButton}
                    size={'small'}
                    color={'primary'}
                    variant={props.todoListFilter === 'All' ? 'outlined' : 'contained'}
                    onClick={setAllFilterValue}>All</Button>
                <Button
                    style={styleButton}
                    size={'small'}
                    color={'primary'}
                    variant={props.todoListFilter === 'Active' ? 'outlined' : 'contained'}
                    onClick={setActiveFilterValue}>Active</Button>
                <Button
                    style={styleButton}
                    size={'small'}
                    color={'primary'}
                    variant={props.todoListFilter === 'Completed' ? 'outlined' : 'contained'}
                    onClick={setCompletedFilterValue}>Completed</Button>
            </div>
        </div>
    )
});
