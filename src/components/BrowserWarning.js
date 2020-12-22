import React from 'react';
import PropTypes from 'prop-types';

class BrowserWarning extends React.Component {
	/**
		This component is in charge of displaying a warning message to the user if:
			- the browser used is not Chrome
			- the bluetooth is not active
	*/

	componentDidMount() {
		// remove the loader once the page is ready
		this.setState({ 'pageLoading': false }, () => {
			document.getElementById("loading-page").style.display = "none";
		});

		//add event listeners
		window.addEventListener('resize', this.onWindowResize);
		window.addEventListener('popstate', this.onLocationChange);

		// redirect to the home page
		window.history.pushState({}, '', '#');
		const navEvent = new PopStateEvent('popstate');
		window.dispatchEvent(navEvent);
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.onWindowResize);
		window.removeEventListener('popstate', this.onLocationChange);
	}

	onWindowResize() {
		/**
			This method is called only go the desktop version, to ensure that the width/height of the root element
			always has the ratio of the targeted screen size defined (75%).
			The idea is to have the root element displayed with the same ratio and in the center of the screen, even when the browser
			window is very wide.
		*/

		var screenRatio = window.visualViewport.height/window.visualViewport.width;
		if (screenRatio < 0.75) {
			var width = window.visualViewport.height / 0.75;
			document.getElementById('root').style.width = width + 'px' ;
			document.getElementById('root').style.height = window.visualViewport.height + 'px' ;
		}
	}

	render() {

		if (this.props.type === 'browser') {
			return (
				<div id="browser-warning">
					<img width="146" height="146" src={`${process.env.PUBLIC_URL}/assets/images/logo.svg`} alt='Maïa' />
					<p>
						Ce service n'est pas conçu pour fonctionner sur un autre navigateur que
						<span> </span>
						<a href='https://www.google.com/chrome/' target="_blank" rel="noopener noreferrer">
							<span style={{'color': '#4386F4'}}>C</span>
							<span style={{'color': '#EA483A'}}>h</span>
							<span style={{'color': '#FBBD28'}}>r</span>
							<span style={{'color': '#4386F4'}}>o</span>
							<span style={{'color': '#34A853'}}>m</span>
							<span style={{'color': '#EA483A'}}>e</span>
						</a>
						<span> </span>
						!
					</p>
				</div>
			)
		} else  if (this.props.type === 'bluetooth') {
			return (
				<div id="browser-warning">
					<img width="146" height="146" src={`${process.env.PUBLIC_URL}/assets/images/logo.svg`} alt='Maïa' />
					<p>
						Chrome does not support Web Bluetooth in iOS ! There's an iOS app coming soon.
					</p>
				</div>
			)
		}
	}
}

BrowserWarning.propTypes = {
	type:PropTypes.string.isRequired
}


export default BrowserWarning;
