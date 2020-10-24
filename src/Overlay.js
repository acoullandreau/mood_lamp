import React from 'react';
import PropTypes from 'prop-types';

class Overlay extends React.Component {

	state = { 
		'display': false, 
		'title':'Nouveau mode', 
		'message':'Enregistrer cette configuration comme nouveau mode préconfiguré.',
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
					<div id="overlay-title">{this.state.title}</div>
					<div id="overlay-text">{this.state.message}</div>
					<input 
						className="overlay-input" 
						type="text" 
						placeholder="Nom du mode" 
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
   onClose:PropTypes.func.isRequired,
   onSave:PropTypes.func.isRequired
}

export default Overlay;