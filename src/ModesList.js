import React from 'react';
import ModeTile from './ModeTile.js';
import PropTypes from 'prop-types';

class ModesList extends React.Component {

	// state = {'selectedMode':''}; 

	componentDidMount() {
		// we ensure that we have a grid the right size
		var numRows = Math.ceil(Object.keys(this.props.modesList).length / 3)
		document.getElementById("mode-grid").style['grid-template-rows'] = `repeat(${numRows}, 23vh)`;
	}

	onHover = (event, bool) => {
		if (event.target.id === '') {
			console.log(event.target)
		}


		if (bool) {
			this.setState({'selectedMode':event.target.value, 'idemId':event.target.id}, () => {
				var id = this.state.idemId;
				document.getElementsByClassName("mode-hover")[id].style.display = 'block';
			})
		} else {
			var id = this.state.idemId;
			// console.log(id)
			document.getElementsByClassName("mode-hover")[id].style.display = 'none';

		}

	}	

	renderListItems = () => {
		return (
			<div id="mode-grid">
			  	{
					React.Children.toArray(
						Object.keys(this.props.modesList).map((item, i) => {
							return (
								<ModeTile model={this.props.modesList[item]} />
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

ModesList.propTypes = {
	modesList:PropTypes.array.isRequired
}

export default ModesList;