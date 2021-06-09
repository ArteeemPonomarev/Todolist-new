import React from 'react';
import {Meta, Story} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {Task, TaskPropsType} from './Task';
import {TaskPriorities, TaskStatuses} from '../../../../api/todolist-api';

export default {
    title: 'Todo/Task',
    component: Task
} as Meta;

const removeTaskCallback = action('Remove Button inside Task');
const changeStatusCallback = action('Status changed inside Task');
const changeTaskTitleCallback = action('Title changed inside Task');

const Template: Story<TaskPropsType> = (args) => <Task {...args} />;

const baseArgs = {
    removeTask: removeTaskCallback,
    changeStatus: changeStatusCallback,
    changeTaskTitle: changeTaskTitleCallback
}

export const TaskIsDoneExample = Template.bind({});
TaskIsDoneExample.args = {
    ...baseArgs,
    task: {
        id: '1',
        status: TaskStatuses.Completed,
        title: 'JS',
        todoListId: 'tdId1',
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 1,
        description: '',
        priority: TaskPriorities.Low
    }
};

export const TaskIsNotDoneExample = Template.bind({});
TaskIsNotDoneExample.args = {
    ...baseArgs,
    task: {
        id: '1',
        status: TaskStatuses.New,
        title: 'JS',
        todoListId: 'tdId1',
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 1,
        description: '',
        priority: TaskPriorities.Low
    }
};

