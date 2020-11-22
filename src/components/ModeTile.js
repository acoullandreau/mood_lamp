import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { selectMode } from '../actions';
import DropdownOverlay from './DropdownOverlay.js';
import MaiaService from './MaiaService.js';
import Utils from './Utils.js';

class ModeTile extends React.Component {

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
		this.props.selectMode(this.state.id);
		// send the info to the microcontroller
		var serializedMode = this.props.model.serialize();
		MaiaService.executeMode(serializedMode);
	}

	onEdit = () => {
		//lauch the mode
		this.launchMode();
		this.props.onEditMode(this.props.model)
	}

	onDelete = () => {
		this.props.onDeleteMode(this.props.model);
	}

	getThumbnail = (colors) => {

		if (this.state.category === 'sound') {
			var specialGradient = Utils.getSpecialGradient(this.props.model.name);
			return { 'background':specialGradient };

		} else {
			var initialColor = Utils.convertRGBToString(colors[0]);

			if (colors.length > 1) {
				var gradient = Utils.getGradient(colors);
				return { 'background':gradient };
			} 

			return {'backgroundColor': initialColor};
		}


	}

	onHover = (event, bool) => {

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
		clearTimeout(this.touchTimeout);
	}

	closeOverlay = () => {
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

		if (this.state.category === 'off') {
			style = {'backgroundColor': '#000000', 'border':borderStyle};
			thumbnailButton = (
				<button
					className={["mode-button", "grid-row-one"].join(' ')}
					style={style}
					onClick={this.launchMode} 
				>
					<img src={`${process.env.PUBLIC_URL}/assets/images/off.svg`} alt='Off' />
				</button>
			)
		} else {
			style = this.getThumbnail(mode.colors);
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
									src={`${process.env.PUBLIC_URL}/assets/images/edit.svg`} 
									alt="Éditer"
								/>
							</button>
							<button className={["hover-button", "delete-button"].join(' ')} onClick={this.onDelete}>
								<img 
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
		// let overlay;
		// if (this.state.overlay.display) {
		// 	overlay = (
		// 		<div style={{display:'block'}}>
		// 			<DropdownOverlay settings={this.state.overlay.settings} onEdit={this.onEdit} onDelete={this.onDelete} onClose={this.closeOverlay} />
		// 		</div>
		// 	)
		// } else {
		// 	overlay = (
		// 		<div style={{display:'none'}}>
		// 			<DropdownOverlay settings={{}} onEdit={this.onEdit} onDelete={this.onDelete} onClose={this.closeOverlay} />
		// 		</div>
		// 	)
		// }


		// return (
		// 	<React.Fragment>
		// 		{ overlay }	
		// 		{this.renderMode()}
		// 	</React.Fragment>
		// ) 


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