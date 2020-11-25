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
	}
}


export default BrowserWarning;
