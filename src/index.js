import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {BrowserRouter} from 'react-router-dom';
import {applyMiddleware, createStore} from 'redux';
import thunk from 'redux-thunk';

import registerServiceWorker from './registerServiceWorker';
import reducers from './reducers';

import App from './components/App';

import 'semantic-ui-css/semantic.min.css';

const store = createStore(reducers, applyMiddleware(thunk));

// localStorage.clear();

ReactDOM.render(
    <BrowserRouter>
        <Provider store={store}>
            <App/>
        </Provider>
    </BrowserRouter>,
    document.getElementById(
        'root'
    )
);

registerServiceWorker();