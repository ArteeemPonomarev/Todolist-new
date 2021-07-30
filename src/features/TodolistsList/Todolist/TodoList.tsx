import React, {useCallback, useEffect} from 'react';
import {AddItemForm} from '../../../components/AddItemForm/AddItemForm';
import EditableSpan from '../../../components/EditableSpan/EditableSpan';
import {Button, IconButton} from '@material-ui/core';
import {Delete} from '@material-ui/icons';
import {Task} from './Task/Task';
import {TaskStatuses, TaskType} from '../../../api/todolist-api';
import {FilterValuesType, TodolistDomainType} from '../todolists-reducer';
import {fetchTasksTC} from '../tasks-reducer';
import {useDispatch} from 'react-redux';



type TodoListPropsType = {
    todolist: TodolistDomainType
    tasks: Array<TaskType>
    addTask: (title: string, todoListID: string) => void
    changeFilterValue: (newFilterValue: FilterValuesType, todoListID: string) => void
    removeTask: (taskId: string, todoListID: string) => void
    changeTaskStatus: (taskId: string, status: TaskStatuses, todoListID: string) => void
    removeTodoList: (todoListID: string) => void
    changeTaskTitle: (taskId: string, title: string, todoListID: string) => void
    changeTodoListTitle: (title: string, todoListID: string) => void
    demo?: boolean
};


export const TodoList = React.memo(({demo = false, ...props}: TodoListPropsType) => {

        const dispatch = useDispatch();

    useEffect(() => {
        if (demo) {
            return
        }
        dispatch(fetchTasksTC(props.todolist.id))
    }, [])

    function getTasksForTodoList(): Array<TaskType> {
        switch (props.todolist.filter) {
            case 'Active':
                return props.tasks.filter(t => t.status === TaskStatuses.New)
            case 'Completed':
                return props.tasks.filter(t => t.status === TaskStatuses.Completed)
            default:
                return props.tasks
        }
    }

    const removeTask = useCallback((taskId: string) => {
        props.removeTask(taskId, props.todolist.id)
    }, [props.removeTask, props.todolist.id]);

    const changeStatus = useCallback((taskId: string, status: TaskStatuses) => {
        props.changeTaskStatus(taskId, status, props.todolist.id)
    }, [props.changeTaskStatus, props.todolist.id]);

    const changeTaskTitle = useCallback((taskId: string, title: string) => {
        props.changeTaskTitle(taskId, title, props.todolist.id)
    }, [props.changeTaskStatus, props.todolist.id]);

    const addTask = useCallback((title: string) => {
        props.addTask(title, props.todolist.id);
    }, [props.todolist.id, props.addTask])

    const removeTodoList = useCallback(() => {
        props.removeTodoList(props.todolist.id)
    }, [props.removeTodoList, props.todolist.id]);

    const changeTodoListTitle = useCallback((title: string) => {
        props.changeTodoListTitle(title, props.todolist.id)
    }, [props.changeTodoListTitle, props.todolist.id]);


    //Switchers for Tasks, All, Active, Completed
    const setAllFilterValue = useCallback(() => {
        props.changeFilterValue('All', props.todolist.id)
    }, [props.changeFilterValue, props.todolist.id]);

    const setActiveFilterValue = useCallback(() => {
        props.changeFilterValue('Active', props.todolist.id)
    }, [props.changeFilterValue, props.todolist.id]);

    const setCompletedFilterValue = useCallback(() => {
        props.changeFilterValue('Completed', props.todolist.id)
    }, [props.changeFilterValue, props.todolist.id]);


    const styleButton = {
        marginRight: '5px'
    };

    return (
        <div>
            <h3>
                <EditableSpan title={props.todolist.title} changeTitle={changeTodoListTitle}/>
                <IconButton onClick={removeTodoList} disabled={props.todolist.entityStatus === 'loading'}>
                    <Delete/>
                </IconButton>
            </h3>
            <AddItemForm addItem={addTask} disabled={props.todolist.entityStatus === 'loading'}/>
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
                    variant={props.todolist.filter === 'All' ? 'outlined' : 'contained'}
                    onClick={setAllFilterValue}>All</Button>
                <Button
                    style={styleButton}
                    size={'small'}
                    color={'primary'}
                    variant={props.todolist.filter === 'Active' ? 'outlined' : 'contained'}
                    onClick={setActiveFilterValue}>Active</Button>
                <Button
                    style={styleButton}
                    size={'small'}
                    color={'primary'}
                    variant={props.todolist.filter === 'Completed' ? 'outlined' : 'contained'}
                    onClick={setCompletedFilterValue}>Completed</Button>
            </div>
        </div>
    )
});
