import React, {useCallback, useEffect} from 'react';
import './App.css';
import {TodoList} from './TodoList';
import {AddItemForm} from './AddItemForm';
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from '@material-ui/core';
import {Menu} from '@material-ui/icons';
import {
    changeTodoListFilterAC,
    changeTodoListTitleAC,
    createTodolistTC,
    deleteTodolistTC,
    fetchTodolistsTC,
    FilterValuesType,
    TodolistDomainType,
} from './state/todolists-reducer';
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, removeTaskTC} from './state/tasks-reducer';
import {useDispatch, useSelector} from 'react-redux';
import {AppRootStateType} from './state/store';
import {TaskStatuses, TaskType} from './api/todolist-api';


export type TasksStateType = {
    [key: string]: Array<TaskType>
}

function AppWithRedux() {
    useEffect(() => {
        dispatch(fetchTodolistsTC());
    }, [])

    const todoLists = useSelector<AppRootStateType, Array<TodolistDomainType>>(state => state.todolists)
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)

    const dispatch = useDispatch();

    const removeTask = useCallback((taskID: string, todoListID: string) => {
        dispatch(removeTaskTC(todoListID, taskID))
    }, [dispatch])

    const addTask = useCallback((title: string, todoListID: string) => {
        dispatch(addTaskAC(title, todoListID))
    }, [dispatch])

    const changeTaskStatus = useCallback((taskId: string, status: TaskStatuses, todoListID: string) => {
        dispatch(changeTaskStatusAC(taskId, status, todoListID))
    }, [dispatch])

    const changeTaskTitle = useCallback((taskId: string, title: string, todoListID: string) => {
        dispatch(changeTaskTitleAC(taskId, title, todoListID))
    }, [dispatch])

    const changeTodoListFilter = useCallback((newFilterValue: FilterValuesType, todoListID: string) => {
        dispatch(changeTodoListFilterAC(todoListID, newFilterValue))
    }, [dispatch])

    const removeTodoList = useCallback((todoListID: string) => {
        dispatch(deleteTodolistTC(todoListID))
    }, [dispatch])

    const addTodoList = useCallback((title: string) => {
        dispatch(createTodolistTC(title));
    }, [dispatch])

    const changeTodoListTitle = useCallback((title: string, todoListID: string) => {
        dispatch(changeTodoListTitleAC(title, todoListID))
    }, [dispatch])

    const todolistComponents = todoLists.map(tl => {

        return (
            <Grid item key={tl.id}>
                <Paper elevation={6} style={{padding: '0 15px 15px 15px'}}>
                    <TodoList
                        key={tl.id}
                        id={tl.id}
                        title={tl.title}
                        todoListFilter={tl.filter}
                        tasks={tasks[tl.id]}
                        changeFilterValue={changeTodoListFilter}
                        removeTask={removeTask}
                        addTask={addTask}
                        changeTaskStatus={changeTaskStatus}
                        removeTodoList={removeTodoList}
                        changeTaskTitle={changeTaskTitle}
                        changeTodoListTitle={changeTodoListTitle}/>
                </Paper>
            </Grid>
        )
    })

    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar style={{display: 'flex', justifyContent: 'space-between'}}>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        TodoList
                    </Typography>
                    <Button variant={'outlined'} color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
            <Container fixed style={{padding: '20px 0px'}}>
                <Grid container style={{padding: '20px 0px'}}>
                    <AddItemForm addItem={addTodoList}/>
                </Grid>
                <Grid container style={{padding: '20px 0px'}} spacing={3}>
                    {todolistComponents}
                </Grid>
            </Container>
        </div>
    );
}

export default AppWithRedux;
