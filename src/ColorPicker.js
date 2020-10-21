import React from 'react';
import PropTypes from 'prop-types';
import iro from '@jaames/iro';

class IroColorPicker extends React.Component {

	componentDidMount() {
		console.trace('new colorPicker')
		const { props } = this;
		// create a new iro color picker and pass component props to it
		this.colorPicker = new iro.ColorPicker(this.el, props.params);
		// call onColorChange prop whenever the color changes
		this.colorPicker.on('color:change', (color) => {
			if (props.onColorChange) {
				props.onColorChange(color);
			}
		});
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

	render() {
		console.log(this.props)
		return (
			<div ref={el => this.el = el} />
		);
	}
}


class ColorPicker extends React.Component {

	state = {'single':{
		id:'single',
		width: 250,
		margin:100,
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
	}, 'gradient':{
		id:'gradient',
		width: 250,
		margin:100,
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
	}}
	

	handleColorChange = (color) => {
		// send color to the microcontroller for live update
		console.log(color.rgb)
	}

	renderSingleColorPicker() {
		console.log(this.state.single)
		return (
			<div>
				<div>Single Color Picker </div>
				<IroColorPicker
					params={this.state.single}
					onColorChange={(color) => this.handleColorChange(color)}
				/>
			</div>
		)
	}

	renderGradientColorPicker() {
		console.log(this.state.gradient)

		return (
			<div>
				<div>Gradient Color Picker </div>
				<IroColorPicker
					params={this.state.gradient}
					onColorChange={(color) => this.handleColorChange(color)}
				/>
			</div>
		)
	}


	render() { 
		console.log(this.props.target)
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