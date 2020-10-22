import React from 'react';
import PropTypes from 'prop-types';
import iro from '@jaames/iro';
import Slider from './Slider.js';
import star from './image_library/star.svg';

class IroColorPicker extends React.Component {

	componentDidMount() {
		const { props } = this;
		// create a new iro color picker and pass component props to it
		this.colorPicker = new iro.ColorPicker(this.el, props.params);
		// call onColorChange prop whenever the color changes
		this.colorPicker.on('color:change', (color) => {
			if (props.onColorChange) {
				props.onColorChange(color);
			}
		});

		window.addEventListener('resize', this.onWindowResize);
	}

	componentDidUpdate() {
		// isolate color from the rest of the props
		const {color, ...colorPickerState} = this.props;
		// update color
		if (color) {
			this.colorPicker.color.set(color);
		}
		// push rest of the component props to the colorPicker's state
		this.colorPicker.setState(colorPickerState);
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.onWindowResize);
	}

	onWindowResize = () => {
		var newWidth = 0.6 * window.innerHeight;
		this.colorPicker.resize(newWidth);
	}

	render() {
		return (
			<div ref={el => this.el = el} />
		);
	}
}


class ColorPicker extends React.Component {

	state = {
		'selectedColor':'#FFFFFF', 
		'selectedColors':['#FA4D3D', '#28666E'],
		'animationSpeed':30,
		'layoutParams':{
			width: this.getInitialWidth(),
			margin:80,
			layoutDirection: 'horizontal',
			borderWidth: 2,
			layout: [
				{
					component: iro.ui.Wheel,
					options: {
						borderColor: '#ffffff'
					}
				},
				{
					component: iro.ui.Slider,
					options: {
						borderColor: '#000000'
					}
				}
			]
		}
	}

	getInitialWidth() {
		//console.log(0.6 * window.innerHeight, 0.6 * window.innerWidth)
		return 0.6 * window.innerHeight;
	}

	onSpeedChange = (speed) => {
		// save the currently selected color
		this.setState({'animationSpeed':speed});
		// send color to the microcontroller for live update
		// #############################################
	}

	onSingleColorSelect = (color) => {
		// save the currently selected color
		this.setState({'selectedColor':color.rgb});
		// send color to the microcontroller for live update
		// #############################################
	}

	onGradientColorSelect = (color) => {
		// save the currently selected color
		var selectedColors = this.state.selectedColors;
		var colorIndex = color.index;
		selectedColors[colorIndex]=color.hexString;
		this.setState({'selectedColors':selectedColors});
		// send color to the microcontroller for live update
		// #############################################
	}

	addColorSelector = (event) => {
		var selectedColors = this.state.selectedColors;
		selectedColors.push('FFFFFF');
		this.setState({'selectedColors':selectedColors});
	}
	
	onColorClick = (event) => {
		console.log(event)
	}

	renderSingleColorPicker() {
		var params = this.state.layoutParams;
		params['color'] = this.state.selectedColor;

		return (
			<React.Fragment>
				<div id='single-color'>
					<IroColorPicker
						params={params}
						onColorChange={(color) => this.onSingleColorSelect(color)}
					/>
				</div>
				<div className='button-single-color-picker'>
					<button className='save-button'>
						<img style={{marginRight:'7%'}} src={star} alt='Enregistrer'/>
						Enregistrer mode
					</button>
				</div>
			</React.Fragment>
		)
	}

	renderColorSelectors = () => {
		var addSelector;

		if (this.state.selectedColors.length < 10) {
			addSelector = (
				<button 
					className='color-selector' 
					id='add-selector'
					onClick={this.addColorSelector}
				>
					+
				</button>
			)
		} 

		return (
			<div id='selectors' className={['column-two', 'grid-row-one'].join(' ')} >
			  	{
					React.Children.toArray(
						Object.keys(this.state.selectedColors).map((item, i) => {
							var background = this.state.selectedColors[item];
							return (
								<button 
									className='color-selector' 
									style={{'backgroundColor':background}}
									onClick={this.onColorClick}
								></button>
							)
						})
					)
				}
				{addSelector}
			</div>
		)
	}

	renderGradientColorPicker() {
		var params = this.state.layoutParams;
		params['colors'] = this.state.selectedColors;

		return (
			<div id='gradient-color'>
				<IroColorPicker
					className={['column-one', 'grid-row-one'].join(' ')}
					params={params}
					onColorChange={(color) => this.onGradientColorSelect(color)}
				/>
				{ this.renderColorSelectors() }
				<Slider onChange={this.onSpeedChange}/>
				<div className={['column-two', 'grid-row-two', 'button-gradient-color-picker'].join(' ')}>
					<button className='save-button'>
						<img style={{marginRight:'7%'}} src={star} alt='Enregistrer'/>
						Enregistrer mode
					</button>
				</div>
			</div>
		)
	}


	render() { 
		if (this.props.target === 'single') {
			return (
				<React.Fragment>
					{this.renderSingleColorPicker()}
				</React.Fragment>
			)
		} else if (this.props.target === 'gradient') {
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
	target:PropTypes.string.isRequired
}

export default ColorPicker;