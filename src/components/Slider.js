import React from 'react';
import PropTypes from 'prop-types';

class Slider extends React.Component {
	constructor(props) {
		super(props)
		this.state = {value: this.props.initialSpeed}
	}

	handleChange = (event) => {
		this.setState({value: event.target.value});
		this.props.onChange(event.target.value);
		document.getElementById("slider").style.background='linear-gradient(to right, #FEEDDF 0%, #FEEDDF '+this.state.value +'%, #827081 ' + this.state.value + '%, #827081 100%)';
	}

 	render() {

 		var style = {};
 		if (this.props.isDisabled) {
 			var style = {'opacity':'0.3'};
		} 

		return (
	    	<div id="slider-block" style={style} className={['column-one', 'grid-row-two'].join(' ')}>
	      		<img className='slider-img' src={`${process.env.PUBLIC_URL}/assets/images/slow.svg`} alt='Lent' />
				<input 
					id="slider" 
					type="range" 
					min="0" max="100" 
					value={this.state.value} 
					onChange={this.handleChange}
					onClick={this.handleChange}
					step="1"
				/>
				<img className='slider-img' src={`${process.env.PUBLIC_URL}/assets/images/fast.svg`} alt='Rapide' />
	    	</div>
    	);

	}
}

// props validation
Slider.propTypes = {
	isDisabled:PropTypes.bool.isRequired,
	initialSpeed:PropTypes.string.isRequired,
	onChange:PropTypes.func.isRequired
}

export default Slider;

