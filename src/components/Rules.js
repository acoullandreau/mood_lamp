import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TimePicker from './TimePicker.js';
import Dropdown from './Dropdown.js';
// import { editRules } from '../actions';

class Rules extends React.Component {

	constructor(props) {
		super(props);
		console.log(this.props.rulesConfig.dayTimeAuto.active)
		this.state = {
			'dayTimeAuto': 
			{
				'active':this.props.rulesConfig.dayTimeAuto.active
			},
			'silentAutoOff':
			{
				'active':this.props.rulesConfig.silentAutoOff.active,
				'duration':this.props.rulesConfig.silentAutoOff.duration
			},
			'autoOn':{
				'onLightLevel':{
					'active':this.props.rulesConfig.autoOn.onLightLevel.active, 
					'startTime':this.props.rulesConfig.autoOn.onLightLevel.startTime
				},
				'onSchedule':{
					'active':this.props.rulesConfig.autoOn.onSchedule.active, 
					'startTime':this.props.rulesConfig.autoOn.onSchedule.startTime,
					'startDimmingTime':this.props.rulesConfig.autoOn.onSchedule.startDimmingTime
				},
			},
			'autoOff':{
				'onLightLevel':{
					'active':this.props.rulesConfig.autoOff.onLightLevel.active, 
					'startTime':this.props.rulesConfig.autoOff.onLightLevel.startTime
				},
				'onSchedule':{
					'active':this.props.rulesConfig.autoOff.onSchedule.active, 
					'startTime':this.props.rulesConfig.autoOff.onSchedule.startTime,
					'startDimmingTime':this.props.rulesConfig.autoOff.onSchedule.startDimmingTime
				},
			},
		};
	}

	handleChange = (event, target) => {
		var currentState = {};
		if (target === 'autoOff' || target === 'autoOn') {
			this.handleAutoOnOffChange(currentState, target);
		} else  {
			currentState[target].active = !this.state[target];
		} 
		this.setState(currentState);
	}

	renderSwitch = (target) => {
		var stateTarget = this.state[target]['active'];

		return (
			<label className="switch" name={target} value={target}>
				<input type="checkbox" checked={ stateTarget } onChange={ e => this.handleChange(e, target) } />
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
				<div className='span-row'>
					{this.renderSwitch('silentAutoOff')}
					<div className="rule-text">
						<p className="rule-text">Désactiver les automatismes si aucun son pendant plus de </p>
						<input type="number" placeholder={12} value={this.state.silentAutoOff.duration}/><p>heures</p>
					</div>	

				</div>
				<TimePicker time={"20:04"}/>
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

