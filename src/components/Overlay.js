import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { deleteMode } from '../actions';
import ColorPicker from './ColorPicker.js';

class Overlay extends React.Component {

	constructor(props) {
		super(props);
		this.state = { 'modeName':''};

	}

	componentDidUpdate(prevProps) {
		if (this.props !== prevProps) {
			this.setState({'modeName':''});
		}

	}

	closeModal() {
		// object passed to displayOverlay function of App through props 
		this.props.onClose({'display':false});
	}

	onInputChange = (input) => {
		this.setState({'modeName':input.target.value});
	}


	saveEditMode = (mode) => {
		if (this.state.modeName !== '') {
			mode.setName(this.state.modeName);
		}
		var parameters = {...this.props.settings};
		parameters.modeInstance = mode;
		this.props.onSave(parameters);
		this.closeModal();
	}

	saveMode = () => {
		if (this.state.modeName !== '') {
			this.props.settings.modeInstance.setName(this.state.modeName);
			this.props.onSave(this.props.settings);
			this.closeModal();
		} 
	}

	deleteMode = () => {
		this.props.deleteMode(this.props.settings.modeInstance);
		this.closeModal();
	} 

	renderNameInputOverlay = () => {
		return (
			<React.Fragment>
				<div className='OverlayInputWindow'>
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
						<button className="overlay-button"onClick={() => this.saveMode()}>Enregistrer</button>
					</div>
				</div>
			</React.Fragment>
		)
	}

	renderEditModeOverlay = () => {

		var valueDisplayed = this.state.modeName;
		if (this.state.modeName === '') {
			valueDisplayed = this.props.settings.modeInstance.name;
		} 

		return (
			<React.Fragment>
				<div className='OverlayEditWindow'>
					<div>
						<input 
							id="overlay-edit"
							type="text"
							value={valueDisplayed}
							onChange={this.onInputChange} 
						/>
						<img id="overlay-edit-img" src={`${process.env.PUBLIC_URL}/assets/images/edit.svg`} alt="Éditer"/>
						<button id="overlay-edit-close" onClick={() => this.closeModal()}>x</button>
					</div>
					<ColorPicker 
						type='edit'
						modeModel={this.props.settings.modeInstance}
						onSaveEditMode={this.saveEditMode}
					/>
				</div>
			</React.Fragment>
		)

	}

	renderDeletetModeOverlay = () => {
		return (
			<React.Fragment>
				<div className='OverlayInputWindow'>
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
					<div className="Blur" onClick={() => this.closeModal()}></div>
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
		}

		return null;


	}
}


Overlay.propTypes = {
	settings:PropTypes.object.isRequired,
	onClose:PropTypes.func.isRequired,
	onSave:PropTypes.func.isRequired,
}

export default connect(null, { deleteMode })(Overlay);


