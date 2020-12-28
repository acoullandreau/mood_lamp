import React from 'react';

function Picker(props) {
	/**
		This functional component renders a time picker. It is used by the Rules component.
		It receives as props 
			- whether it is disabled or not
			- the initial value to display
			- as several pickers are rendered by the Rules component, a target to identify what picker it is
			- a callback function to call when the value is changed by the user
	*/

	const { disabled, target, time, onTimeChange } = props;

	return (
		<input 
			type="time" 
			className="time-picker" 
			disabled={disabled}
			min="00:00" 
			max="23:59" 
			required
			onChange={e => onTimeChange(e, target)}
			value={time}
		/>
    )
}

export default Picker;