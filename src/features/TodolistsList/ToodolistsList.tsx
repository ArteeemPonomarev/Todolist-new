import React, {useCallback, useEffect} from 'react';
import {
    changeTodoListFilterAC, createTodolistTC,
    deleteTodolistTC,
    fetchTodolistsTC,
    FilterValuesType,
    TodolistDomainType,
    updateTodolistTitleTC
} from './todolists-reducer';
import {useDispatch, useSelector} from 'react-redux';
import {AppRootStateType} from '../../app/store';
import {createTaskTC, removeTaskTC, TasksStateType, updateTaskTC} from './tasks-reducer';
import {TaskStatuses} from '../../api/todolist-api';
import {Grid, Paper} from '@material-ui/core';
import {TodoList} from './Todolist/TodoList';
import {AddItemForm} from "../../components/AddItemForm/AddItemForm";
import {Redirect} from "react-router-dom";

type TodolistsPropsType = {
    demo?: boolean
}


export const TodolistsList: React.FC<TodolistsPropsType> = ({demo = false, ...props}) => {
    useEffect(() => {
        if (demo || !isLoggedIn) {
            return
        }
        dispatch(fetchTodolistsTC());
    }, [])

    const todoLists = useSelector<AppRootStateType, Array<TodolistDomainType>>(state => state.todolists);
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks);
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn);


    const dispatch = useDispatch();


    //For tasks
    const removeTask = useCallback((taskID: string, todoListID: string) => {
        dispatch(removeTaskTC(todoListID, taskID))
    }, [dispatch])

    const addTask = useCallback((title: string, todoListID: string) => {
        dispatch(createTaskTC(todoListID, title))
    }, [dispatch])

    const changeTaskStatus = useCallback((taskId: string, status: TaskStatuses, todoListID: string) => {
        dispatch(updateTaskTC(todoListID, taskId, {status}))
    }, [dispatch])

    const changeTaskTitle = useCallback((taskId: string, title: string, todoListID: string) => {
        dispatch(updateTaskTC(todoListID, taskId, {title}))
    }, [dispatch])


    // For todolists
    const addTodoList = useCallback((title: string) => {
        dispatch(createTodolistTC(title));
    }, [dispatch])

    const removeTodoList = useCallback((todoListID: string) => {
        dispatch(deleteTodolistTC(todoListID))
    }, [dispatch])


    const changeTodoListTitle = useCallback((title: string, todoListID: string) => {
        dispatch(updateTodolistTitleTC(title, todoListID))
    }, [dispatch])

    const changeTodoListFilter = useCallback((newFilterValue: FilterValuesType, todoListID: string) => {
        dispatch(changeTodoListFilterAC(todoListID, newFilterValue))
    }, [dispatch])

    const todolistComponents = todoLists.map(tl => {
        return (
            <Grid item key={tl.id}>
                <Paper elevation={6} style={{padding: '0 15px 15px 15px'}}>
                    <TodoList
                        key={tl.id}
                        todolist={tl}
                        tasks={tasks[tl.id]}
                        changeFilterValue={changeTodoListFilter}
                        removeTask={removeTask}
                        addTask={addTask}
                        changeTaskStatus={changeTaskStatus}
                        removeTodoList={removeTodoList}
                        changeTaskTitle={changeTaskTitle}
                        changeTodoListTitle={changeTodoListTitle}
                        demo={demo}/>
                </Paper>
            </Grid>
        )
    })



    if (!isLoggedIn) {
        return <Redirect to={'/login'}/>
    }

    return (
        <>
            <Grid container style={{padding: '20px 0px'}}>
                <AddItemForm addItem={addTodoList}/>
            </Grid>
            <Grid container style={{padding: '20px 0px'}} spacing={3}>
                {todolistComponents}
            </Grid>
        </>
    )
}