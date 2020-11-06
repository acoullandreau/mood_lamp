import React from 'react';
import TimePicker from 'react-time-picker';

function Picker(props) {
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