import React from 'react';
import TimePicker from 'react-time-picker';

function Picker(props) {
	const { target, time, onTimeChange } = props;
	return (
		<TimePicker
			className="time-picker"
			disableClock={true}
			clearIcon={null}
			format={"HH:mm"}
			onChange={e => onTimeChange(e, target)}
			value={time}
		/>
	);
}

export default Picker;