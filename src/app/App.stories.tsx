import React from 'react';
import { Story, Meta } from '@storybook/react';
import App from './App';
import {ReduxStoreProviderDecorator} from '../stories/ReduxStoreProviderDecorator';


export default {
  title: 'Todo/App',
  component: App,
  decorators: [ReduxStoreProviderDecorator]
} as Meta;

const Template: Story = () =>  <App demo={true}/>;

export const AppBaseExample = Template.bind({});


