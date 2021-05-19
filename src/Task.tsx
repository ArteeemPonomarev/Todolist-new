import React, {ChangeEvent, useCallback} from 'react';
import {TaskType} from './AppWithRedux';
import {Checkbox, IconButton} from '@material-ui/core';
import EditableSpan from './EditableSpan';
import {Delete} from '@material-ui/icons';

export type TaskPropsType = {
    task: TaskType
    removeTask: (taskId: string) => void
    changeStatus: (taskId: string, newIsDoneValue: boolean) => void
    changeTaskTitle: (taskId: string, title: string) => void
}

export const Task = React.memo(({task, changeStatus, changeTaskTitle, removeTask}: TaskPropsType) => {
    console.log('Task called')

    const onClickHandler = useCallback(() => removeTask(task.id), [task.id]);
    const onChangeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => changeStatus(task.id, e.currentTarget.checked), [changeStatus, task.id]);
    const onTitleChangeHandler = useCallback((title: string) => changeTaskTitle(task.id, title), [task.id]);

    return (
        <li key={task.id}>
            <Checkbox checked={task.isDone} onChange={onChangeHandler} color={'primary'}/>
            <EditableSpan title={task.title} changeTitle={onTitleChangeHandler}/>
            <IconButton onClick={onClickHandler}>
                <Delete/>
            </IconButton>
        </li>
    );
});


