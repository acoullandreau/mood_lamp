import React from 'react';
// import PropTypes from 'prop-types';

class SideNavBar extends React.Component {

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
		var selectedPage = this.state.matchPages[window.location.hash];
		this.setState({ activeItem: selectedPage });
    };


	handleItemClick = (e, { name, to }) => {
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
		const active = this.state.activeItem === target ? true : false;
		switch (target) {
			case 'couleurs':
				if (active) {
					return <img src={`${process.env.PUBLIC_URL}/assets/images/couleurs-active.svg`} alt="Couleurs" />
				} else {
					return <img src={`${process.env.PUBLIC_URL}/assets/images/couleurs.svg`} alt="Couleurs" />
				}
				// break;
			case 'mesures':
				if (active) {
					return <img src={`${process.env.PUBLIC_URL}/assets/images/mesures-active.svg`} alt="Mesures" />
				} else {
					return <img src={`${process.env.PUBLIC_URL}/assets/images/mesures.svg`} alt="Mesures" />
				}
				// break;
			case 'automatismes':
				if (active) {
					return <img src={`${process.env.PUBLIC_URL}/assets/images/automatismes-active.svg`} alt="Automatismes" />
				} else {
					return <img src={`${process.env.PUBLIC_URL}/assets/images/automatismes.svg`} alt="Automatismes" />
				}
				// break;
			default:
				if (active) {
					return <img src={`${process.env.PUBLIC_URL}/assets/images/modes-active.svg`} alt="Modes" />
				} else {
					return <img src={`${process.env.PUBLIC_URL}/assets/images/modes.svg`} alt="Modes" />
				}
				// break;
		}

						
	}

	render () {
		return (
			<React.Fragment>
				<a href='#modes' className={['grid-row-one', `nav-icon-${this.state.activeItem === 'modes' ? 'active' : 'inactive'}`].join(' ')}>
					{this.fetchIconImage('modes')}
					<p>Modes</p>
				</a>
				<a href='#couleurs' className={['grid-row-two', `nav-icon-${this.state.activeItem === 'couleurs' ? 'active' : 'inactive'}`].join(' ')}>
					{this.fetchIconImage('couleurs')}
					<p>Couleurs</p>
				</a>
				<a href='#mesures' className={['grid-row-three', `nav-icon-${this.state.activeItem === 'mesures' ? 'active' : 'inactive'}`].join(' ')}>
					{this.fetchIconImage('mesures')}
					<p>Mesures</p>
				</a>
				<a href='#automatismes' className={['grid-row-four', `nav-icon-${this.state.activeItem === 'automatismes' ? 'active' : 'inactive'}`].join(' ')}>
					{this.fetchIconImage('automatismes')}
					<p>Automatismes</p>
				</a>
			</React.Fragment>
		);

	}
}

// props validation
// SideNavBar.propTypes = {
//    selection: PropTypes.string.isRequired
// }

export default SideNavBar;

