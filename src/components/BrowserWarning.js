import React from 'react';

class BrowserWarning extends React.Component {

	componentDidMount() {
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
		var screenRatio = window.visualViewport.height/window.visualViewport.width;
		if (screenRatio < 0.75) {
			var width = window.visualViewport.height / 0.75;
			document.getElementById('root').style.width = width + 'px' ;
			document.getElementById('root').style.height = window.visualViewport.height + 'px' ;
		}
	}

	render() {
		return (
			<div id="browser-warning">
				<img src={`${process.env.PUBLIC_URL}/assets/images/logo.svg`} alt='Maïa' />
				<p>Ce service n'est pas conçu pour fonctionner sur un autre navigateur que <b><a href='https://www.google.com/chrome/' target="_blank">Chrome</a></b> !</p>
			</div>
		)
	}
}


export default BrowserWarning;
