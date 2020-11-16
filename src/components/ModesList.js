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
		var numRows = Math.ceil(Object.keys(this.props.modesList).length / 3);
		if (this.props.target === 'mobile') {
			numRows = Math.ceil(Object.keys(this.props.modesList).length / 2);
			document.getElementById("mode-grid").style['grid-template-rows'] = `repeat(${numRows}, minmax(150px, 20vh))`;
		} else {
			document.getElementById("mode-grid").style['grid-template-rows'] = `repeat(${numRows}, minmax(192px, 25vh))`;
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
				<div id="mode-grid">
				  	{
						React.Children.toArray(
							Object.keys(this.props.modesList).map((item, i) => {
								if (this.props.modesList[item].isOriginMode === false) {
									return (
										<ModeTile 
											id={i} 
											onEditMode={this.props.onEditMode}
											onDeleteMode={this.props.onDeleteMode}
											model={this.props.modesList[item]} 
											onTileSelect={this.selectTile}
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
				<div id="mode-grid">
				  	{
						React.Children.toArray(
							Object.keys(this.props.modesList).map((item, i) => {
								if (this.props.modesList[item].isOriginMode) {			
									return (
										<ModeTile 
											id={i} 
											onEditMode={this.props.onEditMode} 
											onDeleteMode={this.props.onDeleteMode}
											model={this.props.modesList[item]} 
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
				<Tabs forceRenderTabPanel={true} defaultIndex={this.props.index}>
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
	target:PropTypes.string.isRequired
}

export default connect(mapStateToProps)(ModesList);