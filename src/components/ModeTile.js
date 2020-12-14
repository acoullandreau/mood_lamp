import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { selectMode } from '../actions';
import DropdownOverlay from './DropdownOverlay.js';
import MaiaService from '../services/MaiaService.js';
import Utils from '../classes/Utils.js';

class ModeTile extends React.Component {
	/**
		This component is in charge of rendering a single mode tile. It manages the interactions a user has with a single mode, 
		such as executing it, editing and deleting it (when allowed).
	*/

	constructor(props) {
		super(props);
		this.state = {
			'isDefault':this.props.model.isOriginMode,
			'isEditable':this.props.model.isEditable,
			'category':this.props.model.category,
			'id':this.props.id,
			'overlay':{'display':false, 'settings':{}}
		}; 
	}


	launchMode = () => {
		/**
			This method is called whenever the user clicks on a tile, or on the edit button.
			It updates the selected mode of the Redux store, serializes the mode model instance to pass it down to
			MaiaService.executeMode.
		*/

		this.props.selectMode(this.state.id);
		// send the info to the microcontroller
		var serializedMode = this.props.model.serialize();
		MaiaService.executeMode(serializedMode);
	}

	onEdit = () => {
		/**
			This method is called whenever the user click on the edit button.
			It triggers the execution of the mode (launch) and passes back the reference of the mode model instance to the App
			through a props function onEditMode.
		*/

		this.launchMode();
		this.props.onEditMode(this.props.model)
	}

	onDelete = () => {
		/**
			This method is called whenever the user click on the delete button.
			It passes back the reference of the mode model instance to the App through a props function onDeleteMode.
		*/

		this.props.onDeleteMode(this.props.model);
	}

	getThumbnail = () => {
		/**
			This method returns a gradient of colors to display on the mode tile.
			For the non editable modes, a special set of gradients is retrieved using Utils.getSpecialGradient(id). 
			Otherwise, the gradient is computed using the array of colors of the mode.
		*/

		if (this.state.isEditable === false) {
			var specialGradient = Utils.getSpecialGradient(this.props.model.id);
			return { 'background':specialGradient };

		} else {
			var colors = this.props.model.colors;
			var initialColor = Utils.convertRGBToString(colors[0]);

			if (colors.length > 1) {
				var gradient = Utils.getGradient(colors);
				return { 'background':gradient };
			} 

			return {'backgroundColor': initialColor};
		}


	}

	onHover = (event, bool) => {
		/**
			This method is called whenever the user hovers a tile (on desktop). It is in charge of showing the appropriate
			icon (edit, delete or none), depending on the type of mode hovered. 
		*/

		let hoverDisplay;
		if (bool) {
			hoverDisplay = 'inline-block';
		} else {
			hoverDisplay = 'none';
		}

		if (this.state.isEditable !== false) {
			let hoverTargetDelete;
			let hoverTargetEdit;
			if (this.state.isDefault !== false) {
				hoverTargetDelete = event.currentTarget.childNodes[1].childNodes[1].childNodes[0];
				hoverTargetDelete.style.display = hoverDisplay;
			} else {
				hoverTargetEdit= event.currentTarget.childNodes[1].childNodes[1].childNodes[0];
				hoverTargetDelete = event.currentTarget.childNodes[1].childNodes[1].childNodes[1];
				hoverTargetEdit.style.display = hoverDisplay;
				hoverTargetDelete.style.display = hoverDisplay;
			}

		}

	}	


	onTouchStart = (e) => {
		/**
			This method is called whenever the user hold touch on a tile (on mobile). It is in charge of updating the state of overlay
			to be able to show a dropdown menu with options (to edit and/or delete a mode).
		*/

		let targetMode = e.currentTarget;
		this.touchTimeout = setTimeout(() => {
			//we show the menu dropdown for the modes that are editable
			if (this.state.isEditable !== false) {	
				let overlay = {...this.state.overlay};
				overlay.display = true;
				overlay.settings = {'targetMode':targetMode, 'isDefault':this.state.isDefault}
				this.setState({ overlay });
			} else {
				this.launchMode();
			}
		}, 1000);
	}

	onTouchEnd = () => {
		/**
			As the touch hold is detected using a timeout, this method is in charge of clearing the timeout when touch is released.
		*/	

		clearTimeout(this.touchTimeout);
	}

	closeOverlay = () => {
		/**
			This method is in charge of hiding the menu dropdown.
		*/

		let overlay = {...this.state.overlay};
		overlay.display = false;
		this.setState({ overlay })
	}

	renderMode = () => {

		let mode = this.props.model;
		let thumbnailButton;
		let borderStyle = this.props.selectedMode === this.state.id ? '3px solid #FEEDDF' : '1px solid rgba(254, 237, 223, 0.1)';
		let outerBorderStyle = this.props.selectedMode === this.state.id ? '0 0 5px 5px #FA4D3D' : 'none'; //'3px solid #FA4D3DDF' inset 
		let style;

		if (mode.id === 0) {
			// this is the off mode
			style = {'backgroundColor': '#000000', 'border':borderStyle};
			thumbnailButton = (
				<button
					className={["mode-button", "grid-row-one"].join(' ')}
					style={style}
					onClick={this.launchMode} 
				>
					<img width="102" height="102" src={`${process.env.PUBLIC_URL}/assets/images/off.svg`} alt='Off' />
				</button>
			)
		} else {
			style = this.getThumbnail();
			style['border'] = borderStyle;
			style['WebkitBoxShadow'] = outerBorderStyle;
			thumbnailButton = (
				<button
					className={["mode-button", "grid-row-one"].join(' ')}
					style={style}
					onClick={this.launchMode} 
				></button>
			)
		} 

		if (this.props.targetDevice === 'desktop') {
			return (
				<div 
					className='mode-sub-grid'
					onMouseEnter={(e) => this.onHover(e, true)}
					onMouseLeave={(e) => this.onHover(e, false)}
				>
					{ thumbnailButton }
					<div className={["mode-text", "grid-row-two"].join(' ')}>
						<p className="colum-one">{mode.name}</p>
						<div className="colum-two">
							<button className={["hover-button", "edit-button"].join(' ')} onClick={this.onEdit} >
								<img 
									width="78"
									height="78"
									src={`${process.env.PUBLIC_URL}/assets/images/edit.svg`} 
									alt="Éditer"
								/>
							</button>
							<button className={["hover-button", "delete-button"].join(' ')} onClick={this.onDelete}>
								<img 
									width="60"
									height="70"
									src={`${process.env.PUBLIC_URL}/assets/images/delete.svg`} 
									alt="Supprimer"
								/>
							</button>
						</div>

					</div>

				</div>
			)
		} else {
			return (
				<div 
					className='mode-sub-grid'
					onTouchStart={this.onTouchStart}
					onTouchEnd={this.onTouchEnd}
				>
					{ thumbnailButton }
					<div className={["mode-text", "grid-row-two"].join(' ')}>
						<p>{mode.name}</p>
					</div>
				</div>
			)
		}

	}

	render() {

		if (this.state.overlay.display) {
			return (
				<div style={{display:'block'}}>
					<DropdownOverlay 
						settings={this.state.overlay.settings} 
						onEdit={this.onEdit} 
						onDelete={this.onDelete} 
						onClose={this.closeOverlay} 
					/>
					{this.renderMode()}
				</div>
			)
		} else {
			return (
				this.renderMode()
			)
		}
		

	}
}

const mapStateToProps = (state) => {
	return { selectedMode : state.selectedMode };
}

ModeTile.propTypes = {
	model:PropTypes.object.isRequired,
	id:PropTypes.number.isRequired,
	onEditMode:PropTypes.func.isRequired,
	onDeleteMode:PropTypes.func.isRequired,
	targetDevice:PropTypes.string.isRequired
}

export default connect(mapStateToProps, { selectMode })(ModeTile);