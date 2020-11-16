import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import * as serviceWorker from './serviceWorker';
import './css/index.css';
import App from './components/App.js';
import BrowserWarning from './components/BrowserWarning.js';
import reducers from './reducers';


//we define the vh unit using the screen innerHeight
// let vh = window.innerHeight * 0.01;
// document.documentElement.style.setProperty('--vh', `${vh}px`);

// window.addEventListener('resize', () => {
//   let vh = window.innerHeight * 0.01;
//   document.documentElement.style.setProperty('--vh', `${vh}px`);
// });

// console.log(document.documentElement.clientHeight, window.innerHeight)
// console.log(document.getElementsByTagName('html')[0].scrollHeight)
// console.log(document.documentElement.clientHeight, window.screen.height, window.innerHeight)




const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
	reducers, 
	composeEnhancers(applyMiddleware(thunk))
);

var contentToRender;
if (/chrome/i.test( navigator.userAgent) || (navigator.userAgent.match('CriOS'))) {
	// if not supported on IoS, remove CriOS !!!!   
  // || (navigator.userAgent.match('CriOS'))
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
