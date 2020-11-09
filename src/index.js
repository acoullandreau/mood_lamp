import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import * as serviceWorker from './serviceWorker';
import './index.css';
import App from './components/App.js';
import BrowserWarning from './components/BrowserWarning.js';
import reducers from './reducers';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
	reducers, 
	composeEnhancers(applyMiddleware(thunk))
);


var contentToRender;
if (/chrome/i.test( navigator.userAgent )) {
	contentToRender = (<App/>);
} else {
	contentToRender = (<BrowserWarning/>);
}

ReactDOM.render(
  <React.StrictMode>
  	<Provider store={store}>
    	{contentToRender}
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
