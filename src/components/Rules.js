import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TimePicker from './TimePicker.js';
// import Dropdown from './Dropdown.js';
// import { editRules } from '../actions';

class Rules extends React.Component {

	constructor(props) {
		super(props);
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
				'active':this.props.rulesConfig.autoOn.active,
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
				'active':this.props.rulesConfig.autoOff.active,
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


	handleSwitchChange = (event, target) => {
		var targets = target.split('.');
		var currentState = {...this.state};
		if (targets.length === 2) {
			currentState[targets[0]][targets[1]]['active'] = !this.state[targets[0]][targets[1]]['active'];
		} else {
			currentState[targets[0]]['active'] = !this.state[targets[0]]['active'];
		}
		this.setState(currentState, () => console.log(this.state));
	}

	handleNumberInputChange = (event) => {
		var silentAutoOff = {...this.state.silentAutoOff};
		silentAutoOff['duration'] = event.target.value;
		this.setState({silentAutoOff});
	}

	renderSwitch = (target) => {
		var targets = target.split('.');
		var stateTarget;
		if (targets.length === 2) {
			stateTarget = this.state[targets[0]][targets[1]]['active'];
		} else {
			stateTarget = this.state[targets[0]]['active'];

		}

		return (
			<label className="switch" name={target} value={target}>
				<input type="checkbox" checked={ stateTarget } onChange={ e => this.handleSwitchChange(e, target) } />
				<span className="slider round"></span>
			</label>
		)
	}

	renderAutoOnSection() {

		return (
			<div className="rules-div" style={{'float':'left'}}>
				<div>
					{this.renderSwitch('autoOn')}
					<p className="rule-text">Allumage automatique</p>
				</div>
				<div>
					<div>
						<input 
							name="autoOn"
							type="radio" 
							className="display-inline"
						/>
						<p className="display-inline">Allumer si le niveau lumineux est bas </p>
					</div>
					<div>
						{this.renderSwitch('autoOn.onLightLevel')}
						<p className="rule-text">Allumer après</p>
						<TimePicker time={"20:15"}/>
					</div>
				</div>
				<div>
					<div>
						<input 
							name="autoOn"
							type="radio"
							className="display-inline"
						/>
						<p className="display-inline">Allumer chaque jour à </p>
						<TimePicker time={"20:30"}/>
					</div>
					<div>
						{this.renderSwitch('autoOn.onSchedule')}
						<p className="rule-text">Grader à partir de</p>
						<TimePicker time={"20:15"}/>
					</div>
				</div>
			</div>
		)
	}

	renderAutoOffSection() {

		return (
			<div className="rules-div" style={{'float':'left'}}>
				<div>
					{this.renderSwitch('autoOff')}
					<p className="rule-text">Extinction automatique</p>
				</div>
				<div>
					<div>
						<p className="display-inline">Éteindre si le niveau lumineux est haut </p>
					</div>
					<div>
						{this.renderSwitch('autoOff.onLightLevel')}
						<p className="rule-text">Éteindre après</p>
						<TimePicker time={"20:15"}/>
					</div>
				</div>
				<div>
					<div>
						<p className="display-inline">Éteindre chaque jour à </p>
						<TimePicker time={"20:30"}/>
					</div>
					<div>
						{this.renderSwitch('autoOff.onSchedule')}
						<p className="rule-text">Grader à partir de</p>
						<TimePicker time={"20:15"}/>
					</div>
				</div>
			</div>
		)
	}

								// onChange={ e => this.handleAutoOnOffChange(e, 'onLightLevel') } 

	render() {

		return (
			<div id="rules-page">
				<div className="rules-div">
					{this.renderSwitch('dayTimeAuto')}
					<p className="rule-text">Choisir automatiquement le mode actif en fonction du moment de la journée</p>
				</div>
				<div className="rules-div">
					{this.renderSwitch('silentAutoOff')}
					<div className="rule-text">
						<p style={{display:'inline-block'}}>Désactiver les automatismes si aucun son pendant plus de </p>
						<input 
							id="number-input"
							style={{display:'inline-block'}}
							type="number" 
							value={this.state.silentAutoOff.duration} 
							onChange={this.handleNumberInputChange}
						/>
						<p style={{display:'inline-block'}}>heures</p>
					</div>	
				</div>
				{this.renderAutoOnSection()}
				{this.renderAutoOffSection()}
			</div>
		)

	}
}


const mapStateToProps = (state) => {
	return { rulesConfig : state.rules };
}

// Rules.propTypes = {
// 	settings:PropTypes.object.isRequired,
// 	onClose:PropTypes.func.isRequired,
// 	onSave:PropTypes.func.isRequired,
// }

export default connect(mapStateToProps)(Rules);

