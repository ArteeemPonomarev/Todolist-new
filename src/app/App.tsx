import React, {useEffect} from 'react';
import './App.css';
import {AppBar, Button, Container, IconButton, Toolbar, Typography} from '@material-ui/core';
import {Menu} from '@material-ui/icons';
import {useDispatch, useSelector} from 'react-redux';
import {TodolistsList} from '../features/TodolistsList/ToodolistsList';
import LinearProgress from '@material-ui/core/LinearProgress';
import {AppRootStateType} from './store';
import {initializeApp, RequestStatusType} from './app-reducer';
import {ErrorSnackbar} from '../components/ErrorSnackBar/ErrorSnackBar';
import {NavLink, Redirect, Route, Switch} from "react-router-dom";
import {Login} from "../features/Login/Login";
import CircularProgress from '@material-ui/core/CircularProgress';
import {logOutTC} from "../features/Login/authReducer";
import {useCallback} from 'react';

type AppPropsType = {
    demo?: boolean
}

const App: React.FC<AppPropsType> = ({demo = false, ...props}) => {

    useEffect(() => {
        if (!demo) {
            dispatch(initializeApp())
        }
    }, []);


    const dispatch = useDispatch();
    const status = useSelector<AppRootStateType, RequestStatusType>((state) => state.app.status);
    const isInitialized = useSelector<AppRootStateType, boolean>(state => state.app.isInitialized);
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn);

    const logoutHandler = useCallback(() => {
        dispatch(logOutTC())
    }, [dispatch])

    if (!isInitialized) {
        return <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>
    }

    return (
        <div className="App">
            <ErrorSnackbar/>
            <AppBar position="static">
                <Toolbar style={{display: 'flex', justifyContent: 'space-between'}}>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        TodoList
                    </Typography>
                    <NavLink to={"/login"}>
                        {!isLoggedIn && <Button variant={'outlined'} color="inherit">Login</Button>}
                    </NavLink>
                    {isLoggedIn && <Button variant={'outlined'} color="inherit" onClick={logoutHandler}>LogOut</Button>}
                </Toolbar>
                {status === 'loading' && <LinearProgress color={"secondary"}/>}
            </AppBar>
            <Container fixed style={{padding: '20px 0px'}}>
                <Switch>
                    <Route path={"/"} exact render={() => <TodolistsList demo={demo}/>}/>
                    <Route path={"/login"} render={() => <Login/>}/>
                    <Route path={"/404"} render={() => <div>404 page not found</div>}/>
                    <Redirect from={"*"} to={"/404"}/>
                </Switch>
            </Container>
        </div>
    );
}

export default App;
