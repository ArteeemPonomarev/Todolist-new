import React, {ChangeEvent, useCallback} from 'react';
import {Checkbox, IconButton} from '@material-ui/core';
import EditableSpan from '../../../../components/EditableSpan/EditableSpan';
import {Delete} from '@material-ui/icons';
import {TaskStatuses, TaskType} from '../../../../api/types';
import {tasksActions} from "../../index";
import {useActions} from '../../../../utils/redux-utils';

export type TaskPropsType = {
    task: TaskType
    todolistId: string
}

export const Task = React.memo((props: TaskPropsType) => {
    const {updateTask, removeTask} = useActions(tasksActions)

    const onClickHandler = useCallback(() => removeTask({taskId: props.task.id, todolistId: props.todolistId}),
        [props.task.id, props.todolistId]);

    const onChangeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        updateTask({
            taskId: props.task.id,
            todolistId: props.todolistId,
            model: {status: e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New},
        })
    }, [props.task.id, props.todolistId]);

    const onTitleChangeHandler = useCallback((title: string) => {
        updateTask({
            taskId: props.task.id,
            todolistId: props.todolistId,
            model: {title},
        })
    }, [props.task.id, props.todolistId]);

    return (
        <li key={props.task.id}>
            <Checkbox checked={props.task.status === TaskStatuses.Completed} onChange={onChangeHandler}
                      color={'primary'}/>
            <EditableSpan title={props.task.title} changeTitle={onTitleChangeHandler}/>
            <IconButton onClick={onClickHandler}>
                <Delete/>
            </IconButton>
        </li>
    );
});


