import React from 'react';
import PropTypes from 'prop-types';
import slow from './image_library/slow.svg';
import fast from './image_library/fast.svg';


class Slider extends React.Component {
	constructor() {
		super()
		this.state = {value: 30}
	}

	handleChange = (event) => {
		this.setState({value: event.target.value});
		this.props.onChange(event.target.value);
		document.getElementById("slider").style.background='linear-gradient(to right, #FEEDDF 0%, #FEEDDF '+this.state.value +'%, #827081 ' + this.state.value + '%, #827081 100%)';
	}

 	render() {
		return (
	    	<div id="slider-block" className={['column-one', 'grid-row-two'].join(' ')}>
	      		<img className='slider-img' src={slow} alt='Lent' />
				<input 
					id="slider" 
					type="range" 
					min="0" max="100" 
					value={this.state.value} 
					onChange={this.handleChange}
					step="1"
				/>
				<img className='slider-img' src={fast} alt='Rapide' />
	    	</div>
	    );
	}
}

// props validation
Slider.propTypes = {
	onChange:PropTypes.func.isRequired
}

export default Slider;

