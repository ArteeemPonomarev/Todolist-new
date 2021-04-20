import React, {ChangeEvent} from 'react';
import {FilterValuesType, TaskType} from './App';
import AddItemForm from './AddItemForm';
import EditableSpan from './EditableSpan';
import {Button, Checkbox, IconButton} from '@material-ui/core';
import {Delete} from '@material-ui/icons';

type TodoListPropsType = {
    id: string
    title: string
    todoListFilter: FilterValuesType
    tasks: Array<TaskType>
    addTask: (title: string, todoListID: string) => void
    changeFilterValue: (newFilterValue: FilterValuesType, todoListID: string) => void
    removeTask: (taskId: string, todoListID: string) => void
    changeTaskStatus: (taskId: string, newIsDoneValue: boolean, todoListID: string) => void
    removeTodoList: (todoListID: string) => void
    changeTaskTitle: (taskId: string, title: string, todoListID: string) => void
    changeTodoListTitle: (title: string, todoListID: string) => void
};


function TodoList(props: TodoListPropsType) {

    const tasks = props.tasks.map(t => {
        const removeTask = () => props.removeTask(t.id, props.id);
        const changeStatus = (e: ChangeEvent<HTMLInputElement>) => props.changeTaskStatus(t.id, e.currentTarget.checked, props.id);
        const changeTaskTitle = (title: string) => props.changeTaskTitle(t.id, title, props.id);
        return (
            <li key={t.id}>
                <Checkbox checked={t.isDone} onChange={changeStatus} color={'primary'}/>
                <EditableSpan title={t.title} changeTitle={changeTaskTitle}/>
                <IconButton onClick={removeTask}>
                    <Delete/>
                </IconButton>
            </li>
        );
    });

    const addTask = (title: string) => {
        props.addTask(title, props.id);
    }

    const removeTodoList = () => props.removeTodoList(props.id);

    const changeTodoListTitle = (title: string) => props.changeTodoListTitle(title, props.id);

    const setAllFilterValue = () => props.changeFilterValue('All', props.id);
    const setActiveFilterValue = () => props.changeFilterValue('Active', props.id);
    const setCompletedFilterValue = () => props.changeFilterValue('Completed', props.id);


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
                {tasks}
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
}

export default TodoList;