import React from 'react';
import { connect } from 'react-redux';
import { fetchModes, addMode } from '../actions';
import ColorPicker from './ColorPicker.js';
import ModeModel from '../components/ModeModel.js';
import ModesList from './ModesList.js';
import Overlay from './Overlay.js';
import Route from './Route.js';
import SideNavBar from './SideNavBar.js';

class App extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			'isConnected':false,
			'overlay':{'display':false, 'title':'', 'message':'', 'modeName':''},
			'disconnectDisplay':{ 'display':'none' },
			'modesList':[]
		};

		this.overlayRef = React.createRef();
		this.singleColorPickerRef = React.createRef();
		this.gradientColorPickerRef = React.createRef();
		this.onWindowResize();
	}


	componentDidMount() {
		window.addEventListener('resize', this.onWindowResize);
		window.addEventListener('popstate', this.onLocationChange);
	}

	componentDidUpdate() {
		//this.serializeModes();
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.onWindowResize);
		window.removeEventListener('popstate', this.onLocationChange);
	}

	onWindowResize() {
		var screenRatio = window.innerHeight/window.innerWidth;
		if (screenRatio < 0.75) {
			var width = window.innerHeight / 0.75;
			document.getElementById('root').style.width = width + 'px' ;
			document.getElementById('root').style.height = window.innerHeight + 'px' ;
		}
	}

	onLocationChange = () => {
		//logic to display/hide the disconnect button
		// setState accepts a function rather than an object that receives the state as an argument to be able to use previous state to get new state
		if (window.location.hash !== '') {
			this.setState((state) => ({
				disconnectDisplay:{'display':state.isConnected === true ? 'block':'none'}
			}));

		} else {
			this.setState({disconnectDisplay:{'display':'none'}});

		}
	}

	displayOverlay = (parameters) => {
		var overlay = parameters;
		// var overlay = {...this.state.overlay};
		// overlay['type'] = parameters.type;
		// overlay['display'] = parameters.display;
		// overlay['title'] = parameters.title;
		// overlay['message'] = parameters.message;
		// overlay['modeInstance'] = parameters.modeInstance;
		this.setState({ overlay });
	}


	onSaveMode = (type, modeInstance) => {
		if (type === 'new') {
			this.props.addMode(modeInstance);
		} else if (type === 'edit') {
			console.log(modeInstance)

		}
	}

	onEditMode = (modeInstance) => {
		// display overlay with color picker
		var params = {
			'type':'edit',
			'display':true,
			'title':'Éditer mode', 
			'modeInstance':modeInstance
		};
		this.displayOverlay(params);
	}


	onConnectClick = () =>  {
		// try to connect to the micro-controller
		// once the connection is established, call onConnect
	}

	onDisconnectClick = () =>  {
		// serialize the store
		// send the new state to the micro-controller?
		// once the disconnection is confirmed, call onDisconnect
	}

	onConnect = () => {
		if (this.state.isConnected === false) {
			this.setState({'isConnected':true}, () => {
				this.props.fetchModes();
			});
			window.history.pushState({}, '', '#modes');
			const navEvent = new PopStateEvent('popstate');
			window.dispatchEvent(navEvent);

		} else {
		}

	}

	onDisconnect = () =>  {
		this.setState({'isConnected':false});
		window.history.pushState({}, '', '#');
		const navEvent = new PopStateEvent('popstate');
		window.dispatchEvent(navEvent);

	}

	renderHome = () => {
		return (
			<div id='home'>
				<button 
					className={['column-one', 'button-home'].join(' ')}
					onClick={this.onConnect}
				>
					{this.state.isConnected === false ? 'Connecter' : 'Déconnecter' }
				</button>
			</div>
		)
	}

	renderModes = () => {
		if (this.state.isConnected) {	
			return (
				<div className='grid-row-two'>
					<ModesList onEditMode={this.onEditMode} />
				</div>
			)
		}
		return null;
	}

	renderCouleurs = () => {

		var mode = {
			'isOriginMode':false, 
			'isEditable':true, 
			'category':'single', 
			'colors':[{ r: 255, g: 255, b: 255 }], 
			'speed':30
		}

		var modeModel = ModeModel.createNewModeModel(mode);

		return (
			<React.Fragment>
				<ColorPicker 
					type='new'
					modeModel={modeModel}
					onSaveMode={this.displayOverlay}
				/>
			</React.Fragment>
		)
		// if (this.state.isConnected) { 
		// }
		// return null;
	}

	renderMesures = () => {
		if (this.state.isConnected) {	
			return (
				<React.Fragment>
					<div className="grid-row-one">
						Rafraîchir
					</div>
					<div className="grid-row-two">
						Mesures
					</div>
				</React.Fragment>
			)
		}
		return null;
	}


	renderAutomatismes = () => {
		if (this.state.isConnected) {	
			return (
				<div className="grid-row-two">
					Automatismes
				</div>
			)
		}
		return null;
	}

	render() {

		let disconnectDisplay = this.state.disconnectDisplay;
		let overlay;
		if (this.state.overlay.display) {
			overlay = (
				<div style={{display:'block'}}>
					<Overlay settings={this.state.overlay} onClose={this.displayOverlay} onSave={this.onSaveMode} ref={this.overlayRef} />
				</div>
			)
		} else {
			overlay = (
				<div style={{display:'none'}}>
					<Overlay settings={this.state.overlay} onClose={this.displayOverlay} onSave={this.onSaveMode} ref={this.overlayRef} />
				</div>
			)
		}

		return (
			<React.Fragment>
				{ overlay }
				<div className="grid-content">
					<div className="content-one">
						<div id='logo'>
							<a href='/#'><img src={`${process.env.PUBLIC_URL}/assets/images/logo.svg`} alt='Maïa' /></a>
						</div>
						<div id='nav-bar'>
							<SideNavBar/>
						</div>
						<button 
							id='disconnect-button'
							style={disconnectDisplay}
							value='disconnect'
							onClick={this.onConnect}
						>Déconnecter</button>
					</div>

					<div className={["content-two", "column-two"].join(' ')}>
						<Route path='' >
							{ this.renderHome() }
						</Route>
						<Route path="#modes" >
							{ this.renderModes() }
						</Route>
						<Route path="#couleurs" >
							<React.Fragment>
								{ this.renderCouleurs() }
							</React.Fragment>
						</Route>
						<Route path="#mesures">
							<React.Fragment>
								{ this.renderMesures() }
							</React.Fragment>
						</Route>
						<Route path="#automatismes">
							<React.Fragment>
								{ this.renderAutomatismes() }
							</React.Fragment>
						</Route>
					</div>
				</div>
			</React.Fragment>
		);

  }
}


export default connect(null, { fetchModes, addMode })(App);
