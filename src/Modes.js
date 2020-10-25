import React from 'react';
import Utils from './Utils.js';
//import PropTypes from 'prop-types';

class Modes extends React.Component {

	componentDidMount() {
		// we ensure that we have a grid the right size
		var numRows = Math.ceil(Object.keys(this.props.modesList).length / 3)
		document.getElementById("mode-grid").style['grid-template-rows'] = `repeat(${numRows}, 23vh)`;
	}

	launchMode = (event) => {
		//console.log(event.target.value)
	}

	getThumbnail = (item) => {
		
		return Utils.convertRGBToString(item.color[0]);

	}


	renderListItems = () => {
		return (
			<div id="mode-grid">
			  	{
					React.Children.toArray(
						Object.keys(this.props.modesList).map((item, i) => {
							var mode = this.props.modesList[item];
							var background = this.getThumbnail(mode);
							return (
								<div className='mode-sub-grid'>
									<button
										className={["mode-button", "grid-row-one"].join(' ')}
										style={{'backgroundColor':background}}
										value={mode}
										onClick={this.launchMode}
									></button>
									<div className={["mode-text", "grid-row-two"].join(' ')}>{mode.name}</div>
								</div>
							)
						})
					)
				}
			</div>
		)
	}


	render() {
		console.log(this.props.modesList)

		return (
			<React.Fragment>
				{this.renderListItems()}
			</React.Fragment>
		) 

	}
}


// Modes.propTypes = {
//    onClose:PropTypes.func.isRequired,
//    onSave:PropTypes.func.isRequired
// }

export default Modes;