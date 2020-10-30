import React from 'react';
import { connect } from 'react-redux';
import ModeTile from './ModeTile.js';
import PropTypes from 'prop-types';

class ModesList extends React.Component {

	componentDidUpdate() {
		// we ensure that we have a grid the right size
		var numRows = Math.ceil(Object.keys(this.props.modesList).length / 3)
		document.getElementById("mode-grid").style['grid-template-rows'] = `repeat(${numRows}, 23vh)`;
	}

	renderListItems = () => {
		return (
			<div id="mode-grid">
			  	{
					React.Children.toArray(
						Object.keys(this.props.modesList).map((item, i) => {
							return (
								<ModeTile id={i} onEditMode={this.props.onEditMode} model={this.props.modesList[item]} />
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

const mapStateToProps = (state) => {
	return { modesList : state.modes };
}


ModesList.propTypes = {
	onEditMode:PropTypes.func.isRequired
}

export default connect(mapStateToProps)(ModesList);