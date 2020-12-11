import React from 'react';
import { connect } from 'react-redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import PropTypes from 'prop-types';
import ModeTile from './ModeTile.js';
import Utils from '../classes/Utils.js';

class ModesList extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			'modesListUser' : this.filterSortModesArray('user'), 
			'modesListDefault' : this.filterSortModesArray('default'
		)};
	}

	componentDidMount() {
		this.getGridSize();
	}

	componentDidUpdate(prevProps) {
		this.getGridSize();
		if (Utils.compareObjects(prevProps.modesList, this.props.modesList) === false) {
			this.setState({
				'modesListUser' : this.filterSortModesArray('user'), 
				'modesListDefault' : this.filterSortModesArray('default')
			})
		};
	}

	getGridSize() {
		// we ensure that we have a grid the right size
		var modesListDefault = this.props.modesList.filter(mode => mode.isOriginMode === true);
		var modesListCustom = this.props.modesList.filter(mode => mode.isOriginMode === false);
		var numRowsDefault;
		var numRowsCustom;

		if (this.props.targetDevice === 'mobile') {
			numRowsDefault = Math.ceil(Object.keys(modesListDefault).length / 2);
			numRowsCustom = Math.ceil((Object.keys(modesListCustom).length + 1) / 2); // + 1 for the "+" icon at the beginning of the first row
			document.getElementById("mode-grid-default").style['grid-template-rows'] = `repeat(${numRowsDefault}, minmax(150px, 25vh))`;
			document.getElementById("mode-grid-custom").style['grid-template-rows'] = `repeat(${numRowsCustom}, minmax(150px, 25vh))`;
		} else {
			numRowsDefault = Math.ceil(Object.keys(modesListDefault).length / 3);
			numRowsCustom = Math.ceil((Object.keys(modesListCustom).length + 1) / 3); // + 1 for the "+" icon at the beginning of the first row
			document.getElementById("mode-grid-default").style['grid-template-rows'] = `repeat(${numRowsDefault}, minmax(192px, 25vh))`;
			document.getElementById("mode-grid-custom").style['grid-template-rows'] = `repeat(${numRowsCustom}, minmax(192px, 25vh))`;
		}
	}

	sortModesArray = (modesArray, reverse) => {
		const sortedArray = [...modesArray].sort(function(a, b) { 
			return a.orderIndex - b.orderIndex; 
		})

		if (reverse) {
			sortedArray.reverse();
		}

		return sortedArray;
	}

	filterSortModesArray = (target) => {
		var modesArray;
		if (target === 'user') {
			modesArray = this.props.modesList.filter(mode => mode.isOriginMode === false);
			modesArray = this.sortModesArray(modesArray, true);
		} else if (target === 'default') {
			modesArray = this.props.modesList.filter(mode => mode.isOriginMode === true);
			modesArray = this.sortModesArray(modesArray, false);
		}

		return modesArray;
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
					{this.renderAddModeButton()}
				  	
				  	{
						React.Children.toArray(
							Object.keys(this.state.modesListUser).map((item, i) => {
								return (
									<ModeTile 
										id={this.state.modesListUser[item].id} 
										onEditMode={this.props.onEditMode}
										onDeleteMode={this.props.onDeleteMode}
										model={this.state.modesListUser[item]} 
										onTileSelect={this.selectTile}
										targetDevice={this.props.targetDevice}
									/>
								);
							})
						)
					}

				</div>
			)
		} else if (type === 'default') {
			return (
				<div className="mode-grid" id="mode-grid-default">
				  	{
						React.Children.toArray(
							Object.keys(this.state.modesListDefault).map((item, i) => {
								return (
									<ModeTile 
										id={this.state.modesListDefault[item].id} 
										onEditMode={this.props.onEditMode} 
										onDeleteMode={this.props.onDeleteMode}
										model={this.state.modesListDefault[item]} 
										targetDevice={this.props.targetDevice}
									/>
								);

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