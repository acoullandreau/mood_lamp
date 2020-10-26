import React from 'react';
import ModeTile from './ModeTile.js';
// import PropTypes from 'prop-types';

class ModesList extends React.Component {

	state = {'modesList':[]};

	componentDidUpdate() {
		// we ensure that we have a grid the right size
		var numRows = Math.ceil(Object.keys(this.state.modesList).length / 3)
		document.getElementById("mode-grid").style['grid-template-rows'] = `repeat(${numRows}, 23vh)`;
	}

	onModeDelete = (modeId) => {
		var modesList = this.state.modesList ;
		modesList.splice(modeId, 1);
		this.setState({ modesList });
	}

	setModesList = (modesList) => {
		this.setState({ modesList })
	}
	
	renderListItems = () => {
		return (
			<div id="mode-grid">
			  	{
					React.Children.toArray(
						Object.keys(this.state.modesList).map((item, i) => {
							return (
								<ModeTile id={i} model={this.state.modesList[item]} onModeDelete={this.onModeDelete} />
							);

						})
					)
				}
			</div>
		)
	}

	render() {
		return (
			<React.Fragment>
				{this.renderListItems()}
			</React.Fragment>
		) 

	}
}

// ModesList.propTypes = {
// 	modesList:PropTypes.array.isRequired
// }

export default ModesList;