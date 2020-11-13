import React from 'react';
import PropTypes from 'prop-types';
import iro from '@jaames/iro';
import { connect } from 'react-redux';
import { selectMode } from '../actions';
import MaiaService from './MaiaService.js';
import ModeModel from './ModeModel.js';
import Slider from './Slider.js';
import Utils from './Utils.js';

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
			'minNumberColors':this.getMinNumberColors(),
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


	componentDidMount() {
		window.addEventListener('resize', this.onWindowResize);
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.onWindowResize);
	}

	onWindowResize = () => {

		// the  parent component is at most 80% of the width of its parent, being at most 90% of its own parent
		var parentWidth = 0.9 * document.getElementsByClassName("content-two")[0].offsetWidth;
		var width = 0.5 * window.visualViewport.height;
		if (width + 115 > 0.75 * parentWidth) {
			// the grid cell is at most 75% of the width of its parent
			width = 0.75 * parentWidth - 115;
		} 
		if (width < (548 - 115)) {
			// 115px for the slider (by default 32px) and the margin (set to 80px)
			width = 433;
		}
		this.colorPickerRef.current.colorPicker.resize(width)

	}

	getInitialWidth() {
		var parentWidth = 0.9 * document.getElementsByClassName("content-two")[0].offsetWidth;
		var width = 0.5 * window.visualViewport.height;
		if (width + 115 > 0.75 * parentWidth) {
			width = 0.75 * parentWidth - 115;
		} 
		if (width < (548 - 115)) {
			width = 433;
		}
		return width;

	}

	getInitialSliderDisabled() {
		if (this.props.modeModel.colors.length === 1) {
			return true;
		} else if (this.props.modeModel.isOriginMode) {
			return true;
		}

		return false;
	}

	getInitialColors() {
		var colors = this.props.modeModel.colors;
		return this.getHexColors(colors);
	}

	getHexColors(colors) {
		var initialColors = [];
		
		for (var i = 0; i < colors.length; i++) {
			var hexColor = Utils.convertRGBStringtoHex(colors[i]);
			initialColors.push(hexColor);
		}
		return initialColors;
	}

	getMinNumberColors() {
		var minNumberColors = 0;
		if (this.props.modeModel.isOriginMode) {
			minNumberColors = 1;
		}
		return minNumberColors;
	}

	resetColors = (initialColors) => {
		//convert the initialColors to hex and update the state
		this.setState({'selectedColors':this.getHexColors(initialColors)});
	}

	executeCurrentMode = () => {
		var serializedMode = this.props.modeModel.serialize();
		MaiaService.executeMode(serializedMode);
	}

	onSpeedChange = (speed) => {
		// save the currently selected color
		this.setState({'animationSpeed':speed}, () => {
			// update the modeModel
			this.props.modeModel.setSpeed(this.state.animationSpeed);
			// send color to the microcontroller for live update
			this.executeCurrentMode();
		});
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
		this.editModeModel()
		this.executeCurrentMode();

		// if the color picker is not editing a saved mode, the selectedMode from the redux store should be cleared
		if (this.props.type === 'new') {
			this.props.selectMode('');
		}

	}

	onColorClick = (event) => {
		// this method is called when the user clicks on a color circle from the colors selectors grid on the right
		var selectedIndex = parseInt(event.currentTarget.value);

		if (selectedIndex > 0 && selectedIndex === this.state.showDelete) {
			this.removeColorSelector(selectedIndex);
		} else {
			this.selectColor(selectedIndex);
		}

	}

	addColorSelector = (event) => {
		// this method is called when the user clicks on the + button of the colors selectors grid on the right
		var selectedColors = this.state.selectedColors;
		selectedColors.push('FFFFFF');
		var selectedColorIndex = this.state.selectedColors.length - 1;
		var sliderDisabled = this.props.modeModel.isOriginMode ? true : false;
		this.setState({
			'selectedColors':selectedColors, 
			'selectedColorIndex':selectedColorIndex, 
			'sliderDisabled':sliderDisabled,
			'showDelete':selectedColorIndex
		}, () => {
			this.colorPickerRef.current.colorPicker.color.set('FFFFFF');
		});
	}

	selectColor = (index) => {
		// this methods selects the color clicked on on the color wheel
		var showDeleteIndex = index === 0 ? null : index;;
		this.setState({'selectedColorIndex':index, 'showDelete':showDeleteIndex}, () => {
			var color = this.state.selectedColors[index];
			this.colorPickerRef.current.colorPicker.color.set(color);
		});
	} 

	removeColorSelector = (indexColorToRemove) => {
		// this method removes the color from the grid and the list of selected colors
		if (indexColorToRemove > this.state.minNumberColors) {
			var selectedColors = this.state.selectedColors;
			selectedColors.splice(indexColorToRemove, 1);
			var sliderDisabled = (selectedColors.length === 1 || this.props.modeModel.isOriginMode) ? true : false;
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

	editModeModel = () => {
		// add state to modeModel
		var modeColors = [];
		var selectedColors = this.state.selectedColors;
		for (var i = 0; i < selectedColors.length; i++) {
			var rgbColor = Utils.convertHexToRGB(selectedColors[i]);
			modeColors.push(rgbColor);
		}
		this.props.modeModel.setColors(modeColors);
		//this.props.modeModel.setSpeed(this.state.animationSpeed);
	}

	onSaveMode = () => {
 		this.editModeModel();

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
			borderColor = '#FA4D3D';
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

		if (index > this.state.minNumberColors) {
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
			<div id="picker" className={['color-grid', `color-${this.props.type}`].join(' ')}>
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

export default connect(null, {selectMode}, null, {forwardRef:true})(ColorPicker);
