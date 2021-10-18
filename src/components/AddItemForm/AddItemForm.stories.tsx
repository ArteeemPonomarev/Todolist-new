import React from 'react';
import {Meta, Story} from '@storybook/react';
import {AddItemForm, AddItemFormPropsType} from './AddItemForm';
import {action} from '@storybook/addon-actions';

export default {
    title: 'Todo/AddItemForm',
    component: AddItemForm
} as Meta;

const Template: Story<AddItemFormPropsType> = (args) => <AddItemForm {...args} />;

export const AddItemFormExample = Template.bind({});
AddItemFormExample.args = {
    addItem: action('Button inside form clicked')
};

export const AddItemFormDisabledExample = Template.bind({});
AddItemFormExample.args = {
    addItem: action('Button inside form clicked'),
    disabled: true
};
