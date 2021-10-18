import React, {useCallback, useEffect} from 'react';
import {TodolistDomainType} from './todolists-reducer';
import {useSelector} from 'react-redux';
import {TasksStateType} from './tasks-reducer';
import {Grid, Paper} from '@material-ui/core';
import {TodoList} from './Todolist/TodoList';
import {AddItemForm, AddItemFormSubmitHelperType} from "../../components/AddItemForm/AddItemForm";
import {Redirect} from "react-router-dom";
import {AppRootStateType} from '../../utils/types';
import {selectIsLoggedIn} from "../Auth/selectors";
import {useActions, useAppDispatch} from "../../utils/redux-utils";
import {todolistsActions} from "./index";

type TodolistsPropsType = {
    demo?: boolean
}


export const TodolistsList: React.FC<TodolistsPropsType> = ({demo = false, ...props}) => {

    useEffect(() => {
        if (demo || !isLoggedIn) {
            return
        }
        fetchTodolistsTC();
    }, [])

    const todoLists = useSelector<AppRootStateType, Array<TodolistDomainType>>(state => state.todolists);
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks);
    const isLoggedIn = useSelector(selectIsLoggedIn);

    const dispatch = useAppDispatch();

    const {fetchTodolistsTC} = useActions(todolistsActions)

    const addTodolistCallback = useCallback(async (title: string, helper: AddItemFormSubmitHelperType) => {
            let thunk = todolistsActions.createTodolistTC(title)
            const resultAction = await dispatch(thunk)

            if (todolistsActions.createTodolistTC.rejected.match(resultAction)) {
                if (resultAction.payload?.errors?.length) {
                    const errorMessage = resultAction.payload?.errors[0]
                    helper.setError(errorMessage)
                } else {
                    helper.setError('Some error occured')
                }
            } else {
                helper.setTitle('')
            }
        }, []
    )


    const todolistComponents = todoLists.map(tl => {
        let allTodolistTasks = tasks[tl.id];
        return (
            <Grid item key={tl.id}>
                <Paper elevation={6} style={{padding: '0 15px 15px 15px'}}>
                    <TodoList
                        key={tl.id}
                        todolist={tl}
                        tasks={allTodolistTasks}
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
                <AddItemForm addItem={addTodolistCallback}/>
            </Grid>
            <Grid container style={{padding: '20px 0px'}} spacing={3}>
                {todolistComponents}
            </Grid>
        </>
    )
}