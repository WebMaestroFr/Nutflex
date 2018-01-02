import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {ConnectedRouter, routerReducer, routerMiddleware} from 'react-router-redux';
import {applyMiddleware, combineReducers, createStore} from 'redux';
import thunk from 'redux-thunk';
import createHistory from 'history/createBrowserHistory';

import registerServiceWorker from './registerServiceWorker';
import reducers from './reducers';

import App from './components/App';

import 'semantic-ui-css/semantic.min.css';

const history = createHistory(),
    router = routerMiddleware(history),
    store = createStore(combineReducers({
        ...reducers,
        router: routerReducer
    }), applyMiddleware(router, thunk));

ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <App/>
        </ConnectedRouter>
    </Provider>,
    document.getElementById(
        'root'
    )
);

registerServiceWorker();