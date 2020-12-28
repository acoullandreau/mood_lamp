import React from 'react';
import { connect } from 'react-redux';
import { editRules } from '../actions';
import TimePicker from './TimePicker.js';

class Rules extends React.Component {
	/**
		This component is in charge of rendering the list of rules the user can set on the lamp.
		It has access to the Redux store that holds the latest version of the rules object.
	*/


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
		/**
			This helper function is used to identify which of the two options available for AutoOn and AutoOff,
			onSchedule or onLightLevel, is currently set as active.
		*/


		if (this.props.rulesConfig[category].onSchedule.active) {
			return 'onSchedule';
		} else {
			return 'onLightLevel';
		}
	}

	getOpacity = (target, isSubLevel) => {
		/**
			This helper function is used to compute the opacity style to apply to a line based on whether it is active or not.
		*/

		var targetArray = target.split('.');
		var category = targetArray[0];
		var subcategory = targetArray[1];
		var opacity = 1;
		if (isSubLevel) {
			if (this.state[category].activeOption !== subcategory) {
				opacity = 0.5;
			}
		}
		if (this.state[category].active === false) {
			opacity = 0.5;
		} 

		return opacity;
	}

	isDisabled = (target) => {
		/**
			This helper function determines whether or not a rule is disabled or not.
		*/

		var isDisabled = false;
		var targetArray = target.split('.');
		if (targetArray.length > 1) {
			if (this.state[targetArray[0]]['active'] === false) {
				isDisabled = true;
			} else if (this.state[targetArray[0]].activeOption !== targetArray[1]) {
				isDisabled = true;
			}
		}
		return isDisabled;
	}

	parseStateToRules = () => {
		/**
			This method is in charge of converting the state of the component into an object that matches the format of the redux store Rules object.
			It triggers the update to the Redux store (that in turn is going to trigger a save through MaiaService).
		*/

		// Object.assign only does a shallow copy, so if there are nested objects they can be altered in the source from the target!!
		var rules = {};
		rules.dayTimeAuto = Object.assign({}, this.state.dayTimeAuto);
		rules.silentAutoOff = Object.assign({}, this.state.silentAutoOff);
		rules.autoOn = {
			'active':this.state.autoOn.active, 
			'onLightLevel':Object.assign({}, this.state.autoOn.onLightLevel), 
			'onSchedule':Object.assign({}, this.state.autoOn.onSchedule)
		};
		rules.autoOff = {
			'active':this.state.autoOff.active, 
			'onLightLevel':Object.assign({}, this.state.autoOff.onLightLevel), 
			'onSchedule':Object.assign({}, this.state.autoOff.onSchedule)
		};

		if (this.state.autoOn.activeOption === 'onLightLevel') {
			rules.autoOn.onLightLevel.active = true;
			rules.autoOn.onSchedule.active = false;
		} else {
			rules.autoOn.onLightLevel.active = false;
			rules.autoOn.onSchedule.active = true;
		};

		if (this.state.autoOff.activeOption === 'onLightLevel') {
			rules.autoOff.onLightLevel.active = true;
			rules.autoOff.onSchedule.active = false;
		} else {
			rules.autoOff.onLightLevel.active = false;
			rules.autoOff.onSchedule.active = true;
		};

		this.props.editRules(rules);
	}

	handleSwitchChange = (event, target) => {
		/**
			This method is triggered when a user clicks on a switch. It is in charge of updating the state with the new active rule,
			and triggering an update of the Redux store and a save of the rules (as a change is detected).
		*/

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
		this.setState(currentState, () => {
			this.parseStateToRules();
		});
	}

	handleOptionChange = (event) => {
		/**
			This method is triggered when a user clicks selects an option. 
			Options are identified with a radio button, only one at a time can be selected. 
			This method triggers an update of the Redux store and a save of the rules (as a change is detected).
		*/

		var currentState = {...this.state};
		currentState[event.target.name].activeOption = event.target.value;
		this.setState(currentState, () => {
			this.parseStateToRules();
		});
	}

	handleNumberInputChange = (event) => {
		/**
			This method is triggered when a user updates the value of the number input field displayed in one of the rules.
			It triggers an update of the Redux store and a save of the rules (as a change is detected).
		*/

		var silentAutoOff = {...this.state.silentAutoOff};
		silentAutoOff['active'] = true;
		silentAutoOff['duration'] = event.target.value;
		this.setState({silentAutoOff}, () => {
			this.parseStateToRules();
		});
	}

	onTimeChange = (event, target) => {
		/**
			This method is triggered when a user updates the value of a time picker (available for multiple rules).
			If the value inputted is correct (i.e numbers set for the hour and the minutes), it triggers an update of
			the Redux store and a save of the rules (as a change is detected).
		*/

		var value = event.target.value
		var targets = target.split('.');
		var category = targets[0];
		var subsection = targets[1];
		var item = targets[2];

		if (value !== null) {
			var currentState = {...this.state};
			currentState[category][subsection][item] = value;
			if (subsection === 'onLightLevel') {
				currentState[category][subsection]['withStartTime'] = true;
			} else if (subsection === 'onSchedule') {
				currentState[category][subsection]['withStartDimmingTime'] = true;
			}
			this.setState(currentState, () => {
				this.parseStateToRules();
			});	
		}

	}

	renderSwitch = (target) => {
		var targets = target.split('.');
		var stateTarget;

		if (targets.length === 2) {
			if (targets[1] === 'onLightLevel') {
				stateTarget = this.state[targets[0]]['onLightLevel']['withStartTime'];
			} else {
				stateTarget = this.state[targets[0]]['onSchedule']['withStartDimmingTime'];
			}
		} else {
			stateTarget = this.state[targets[0]]['active'];
		}

		return (
			<label className="switch" name={target} value={target}>
				<input 
					type="checkbox" 
					checked={ stateTarget } 
					disabled={ this.isDisabled(target) }
					onChange={ e => this.handleSwitchChange(e, target) } 
				/>
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
				<div className="subsection" style={{'opacity':this.getOpacity('autoOn.onLightLevel', false)}}> 
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
						<p className="display-inline long-rule-text">Allumer si le niveau lumineux est bas </p>
					</div>
					<div 
						className="subsection-sublevel" 
						style={{'opacity':this.getOpacity('autoOn.onLightLevel', true)}}
					>
						{this.renderSwitch('autoOn.onLightLevel')}
						<p className="rule-text">Allumer après</p>
						<TimePicker 
							target="autoOn.onLightLevel.startTime" 
							disabled={ this.isDisabled("autoOn.onLightLevel") }
							time={this.state.autoOn.onLightLevel.startTime} 
							onTimeChange={this.onTimeChange}
						/>
					</div>
				</div>
				<div className="subsection" style={{'opacity':this.getOpacity('autoOn.onSchedule', false)}}>
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
						<p className="display-inline rule-text">Allumer chaque jour à </p>
						<TimePicker 
							target="autoOn.onSchedule.startTime" 
							disabled={ this.isDisabled('autoOn.onSchedule') }
							time={this.state.autoOn.onSchedule.startTime} 
							onTimeChange={this.onTimeChange}
						/>
					</div>
					<div 
						className="subsection-sublevel" 
						style={{'opacity':this.getOpacity('autoOn.onSchedule', true) }}
					>
						{this.renderSwitch('autoOn.onSchedule')}
						<p className="rule-text">Progressif dès </p>
						<TimePicker 
							target="autoOn.onSchedule.startDimmingTime" 
							disabled={ this.isDisabled('autoOn.onSchedule') }
							time={this.state.autoOn.onSchedule.startDimmingTime} 
							onTimeChange={this.onTimeChange}
						/>
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
				<div className="subsection" style={{'opacity':this.getOpacity('autoOff.onLightLevel', false)}}>
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
						<p className="display-inline long-rule-text">Éteindre si le niveau lumineux est haut </p>
					</div>
					<div 
						className="subsection-sublevel" 
						style={{'opacity':this.getOpacity('autoOff.onLightLevel', true) }}
					>
						{this.renderSwitch('autoOff.onLightLevel')}
						<p className="rule-text">Éteindre après</p>
						<TimePicker 
							target="autoOff.onLightLevel.startTime" 
							disabled={ this.isDisabled("autoOff.onLightLevel") }
							time={this.state.autoOff.onLightLevel.startTime} 
							onTimeChange={this.onTimeChange}
						/>
					</div>
				</div>
				<div className="subsection" style={{'opacity':this.getOpacity('autoOff.onSchedule', false)}}>
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
						<p className="rule-text display-inline">Éteindre chaque jour à </p>
						<TimePicker 
							target="autoOff.onSchedule.startTime" 
							disabled={ this.isDisabled("autoOff.onSchedule") }
							time={this.state.autoOff.onSchedule.startTime} 
							onTimeChange={this.onTimeChange}
						/>
					</div>
					<div 
						className="subsection-sublevel" 
						style={{'opacity':this.getOpacity('autoOff.onSchedule', true)}}
					>
						{this.renderSwitch('autoOff.onSchedule')}
						<p className="rule-text">Progressif dès </p>
						<TimePicker 
							target="autoOff.onSchedule.startDimmingTime" 
							disabled={ this.isDisabled("autoOff.onSchedule") }
							time={this.state.autoOff.onSchedule.startDimmingTime} 
							onTimeChange={this.onTimeChange} 
						/>
					</div>
				</div>
			</div>
		)
	}



	render() {

		return (
			<div id="rules-page">
				<div className="rules-div">
					{this.renderSwitch('dayTimeAuto')}
					<p className="rule-text">Laisser la lampe choisir automatiquement le mode actif</p>
				</div>
				<div className="rules-div">
					{this.renderSwitch('silentAutoOff')}
					<div className="rule-text text-with-input">
						<p style={{display:'inline-block'}}>Désactiver les automatismes si aucun son pendant plus de </p>
						<input 
							id="number-input"
							type="number" 
							style={{display:'inline-block'}}
							value={this.state.silentAutoOff.duration} 
							onChange={this.handleNumberInputChange}
						/>
						<label style={{'display':'inline-block'}}>heures</label>
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

export default connect(mapStateToProps, { editRules })(Rules);

