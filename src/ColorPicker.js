import React from 'react';
import PropTypes from 'prop-types';
import iro from '@jaames/iro';

var colorPicker = new iro.ColorPicker('#picker');

class ColorPicker extends React.Component {

	//state = {target, brightness, color, speed}

	renderSingleColorPicker() {
		return (
			<div id="picker" >Single Color Picker </div>
		)
	}

	renderGradientColorPicker() {
		return (
			<div id="picker" >Gradient Color Picker </div>
		)
	}


	render() {
		if (this.props.params.target === 'single') {
			return (
				<React.Fragment>
					{this.renderSingleColorPicker()}
				</React.Fragment>
			)
		} else if (this.props.params.target === 'gradient') {
			return (
				<React.Fragment>
					{this.renderGradientColorPicker()}
				</React.Fragment>
			)
		}
	}

}

// props validation
ColorPicker.propTypes = {
	params:PropTypes.object.isRequired
}

export default ColorPicker;