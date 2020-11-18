import React from 'react';
import PropTypes from 'prop-types';

class DropdownOverlay extends React.Component {

	componentDidMount() {
		this.positionMenu();
		// this.setState({'settings':this.props.settings});
	}

	componentDidUpdate(prevProps) {
		this.positionMenu();
		// if (this.props !== prevProps) {
		// 	this.setState({'settings':this.props.settings}, () => {
		// 		if (Object.keys(this.props.settings).length > 0) {
		// 		}
		// 	});
		// }

	}

	positionMenu = () => {
		// if the mode is in the right side of the screen, we position the top right corner of the menu
		let dropdownMenuElem = document.getElementsByClassName("OverlayDropdownMenu")[0];
		let xTranslate;
		let yTranslate;

		if (this.props.settings.touchPoint.screenX < window.innerWidth / 2) {
			xTranslate = this.props.settings.touchPoint.clientX - dropdownMenuElem.getBoundingClientRect().x;
		} else {
			xTranslate = this.props.settings.touchPoint.clientX - (dropdownMenuElem.getBoundingClientRect().x + dropdownMenuElem.getBoundingClientRect().width);
		}
		if (this.props.settings.touchPoint.clientX < dropdownMenuElem.getBoundingClientRect().x) {
			xTranslate = - xTranslate;
		}

		if (this.props.settings.touchPoint.screenX < window.innerHeight / 2) {
			yTranslate = this.props.settings.touchPoint.clientY - dropdownMenuElem.getBoundingClientRect().y;
		} else {
			yTranslate = this.props.settings.touchPoint.clientY - (dropdownMenuElem.getBoundingClientRect().y + dropdownMenuElem.getBoundingClientRect().width);
		}
		if (this.props.settings.touchPoint.clientY < dropdownMenuElem.getBoundingClientRect().y) {
			yTranslate = - yTranslate;
		}

		dropdownMenuElem.style.transform = `translate(${xTranslate}px,${yTranslate}px)`;

		// make the targeted tile z-index ++
		//console.log(this.props.settings.targetMode)


	} 
	

	closeModal() {
		// object passed to displayOverlay function of App through props 
		this.props.onClose({'display':false});
	}

	deleteMode = () => {
		this.props.onDelete();
		this.closeModal();
	} 


	editMode = () => {
		this.props.onEdit();
		this.closeModal();
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
								<p className="column-one">Éditer le mode</p>
								<img 
									className="column-two"
									src={`${process.env.PUBLIC_URL}/assets/images/edit.svg`} 
									alt="Éditer"
								/>
							</button>
							<button className="touch-menu-button grid-row-two" onClick={() => this.deleteMode()} disabled={isDisabled}>
								<p className="column-one">Supprimer le mode</p>
								<img 
									className="column-two"
									src={`${process.env.PUBLIC_URL}/assets/images/delete.svg`} 
									style={{'opacity':iconOpacity}}
									alt="Supprimer"
								/>
							</button>
						</div>
					</div>
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

