import React, {ChangeEvent, useCallback} from 'react';
import {Checkbox, IconButton} from '@material-ui/core';
import EditableSpan from './EditableSpan';
import {Delete} from '@material-ui/icons';
import {TaskStatuses, TaskType} from './api/todolist-api';

export type TaskPropsType = {
    task: TaskType
    removeTask: (taskId: string) => void
    changeStatus: (taskId: string, status: TaskStatuses) => void
    changeTaskTitle: (taskId: string, title: string) => void
}

export const Task = React.memo(({task, changeStatus, changeTaskTitle, removeTask}: TaskPropsType) => {
    console.log('Task called')

    const onClickHandler = useCallback(() => removeTask(task.id), [task.id]);
    const onChangeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        let newStatusValue = e.currentTarget.checked;
        changeStatus(task.id, newStatusValue ? TaskStatuses.Completed : TaskStatuses.New)
    }, [changeStatus, task.id]);
    const onTitleChangeHandler = useCallback((title: string) => changeTaskTitle(task.id, title), [task.id]);

    return (
        <li key={task.id}>
            <Checkbox checked={task.status === TaskStatuses.Completed} onChange={onChangeHandler} color={'primary'}/>
            <EditableSpan title={task.title} changeTitle={onTitleChangeHandler}/>
            <IconButton onClick={onClickHandler}>
                <Delete/>
            </IconButton>
        </li>
    );
});


