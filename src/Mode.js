import React from 'react';
import Utils from './Utils.js';
import PropTypes from 'prop-types';

class Mode extends React.Component {

	constructor(props) {
		super(props);
		this.state = {'name':'', 'color':[], 'speed':0}; 
	}


	launchMode = (event) => {
		this.setState({'launchedMode':event.target.value}, () => {
			//execute the mode
			console.log(this.state.launchedMode)
		})
	}

	// onEdit = (event) => {

	// }

	// onDelete = (event) => {

	// }

	getThumbnail = (item) => {
		return Utils.convertRGBToString(item.color[0]);

	}

	onHover = (event, bool) => {
		var id = event.currentTarget.id;

		if (bool) {
			document.getElementsByClassName("mode-hover")[id].style.display = 'block';
		} else {
			document.getElementsByClassName("mode-hover")[id].style.display = 'none';
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
					<div className={["mode-hover", "colum-two"].join(' ')}>
						<button className="edit-button">
							<img 
								src={`${process.env.PUBLIC_URL}/assets/images/edit.svg`} 
								alt="Éditer"
							/>
						</button>
						<button className="edit-button">
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
	id:PropTypes.number.isRequired
}

export default Mode;