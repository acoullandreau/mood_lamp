import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { selectMode } from '../actions';
import iro from '@jaames/iro';
import ModeModel from './ModeModel.js';
import Slider from './Slider.js';
import Utils from '../Utils.js';

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
		var newWidth = 0.5 * window.innerHeight;
		this.colorPicker.resize(newWidth);
	}

	render() {
		return (
			<div style={{'alignSelf': 'center'}} ref={el => this.el = el} />
		);
	}
}

class ColorPicker extends React.Component {

	constructor(props) {
		super(props)

		this.state = {
			'selectedColorIndex':0,
			'showDelete':0,
			'selectedColors':this.getInitialColors(),
			'animationSpeed':this.props.modeModel.speed,
			'sliderDisabled':this.getInitialSliderDisabled(),
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

		this.colorPickerRef = React.createRef();
	}


	getInitialWidth() {
		var width = 0.5 * window.innerHeight;
		return width;
	}

	getInitialColors() {
		var initialColors = [];
		var colors = this.props.modeModel.colors;
		for (var i = 0; i < colors.length; i++) {
			var hexColor = Utils.convertRGBStringtoHex(colors[i]);
			initialColors.push(hexColor);
		}
		return initialColors;
	}

	getInitialSliderDisabled() {
		if (this.props.modeModel.colors.length > 1) {
			return false;
		}

		return true;
	}

	onSpeedChange = (speed) => {
		// save the currently selected color
		this.setState({'animationSpeed':speed});
		// send color to the microcontroller for live update
		// #############################################
	}

	onColorSelect = (color) => {
		// save the currently selected color and the current array of colors
		var selectedColors = this.state.selectedColors;
		var colorIndex = this.state.selectedColorIndex;
		selectedColors[colorIndex]=color.hexString;
		this.setState({
			'selectedColors':selectedColors
		});

		// send color to the microcontroller for live update
		// #############################################

		// if the color picker is not editing a saved mode, the selectedMode from the redux store should be cleared
		if (this.props.type === 'new') {
			this.props.selectMode('');
		}

	}

	onColorClick = (event) => {
		var selectedIndex = parseInt(event.currentTarget.value);

		if (selectedIndex > 0 && selectedIndex === this.state.showDelete) {
			this.removeColorSelector(selectedIndex);
		} else {
			this.selectColor(selectedIndex);
		}

	}

	addColorSelector = (event) => {
		var selectedColors = this.state.selectedColors;
		selectedColors.push('FFFFFF');
		var selectedColorIndex = this.state.selectedColors.length - 1;
		this.setState({
			'selectedColors':selectedColors, 
			'selectedColorIndex':selectedColorIndex, 
			'sliderDisabled':false,
			'showDelete':selectedColorIndex
		}, () => {
			this.colorPickerRef.current.colorPicker.color.set('FFFFFF');
		});
	}

	selectColor = (index) => {
		var showDeleteIndex = index === 0 ? null : index;;
		this.setState({'selectedColorIndex':index, 'showDelete':showDeleteIndex}, () => {
			var color = this.state.selectedColors[index];
			this.colorPickerRef.current.colorPicker.color.set(color);
		});
	} 

	removeColorSelector = (indexColorToRemove) => {
		if (indexColorToRemove > 0) {
			var selectedColors = this.state.selectedColors;
			selectedColors.splice(indexColorToRemove, 1);
			var sliderDisabled = selectedColors.length === 1 ? true : false;
			var selectedIndex = indexColorToRemove - 1;
			this.setState({
				'selectedColors':selectedColors, 
				'sliderDisabled':sliderDisabled,
				'selectedColorIndex':selectedIndex
			}, () => {
				this.selectColor(selectedIndex);
			});
		}

	}

	onSaveMode = () => {
		// add state to modeModel
		var modeColors = [];
		var selectedColors = this.state.selectedColors;
		for (var i = 0; i < selectedColors.length; i++) {
			var rgbColor = Utils.convertHexToRGB(selectedColors[i]);
			modeColors.push(rgbColor);
		}
		this.props.modeModel.setColors(modeColors);
		this.props.modeModel.setSpeed(this.state.animationSpeed);
 
		if (this.props.type === 'new') {
			// send the modeModel reference back to the App
			let params = {
				'type':'new',
				'display':true,
				'title':'Nouveau mode', 
				'message':'Enregistrer cette configuration comme nouveau mode préconfiguré.',
				'modeInstance':this.props.modeModel
			};
			this.props.onSaveNewMode(params);
		} else if (this.props.type === 'edit') {
			this.props.onSaveEditMode(this.props.modeModel);
		}


	}

	getSelectedBorder = (index, background) => {
		let hsvColor = Utils.convertHextoHSV(background);
		let borderColor;
		let borderStyle;

		if (hsvColor.s < 50 || (hsvColor.h > 40 && hsvColor.h < 190)) {
			borderColor = '#FA4D3D';//#FA4D3D
		} else {
			borderColor = '#FEEDDF';
		}

		if (parseInt(index) === this.state.selectedColorIndex) {
			borderStyle = `5px solid ${borderColor}`;
		} else {
			borderStyle = `1px solid ${borderColor}1A`;
		}

		return borderStyle;
	}

	renderDeleteIcon = (index, background) => {
		var hsvColor = Utils.convertHextoHSV(background);
		var style;
		if (hsvColor.v < 50) {
			style = {'filter':'invert(0)'};
		} else {
			style = {'filter':'invert(1)'};
		}

		if (index !== 0) {
			if (this.state.showDelete === index) {
				return (
					<React.Fragment>
						<img id="color-select-delete" style={style} src={`${process.env.PUBLIC_URL}/assets/images/delete.svg`} alt='Supprimer' />
					</React.Fragment>
				)
			}
		}

		return null;
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
							let background = this.state.selectedColors[item];
							let borderStyle = this.getSelectedBorder(item, background);

							return (
								<button 
									value={item}
									className='color-selector' 
									style={{'backgroundColor':background, 'border':borderStyle}}
									onClick={this.onColorClick}
								>
									{this.renderDeleteIcon(parseInt(item), background)}
								</button>
							)
						})
					)
				}
				{addSelector}
			</div>
		)
	}

	renderColorPicker() {
		let params = this.state.layoutParams;
		params['color'] = this.state.selectedColors[0];

		return (
			<React.Fragment>
				<IroColorPicker
					className={['column-one', 'grid-row-one'].join(' ')}
					params={params}
					onColorChange={(color) => this.onColorSelect(color)}
					ref={this.colorPickerRef}
				/>
			</React.Fragment>
		)
	}


	renderSlider() {
		return (
			<Slider isDisabled={this.state.sliderDisabled} initialSpeed={this.state.animationSpeed} onChange={this.onSpeedChange}/>
		)
	} 

	renderButton() {
		var buttonContent;
		if (this.props.type === 'new') {
			buttonContent = (
				<React.Fragment>
					<img style={{marginRight:'7%'}} src={`${process.env.PUBLIC_URL}/assets/images/star.svg`} alt='Enregistrer'/>
					<React.Fragment>Enregistrer mode</React.Fragment>
				</React.Fragment>
			)
		} else {
			buttonContent = (
				<React.Fragment>Enregistrer</React.Fragment>
			)
		}

		return (
			<React.Fragment>
				<div className={['column-two', 'grid-row-two', 'button-color-picker'].join(' ')}>
					<button className='save-button' onClick={this.onSaveMode} >
						{buttonContent}
					</button>
				</div>
			</React.Fragment>
		)
	}

	render() { 
		return (
			<div className={['color-grid', `color-${this.props.type}`].join(' ')}>
				{ this.renderColorPicker() }
				{ this.renderSlider() }
				{ this.renderColorSelectors() }
				{ this.renderButton() }
			</div>
		)
	}

}

// props validation
ColorPicker.propTypes = {
	type:PropTypes.string.isRequired,
	modeModel:PropTypes.instanceOf(ModeModel).isRequired,
	onSaveNewMode:PropTypes.func,
	onSaveEditMode:PropTypes.func

}

export default connect(null, {selectMode})(ColorPicker);
