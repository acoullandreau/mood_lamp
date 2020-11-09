import React from 'react';
import { connect } from 'react-redux';
import { fetchModes, fetchRules, addMode, editMode, getFactorySettings, selectMode } from '../actions';
import configJSON from '../config.json';
import ColorPicker from './ColorPicker.js';
import MaiaService from './MaiaService.js';
import ModeModel from '../components/ModeModel.js';
import ModesList from './ModesList.js';
import Overlay from './Overlay.js';
import Readings from './Readings.js';
import Route from './Route.js';
import Rules from './Rules.js';
import SideNavBar from './SideNavBar.js';

// Mobile version (user Agent, replace hover and click with hold and tap, vertical layout)
// ReadMe (Chrome only, improvements possible)
	// native app (iOS)
	// other languages
	// OTA menu
	// add options : auto turn on with noise
	// offer possibility to turn off auto after minutes (instead of hours)


class App extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			'isConnected':false,
			'overlay':{'type':'', 'display':false, 'title':'', 'message':'', 'modeName':''},
			'disconnectDisplay':{ 'display':'none' },
			'tabIndex':0,
		};


		this.singleColorPickerRef = React.createRef();
		this.gradientColorPickerRef = React.createRef();
		this.onWindowResize();
	}


	componentDidMount() {
		// add the factoryModes JSON to the redux store
		this.props.getFactorySettings(configJSON.factoryModes);

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
		this.setState({ overlay });
	}


	onSaveRules = () => {
		this.syncRulesStateWithLamp();
	}


	onSaveMode = (parameters) => {
		var type = parameters.type;
		var modeInstance = parameters.modeInstance;
		if (type === 'new') {
			this.props.addMode(modeInstance);
			this.props.selectMode(this.props.modesList.length);
		} else if (type === 'edit') {
			var refModeInstance = parameters.refModeInstance;
			this.props.editMode(modeInstance, refModeInstance);
		}

		this.setState({'tabIndex':1}, () => {
			this.syncModesStateWithLamp();
			window.history.pushState({}, '', '#modes');
			const navEvent = new PopStateEvent('popstate');
			window.dispatchEvent(navEvent);
		})

	}

	onEditMode = (modeInstance) => {
		// to keep track of the changes, we clone the modeInstance
		var clonedModeModel = modeInstance.cloneInstance();
		// display overlay with color picker
		var params = {
			'type':'edit',
			'display':true,
			'title':'Éditer mode', 
			'refModeInstance':modeInstance,
			'modeInstance':clonedModeModel
		};
		this.displayOverlay(params);
	}

	onDeleteMode = (modeInstance) => {
		var params = {
			'type':'delete',
			'display':true,
			'title':'Supprimer le mode', 
			'message':'Êtes-vous sûr(e) de vouloir supprimer ce mode ? Cette action est irréversible.',
			'modeInstance':modeInstance
		};
		this.displayOverlay(params);
	}


	onConnectClick = () =>  {
		// try to connect to the micro-controller
		// once the connection is established, call onConnect
		this.onConnect();

	}

	onDisconnectClick = () =>  {
		// save the changes on the micro-controller
		this.syncModesStateWithLamp();
		this.syncRulesStateWithLamp();
		// close the connection to the lamp
		// once the disconnection is confirmed, call onDisconnect
		this.setState({'tabIndex':0});
		this.onDisconnect();
	}

	onConnect = () => {
		this.setState({'isConnected':true}, () => {
			this.props.fetchModes();
			this.props.fetchRules();
		});
		window.history.pushState({}, '', '#modes');
		const navEvent = new PopStateEvent('popstate');
		window.dispatchEvent(navEvent);
	}

	onDisconnect = () =>  {
		this.setState({'isConnected':false});
		window.history.pushState({}, '', '#');
		const navEvent = new PopStateEvent('popstate');
		window.dispatchEvent(navEvent);

	}

	serializeModes() {
		var modesArray = [];
		for (var i = 0; i < this.props.modesList.length; i++) {
			var serializedModeModel = this.props.modesList[i].serialize();
			modesArray.push(serializedModeModel);
		}
		return modesArray;
	}

	syncModesStateWithLamp() {
		var modesArray = this.serializeModes();
		var modesObject = {'modesArray':modesArray, 'selectedMode':this.props.selectedMode};
		MaiaService.saveModes(modesObject);
	}

	syncRulesStateWithLamp() {
		MaiaService.saveRules(this.props.rules);
	}


	renderHome = () => {
		return (
			<div id='home'>
				<button 
					className={['column-one', 'button-home'].join(' ')}
					onClick={this.state.isConnected === false ? this.onConnectClick : this.onDisconnectClick }
				>
					{this.state.isConnected === false ? 'Connecter' : 'Déconnecter' }
				</button>
				<h3>À propos</h3>
				<p>
					Cette application est conçue pour vous permettre de piloter une lampe d'ambiance nommée Maïa !
					Le projet est développé par <a href="https://acoullandreau.com" target="_blank">Alexina Coullandreau</a> et <a href="https://gbuzogany.com" target="_blank">Gustavo Buzogany</a>. 
					Jetez un oeil au <a href="https://github.com/acoullandreau/mood_lamp" target="_blank">code source de cette page</a>, ou encore au projet de lampe, et n'hésitez pas à nous contacter !
				</p>
			</div>
		)
	}

	renderModes = () => {
		return (
			<div className='grid-row-two'>
				<ModesList 
					onEditMode={this.onEditMode} 
					onDeleteMode={this.onDeleteMode}
					index={this.state.tabIndex}
				/>
			</div>
		)
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
					onSaveNewMode={this.displayOverlay}
				/>
			</React.Fragment>
		)
	}

	renderMesures = () => {
		return (
			<Readings />
		)
	}


	renderAutomatismes = () => {
		return (
			<Rules onSaveRules={this.onSaveRules} />
		)
	}


	renderDisconnected() {
		return (
			<React.Fragment>
				<div className="grid-content">
					<div className="content-one">
						<div id='logo'>
							<a href='/#'><img src={`${process.env.PUBLIC_URL}/assets/images/logo.svg`} alt='Maïa' /></a>
						</div>
					</div>
					<div className={["content-two", "column-two"].join(' ')}>
						{ this.renderHome() }
					</div>
				</div>
			</React.Fragment>
		);
	}


	renderConnected() {
		let disconnectDisplay = this.state.disconnectDisplay;
		let overlay;
		if (this.state.overlay.display) {
			overlay = (
				<div style={{display:'block'}}>
					<Overlay settings={this.state.overlay} onClose={this.displayOverlay} onSave={this.onSaveMode} />
				</div>
			)
		} else {
			overlay = (
				<div style={{display:'none'}}>
					<Overlay settings={this.state.overlay} onClose={this.displayOverlay} onSave={this.onSaveMode} />
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
							onClick={this.onDisconnectClick}
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

	render() {

		if (this.state.isConnected) {
			return (
				<React.Fragment>
					{this.renderConnected()}
				</React.Fragment>
			);
		} else {
			return (
				<React.Fragment>
					{this.renderDisconnected()}
				</React.Fragment>
			);
		}
  }
}

const mapStateToProps = (state) => {
	return { 
		modesList : state.modes, 
		selectedMode:state.selectedMode,
		rules : state.rules
	};
}


export default connect(
	mapStateToProps, 
	{ 
		fetchModes, 
		fetchRules, 
		addMode, 
		editMode, 
		getFactorySettings, 
		selectMode
	}
	)(App);
