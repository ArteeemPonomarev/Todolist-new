import React, {useCallback, useEffect} from 'react';
import './App.css';
import {AppBar, Button, Container, IconButton, Toolbar, Typography} from '@material-ui/core';
import {Menu} from '@material-ui/icons';
import {useSelector} from 'react-redux';
import {TodolistsList} from '../features/TodolistsList';
import LinearProgress from '@material-ui/core/LinearProgress';
import {ErrorSnackbar} from '../components/ErrorSnackBar/ErrorSnackBar';
import {NavLink, Redirect, Route, Switch} from "react-router-dom";
import {authActions, authSelectors, Login} from "../features/Auth";
import CircularProgress from '@material-ui/core/CircularProgress';
import {selectIsInitialized, selectStatus} from "../features/Application/selectors";
import {appActions} from "../features/Application";
import {useActions} from "../utils/redux-utils";

type AppPropsType = {
    demo?: boolean
}

const App: React.FC<AppPropsType> = ({demo = false, ...props}) => {

    const status = useSelector(selectStatus);
    const isInitialized = useSelector(selectIsInitialized);
    const isLoggedIn = useSelector(authSelectors.selectIsLoggedIn);

    const {logout} = useActions(authActions)
    const {initializeApp} = useActions(appActions)

    useEffect(() => {
        if (!demo) {
            initializeApp()
        }
    }, []);


    const logoutHandler = useCallback(() => {
        logout()
    }, [])

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
