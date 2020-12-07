import React from 'react';
import { connect } from 'react-redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import PropTypes from 'prop-types';
import ModeTile from './ModeTile.js';

class ModesList extends React.Component {

	componentDidMount() {
		this.getGridSize();
	}

	componentDidUpdate() {
		this.getGridSize();
	}

	getGridSize() {
		// we ensure that we have a grid the right size
		var modesListDefault = this.props.modesList.filter(mode => mode.isOriginMode === true);
		var modesListCustom = this.props.modesList.filter(mode => mode.isOriginMode === false);
		var numRowsDefault;
		var numRowsCustom;

		if (this.props.targetDevice === 'mobile') {
			numRowsDefault = Math.ceil(Object.keys(modesListDefault).length / 2);
			numRowsCustom = Math.ceil(Object.keys(modesListCustom).length / 2);
			document.getElementById("mode-grid-default").style['grid-template-rows'] = `repeat(${numRowsDefault}, minmax(150px, 25vh))`;
			document.getElementById("mode-grid-custom").style['grid-template-rows'] = `repeat(${numRowsCustom}, minmax(150px, 25vh))`;
		} else {
			numRowsDefault = Math.ceil(Object.keys(modesListDefault).length / 3);
			numRowsCustom = Math.ceil(Object.keys(modesListCustom).length / 3);
			document.getElementById("mode-grid-default").style['grid-template-rows'] = `repeat(${numRowsDefault}, minmax(192px, 25vh))`;
			document.getElementById("mode-grid-custom").style['grid-template-rows'] = `repeat(${numRowsCustom}, minmax(192px, 25vh))`;
		}
	}

	addMode() {
		window.history.pushState({}, '', '#couleurs');
		const navEvent = new PopStateEvent('popstate');
		window.dispatchEvent(navEvent);
	}

	renderAddModeButton() {
		return (	
			<div className='mode-sub-grid'>
				<button 
					id='add-mode'
					className= "grid-row-one"
					onClick={this.addMode}
				>
					+
				</button>
			</div>
		)

	}

	renderListItems = (type) => {

		if (type === 'custom') {
			return (
				<div className="mode-grid" id="mode-grid-custom">
				  	{
						React.Children.toArray(
							Object.keys(this.props.modesList).map((item, i) => {
								if (this.props.modesList[item].isOriginMode === false) {
									return (
										<ModeTile 
											id={this.props.modesList[item].id} 
											onEditMode={this.props.onEditMode}
											onDeleteMode={this.props.onDeleteMode}
											model={this.props.modesList[item]} 
											onTileSelect={this.selectTile}
											targetDevice={this.props.targetDevice}
										/>
									);
								}
								return null;

							})
						)
					}

					{this.renderAddModeButton()}
				</div>
			)
		} else if (type === 'default') {
			return (
				<div className="mode-grid" id="mode-grid-default">
				  	{
						React.Children.toArray(
							Object.keys(this.props.modesList).map((item, i) => {
								if (this.props.modesList[item].isOriginMode) {			
									return (
										<ModeTile 
											id={this.props.modesList[item].id} 
											onEditMode={this.props.onEditMode} 
											onDeleteMode={this.props.onDeleteMode}
											model={this.props.modesList[item]} 
											targetDevice={this.props.targetDevice}
										/>
									);
								}
								return null;

							})
						)
					}
				</div>
			)
		}
		return null;
	}

	render() {
		return (
			<React.Fragment>
				<Tabs forceRenderTabPanel={true} defaultIndex={this.props.index} onSelect={() => this.getGridSize()}>
					<TabList>
					<Tab>Interactifs</Tab>
					<Tab>Personalisés</Tab>
					</TabList>

					<TabPanel>
						{this.renderListItems('default')}
					</TabPanel>
					<TabPanel>
						{this.renderListItems('custom')}
					</TabPanel>
				</Tabs>
			</React.Fragment>
		) 

	}
}

const mapStateToProps = (state) => {
	return { modesList : state.modes };
}


ModesList.propTypes = {
	index:PropTypes.number.isRequired,
	onEditMode:PropTypes.func.isRequired,
	onDeleteMode:PropTypes.func.isRequired,
	targetDevice:PropTypes.string.isRequired
}

export default connect(mapStateToProps)(ModesList);