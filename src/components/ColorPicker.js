import React from 'react';
import PropTypes from 'prop-types';
import iro from '@jaames/iro';
import { connect } from 'react-redux';
import { selectMode } from '../actions';
import MaiaService from '../services/MaiaService.js';
import ModeModel from '../classes/ModeModel.js';
import Slider from './Slider.js';
import Utils from '../classes/Utils.js';

class IroColorPicker extends React.Component {

	/**
		This component is in charge of rendering a color wheel with a saturation bar. 
	*/

	componentDidMount() {
		const { props } = this;
		// create a new iro color picker and pass component props to it
		this.colorPicker = new iro.ColorPicker(this.el, props.params);
		// call onColorChange prop whenever the color changes
		this.colorPicker.on('input:change', (color) => {
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
			<div className={this.props.className} style={{'alignSelf': 'center'}} ref={el => this.el = el} />
		);
	}
}

class ColorPicker extends React.Component {

	/**
		This component is in charge of rendering the color picker editor. It includes
			- an instance of the IroColorPicker component
			- a list of colors selectors
			- a slider to choose the animation speed
			- a save button
	*/


	constructor(props) {
		super(props)

		this.state = {
			'selectedColorIndex':0,
			'showDelete':0,
			'selectedColors':this.getInitialColors(),
			'animationSpeed':this.props.modeModel.speed,
			'sliderDisabled':this.getInitialSliderDisabled(),
			'saveButtonDisabled':this.isSaveDisabled(),
			'minNumberColors':this.getMinNumberColors(),
			'maxNumberColors':this.getMaxNumberColors(),
			'layoutParams':{
				width: this.getInitialWidth(),
				margin:this.getMargin(),
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

		this.debounceTimer = undefined;
		this.colorPickerRef = React.createRef();
	}


	componentDidMount() {
		window.addEventListener('resize', this.onWindowResize);
	}

	componentWillUnmount() {
		// as we are done editing the current instance of this.props.modeModel, we request a reset of the instance
		if (this.props.type === 'new') {
			this.props.resetModeModel();
		}

		// we clear the event listener
		window.removeEventListener('resize', this.onWindowResize);
	}

	onWindowResize = () => {
		/**
			This method is called every time the window is resized, to ensure that the width/height of the color picker
			is always optimal based on the platform	(desktop vs mobile), and depending on the size of the grid it is rendered in.

			The color picker library used allows to set the width of the component, width that includes the color wheel and the
			saturation bar (if it is positioned vertically).
		*/

		let width;
		if (this.props.targetDevice === 'desktop') {
			// the  parent component is at most 80% of the width of its parent, being at most 90% of its own parent
			var parentWidth = 0.9 * document.getElementById("content").offsetWidth;
			width = 0.5 * window.visualViewport.height;
			if (width + 115 > 0.75 * parentWidth) {
				// the grid cell is at most 75% of the width of its parent
				width = 0.75 * parentWidth - 115;
			}
			if (width < (548 - 115)) {
				// 115px for the slider (by default 32px) and the margin (set to 80px)
				width = 433;
			}
		} else if (this.props.targetDevice === 'mobile') {
			width = 0.9*window.visualViewport.width - 50;
			if (width > 0.50*window.visualViewport.height) {
				width = 0.50*window.visualViewport.height - 50;
			}
		}

		this.colorPickerRef.current.colorPicker.resize(width)

	}

	getInitialWidth() {
		/**
			This method computes the initial width of the color picker, according to the platform	(desktop vs mobile),
			and the size of the parent element.

			The color picker library used allows to set the width of the component, width that includes the color wheel and the
			saturation bar (if it is positioned vertically).

			This method is called when the component is being constructed, to build its state.

		*/

		let width;
		if (this.props.targetDevice === 'desktop') {
			let parentWidth = 0.9 * document.getElementById("content").offsetWidth;
			width = 0.5 * window.visualViewport.height;
			if (width + 115 > 0.75 * parentWidth) {
				width = 0.75 * parentWidth - 115;
			}
			if (width < (548 - 115)) {
				width = 433;
			}
		} else if (this.props.targetDevice === 'mobile') {
			if (this.props.type === 'edit') {
				width = 0.8*window.visualViewport.width - 50;
			} else {
				width = 0.9*window.visualViewport.width - 50;
			}
			if (width > 0.50*window.visualViewport.height) {
				width = 0.50*window.visualViewport.height - 50;
			}
		}

		return width;

	}

	getMargin() {
		/**
			The color picker library used allows to set the width of the component, width that includes the color wheel and the
			saturation bar (if it is positioned vertically). It is possible to adjust the margin between the wheel and the bar.
			This method computes the value of this margin depending to the platform (desktop vs mobile).

			This method is called when the component is being constructed, to build its state.
		*/

		let margin;
		if (this.props.targetDevice === 'desktop') {
			margin = 80;
		} else if (this.props.targetDevice === 'mobile') {
			margin = 15;
		}
		return margin;
	}

	getInitialSliderDisabled() {
		/**
			The color picker library used allows to set the width of the component, width that includes the color wheel and the
			saturation bar (if it is positioned vertically). It is possible to adjust the margin between the wheel and the bar.
			This method computes the value of this margin depending to the platform (desktop vs mobile).

			This method is called when the component is being constructed, to build its state.
		*/

		if (this.props.modeModel.colors.length === 1) {
			return true;
		} else if (this.props.modeModel.isOriginMode) {
			return true;
		}

		return false;
	}

	getInitialColors() {
		/**
			This method is in charge of retrieving the colors array of the mode model received as props.
			The array retrieved is of the form [{ r: r, g: g, b: b }, { r: r, g: g, b: b }, ...], and each value needs to be converted
			to hex.

			This method is called when the component is being constructed, to build its state.
		*/

		var colors = this.props.modeModel.colors;
		return this.getHexColors(colors);
	}

	getHexColors(colors) {
		/**
			This method is called to convert each color of the colors array received as an argument to hex strings.
			The colors array received is of the form [{ r: r, g: g, b: b }, { r: r, g: g, b: b }, ...], and this method returns an array
			of hex strings.

		*/

		var hexColors = [];

		for (var i = 0; i < colors.length; i++) {
			var hexColor = Utils.convertRGBStringtoHex(colors[i]);
			hexColors.push(hexColor);
		}

		return hexColors;
	}

	getRGBColors(colors) {
		/**
			This method is called to convert each color of the colors array received as an argument to RGB objects.
			The colors array received is an array of hex strings and this methos returns an array of the form 
			[{ r: r, g: g, b: b }, { r: r, g: g, b: b }, ...].

		*/

		var rgbColors = [];

		for (var i = 0; i < colors.length; i++) {
			var hexColor = Utils.convertHexToRGB(colors[i]);
			rgbColors.push(hexColor);
		}

		return rgbColors;
	}

	getMinNumberColors() {
		/**
			This method returns the minimum number of colors that should be selected by the user (i.e. below which colors cannot be removed
			from the colors selector).
			This value depends on the mode itself, as for some preconfigured mode, this value is fixed.
			By default for new mode, the minimum number of colors is 1.

			This method is called when the component is being constructed, to build its state.
		*/

		var minNumberColors = 1;
		var specialModes = [1, 2, 3, 4];
		if (this.props.modeModel.isOriginMode) {
			if (specialModes.includes(this.props.modeModel.id)) {
				if (this.props.modeModel.id === 1) {
					minNumberColors = 8;
				} else if (this.props.modeModel.id === 2) {
					minNumberColors = 2;
				} else {
					minNumberColors = 4;
				}
			} else {
				minNumberColors = 2;
			}
		}
		return minNumberColors;
	}

	getMaxNumberColors() {
		/**
			This method returns the maximum number of colors that should be selected by the user (i.e. above which colors cannot be removed
			from the colors selector).
			This value depends on the mode itself, as for some preconfigured mode, this value is fixed.
			By default for new mode, the minimum number of colors is 10.

			This method is called when the component is being constructed, to build its state.
		*/

		var specialModes = [1, 2, 3, 4];
		var maxNumberColors;
		if (specialModes.includes(this.props.modeModel.id)) {
			if (this.props.modeModel.id === 2) {
				maxNumberColors = 2;
			} else {
				maxNumberColors = 4;
			}
		} else {
			maxNumberColors = 6;
		}
		return maxNumberColors;
	}

	isSaveDisabled = () => {
		/**
			This method determines whether the save button is disabled or not. The idea is to enable the save button only for new modes
			or when a changes has been made on an existing mode (edit).

			This method is called when the component is being constructed, to build its state. Afterwards, the state is altered directly
			without calling this method.
		*/

		if (this.props.type === 'new') {
			return false;
		}
		return true;
	}

	resetColors = (initialColors) => {
		/**
			This method is in charge of updating the state with the colors array received as an argument. This array is transformed
			to an array of hex strings to be saved in the state.
			This method is called when the user wants to reset a preconfigured mode to its initial config. In this case,
			the whole colors array is set back to the initialColors array.

			initialColors is of the form [{ r: r, g: g, b: b }, { r: r, g: g, b: b }, ...].
		*/

		this.setState({'selectedColors':this.getHexColors(initialColors)});
	}

	executeCurrentMode = (target) => {
		/**
			This method is in charge of executing the update performed by the user on a given mode.
			If the id of the mode currently set (Redux store's selectedMode) if not the id of the mode received as props by this
			component, MaiaService.executeMode() is called with the id of the mode.

			Otherwise, this method calls MaiaService.updateMode with two arguments:
				- the mode's instance serialized
				- the update object, that can be of three types
						- {'speed':speed} - when the speed is being edited
						- {'color':colorObject, 'color_index':indexInTheArray} - when a color is being updated
						- {'colors':colorsArray} - when the user resets the colors of a preconfigured mode, or removes a color from a saved mode

			A debouncer of 250ms prevent the updates to be sent too often.
		*/

		var serializedMode = this.props.modeModel.serialize();
		if (this.props.modeModel.id !== this.props.selectedMode) {
			MaiaService.executeMode(serializedMode);
		}

		if (target === 'removeColor') {
			var colors = this.getRGBColors(this.state.selectedColors)
			MaiaService.updateMode(serializedMode, {'colors':colors});
		} else {
			if (this.debounceTimer === undefined) {
				this.debounceTimer = setTimeout(() => {
					// send update to the microcontroller with whatever changed
					if (target === 'color') {
						var color = this.state.selectedColors[this.state.selectedColorIndex];
						color = Utils.convertHexToRGB(color);
						MaiaService.updateMode(serializedMode, {'color':color, 'color_index': this.state.selectedColorIndex} );
					} else if (target === 'speed') {
						MaiaService.updateMode(serializedMode, {'speed':this.state.animationSpeed});
					}
					this.debounceTimer = undefined;
				}, 250);
			}
		}

	}

	onSpeedChange = (speed) => {
		/**
			This method is called by the Slider component (props) whenever the value of the speed slider is updated.
			This method is in charge of updating the state of the component and the property of the mode model instance
			 with the updated speed and calling the executeMode method to forward the update to MaiaService.

			As a change is recorded on the mode, the saveButtonDisabled flag is set to false to make sure the save button will be clickable.
		*/

		this.setState({'animationSpeed':speed, 'saveButtonDisabled':false}, () => {
			// update the modeModel
			this.props.modeModel.setSpeed(this.state.animationSpeed);
			// send color to the microcontroller for live update
			this.executeCurrentMode('speed');
		});
	}

	onColorSelect = (color) => {
		/**
			This method is passed as a props to the IroColorPicker component instance and called each
			time the user touches the color wheel and updates the color.
			It is in charge of:
				- updating the state's colors array at the corresponding index
				- calling executeCurrentMode for the microcontroller to execute a live update
				- updating the mode model instance with the change

			In case the mode being edited is not saved yet, this method is also in charge of setting the currently selected mode
			to 255, so that the Redux store keeps track that the mode being executed is not a saved one.
			This is important because as soon as executeCurrentMode is called, the lamp is going to light up with the settings of this
			new mode, so we need to update the Redux store.
		*/


		// save the currently selected color and the current array of colors
		var selectedColors = this.state.selectedColors;
		var colorIndex = this.state.selectedColorIndex;
		selectedColors[colorIndex]=color.hexString;
		this.setState({
			'selectedColors':selectedColors,
			'saveButtonDisabled':false
		});

		// update the mode model instance and enable the save button
		this.editColorsModeModel();
		// this.setState({saveButtonDisabled:false});
		// send color to the microcontroller for live update
		this.executeCurrentMode('color');

		// if the color picker is not editing a saved mode, the selectedMode from the redux store should be set to 255
		if (this.props.type === 'new') {
			this.props.selectMode(255);
		}
	}

	onColorClick = (event) => {
		/**
			This method is called whenever the user clicks on a color circle from the colors selectors grid on the right.
			If the user clicked again on the same circle, this second click triggers the delete action. Otherwise, this method
			calls the selectColor method.
		*/

		var selectedIndex = parseInt(event.currentTarget.value);
		if (selectedIndex === this.state.showDelete) {
			this.removeColorSelector(selectedIndex);
		} else {
			this.selectColor(selectedIndex);
		}

	}

	addColorSelector = (event) => {
		/**
			This method is called when the user clicks on the + button of the colors selectors grid on the right
			It is in charge of adding a color to the colors array of the state and displaying a new circle to the colors selector grid.
		*/

		var selectedColors = this.state.selectedColors;
		selectedColors.push('FFFFFF');
		var selectedColorIndex = this.state.selectedColors.length - 1;
		var sliderDisabled = this.props.modeModel.isOriginMode ? true : false;
		this.setState({
			'selectedColors':selectedColors,
			'selectedColorIndex':selectedColorIndex,
			'sliderDisabled':sliderDisabled,
			'showDelete':selectedColorIndex,
			'saveButtonDisabled':false
		}, () => {
			this.colorPickerRef.current.colorPicker.color.set('FFFFFF');
			// we pass to the microcontroller the info that a color is being edited
			this.executeCurrentMode('color');
		});
	}

	selectColor = (index) => {
		/**
			This methods selects the color clicked on on the color wheel. This triggers two things:
				- the color shown on the color wheel is the color clicked on
				- inside the color circle a tiny delete icon is shown
		*/

		var showDeleteIndex = index;
		this.setState({'selectedColorIndex':index, 'showDelete':showDeleteIndex}, () => {
			var color = this.state.selectedColors[index];
			this.colorPickerRef.current.colorPicker.color.set(color);
		});
	}

	removeColorSelector = (indexColorToRemove) => {
		/**
			This method removes the color from the grid and the list of selected colors.
			It is triggered if a user clicks/taps twice on a color circle from the selector grid (if the delete icon is visible).
		*/

		if (this.state.selectedColors.length > this.state.minNumberColors) {
			var selectedColors = this.state.selectedColors;
			selectedColors.splice(indexColorToRemove, 1);
			var sliderDisabled = (selectedColors.length === 1 || this.props.modeModel.isOriginMode) ? true : false;
			var selectedIndex = indexColorToRemove === 0 ? 0 : indexColorToRemove - 1;
			this.setState({
				'selectedColors':selectedColors,
				'sliderDisabled':sliderDisabled,
				'selectedColorIndex':selectedIndex,
				'saveButtonDisabled':false
			}, () => {
				this.editColorsModeModel();
				this.selectColor(selectedIndex);
				this.executeCurrentMode('removeColor')
			});
		}

	}

	editColorsModeModel = () => {
		/**
			This method updates the mode model instance with the array of colors.
		*/

		var modeColors = [];
		var selectedColors = this.state.selectedColors;
		for (var i = 0; i < selectedColors.length; i++) {
			var rgbColor = Utils.convertHexToRGB(selectedColors[i]);
			modeColors.push(rgbColor);
		}

		this.props.modeModel.setColors(modeColors);

	}

	onSaveMode = () => {
		/**
			This method is called when the user clicks on save.
			If the mode currently handled is a new mode, then this method calls onSaveNewMode from its parent with an object that is used
			to display an overlay (to give a name to the new mode).
			Otherwise, it calls onSaveEditMode from its parent with the mode instance, which will trigger a save to the microcontroller.
		*/

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
		/**
			This method is in charge of deciding whether to add a border to a color selector, which depends on whether it is
			the selected color or not.
			The color of the border is adapted based on the color of the color selector circle.
		*/

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

		if (this.state.selectedColors.length > this.state.minNumberColors) {
			if (this.state.showDelete === index) {
				return (
					<React.Fragment>
						<img width="61" height="78" id="color-select-delete" style={style} src={`${process.env.PUBLIC_URL}/assets/images/delete.svg`} alt='Supprimer' />
					</React.Fragment>
				)
			}
		}

		return null;
	}

	renderColorSelectors = () => {
		let addSelector;
		let selectorClassName;
		let maxNumColorSelector = this.state.maxNumberColors;

		if (this.props.targetDevice === 'desktop') {
			selectorClassName = ['column-two', 'grid-row-one'].join(' ')
		} else if (this.props.targetDevice === 'mobile') {
			selectorClassName = ['column-one', 'grid-row-one'].join(' ')
		}

		if (this.state.selectedColors.length < maxNumColorSelector) {
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
			<div id='selectors' className={selectorClassName} >
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

		let pickerClassName;
		if (this.props.targetDevice === 'desktop') {
			pickerClassName = ['column-one', 'grid-row-one'].join(' ')
		} else if (this.props.targetDevice === 'mobile') {
			pickerClassName = ['span-columns', 'grid-row-two', 'picker-block'].join(' ');
		}

		return (
			<React.Fragment>
				<IroColorPicker
					className={pickerClassName}
					params={params}
					onColorChange={(color) => this.onColorSelect(color)}
					ref={this.colorPickerRef}
				/>
			</React.Fragment>
		)
	}


	renderSlider() {
		var sliderClassName;
		if (this.props.targetDevice === 'desktop') {
			sliderClassName = ['column-one', 'grid-row-two'].join(' ');
		} else if (this.props.targetDevice === 'mobile') {
			sliderClassName = ['span-columns', 'grid-row-three'].join(' ');
		}

		return (
			<Slider
				isDisabled={this.state.sliderDisabled}
				initialSpeed={this.state.animationSpeed}
				onChange={this.onSpeedChange}
				className={sliderClassName}
			/>
		)
	}

	renderButton() {
		let buttonContent;
		let buttonClassName;
		// for the edit mode specifically, we use a state property to disable the button
		let buttonDisabled = this.state.saveButtonDisabled;
		let buttonOpacity = this.state.saveButtonDisabled ? 0.3 : 1;;

		// we define the button content based on the device used
		if (this.props.targetDevice === 'desktop') {
			if (this.props.type === 'new') {
				buttonContent = (
					<React.Fragment>
						<img className="save-button-icon" width="66" height="66" src={`${process.env.PUBLIC_URL}/assets/images/star.svg`} alt='Enregistrer'/>
						<p className="save-button-text">Enregistrer mode</p>
					</React.Fragment>
				)
			} else if (this.props.type === 'edit') {
				buttonContent = (
					<React.Fragment>Enregistrer</React.Fragment>
				)
			}
		} else {
			buttonContent = (
				<React.Fragment>
					<img width="66" height="66" style={{marginRight:'7%'}} src={`${process.env.PUBLIC_URL}/assets/images/save.svg`} alt='Enregistrer'/>
				</React.Fragment>
			)
		}

		// we define the layout (button position) based on the device used
		if (this.props.targetDevice === 'desktop') {
			buttonClassName = ['column-two', 'grid-row-two', 'button-color-picker'].join(' ');
		} else if (this.props.targetDevice === 'mobile') {
			buttonClassName = ['column-two', 'grid-row-one', 'button-color-picker'].join(' ');
		}


		return (
			<React.Fragment>
				<div className={buttonClassName}>
					<button style={{'opacity':buttonOpacity}} disabled={buttonDisabled} className='save-button' onClick={this.onSaveMode} >
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

const mapStateToProps = (state) => {
	return { selectedMode:state.selectedMode, };
}

// props validation
ColorPicker.propTypes = {
	type:PropTypes.string.isRequired,
	modeModel:PropTypes.instanceOf(ModeModel).isRequired,
	onSaveNewMode:PropTypes.func,
	onSaveEditMode:PropTypes.func,
	targetDevice:PropTypes.string.isRequired,
	resetModeModel:PropTypes.func
}

export default connect(mapStateToProps, {selectMode}, null, {forwardRef:true})(ColorPicker);
