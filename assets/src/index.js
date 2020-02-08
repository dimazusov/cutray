import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import rootReducer from './reducers'
import { createStore } from 'redux'

const store = createStore(rootReducer);

ReactDOM.render(
    <App store={store}/>,
    document.getElementById('root')
);

registerServiceWorker();