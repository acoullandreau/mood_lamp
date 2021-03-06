import React from 'react';
import PropTypes from 'prop-types';

class Slider extends React.Component {
	/**
		This component is in charge of rendering a slider along with a ColorPicker component, for the user to adjust animation speed.
	*/

	constructor(props) {
		super(props)
		this.state = {value: this.props.initialSpeed};
	}

	handleChange = (event) => {
		/**
			This method is triggered at every click/change of the value of the slider.
			If the slider is not disabled, the value selected is set as the new value of the slider (thus triggering an update of the component rendered).
		*/

		if (this.props.isDisabled === false) {
			this.setState({value: event.target.value});
			this.props.onChange(event.target.value);
		}
	}

 	render() {
 		var styleBlock = {};
 		if (this.props.isDisabled) {
 			styleBlock.opacity = '0.3';
		} 

		var styleSlider = {'background':'linear-gradient(to right, #FEEDDF 0%, #FEEDDF '+this.state.value +'%, #827081 ' + this.state.value + '%, #827081 100%)'};

		return (
	    	<div id="slider-block" style={styleBlock} className={this.props.className}>
	      		<img width="81" height="42" className='slider-img' src={`${process.env.PUBLIC_URL}/assets/images/slow.svg`} alt='Lent' />
				<input 
					id="slider" 
					style={styleSlider}
					type="range" 
					min="0" max="100" 
					value={this.state.value} 
					onChange={this.handleChange}
					onClick={this.handleChange}
					step="1"
				/>
				<img width="80" height="68" className='slider-img' src={`${process.env.PUBLIC_URL}/assets/images/fast.svg`} alt='Rapide' />
	    	</div>
    	);

	}
}

// props validation
Slider.propTypes = {
	isDisabled:PropTypes.bool.isRequired,
	initialSpeed:PropTypes.string.isRequired,
	onChange:PropTypes.func.isRequired,
	className:PropTypes.string.isRequired
}

export default Slider;

