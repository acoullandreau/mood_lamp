import React from 'react';
import { connect } from 'react-redux';
import { initModes, initRules, addMode, editMode, getFactorySettings, selectMode } from '../actions';
import { Default } from 'react-spinners-css';
import BluetoothService from '../services/BluetoothService.js';
import ColorPicker from './ColorPicker.js';
import MaiaService from '../services/MaiaService.js';
import ModeModel from './ModeModel.js';
import ModesList from './ModesList.js';
import Overlay from './Overlay.js';
import Readings from './Readings.js';
import Route from './Route.js';
import Rules from './Rules.js';
import SideNavBar from './SideNavBar.js';
import Utils from '../classes/Utils.js';

// Before Prod
	// fonts downloaded manually ?
	// clear cache



class App extends React.Component {


	constructor(props) {
		super(props);

		this.state = {
			'isConnected':false,
			'overlay':{'type':'', 'display':false, 'title':'', 'message':'', 'modeName':''},
			'disconnectDisplay':{ 'display':'none' },
			'tabIndex':0,
			'targetDevice':this.getTargetDevice(),
			'changeOrientationWarning':false,
			'loading':false
		};

		this.previousHeight = undefined;
		this.onWindowResize();
	}


	componentDidMount() {
		// remove the loader once app is ready
		this.setState({ 'pageLoading': false }, () => {
			document.getElementById("loading-page").style.display = "none";
		});

		//add event listeners
		window.addEventListener('resize', this.onWindowResize);
		window.addEventListener('popstate', this.onLocationChange);
		window.addEventListener('orientationchange', this.onOrientationChange);

		// show default prompt to add the app to the home screen
		window.addEventListener('beforeinstallprompt', (e) => {});

		// in case we want our own banner to prompt to add the app to the home screen
		// let deferredPrompt;
		// const addBtnOverlay = document.querySelector('.add-button-overlay');
		// const addBtn = document.querySelector('.add-button');
		// addBtnOverlay.style.display = 'none';
		// window.addEventListener('beforeinstallprompt', (e) => {
		// 	e.preventDefault();
		// 	deferredPrompt = e;
		// 	addBtnOverlay.style.display='block';
		// });

		// addBtn.addEventListener('click', (e) => {
		// 	deferredPrompt.prompt();
		// 	deferredPrompt.userChoice.then((choiceResult) => {
		// 		if (choiceResult.outcome === 'accepted') {
		// 			console.log('User accepted the A2HS prompt');
		// 		} else {
		// 			console.log('User dismissed the A2HS prompt');
		// 		}
		// 		deferredPrompt = null;
		// 	})
		// })

		// redirect to the home page
		window.history.pushState({}, '', '#');
		const navEvent = new PopStateEvent('popstate');
		window.dispatchEvent(navEvent);

		// ensure the content is displayed with the right dimensions and according to orientation
		window.requestAnimationFrame(this.checkSize);
		if (this.state.targetDevice === 'mobile') {
			this.onOrientationChange();
		}
	}


	componentDidUpdate(prevProps) {
		if (this.state.targetDevice === 'mobile') {
			this.resizeElements();
		}

		//we check if the rules were updated in the Redux store
		if (Object.keys(prevProps.rules).length !== 0) {
			if (Utils.compareObjects(prevProps.rules, this.props.rules) === false) {
				this.syncRulesStateWithLamp();
			}
		}
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.onWindowResize);
		window.removeEventListener('popstate', this.onLocationChange);
		window.removeEventListener('orientationchange', this.onOrientationChange);
	}


	getTargetDevice() {
		if (/Mobi/.test(navigator.userAgent)) {
			return "mobile";
		};

		return "desktop";
	}

	checkSize = () => {
		if (this.state.targetDevice === 'mobile' && (this.previousHeight === undefined || this.previousHeight !== window.innerHeight)) {
			this.resizeElements();
			this.previousHeight = window.innerHeight;
		} 

		window.requestAnimationFrame(this.checkSize);
	}

	resizeElements = () => {
		// this function aims at recomputing the heights of the root, the grid content,
		// and the tab component so that it matches the available screen size of the browser (Chrome Android)

		document.getElementById('root').style.height = window.innerHeight + 'px';
		let gridElement = document.getElementsByClassName("grid-content");
		if (gridElement.length > 0) {
			// we get the height of the top menu bar
			var menuBBHeight = document.getElementById("top-section").getBoundingClientRect().height;
			gridElement[0].style.height = window.innerHeight - menuBBHeight + 'px';
		}

		let tabElement = document.getElementsByClassName("react-tabs");
		let tabPanelElement = document.getElementsByClassName("react-tabs__tab-panel");

		if (tabElement.length > 0) {
			// we get the height of the bottom nav bar
			var barBBHeight = document.getElementById("bottom-nav-bar").getBoundingClientRect().height;
			// we get the height of the tab list section
			var tabListBB = document.getElementsByClassName("react-tabs__tab-list")[0].getBoundingClientRect();
			tabListBB = tabListBB.height + Math.max(0.04*window.innerHeight, 20);
			// we get the top margin applied at the top of the tabs panel
			var topMargin = Math.max(0.025*window.innerHeight, 15);
			// we calculate the height of the tab and the tab panels from the height of the window (deducing margins and bottom bar)
			tabElement[0].style.height = window.innerHeight - barBBHeight - 2*topMargin - tabListBB + 'px';
			tabPanelElement[0].style.height = window.innerHeight - barBBHeight - 2*topMargin - 2*tabListBB + 'px';
		}

	}

	onOrientationChange = () => {
		//we could also use orientation.type, values in the format landscape-secondary, portrait-primary...
		if (this.isInPortraitOrientation() === false) {
			// we are in landscape orientation
			if (window.screen.width > 930) {
				//we want the app to be displayed for desktop version
				this.setState({targetDevice:'desktop'});
			} else {
				//display an overlay for the user to rotate the phone back
				this.setState({changeOrientationWarning:true});
			}
		} else {
			//we are in portrait orientation, we ensure that we are displaying the mobile layout
			this.setState({targetDevice:'mobile', changeOrientationWarning:false});
		}

	}

	isInPortraitOrientation = () => {
		if (window.screen.orientation.angle === 90 || window.screen.orientation.angle === 270) {
			return false;
		}

		return true;
	}


	onWindowResize = () => {
		// console.log(this.state.targetDevice)
		if (this.state.targetDevice === 'desktop') {
			// console.log(window.visualViewport.width)
			var screenRatio = window.visualViewport.height/window.visualViewport.width;
			if (screenRatio < 0.75) {
				var width = window.visualViewport.height / 0.75;
				document.getElementById('root').style.width = width + 'px' ;
			}
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

	setId = () => {
		// NOTE : no check is performed to ensure that the id is never greater than 254..

		var listOfIds = [];
		Object.keys(this.props.modesList).forEach(key => {
			if (this.props.modesList[key]['id'] >= 100) {
				listOfIds.push(this.props.modesList[key]['id']);
			}
		})

		if (listOfIds.length === 0) {
			return 100;
		} else {
			listOfIds.sort();

			if (listOfIds[0] !== 100) {
				return 100;
			} else {
				// we assign the first id available from 100 (ids between 0 and 99 are reserved to preconfigured modes)
				for (var i = 0 ; i < listOfIds.length - 1 ; i++) {
					if (listOfIds[i+1] > listOfIds[i] + 1) {
						return listOfIds[i] + 1;
					}
				}

				return listOfIds[listOfIds.length - 1] + 1;
			}
		}

	}

	setOrderId = () => {
		var maxId = 0;
		Object.keys(this.props.modesList).forEach(key => {
			if (this.props.modesList[key]['orderIndex'] > maxId) {
				maxId = this.props.modesList[key]['orderIndex'];
			}
		})

		return maxId + 1;
	}

	onSaveMode = (parameters) => {
		var type = parameters.type;
		var modeInstance = parameters.modeInstance;
		if (type === 'new') {
			var newModeId = this.setId();
			var newModeOrderIndex = this.setOrderId();
			modeInstance.setId(newModeId);
			modeInstance.setOrderIndex(newModeOrderIndex);
			this.props.addMode(modeInstance);
			this.props.selectMode(modeInstance.id);
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

	showAbout = () => {
		var params = {
			'type':'about',
			'display':true,
			'title':'À propos',
			'message':'',
			'modeInstance':''
		};
		this.displayOverlay(params);
	}

	parseEditableModes(configJSON) {
		var editableModesList = configJSON.editableModes;
		var modeConfig = configJSON.modesSettings;
		var factoryModes = {};

		for (var i = 0 ; i < editableModesList.length ; i++) {
			var modeId = editableModesList[i];
			factoryModes[modeId] = modeConfig[modeId];
		}

		return factoryModes;
	}

	setLoading = (value) => {
		this.setState({loading:value});
	}

	onConnectClick = () =>  {
		// try to connect to the micro-controller, BluetoothService sets loading to true
		// once the connection is established, call onConnect
		BluetoothService.connect(this.setLoading, this.onConnect, this.onDisconnect, this.handleNotifications);

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
		// we get a set of promises
		var initPromise = MaiaService.getInitSetting();
		initPromise.then(initSettings => {
			// connection is established, so we set loading to false
			this.setLoading(false);
			// we call redux actions to store the modes, the rules and the factoryModes
			this.props.initModes(initSettings['modes']);
			this.props.initRules(initSettings['rules']);
			var factoryModes = this.parseEditableModes(initSettings['config']);
			this.props.getFactorySettings(factoryModes);
			MaiaService.setCurrentTime();
			this.setState({'isConnected':true, 'disconnectDisplay':{ 'display':'block' }});
		})

		window.history.pushState({}, '', '#modes');
		const navEvent = new PopStateEvent('popstate');
		window.dispatchEvent(navEvent);

	}

	onDisconnect = () =>  {
		this.setState({
			'isConnected':false,
			'loading':false
		});
		window.history.pushState({}, '', '#');
		const navEvent = new PopStateEvent('popstate');
		window.dispatchEvent(navEvent);
	}

	handleNotifications = (event) => {
		// console.log(event);
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

		// uncomment when changes on BluetoothService have been made
		// var savedModeInstance = this.props.modesList[this.props.selectedMode].serialize();
		// var modesObject = {'savedMode':savedModeInstance, 'selectedMode':this.props.selectedMode};
		// MaiaService.saveModes(modesObject);
	}

	syncRulesStateWithLamp() {
		MaiaService.saveRules(this.props.rules);
	}


	renderHome = () => {
		let homeButton;
		let loading = this.state.loading;

		if (this.state.isConnected === false) {
			if (loading) {
				homeButton = (
					<button
						className="button-home-disabled"
						onClick={this.onConnectClick}
						disabled
					>
						<div className="spinner">
							<div>Connexion</div>
							<Default color="#0D0828" size={40}/>
						</div>
					</button>
				)
			} else {
				homeButton = (
					<button
						className="button-home"
						onClick={this.onConnectClick}
					>
						Connexion
					</button>
				)
			}

		} else {
			homeButton = (
				<button
					className="button-home"
					onClick={this.onDisconnectClick}
				>
					Déconnexion
				</button>
			)
		}


		return (
			<div id='home'>
				{homeButton}
			</div>
		)
	}




	renderModes = () => {
		return (
			<ModesList
				onEditMode={this.onEditMode}
				onDeleteMode={this.onDeleteMode}
				index={this.state.tabIndex}
				targetDevice={this.state.targetDevice}
			/>
		)
	}

	renderCouleurs = () => {

		var mode = {
			'id':255,
			'orderIndex':255,
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
					targetDevice={this.state.targetDevice}
				/>
			</React.Fragment>
		)
	}

	renderMesures = () => {
		return (
			<Readings target={this.state.targetDevice}/>
		)
	}


	renderAutomatismes = () => {
		return (
			<Rules onSaveRules={this.onSaveRules} />
		)
	}


	renderDisconnected() {
		if (this.state.targetDevice === 'desktop') {
			return (
				<React.Fragment>
					<div className="grid-content">
						<div className="content-one">
							<div id='logo'>
								<a href='/#'><img width="238" height="146" src={`${process.env.PUBLIC_URL}/assets/images/logo.svg`} alt='Maïa' /></a>
							</div>
						</div>
						<div className={["content-two", "column-two"].join(' ')}>
							{ this.renderHome() }
						</div>
					</div>
				</React.Fragment>
			);
		} else {
			return (
				<React.Fragment>
					<div className="grid-content">
						<div id='logo-mobile'>
							<a href='/#'><img width="238" height="146" src={`${process.env.PUBLIC_URL}/assets/images/logo.svg`} alt='Maïa' /></a>
						</div>
						<div className={["content-two", "column-two"].join(' ')}>
							{ this.renderHome() }
						</div>
					</div>
				</React.Fragment>
			);
		}
	}


	renderConnected() {
		let disconnectDisplay = this.state.disconnectDisplay;

		if (this.state.targetDevice === 'desktop') {
			// to make the Maïa logo a button
			// <div id='logo'>
			// 	<a href='/#'><img src={`${process.env.PUBLIC_URL}/assets/images/logo.svg`} alt='Maïa' /></a>
			// </div>

			return (
				<React.Fragment>
					<div className="grid-content">
						<div className="column-one">
							<div id='logo'>
								<img width="146" height="146" src={`${process.env.PUBLIC_URL}/assets/images/logo.svg`} alt='Maïa' />
							</div>
							<div id='nav-bar'>
								<SideNavBar orientation="vertical"/>
							</div>
							<button
								id='disconnect-button'
								style={disconnectDisplay}
								value='disconnect'
								onClick={this.onDisconnectClick}
							>Déconnexion</button>
						</div>

						<div id='content' className="column-two">
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
		} else {

			return (
				<React.Fragment>
					<button id="disconnect-icon" style={disconnectDisplay} value='disconnect' onClick={this.onDisconnectClick}>
						<img width="71" height="89" src={`${process.env.PUBLIC_URL}/assets/images/disconnect.svg`} alt='Déconnecter' />
					</button>
					<div className="grid-content">
						<div id='content' className="row-one">
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
						<div id="bottom-bar-row" className="row-two">
							<SideNavBar orientation="horizontal" />
						</div>
					</div>
				</React.Fragment>
			);
		}
	}


	renderAddToHomeScreen = () => {
		// not used by default, call {this.renderAddToHomeScreen()} in the render function
		return (
			<div className="add-button-overlay">
				<button className="add-button">Ajouter à l'écran d'accueil</button>
				<button className="close-button" onClick={() => {document.querySelector('.add-button-overlay').style.display = 'none'}}>Annuler</button>
			</div>
		)
	}

	render() {

		let contentToRender;
		if (this.state.isConnected) {
			contentToRender = this.renderConnected();
		} else {
			contentToRender = this.renderDisconnected();
		}

		let overlay;
		if (this.state.overlay.display) {
			overlay = (
				<div style={{display:'block'}}>
					<Overlay
						settings={this.state.overlay}
						onClose={this.displayOverlay}
						onSave={this.onSaveMode}
						targetDevice={this.state.targetDevice}
					/>
				</div>
			)
		} else {
			overlay = (
				<div style={{display:'none'}}>
					<Overlay
						settings={this.state.overlay}
						onClose={this.displayOverlay}
						onSave={this.onSaveMode}
						targetDevice={this.state.targetDevice}
					/>
				</div>
			)
		}

		let page = Utils.capitalize(window.location.hash.split('#')[1])
		if (this.state.targetDevice === "mobile") {
			if (this.state.changeOrientationWarning) {
				return (
					<React.Fragment>
						<div className="Blur"></div>
						<img width="117" height="117" id='rotate-img' src={`${process.env.PUBLIC_URL}/assets/images/rotate.svg`} alt='Rotate' />
					</React.Fragment>
				)
			} else {
				return (
					<React.Fragment>
						{ overlay }
						<div id="top-section">
							<p>{page}</p>
							<button className="about-icon-mobile" onClick={this.showAbout}>
								i
							</button>
						</div>
						{contentToRender}
					</React.Fragment>
				)
			}

		} else {
			return (
				<React.Fragment>
					{ overlay }
					{contentToRender}
					<button className="about-icon" onClick={this.showAbout}>
						i
					</button>
				</React.Fragment>
			)
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
		initModes,
		initRules,
		addMode,
		editMode,
		getFactorySettings,
		selectMode
	}
	)(App);
