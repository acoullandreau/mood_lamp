import React from 'react';
import PropTypes from 'prop-types';
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
			<div ref={el => this.el = el} />
		);
	}
}

class ColorPicker extends React.Component {

	constructor(props) {
		super(props)

		this.state = {
			'selectedColorIndex':0,
			'showDelete':0,
			'selectedColors':this.props.modeModel.colors,
			'animationSpeed':this.props.modeModel.speed,
			'sliderDisabled':true,
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

	onSave = () => {
		// add state to modeModel
		var modeColors = [];
		var selectedColors = this.state.selectedColors;
		for (var i = 0; i < selectedColors.length; i++) {
			var rgbColor = Utils.convertHexToRGB(selectedColors[i]);
			modeColors.push(rgbColor);
		}
		this.props.modeModel.setColors(modeColors);
		this.props.modeModel.setSpeed(this.state.animationSpeed);

		// send the modeModel reference back to the App
		var params = {
			'type':'new',
			'display':true,
			'title':'Nouveau mode', 
			'message':'Enregistrer cette configuration comme nouveau mode préconfiguré.',
			'modeInstance':this.props.modeModel
		};
		this.props.onSaveMode(params);
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
							var background = this.state.selectedColors[item];
							var borderColor = '1px solid #FEEDDF1A';
							if (parseInt(item) === this.state.selectedColorIndex) {
								borderColor = '5px solid #FEEDDF';
							}

							return (
								<button 
									value={item}
									className='color-selector' 
									style={{'backgroundColor':background, 'border':borderColor}}
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
		var params = this.state.layoutParams;
		params['colors'] = this.state.selectedColors;

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
		return (
			<React.Fragment>
				<div className={['column-two', 'grid-row-two', 'button-color-picker'].join(' ')}>
					<button className='save-button' onClick={this.onSave} >
						<img style={{marginRight:'7%'}} src={`${process.env.PUBLIC_URL}/assets/images/star.svg`} alt='Enregistrer'/>
						Enregistrer mode
					</button>
				</div>
			</React.Fragment>
		)
	}

	render() { 
		return (
			<div className='color-grid'>
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
	modeModel:PropTypes.instanceOf(ModeModel).isRequired,
	onSaveMode:PropTypes.func.isRequired,

}

export default ColorPicker;