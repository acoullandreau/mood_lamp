import React from 'react';
import PropTypes from 'prop-types';

class DropdownOverlay extends React.Component {
	/**
		This component is in charge of rendering the dropdown menu that appears when a user hold touch a tile of the mode list.
		This menu contains two buttons (edit and delete). In some cases the delete button is disabled (for preconfigured modes). 
	*/

	componentDidMount() {
		this.positionMenu();
	}

	componentDidUpdate(prevProps) {
		this.positionMenu();
	}

	positionMenu = () => {
		/**
			This method computes the position of the top left corner of the menu block depending on the position of the selected mode.
			If the selected tile is on the right side of the screen, the menu is aligned to the right side of it, towards the center of the screen.
			The menu is always displayed above the tile.
		*/

		let dropdownMenuElem = document.getElementsByClassName("OverlayDropdownMenu")[0];
		let yOffset = 0;
		if (dropdownMenuElem.getBoundingClientRect().y !== this.props.settings.targetMode.getBoundingClientRect().y) {
			//in this case we scrolled the mode grid, and we need to add an offset to the position of the menu
			yOffset = dropdownMenuElem.getBoundingClientRect().y - this.props.settings.targetMode.getBoundingClientRect().y;
		}
		let yTranslate = - dropdownMenuElem.getBoundingClientRect().height - yOffset;
		let xTranslate = this.props.settings.targetMode.getBoundingClientRect().width/6;

		if (dropdownMenuElem.getBoundingClientRect().x >= window.innerWidth / 2) {
			xTranslate = - 2 * xTranslate;
		}

		dropdownMenuElem.style.transform = `translate(${xTranslate}px,${yTranslate}px)`;
	} 
	

	closeModal() {
		/**
			This method is called when the user clicks outside the menu. It calls the onClose function received as props from the parent component
			with an object to set the display property to false and hide the menu.
		*/
		this.props.onClose({'display':false});
	}

	deleteMode = () => {
		/**
			This method is called when the user clicks on the Delete button. It calls the parent's callback props function onDelete and triggers
			the close modal method.
		*/
		this.props.onDelete();
		this.closeModal();
	} 


	editMode = () => {
		/**
			This method is called when the user clicks on the Edit button. It calls the parent's callback props function onEdit and triggers
			the close modal method.
		*/
		this.props.onEdit();
		this.closeModal();
	} 


	renderTile = () => {
		// we redraw the tile
		let targetModeTile = this.props.settings.targetMode.querySelector(".mode-button");
		
		let tileStyle = {
			'height':targetModeTile.getBoundingClientRect().height,
			'width':targetModeTile.getBoundingClientRect().width,
			'background':targetModeTile.style.background,
			'borderRadius':'8px',
			'border': '1px solid rgba(254, 237, 223, 0.1)'
		}

		let titleStyle = {
			'display': 'inline-block',
			'overflow': 'hidden',
			'width':targetModeTile.getBoundingClientRect().width,
			'maxWidth': '50ch',
			'textOverflow': 'ellipsis',
			'whiteSpace': 'nowrap',
		}

		let overlayStyle = {
			'position': 'absolute', 
			'top':this.props.settings.targetMode.getBoundingClientRect().y,
			'zIndex':'100',
		}

		return (
			<div style={overlayStyle}>
				<div style={tileStyle}></div>
				<div style={titleStyle}>{this.props.settings.targetMode.textContent}</div>
			</div>
		)
	}

	render() {
		if (Object.keys(this.props.settings).length > 0) {
			let isDisabled = true;
			let iconOpacity = 0.2;
			if (this.props.settings.isDefault === false) {
				isDisabled = false;
				iconOpacity = 1;
			} 

			return (
				<React.Fragment>
					<div className="Blur" onClick={() => this.closeModal()}></div>
					<div className="OverlayDropdownMenu">
						<div id="touch-menu">
							<button className={["touch-menu-button", "touch-menu-button-top", "grid-row-one"].join(' ')} onClick={() => this.editMode()}>
								<p className="column-one">Éditer</p>
								<img 
									width="78" 
									height="78"
									className="column-two"
									src={`${process.env.PUBLIC_URL}/assets/images/edit.svg`} 
									alt="Éditer"
								/>
							</button>
							<button className="touch-menu-button grid-row-two" onClick={() => this.deleteMode()} disabled={isDisabled}>
								<p className="column-one">Supprimer</p>
								<img 
									width="60" 
									height="78"
									className="column-two"
									src={`${process.env.PUBLIC_URL}/assets/images/delete.svg`} 
									style={{'opacity':iconOpacity}}
									alt="Supprimer"
								/>
							</button>
						</div>
					</div>
					{this.renderTile()}
				</React.Fragment>
			)
		} 

		return null;
	}

}



DropdownOverlay.propTypes = {
	settings:PropTypes.object.isRequired,
	onDelete:PropTypes.func.isRequired,
	onEdit:PropTypes.func.isRequired,
	onClose:PropTypes.func.isRequired
}

export default DropdownOverlay;

