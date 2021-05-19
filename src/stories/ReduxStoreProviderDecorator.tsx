import React from 'react';
import {Provider} from 'react-redux';
import {store} from '../state/store';


export const ReduxStoreProviderDecorator = (storyFn: () => React.ReactNode) => {
  return <Provider store={store}>{storyFn()}</Provider>
}