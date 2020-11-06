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
				'activeOption':this.getActiveOption('autoOn'),
				'onLightLevel':{
					'startTime':this.props.rulesConfig.autoOn.onLightLevel.startTime,
					'withStartTime':this.props.rulesConfig.autoOn.onLightLevel.withStartTime,
				},
				'onSchedule':{
					'startTime':this.props.rulesConfig.autoOn.onSchedule.startTime,
					'withStartDimmingTime':this.props.rulesConfig.autoOn.onSchedule.withStartDimmingTime,
					'startDimmingTime':this.props.rulesConfig.autoOn.onSchedule.startDimmingTime
				},
			},
			'autoOff':{
				'active':this.props.rulesConfig.autoOff.active,
				'activeOption':this.getActiveOption('autoOff'),
				'onLightLevel':{
					'startTime':this.props.rulesConfig.autoOff.onLightLevel.startTime,
					'withStartTime':this.props.rulesConfig.autoOff.onLightLevel.withStartTime
				},
				'onSchedule':{
					'startTime':this.props.rulesConfig.autoOff.onSchedule.startTime,
					'withStartDimmingTime':this.props.rulesConfig.autoOff.onSchedule.withStartDimmingTime,
					'startDimmingTime':this.props.rulesConfig.autoOff.onSchedule.startDimmingTime
				},
			},
		};
	}

	getActiveOption = (category) => {
		if (this.props.rulesConfig[category].onLightLevel.active) {
			return 'onLightLevel';
		} else {
			return 'onSchedule';
		}
	}

	getOpacity = (target) => {
		var targets = target.split('.');
		var category = targets[0];
		var subsection = targets[1];
		var opacity = 1;
		if (this.state[category].active) {
			if (targets.length === 2) {
				if (this.state[category].activeOption !== subsection) {
					opacity = 0.3;
				} 
			} 
		} else {
			opacity = 0.3;
		} 
		return opacity;
	}

	onSave = () => {
		console.log("Saving")
	}

	handleSwitchChange = (event, target) => {
		var targets = target.split('.');
		var currentState = {...this.state};
		if (targets.length === 2) {
			if (targets[1] === 'onLightLevel') {
				currentState[targets[0]]['onLightLevel']['withStartTime'] = !this.state[targets[0]]['onLightLevel']['withStartTime'];
			} else {
				currentState[targets[0]]['onSchedule']['withStartDimmingTime'] = !this.state[targets[0]]['onSchedule']['withStartDimmingTime'];
			}
		} else {
			currentState[targets[0]]['active'] = !this.state[targets[0]]['active'];
		}
		this.setState(currentState);
	}

	handleOptionChange = (event) => {
		var currentState = {...this.state};
		currentState[event.target.name].activeOption = event.target.value;
		this.setState(currentState);
	}

	handleNumberInputChange = (event) => {
		var silentAutoOff = {...this.state.silentAutoOff};
		silentAutoOff['active'] = true;
		silentAutoOff['duration'] = event.target.value;
		this.setState({silentAutoOff});
	}

	onTimeChange = (value, target) => {
		var targets = target.split('.');
		var category = targets[0];
		var subsection = targets[1];
		var item = targets[2];
		var currentState = {...this.state};
		currentState[category][subsection][item] = value;
		this.setState(currentState);
	}

	renderSwitch = (target) => {
		var targets = target.split('.');
		var stateTarget;
		if (targets.length === 2) {
			if (targets[1] === 'onLightLevel') {
				stateTarget = this.state[targets[0]][targets[1]]['withStartTime'];
			} else {
				stateTarget = this.state[targets[0]][targets[1]]['withStartDimmingTime'];
			}
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
			<div className={["rules-div", "float-left"].join(' ')}>
				<div>
					{this.renderSwitch('autoOn')}
					<p className="rule-text">Allumage automatique</p>
				</div>
				<div className="subsection" style={{'opacity':this.getOpacity('autoOn.onLightLevel')}}> 
					<div>
						<input 
							name="autoOn"
							value='onLightLevel'
							type="radio" 
							checked={this.state.autoOn.activeOption === 'onLightLevel'}
							disabled={this.state.autoOn.active ? false : true}
							onChange={this.handleOptionChange}
							className="display-inline"
						/>
						<p className="display-inline">Allumer si le niveau lumineux est bas </p>
					</div>
					<div className="subsection-sublevel" style={{'opacity':this.state.autoOn.onLightLevel.withStartTime ? '1':'0.5'}}>
						{this.renderSwitch('autoOn.onLightLevel')}
						<p className="rule-text">Allumer après</p>
						<TimePicker target="autoOn.onLightLevel.startTime" time={this.state.autoOn.onLightLevel.startTime} onTimeChange={this.onTimeChange}/>
					</div>
				</div>
				<div className="subsection" style={{'opacity':this.getOpacity('autoOn.onSchedule')}}>
					<div>
						<input 
							name="autoOn"
							value='onSchedule'
							type="radio"
							checked={this.state.autoOn.activeOption === 'onSchedule'}
							disabled={this.state.autoOn.active ? false : true}
							onChange={this.handleOptionChange}
							className="display-inline"
						/>
						<p className="display-inline">Allumer chaque jour à </p>
						<TimePicker target="autoOn.onSchedule.startTime" time={this.state.autoOn.onSchedule.startTime} onTimeChange={this.onTimeChange}/>
					</div>
					<div className="subsection-sublevel" style={{'opacity':this.state.autoOn.onSchedule.withStartDimmingTime ? '1':'0.5'}}>
						{this.renderSwitch('autoOn.onSchedule')}
						<p className="rule-text">Grader à partir de</p>
						<TimePicker target="autoOn.onSchedule.startDimmingTime" time={this.state.autoOn.onSchedule.startDimmingTime} onTimeChange={this.onTimeChange}/>
					</div>
				</div>
			</div>
		)
	}

	renderAutoOffSection() {

		return (
			<div className={["rules-div", "float-left"].join(' ')}>
				<div>
					{this.renderSwitch('autoOff')}
					<p className="rule-text">Extinction automatique</p>
				</div>
				<div className="subsection" style={{'opacity':this.getOpacity('autoOff.onLightLevel')}}>
					<div>
						<input 
							name="autoOff"
							value='onLightLevel'
							type="radio" 
							checked={this.state.autoOff.activeOption === 'onLightLevel'}
							disabled={this.state.autoOff.active ? false : true}
							onChange={this.handleOptionChange}
							className="display-inline"
						/>
						<p className="display-inline">Éteindre si le niveau lumineux est haut </p>
					</div>
					<div className="subsection-sublevel" style={{'opacity':this.state.autoOff.onLightLevel.withStartTime ? '1':'0.5'}}>
						{this.renderSwitch('autoOff.onLightLevel')}
						<p className="rule-text">Éteindre après</p>
						<TimePicker target="autoOff.onLightLevel.startTime" time={this.state.autoOff.onLightLevel.startTime} onTimeChange={this.onTimeChange}/>
					</div>
				</div>
				<div className="subsection" style={{'opacity':this.getOpacity('autoOff.onSchedule')}}>
					<div>
						<input 
							name="autoOff"
							value='onSchedule'
							type="radio"
							checked={this.state.autoOff.activeOption === 'onSchedule'}
							disabled={this.state.autoOff.active ? false : true}
							onChange={this.handleOptionChange}
							className="display-inline"
						/>
						<p className="display-inline">Éteindre chaque jour à </p>
						<TimePicker target="autoOff.onSchedule.startTime" time={this.state.autoOff.onSchedule.startTime} onTimeChange={this.onTimeChange}/>
					</div>
					<div className="subsection-sublevel" style={{'opacity':this.state.autoOff.onSchedule.withStartDimmingTime ? '1':'0.5'}}>
						{this.renderSwitch('autoOff.onSchedule')}
						<p className="rule-text">Grader à partir de</p>
						<TimePicker target="autoOff.onSchedule.startDimmingTime" time={this.state.autoOff.onSchedule.startDimmingTime} onTimeChange={this.onTimeChange} />
					</div>
				</div>
			</div>
		)
	}

	render() {

		var opacitydayTimeAuto = 1;
		var opacitysilentAutoOff = 1;
		if (this.state.dayTimeAuto.active === false) {
			opacitydayTimeAuto = 0.3;
		}
		if (this.state.silentAutoOff.active === false) {
			opacitysilentAutoOff = 0.3;
		}

		return (
			<div id="rules-page">
				<div className="rules-div">
					{this.renderSwitch('dayTimeAuto')}
					<p className="rule-text" style={{'opacity':opacitydayTimeAuto}}>Choisir automatiquement le mode actif en fonction du moment de la journée</p>
				</div>
				<div className="rules-div">
					{this.renderSwitch('silentAutoOff')}
					<div className="rule-text" style={{'opacity':opacitysilentAutoOff}}>
						<p className="rule-text">Désactiver les automatismes si aucun son pendant plus de </p>
						<input 
							id="number-input"
							type="number" 
							value={this.state.silentAutoOff.duration} 
							onChange={this.handleNumberInputChange}
						/>
						<p className="rule-text" style={{marginLeft:'0px'}}>heures</p>
					</div>	
				</div>
				{this.renderAutoOnSection()}
				{this.renderAutoOffSection()}
				<button className={['save-button', 'rules-button'].join(' ')} onClick={this.onSave} >
					Enregistrer
				</button>

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

