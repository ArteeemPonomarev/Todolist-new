import React, {useCallback} from 'react';
import './App.css';
import {AddItemForm} from '../components/AddItemForm/AddItemForm';
import {AppBar, Button, Container, Grid, IconButton, Toolbar, Typography} from '@material-ui/core';
import {Menu} from '@material-ui/icons';
import {createTodolistTC,} from '../features/TodolistsList/todolists-reducer';
import {useDispatch} from 'react-redux';
import {TaskType} from '../api/todolist-api';
import {TodolistsList} from '../features/TodolistsList/ToodolistsList';



export type TasksStateType = {
    [key: string]: Array<TaskType>
}

function App() {
    const dispatch = useDispatch();

    const addTodoList = useCallback((title: string) => {
        dispatch(createTodolistTC(title));
    }, [dispatch])

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
                <TodolistsList/>
            </Container>
        </div>
    );
}


export default App;
