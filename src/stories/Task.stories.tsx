import React from 'react';
import { Story, Meta } from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {Task, TaskPropsType} from '../Task';

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
  task: {id: '1', isDone: true, title: 'JS'}
};

export const TaskIsNotDoneExample = Template.bind({});
TaskIsNotDoneExample.args = {
  ...baseArgs,
  task: {id: '1', isDone: false, title: 'JS'}
};

