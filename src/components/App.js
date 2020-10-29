import React from 'react';
import { connect } from 'react-redux';
// import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { fetchModes } from '../actions';
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
			'overlay':{'display':false, 'source':'', 'title':'', 'message':'', 'modeName':''},
			'disconnectDisplay':{ 'display':'none' },
			'modesList':[]
		};

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
		var overlay = {...this.state.overlay};
		overlay['display'] = parameters.display;
		overlay['source'] = parameters.source;
		overlay['title'] = parameters.title;
		overlay['message'] = parameters.message;
		this.setState({ overlay });
	}

	onSaveNewMode = (modeName) => {
		// var modeParams;
		// if (this.state.overlay.source === 'single') {
		// 	modeParams = this.singleColorPickerRef.current.getModeParams();
		// } else {
		// 	modeParams = this.gradientColorPickerRef.current.getModeParams();
		// }

		// var newMode = {
		// 	'name':modeName, 
		// 	'isOriginMode':false, 
		// 	'isEditable':true, 
		// 	'category':this.state.overlay.source, 
		// 	'colors':modeParams.colors, 
		// 	'speed':modeParams.speed
		// }

		// var modeModel = ModeModel.createNewModeModel(newMode);
		//this.modeListRef.current.addNewMode(modeModel);

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
					<ModesList />
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
			'colors':['#FFFFFF'], 
			'speed':30
		}

		var modeModel = ModeModel.createNewModeModel(mode);

		return (
			<React.Fragment>
				<ColorPicker 
					modeModel={modeModel}
					onSaveMode={this.displayOverlay}
				/>
			</React.Fragment>
		)
		// if (this.state.isConnected) { 
			// var mode = { 
			// 	'isOriginMode':false, 
			// 	'isEditable':true, 
			// 	'category':'single', 
			// 	'colors':['#FFFFFF'], 
			// 	'speed':0
			// }
			// var modeGradient = {
			// 	'isOriginMode':false, 
			// 	'isEditable':true, 
			// 	'category':'gradient', 
			// 	'colors':['#827081', '#DACEDA'], 
			// 	'speed':30
			// }
			// return (
			// 	<React.Fragment>
			// 		<Tabs forceRenderTabPanel={true} >
			// 			<TabList>
			// 				<Tab>Couleur unique</Tab>
			// 				<Tab>Gradient</Tab>
			// 			</TabList>

			// 			<TabPanel>
			// 				<ColorPicker 
			// 					modeModel={ModeModel.createNewModeModel(modeSingle)}
			// 					onSaveMode={this.displayOverlay} 
			// 					ref={this.singleColorPickerRef} 
			// 				/>
			// 			</TabPanel>
			// 			<TabPanel>
			// 				<ColorPicker 
			// 					modeModel={ModeModel.createNewModeModel(modeGradient)}
			// 					onSaveMode={this.displayOverlay} 
			// 					ref={this.gradientColorPickerRef} 
			// 				/>
			// 			</TabPanel>
			// 		</Tabs>
			// 	</React.Fragment>
			// )
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
					<Overlay settings={this.state.overlay} onClose={this.displayOverlay} onSave={this.onSaveNewMode}/>
				</div>
			)
		} else {
			overlay = (
				<div style={{display:'none'}}>
					<Overlay settings={this.state.overlay} onClose={this.displayOverlay} onSave={this.onSaveNewMode}/>
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


export default connect(null, { fetchModes })(App);
