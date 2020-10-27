import React from 'react';
import Utils from './Utils.js';
import PropTypes from 'prop-types';

class ModeTile extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			'isDefault':this.props.model.isOriginMode,
			'isEditable':this.props.model.isEditable,
			'category':this.props.model.category,
			'id':this.props.id
		}; 
	}


	launchMode = () => {
		console.log(this.state.id)
		// this.setState({'launchedMode':event.target.value}, () => {
		// 	//execute the mode
		// 	console.log(this.state.launchedMode)
		// })
	}

	onEdit = (event) => {

	}

	onDelete = () => {
		this.props.onModeDelete(this.state.id);
	}

	getThumbnail = (colors) => {

		if (this.state.category === 'sound') {
			var specialGradient = Utils.getSpecialGradient(this.props.model.name);
			return { 'background':specialGradient };

		} else {
			var initialColor = Utils.convertRGBToString(colors[0]);

			if (colors.length > 1) {
				var gradient = Utils.getGradient(colors);
				return { 'background':initialColor, 'background':gradient };
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

	renderMode = () => {

		let mode = this.props.model;
		let style = this.getThumbnail(mode.colors);
		let thumbnailButton;

		if (this.state.category === 'off') {
			thumbnailButton = (
				<button
					className={["mode-button", "grid-row-one"].join(' ')}
					style={{'backgroundColor': '#000000'}}
					onClick={this.launchMode} 
				>
					<img src={`${process.env.PUBLIC_URL}/assets/images/off.svg`} alt='Off' />
				</button>
			)
		} else {
			thumbnailButton = (
				<button
					className={["mode-button", "grid-row-one"].join(' ')}
					style={style}
					onClick={this.launchMode} 
				></button>
			)
		} 

		return (
			<div 
				className='mode-sub-grid'
				onMouseEnter={(e) => this.onHover(e, true)}
				onMouseLeave={(e) => this.onHover(e, false)}
			>
				{ thumbnailButton }
				<div className={["mode-text", "grid-row-two"].join(' ')}>
					<p className="colum-two">{mode.name}</p>
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
	}

	render() {
		return (
			<React.Fragment>
				{this.renderMode()}
			</React.Fragment>
		) 

	}
}

ModeTile.propTypes = {
	model:PropTypes.object.isRequired,
	id:PropTypes.number.isRequired
}

export default ModeTile;