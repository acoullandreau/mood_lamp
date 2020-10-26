import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import ColorPicker from './ColorPicker.js';
import ModeModel from './ModeModel.js';
import ModesList from './ModesList.js';
import Overlay from './Overlay.js';
import Route from './Route.js';
import SideNavBar from './SideNavBar.js';

class App extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			'isConnected':false,
			'numDefaultModes':1,
			'overlay':false,
			'disconnectDisplay':{ 'display':'none' },
			'modesList':[],
			'automatismes':{}
		};

		this.elemRefs = {};
		this.singleColorPickerRef = React.createRef();
		this.gradientColorPickerRef = React.createRef();
		this.onWindowResize();
	}


	componentDidMount() {
		window.addEventListener('resize', this.onWindowResize);
		window.addEventListener('popstate', this.onLocationChange);
		
		//fetch JSON of modes
		var modesArray = [
			{'name':'Éteindre', 'isOriginMode':true, 'category':'off', 'color':[{ r: 0, g: 0, b: 0 }], 'speed':0},
			{'name':'Fête', 'isOriginMode':true, 'category':'sound', 'color':[{ r: 10, g: 241, b: 135 }], 'speed':0}, 
			{'name':'Discussion', 'isOriginMode':true, 'category':'sound', 'color':[{ r: 125, g: 125, b: 125 }], 'speed':0},
			{'name':'Temperature Ambiance', 'isOriginMode':true, 'category':'temperature', 'color':[{ r: 25, g: 25, b: 25 }], 'speed':0},
			{'name':'Humidity Ambiance', 'isOriginMode':true, 'category':'humidity', 'color':[{ r: 250, g: 250, b: 250 }], 'speed':0},
			{'name':'Saved Mode', 'isOriginMode':false, 'category':'gradient', 'color':[{ r: 30, g: 40, b: 50 }, { r: 100, g: 120, b: 140 }], 'speed':80}
		];
		// deserialize the JSON
		this.deserializeModes(modesArray);

		//fetch automatismes configuration
	}

	componentDidUpdate() {
		this.serializeModes();
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

	deserializeModes = (modesArray) => {
		var modesList = [];

		for (let i=0 ; i < modesArray.length ; i++) {
			const mode = ModeModel.deserialize(modesArray[i]);
			modesList.push(mode);
		}
		this.setState({ modesList });
	}

	createModeRef = (ref, i) => {
		this.elemRefs[`mode${i}`] = ref;
	}

	serializeModes = () => {
		for (const mode in this.elemRefs) {
			console.log(this.elemRefs[mode])
			// if (this.elemRefs[mode] !== null) {
			// 	console.log(this.elemRefs[mode].state);
			// }
		} 
	}

	displayOverlay = (source) => {
		var overlay = {...this.state.overlay};
		overlay['display'] = !overlay['display'];
		overlay['source'] = source;
		this.setState({ overlay });
	}


	onSaveNewMode = (modeName) => {
		// var modeParams;
		// if (this.state.overlay.source === 'single') {
		// 	modeParams = this.singleColorPickerRef.current.getModeParams();
		// } else {
		// 	modeParams = this.gradientColorPickerRef.current.getModeParams();
		// }

		// var newMode = {'name':modeName, 'color':modeParams.color, 'speed':modeParams.speed};
		// var modeIndex = Object.keys(this.state.modes).length;
		// var modes = {...this.state.modes};
		// modes[modeIndex] = newMode;
		// this.setState({ modes });

	}

	onModeDelete = (modeId) => {
		//delete this.elemRefs[`mode${modeId}`];
		var modesList = this.state.modesList ;
		modesList.splice(modeId, 1);
		this.setState({ modesList }, console.log(this.state));
	}

	onConnect = () => {
		if (this.state.isConnected === false) {
			this.setState({'isConnected':true});
			window.history.pushState({}, '', '#modes');
			const navEvent = new PopStateEvent('popstate');
			window.dispatchEvent(navEvent);
		} else {
			this.setState({'isConnected':false});
			window.history.pushState({}, '', '#');
			const navEvent = new PopStateEvent('popstate');
			window.dispatchEvent(navEvent);
		}

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

		return (
			<div className='grid-row-two'>
				<ModesList modesList={this.state.modesList}/>
			</div>
		)
	}

	renderCouleurs = () => {
		return (
			<React.Fragment>
				<Tabs forceRenderTabPanel={true} >
					<TabList>
						<Tab>Couleur unique</Tab>
						<Tab>Gradient</Tab>
					</TabList>

					<TabPanel>
						<ColorPicker target='single' onSaveMode={this.displayOverlay} ref={this.singleColorPickerRef} />
					</TabPanel>
					<TabPanel>
						<ColorPicker target='gradient' onSaveMode={this.displayOverlay} ref={this.gradientColorPickerRef} />
					</TabPanel>
				</Tabs>
			</React.Fragment>
		)
	}

	renderMesures = () => {
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


	renderAutomatismes = () => {
		return (
			<div className="grid-row-two">
				Automatismes
			</div>
		)
	}

	render() {

		let disconnectDisplay = this.state.disconnectDisplay;
		let overlay;
		if (this.state.overlay.display) {
			overlay = (
				<div style={{display:'block'}}>
					<Overlay onClose={this.displayOverlay} onSave={this.onSaveNewMode}/>
				</div>
			)
		} else {
			overlay = (
				<div style={{display:'none'}}>
					<Overlay onClose={this.displayOverlay} onSave={this.onSaveNewMode}/>
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


export default App;
