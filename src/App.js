import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import logo from './image_library/logo.svg';
import ColorPicker from './ColorPicker.js';
import Route from './Route.js';
import SideNavBar from './SideNavBar.js';


class App extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			'isConnected':false,
			'modes':{0:{'name':'Éteindre', 'color':'', 'speed':0}, 
					1:{'name':'Fête', 'color':'party', 'speed':80}, 
					2:{'name':'Discussion', 'color':'talk', 'speed':30},
					3:{'name':'Ambiance', 'color':{ r: 255, g: 241, b: 224 },'speed':0}
			},
			'automatismes':{}
		};

		this.onWindowResize();
	}


	componentDidMount() {
		window.addEventListener('resize', this.onWindowResize);

		//fetch JSON of modes
		//fetch automatismes configuration
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.onWindowResize);
	}

	onWindowResize() {
		var screenRatio = window.innerHeight/window.innerWidth;
		if (screenRatio < 0.75) {
			var width = window.innerHeight / 0.75;
			document.getElementById('root').style.width = width + 'px' ;
			document.getElementById('root').style.height = window.innerHeight + 'px' ;
		}
	}


	onSaveNewMode = (params) => {
		console.log(params);
	}

	onConnect = (event) => {
		console.log(event)
		if (event.target.value === 'connect') {
			this.setState({'isConnected':true});
		} else {
			this.setState({'isConnected':false});
		}
	}

	renderHome = () => {
		return (
			<div id='home'>
				<button 
					type="button"
					value='connect'
					className={['column-one', 'button-home', `button-home-${this.state.isConnected === false ? 'active' : 'inactive'}`].join(' ')}
					disabled={this.state.isConnected}
					onClick={this.onConnect}
				>Connect</button>
				<button 
					type="button"
					value='disconnect'
					className={['column-two', 'button-home', `button-home-${this.state.isConnected === true ? 'active' : 'inactive'}`].join(' ')}
					disabled={!this.state.isConnected}
					onClick={this.onConnect}
				>Disconnect</button>
			</div>
		)
	}

	renderModes = () => {
		return (
			<div className="grid-row-two">
				Modes
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
						<ColorPicker target='single' onSaveMode={this.onSaveNewMode} />
					</TabPanel>
					<TabPanel>
						<ColorPicker target='gradient' onSaveMode={this.onSaveNewMode} />
					</TabPanel>
				</Tabs>
			</React.Fragment>
		)
	}

				/*<div id="scroll-down"><img className="scroll-down-img" src="./image_library/icon_scroll_down.svg" alt="Scroll Icon"/></div>*/

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
		return (
			<div className="grid-content">
				<div className="content-one">
					<div id='logo'>
						<a href=''><img src={logo} alt='Maïa' /></a>
					</div>
					<div id='nav-bar'>
						<SideNavBar/>
					</div>
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
		);

  }
}

export default App;
