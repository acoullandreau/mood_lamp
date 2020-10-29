import React from 'react';
import PropTypes from 'prop-types';

class Overlay extends React.Component {

	state = { 
		'display': false, 
		'title':'', 
		'message':'',
		'modeName':''
	};

	closeModal() {
		// object passed to displayOverlay function of App through props 
		this.props.onClose({'display':false});
	}

	onInputChange = (input) => {
		this.setState({'modeName':input.target.value});
	}

	saveMode = () => {
		if (this.state.modeName !== '') {
			this.props.onSave(this.state.modeName);
			this.closeModal();
		} 
	}

	render() {

		return (
			<div>
				<div className="Blur" onClick={() => this.closeModal()}></div>
				<div className='OverlayWindow'>
					<div id="overlay-title">{this.props.settings.title}</div>
					<div id="overlay-text">{this.props.settings.message}</div>
					<input 
						className="overlay-input" 
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
			</div>
		) 

	}
}


Overlay.propTypes = {
	settings:PropTypes.object.isRequired,
	onClose:PropTypes.func.isRequired,
	onSave:PropTypes.func.isRequired
}

export default Overlay;