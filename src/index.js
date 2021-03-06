import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import './css/index.css';
import App from './components/App.js';
import BrowserWarning from './components/BrowserWarning.js';
import reducers from './reducers';

// set up of the Redux dev tool
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
// create a redux store and add the middleware 
const store = createStore(
	reducers,
	composeEnhancers(applyMiddleware(thunk))
);

// Reference code to receive messages from SW
// navigator.serviceWorker.addEventListener('message', event => {
//     if (event.data && event.data.type === 'NEW_SW') {
//         window.location.reload();
//     }
// });


// define what content to render based on the browser used
var contentToRender;
if (/chrome/i.test( navigator.userAgent)) {
    // add a check for bluetooth
    contentToRender = (<App/>);
}
else if (/CriOS/i.test( navigator.userAgent)) {
  contentToRender = (<BrowserWarning type="bluetooth"/>);
}
else {
	contentToRender = (<BrowserWarning type="browser"/>);
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
serviceWorkerRegistration.register();
