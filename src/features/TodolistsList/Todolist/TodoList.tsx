import React, {useCallback, useEffect} from 'react';
import {AddItemForm, AddItemFormSubmitHelperType} from '../../../components/AddItemForm/AddItemForm';
import EditableSpan from '../../../components/EditableSpan/EditableSpan';
import {Button, IconButton, PropTypes} from '@material-ui/core';
import {Delete} from '@material-ui/icons';
import {Task} from './Task/Task';
import {TaskStatuses, TaskType} from '../../../api/types';
import {FilterValuesType, TodolistDomainType} from '../todolists-reducer';
import {tasksActions, todolistsActions} from "../index";
import {useActions, useAppDispatch} from "../../../utils/redux-utils";


type TodoListPropsType = {
    todolist: TodolistDomainType
    tasks: Array<TaskType>
    demo?: boolean
};


export const TodoList = React.memo(({demo = false, ...props}: TodoListPropsType) => {
    const {fetchTasks} = useActions(tasksActions)
    const {changeTodolistFilter, deleteTodolistTC, updateTodolistTitleTC} = useActions(todolistsActions)

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (demo) {
            return
        }
        fetchTasks(props.todolist.id);
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

    const addTaskCallback = useCallback(async (title: string, helper: AddItemFormSubmitHelperType) => {

        let thunk = tasksActions.createTask({title: title, todolistId: props.todolist.id})
        const resultAction = await dispatch(thunk);

        if (tasksActions.createTask.rejected.match(resultAction)) {
            if (resultAction.payload?.errors?.length) {
                const errorMessage = resultAction.payload?.errors[0]
                helper.setError(errorMessage)
            } else {
                helper.setError('Some error occured')
            }
        } else {
            helper.setTitle('')
        }

    }, [props.todolist.id])


    const removeTodoList = useCallback(() => {
        deleteTodolistTC(props.todolist.id)
    }, [props.todolist.id]);

    const changeTodolistTitle = useCallback((title: string) => {
        updateTodolistTitleTC({id: props.todolist.id, title: title})
    }, [props.todolist.id])

    const onFilterButtonClickHandler = useCallback((filter: FilterValuesType) => changeTodolistFilter({
        todoListID: props.todolist.id,
        newFilterValue: filter
    }), [props.todolist.id])

    const styleButton = {
        marginRight: '5px'
    };

    const renderFilterButton = (buttonFilter: FilterValuesType,
                                color: PropTypes.Color,
                                text: string) => {
        return <Button variant={props.todolist.filter === buttonFilter ? 'outlined' : 'text'}
                       onClick={() => onFilterButtonClickHandler(buttonFilter)}
                       color={color}>{text}
        </Button>
    }

    return (
        <div>
            <h3>
                <EditableSpan title={props.todolist.title} changeTitle={changeTodolistTitle}/>
                <IconButton onClick={removeTodoList} disabled={props.todolist.entityStatus === 'loading'}>
                    <Delete/>
                </IconButton>
            </h3>
            <AddItemForm addItem={addTaskCallback} disabled={props.todolist.entityStatus === 'loading'}/>
            <ul style={{listStyle: 'none', padding: '0px'}}>
                {getTasksForTodoList().map(t => {
                    return (<Task key={t.id}
                                  task={t}
                                  todolistId={props.todolist.id}/>)
                })
                }
                {!getTasksForTodoList().length && <div style={{padding: '10px', color: 'grey'}}>No task</div>}
            </ul>
            <div style={{padding: '10px'}}>
                {renderFilterButton('All', 'default', 'All')}
                {renderFilterButton('Active', 'primary', 'Active')}
                {renderFilterButton('Completed', 'secondary', 'Completed')}
            </div>
        </div>
    )
});
