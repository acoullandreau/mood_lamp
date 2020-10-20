import React from 'react';
import PropTypes from 'prop-types';

class ColorPicker extends React.Component {

	render() {
		return <div>Color Picker</div>
	}

}

// props validation
ColorPicker.propTypes = {
	params:PropTypes.object.isRequired
}

export default ColorPicker;