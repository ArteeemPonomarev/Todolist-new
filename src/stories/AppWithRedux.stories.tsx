import React from 'react';
import { Story, Meta } from '@storybook/react';
import AppWithRedux from '../AppWithRedux';
import {ReduxStoreProviderDecorator} from './ReduxStoreProviderDecorator';


export default {
  title: 'Todo/AppWithRedux',
  component: AppWithRedux,
  decorators: [ReduxStoreProviderDecorator]
} as Meta;

const Template: Story = () =>  <AppWithRedux/>;

export const AppWithReduxExample = Template.bind({});


