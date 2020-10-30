import React from 'react';
import PropTypes from 'prop-types';
import ColorPicker from './ColorPicker.js';

class Overlay extends React.Component {

	constructor(props) {
		super(props);

		this.state = { 
			'display': false, 
			'title':'', 
			'message':'',
			'modeName':""
		};

	}

	closeModal() {
		// object passed to displayOverlay function of App through props 
		this.props.onClose({'display':false});
	}

	onInputChange = (input) => {
		this.setState({'modeName':input.target.value});
	}

	saveMode = () => {
		if (this.state.modeName !== '') {
			this.props.settings.modeInstance.setName(this.state.modeName);
			this.props.onSave(this.props.settings.type, this.props.settings.modeInstance);
			this.closeModal();
		} 
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
						value={this.state.modeName || ''}
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

		return (
			<React.Fragment>
				<div className='OverlayEditWindow'>
					<input 
						type="text" 
						placeholder={this.props.settings.modeInstance.name}
						value={this.state.modeName || this.props.settings.modeInstance.name}
						onChange={this.onInputChange} 
					/>
					<ColorPicker 
						modeModel={this.props.settings.modeInstance}
						onSaveMode={this.saveMode}
					/>
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
		}

		return null;


	}
}


Overlay.propTypes = {
	settings:PropTypes.object.isRequired,
	onClose:PropTypes.func.isRequired,
	onSave:PropTypes.func.isRequired
}

export default Overlay;