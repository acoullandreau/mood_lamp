import React from 'react';
import PropTypes from 'prop-types';
import modesActive from './image_library/modes-active.svg';
import modes from './image_library/modes.svg';
import couleursActive from './image_library/couleurs-active.svg';
import couleurs from './image_library/couleurs.svg';
import mesuresActive from './image_library/mesures-active.svg';
import mesures from './image_library/mesures.svg';
import automatismesActive from './image_library/automatismes-active.svg';
import automatismes from './image_library/automatismes.svg';

class SideNavBar extends React.Component {

	state = { activeItem: 'modes',  'matchPages':{'':'modes', '#modes':'modes', '#couleurs':'couleurs', '#mesures':'mesures', '#automatismes':'automatismes'} };

	componentDidMount() {
		this.onLocationChange();
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
					return <img src={couleursActive} alt="Couleurs" />
				} else {
					return <img src={couleurs} alt="Couleurs" />
				}
				// break;
			case 'mesures':
				if (active) {
					return <img src={mesuresActive} alt="Mesures" />
				} else {
					return <img src={mesures} alt="Mesures" />
				}
				// break;
			case 'automatismes':
				if (active) {
					return <img src={automatismesActive} alt="Automatismes" />
				} else {
					return <img src={automatismes} alt="Automatismes" />
				}
				// break;
			default:
				if (active) {
					return <img src={modesActive} alt="Modes" />
				} else {
					return <img src={modes} alt="Modes" />
				}
				// break;
		}

						
	}

	render () {
		return (
			<React.Fragment>
				<div id='nav-bar'>
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
				</div>
			</React.Fragment>
		);

	}
}

// props validation
SideNavBar.propTypes = {
   selection: PropTypes.string
}

export default SideNavBar;

