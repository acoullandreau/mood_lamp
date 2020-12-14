import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { deleteMode } from '../actions';
import ColorPicker from './ColorPicker.js';
import MaiaService from '../services/MaiaService.js';

class Overlay extends React.Component {
	/**
		This component is in charge of rendering an overlay window. There are five types of overlays:
			- edit mode
			- assign a name to a new mode
			- confirmation prior to discarding changes
			- confirmation prior to delete a mode
			- about menu
	*/

	constructor(props) {
		super(props);
		this.state = { 'modeName':'', 'showDiscardChangesModal':false };
		this.colorPickerRef = React.createRef();
	}

	componentDidUpdate(prevProps) {
		if (this.props !== prevProps) {
			this.setState({'modeName':''});
		}
	}

	closeModal(source) {
		/**
			This method is in charge of handling a request to close an overlay. There are a few situations:
			- the overlay is an mode edit window 
				--> in this case we want to confirm whether the user is willing to discard the changes
				--> there are then two outcomes depending on what the user chooses, either discard the changes or simply hide the message
			- the overlay is any other message window (save name, discard changes,....) --> we hide it
		*/

		if (source === undefined) {
			this.props.onClose({'display':false});
		} else if (source === 'editConfirmation') {
			this.setState({'showDiscardChangesModal':true});
		} else if (source === 'discardChanges') {
			this.setState({'showDiscardChangesModal':false}, () => {
				MaiaService.discardChanges();
				this.props.onClose({'display':false});
			});
		} else if (source === 'keepChanges') {
			this.setState({'showDiscardChangesModal':false});
		}
	}

	onInputChange = (input) => {
		/**
			This method detects when the user inputs a name in the overlay window input field, and updates the state.
		*/

		this.setState({'modeName':input.target.value});
		if (this.props.settings.type === 'edit') {
			this.colorPickerRef.current.setState({saveButtonDisabled:false});
		}
	}


	saveEditMode = (mode) => {
		/**
			This method is executed only when the overlay window displayed is an edit window (i.e. the mode instance is of a saved mode).
			In this case, this method is in charge of updating the mode model instance with the name inputted by the user.
			It then passes back to the App this information of the current context (the overlay parameters along with the updated mode instance), 
			through the props function onSave, and triggers the closeModal method to hide the window.
		*/

		if (this.state.modeName !== '') {
			mode.setName(this.state.modeName);
		}
		var parameters = {...this.props.settings};
		parameters.modeInstance = mode;
		this.props.onSave(parameters);
		this.closeModal();
	}

	saveNewMode = () => {
		/**
			This method is executed when the overlay window displayed is to input a name for a new mode being saved.
			It updates the mode model instance with the name inputted by the user abd passes back to the App this information 
			of the current context (the overlay parameters along with the updated mode instance), through the props function 
			onSave, and triggers the closeModal method to hide the window.
		*/

		if (this.state.modeName !== '') {
			this.props.settings.modeInstance.setName(this.state.modeName);
			this.props.onSave(this.props.settings);
			this.closeModal();
		} 
	}

	onResetMode = (event) => {
		/**
			This method is triggered when the user clicks on the Reset button of an edit mode overlay window.
			In order to reset the colors:
				- it fetches the "factory" settings of the mode
				- it updates the mode model instance with the initial array of colors
				- it enables the save button (as a change was detected)
				- it sends the update to MaiaService for the lamp to execute the change (live update)
		*/

		var initialSetting = this.props.factoryModesSettings[this.props.settings.modeInstance.id].colors;
		this.props.settings.modeInstance.setColors(initialSetting)
		// rerender the color picker
		this.colorPickerRef.current.resetColors(initialSetting);
		//enable the save button
		this.colorPickerRef.current.setState({saveButtonDisabled:false});

		// we request an update from the microcontroller
		var serializedMode = this.props.settings.modeInstance.serialize();
		MaiaService.updateMode(serializedMode, {'reset':initialSetting} );
	} 

	deleteMode = () => {
		/**
			This method is called when the user confirms that the mode selected should be deleted.
			The information is passed to the Redux store through the deleteMode action, and to MaiaService for the
			microcontroller to update its list of modes.
		*/

		this.props.deleteMode(this.props.settings.modeInstance);
		MaiaService.deleteMode(this.props.settings.modeInstance);
		this.closeModal();
	} 


	renderResetButton() {
		if (this.props.settings.modeInstance.isOriginMode) {
			var initialSetting = this.props.factoryModesSettings[this.props.settings.modeInstance.id].colors;
			var currentSetting = this.props.settings.modeInstance.colors;
			var buttonDisabled = JSON.stringify(initialSetting)===JSON.stringify(currentSetting) ? true : false;

			return (
				<button 
					id='overlay-reset-button' 
					disabled={buttonDisabled}
					onClick={this.onResetMode} 
				>
					Reset
				</button>
			);
		} else {
			return null;
		}
	}

	renderInputField() {
		var valueDisplayed = this.state.modeName;
		if (this.state.modeName === '') {
			valueDisplayed = this.props.settings.modeInstance.name;
		} 

		if (this.props.settings.modeInstance.isOriginMode) {
			return (
				<input 
					id="overlay-edit"
					type="text"
					value={valueDisplayed}
					disabled={true}
				/>
			)
		} else {
			return (
				<React.Fragment>
					<input 
						id="overlay-edit"
						type="text"
						value={valueDisplayed}
						onChange={this.onInputChange} 
					/>
					<img width="78" height="78" id="overlay-edit-img" src={`${process.env.PUBLIC_URL}/assets/images/edit.svg`} alt="Éditer"/>
				</React.Fragment>
			)

		}
	}

	renderNameInputOverlay = () => {
		return (
			<React.Fragment>
				<div className={['OverlayWindow', 'OverlayInputWindow'].join(' ')}>
					<div id="overlay-title">{this.props.settings.title}</div>
					<div id="overlay-text">{this.props.settings.message}</div>
					<input 
						id="overlay-input" 
						type="text" 
						placeholder="Nom du mode" 
						value={this.state.valueDisplayed}
						onChange={this.onInputChange} 
					/>
					<div id="overlay-buttons">
						<button className="overlay-button" onClick={() => this.closeModal()}>Annuler</button>
						<button className="overlay-button"onClick={() => this.saveNewMode()}>Enregistrer</button>
					</div>
				</div>
			</React.Fragment>
		)
	}

	renderEditModeOverlay = () => {
		return (
			<React.Fragment>
				{this.renderDiscardChangesOverlay()}
				<div className={['OverlayWindow', 'OverlayEditWindow'].join(' ')}>
					<div>
						{this.renderInputField()}
						{this.renderResetButton()}
						<button id="overlay-edit-close" onClick={() => this.closeModal('editConfirmation')}>x</button>
					</div>
					<ColorPicker 
						type='edit'
						modeModel={this.props.settings.modeInstance}
						onSaveEditMode={this.saveEditMode}
						targetDevice={this.props.targetDevice}
						ref={this.colorPickerRef}
					/>
				</div>
			</React.Fragment>
		)

	}

	renderDiscardChangesOverlay = () => {
		if (this.state.showDiscardChangesModal) {
			return (
				<React.Fragment>
					<div style={{zIndex:'120'}} className="Blur" onClick={() => this.closeModal()}></div>
					<div style={{zIndex:'150'}} className={['OverlayWindow', 'OverlayDeleteWindow'].join(' ')}>
						<div id="overlay-title">Modifications non enregistrées</div>
						<div id="overlay-text">Voulez-vous ignorer les modifications faites à la configuration de ce mode ?</div>
						<div id="overlay-buttons">
							<button className="overlay-button" onClick={() => this.closeModal('keepChanges')}>Annuler</button>
							<button className="overlay-button" onClick={() => this.closeModal('discardChanges')}>Ignorer</button>
						</div>
					</div>
				</React.Fragment>
			)	
		}

		return null;
	}

	renderDeletetModeOverlay = () => {
		return (
			<React.Fragment>
				<div className={['OverlayWindow', 'OverlayDeleteWindow'].join(' ')}>
					<div id="overlay-title">{this.props.settings.title}</div>
					<div id="overlay-text">{this.props.settings.message}</div>
					<div id="overlay-buttons">
						<button className="overlay-button" onClick={() => this.closeModal()}>Annuler</button>
						<button className="overlay-button"onClick={() => this.deleteMode()}>Supprimer</button>
					</div>
				</div>
			</React.Fragment>
		)

	}

	renderAboutOverlay = () => {
		return (
			<React.Fragment>
				<div className={['OverlayWindow', 'OverlayAboutWindow'].join(' ')}>
					<button id="overlay-edit-close" onClick={() => this.closeModal()}>x</button>
					<div id="about-title">{this.props.settings.title}</div>
					<div id="about-text">
						Cette application est conçue pour vous permettre de piloter une lampe d'ambiance nommée Maïa ! <br/> <br/>
						Le projet est développé par 
						<a href="https://acoullandreau.com" target="_blank" rel="noopener noreferrer"> Alexina Coullandreau </a> 
						<span> et </span> 
						<a href="https://gbuzogany.com" target="_blank" rel="noopener noreferrer"> Gustavo Buzogany Eboli</a>.  <br/>
						Jetez un oeil au 
						<a href="https://github.com/acoullandreau/mood_lamp" target="_blank" rel="noopener noreferrer"> code source de cette page</a>,  
						et n'hésitez pas à nous contacter !
					</div>
				</div>
			</React.Fragment>
		)

	}

	render() {
		if (this.props.settings.type === 'new') {
			return (
				<React.Fragment>
					<div className="Blur" onClick={() => this.closeModal()}></div>
					{this.renderNameInputOverlay()}
				</React.Fragment>
			) 
		} else if (this.props.settings.type === 'edit') {
			return (
				<React.Fragment>
					<div className="Blur" onClick={() => this.closeModal('editConfirmation')}></div>
					{this.renderEditModeOverlay()}
				</React.Fragment>
			)
		} else if (this.props.settings.type === 'delete') {
			return (
				<React.Fragment>
					<div className="Blur" onClick={() => this.closeModal()}></div>
					{this.renderDeletetModeOverlay()}
				</React.Fragment>
			)
		} else if (this.props.settings.type === 'about') {
			return (
				<React.Fragment>
					<div className="Blur" onClick={() => this.closeModal()}></div>
					{this.renderAboutOverlay()}
				</React.Fragment>
			)
		}

		return null;


	}
}

const mapStateToProps = (state) => {
	return { factoryModesSettings : state.factorySettings };
}

Overlay.propTypes = {
	settings:PropTypes.object.isRequired,
	onClose:PropTypes.func.isRequired,
	onSave:PropTypes.func,
	targetDevice:PropTypes.string.isRequired
}

export default connect(mapStateToProps, { deleteMode })(Overlay);


