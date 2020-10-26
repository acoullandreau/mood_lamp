import React from 'react';
import Utils from './Utils.js';
import PropTypes from 'prop-types';

class Mode extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			'id':this.props.id, 
			'isDefault':this.props.isDefault,
			'name':this.props.params.name, 
			'color':this.props.params.color, 
			'speed':this.props.params.speed
		}; 
	}


	launchMode = (event) => {
		this.setState({'launchedMode':event.target.value}, () => {
			//execute the mode
			console.log(this.state.launchedMode)
		})
	}

	onEdit = (event) => {

	}

	onDelete = () => {
		this.props.onModeDelete(this.state.id);
	}

	getThumbnail = (item) => {
		return Utils.convertRGBToString(item.color[0]);

	}

	onHover = (event, bool) => {
		if (this.state.isDefault === false) {
			var id = event.currentTarget.id;
			if (bool) {
				document.getElementById(`hover-${id}`).style.display = 'block';
			} else {
				document.getElementById(`hover-${id}`).style.display = 'none';
			}
		}


	}	

	renderMode = () => {

		var mode = this.props.params;
		var id = this.props.id;
		var background = this.getThumbnail(mode);

		return (
			<div 
				className='mode-sub-grid'
				id={id}
				onMouseEnter={(e) => this.onHover(e, true)}
				onMouseLeave={(e) => this.onHover(e, false)}
			>
				<button
					className={["mode-button", "grid-row-one"].join(' ')}
					style={{'backgroundColor':background}}
					onClick={this.launchMode} 
				></button>
				<div className={["mode-text", "grid-row-two"].join(' ')}>
					<p className="colum-two">{mode.name}</p>
					<div id={`hover-${id}`} className={["mode-hover", "colum-two"].join(' ')}>
						<button className="edit-button" onClick={this.onEdit} >
							<img 
								src={`${process.env.PUBLIC_URL}/assets/images/edit.svg`} 
								alt="Éditer"
							/>
						</button>
						<button className="edit-button" onClick={this.onDelete}>
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

Mode.propTypes = {
	params:PropTypes.object.isRequired,
	isDefault:PropTypes.bool.isRequired,
	id:PropTypes.number.isRequired,
	onModeDelete:PropTypes.func.isRequired
}

export default Mode;