import React from 'react';
import PropTypes from 'prop-types';

class NavBar extends React.Component {

	/**
		This class is in charge of rendering the navigation bar.
		It is displayed vertically on desktop, and horizontally on mobile.
	*/


	state = { 
		'activeItem': '',  
		'matchPages':{
			'#':'', 
			'#modes':'modes', 
			'#couleurs':'couleurs', 
			'#mesures':'mesures', 
			'#automatismes':'automatismes'
		} 
	};

	componentDidMount = () => {
		this.onLocationChange();
	}

	componentWillUnmount() {
		window.removeEventListener('popstate', this.onLocationChange);
	}

	componentDidUpdate() {
		window.addEventListener('popstate', this.onLocationChange);
	}

	onLocationChange = () => {
		/**
			This method is passed as a callback to the navigation event listener. It is called any time the user clicks on the side bar buttons.
			It updates the currently selected menu.
		*/
		var selectedPage = this.state.matchPages[window.location.hash];
		this.setState({ activeItem: selectedPage });
    };


	handleItemClick = (e, { name, to }) => {
		/**
			This method triggers a navigation event to move to another position in the page depending on where the user clicks
			on the navigation bar. 
		*/

		if (e.metaKey || e.ctrlKey) {
			var target = window.location.href.replace('#', to)
			window.open(target, "_blank")
			return;
		}

		this.setState({ activeItem: name });
		window.history.pushState({}, '', to);

		const navEvent = new PopStateEvent('popstate');
		window.dispatchEvent(navEvent);

	}

	fetchIconImage = (target) => {
		/**
			This method associates each button of the navigation bar to its logo, depending on whether it is being selected or not.
		*/


		const active = this.state.activeItem === target ? true : false;
		switch (target) {
			case 'couleurs':
				if (active) {
					return <img width="60" height="60" src={`${process.env.PUBLIC_URL}/assets/images/couleurs-active.svg`} alt="Couleurs" />
				} else {
					return <img width="60" height="60" src={`${process.env.PUBLIC_URL}/assets/images/couleurs.svg`} alt="Couleurs" />
				}
			case 'mesures':
				if (active) {
					return <img width="54" height="54" src={`${process.env.PUBLIC_URL}/assets/images/mesures-active.svg`} alt="Mesures" />
				} else {
					return <img width="54" height="54" src={`${process.env.PUBLIC_URL}/assets/images/mesures.svg`} alt="Mesures" />
				}
			case 'automatismes':
				if (active) {
					return <img width="66" height="66" src={`${process.env.PUBLIC_URL}/assets/images/automatismes-active.svg`} alt="Automatismes" />
				} else {
					return <img width="66" height="66" src={`${process.env.PUBLIC_URL}/assets/images/automatismes.svg`} alt="Automatismes" />
				}
			default:
				if (active) {
					return <img width="60" height="60" src={`${process.env.PUBLIC_URL}/assets/images/modes-active.svg`} alt="Modes" />
				} else {
					return <img width="60" height="60" src={`${process.env.PUBLIC_URL}/assets/images/modes.svg`} alt="Modes" />
				}
		}

						
	}

	render () {

		let navBar = (
			<React.Fragment>
				<a href='#modes' className={`nav-icon-${this.state.activeItem === 'modes' ? 'active' : 'inactive'}`}>
					{this.fetchIconImage('modes')}
					<p>Modes</p>
				</a>
				<a href='#couleurs' className= {`nav-icon-${this.state.activeItem === 'couleurs' ? 'active' : 'inactive'}`}>
					{this.fetchIconImage('couleurs')}
					<p>Couleurs</p>
				</a>
				<a href='#mesures' className={`nav-icon-${this.state.activeItem === 'mesures' ? 'active' : 'inactive'}`}>
					{this.fetchIconImage('mesures')}
					<p>Mesures</p>
				</a>
				<a href='#automatismes' className={`nav-icon-${this.state.activeItem === 'automatismes' ? 'active' : 'inactive'}`}>
					{this.fetchIconImage('automatismes')}
					<p>Règles</p>
				</a>
			</React.Fragment>
		)

		
		if (this.props.orientation === 'horizontal') {
			// to make the Maïa logo a button
			// <div id='bottom-nav-bar' >
			// 	<a id='maia-button' href='/#'>Maïa</a>
			// 	{navBar}
			// </div>


			return (
				<div id='bottom-nav-bar' >
					<div id='maia-button' href='/#'>Maïa</div>
					{navBar}
				</div>
			)
		} else {
			return (
				<React.Fragment>
					{navBar}
				</React.Fragment>
			)
		}

	}
}

//props validation
NavBar.propTypes = {
	orientation: PropTypes.string.isRequired,
}

export default NavBar;

