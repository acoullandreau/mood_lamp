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
			'modes':{0:{'name':'Éteindre', 'color':'', 'brightness':0, 'speed':0}, 
					1:{'name':'Fête', 'color':'party', 'brightness':100, 'speed':2}, 
					2:{'name':'Discussion', 'color':'talk', 'brightness':80, 'speed':1},
					3:{'name':'Ambiance', 'color':{ r: 255, g: 241, b: 224 }, 'brightness':50, 'speed':0}
			},
			'automatismes':{}
		};

	}


	componentDidMount() {
		//fetch JSON of modes
		//fetch automatismes configuration
	}

	onSaveNewMode = (params) => {
		console.log(params);
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
						<a href="#modes"><img src={logo} alt='Maïa' /></a>
					</div>
					<div id='nav-bar'>
						<SideNavBar/>
					</div>
				</div>
				<div className={["content-two", "column-two"].join(' ')}>
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
