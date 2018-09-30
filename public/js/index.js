import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader'; // eslint-disable-line
import { Provider } from 'react-redux';
import App from './App';
import configureStore from './store/configure-store';
import '../css/scheduler.css';

const store = configureStore();

const renderApp = (NextApp) => {
  render(
    <AppContainer>
      <Provider store={store}>
        <NextApp />
      </Provider>
    </AppContainer>,
    document.getElementById('root')
  );
};

renderApp(App);

/* eslint-disable */

if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default;
    renderApp(NextApp);
  })
}
