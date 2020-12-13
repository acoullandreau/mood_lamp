import React from 'react';
import TimePicker from 'react-time-picker';

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
		<TimePicker
			className="time-picker"
			disabled={disabled}
			disableClock={true}
			clearIcon={null}
			format={"HH:mm"}
			onChange={e => onTimeChange(e, target)}
			value={time}
		/>
	);
}

export default Picker;