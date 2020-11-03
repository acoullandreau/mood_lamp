import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { editRules } from '../actions';

class Rules extends React.Component {

	constructor(props) {
		super(props);
		this.state = this.props.rulesConfig;
	}

		// const rulesConfig = {
		// 	'dayTimeAuto':false,
		// 	'silentAutoOff':false,
		// 	'autoOn':{
		// 		'onLightLevel':{
		// 			'active':true, 
		// 			'startTime':null
		// 		},
		// 		'onSchedule':{
		// 			'active':false, 
		// 			'startTime':null,
		// 			'startDimmingTime':null
		// 		},
		// 	},
		// 	'autoOff':{
		// 		'onLightLevel':{
		// 			'active':false, 
		// 			'startTime':null
		// 		},
		// 		'onSchedule':{
		// 			'active':true, 
		// 			'startTime':'23:00',
		// 			'startDimmingTime':'22:30'
		// 		},
		// 	},
		// }

	handleChange = (event) => {
		console.log(event);
		this.setState( { dayTimeAuto: !this.state.dayTimeAuto } );
	}

	renderSwitch = (target) => {
		return (
			<label className="switch">
				<input type="checkbox" checked={ this.state.target } onChange={ this.handleChange } />
				<span className="slider round"></span>
			</label>
		)
	}

	render() {

		return (
			<div id='rules-grid'>
				<div className='span-row'>
					{this.renderSwitch('dayTimeAuto')}
					<p className="rule-text">Choisir automatiquement le mode actif en fonction du moment de la journée</p>
				</div>
			</div>
		)
	}
}

//<input checked={ this.state.dayTimeAuto } onChange={ this.handleChange } type="radio" />

const mapStateToProps = (state) => {
	return { rulesConfig : state.rules };
}

// Rules.propTypes = {
// 	settings:PropTypes.object.isRequired,
// 	onClose:PropTypes.func.isRequired,
// 	onSave:PropTypes.func.isRequired,
// }

export default connect(mapStateToProps)(Rules);

