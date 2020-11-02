import React from 'react';
import { connect } from 'react-redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import PropTypes from 'prop-types';
import ModeTile from './ModeTile.js';

class ModesList extends React.Component {

	componentDidUpdate() {
		// we ensure that we have a grid the right size
		var numRows = Math.ceil(Object.keys(this.props.modesList).length / 3)
		document.getElementById("mode-grid").style['grid-template-rows'] = `repeat(${numRows}, 25vh)`;
	}


	addMode() {
		window.history.pushState({}, '', '#couleurs');
		const navEvent = new PopStateEvent('popstate');
		window.dispatchEvent(navEvent);
	}

	renderAddModeButton() {
		return (
			<button 
				id='add-mode'
				onClick={this.addMode}
			>
				+
			</button>
		)

	}

	renderListItems = (target) => {

		if (target === 'custom') {
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
		} else if (target === 'default') {
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
	}

	render() {
		return (
			<React.Fragment>
				<Tabs forceRenderTabPanel={true} >
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
	onEditMode:PropTypes.func.isRequired
}

export default connect(mapStateToProps)(ModesList);