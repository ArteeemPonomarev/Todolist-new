import React from 'react';
import { Story, Meta } from '@storybook/react';
import {action} from '@storybook/addon-actions';
import EditableSpan, {EditableSpanPropsType} from '../EditableSpan';

export default {
  title: 'Todo/EditableSpan',
  component: EditableSpan,
  argTypes: {
    changeTitle: {
      description: 'Value EditableSpan changed'
    },
    title: {
      defaultValue: 'HTML',
      description: 'Start value EditableSpan'
    }
  }
} as Meta;


const Template: Story<EditableSpanPropsType> = (args) => <EditableSpan {...args} />;


export const EditableSpanExample = Template.bind({});
EditableSpanExample.args = {
  changeTitle: action('Value EditableSpan changed'),

};


