import React, { useState, useEffect } from 'react';
import TimePicker from 'react-time-picker';

function Picker(props) {
	const { disabled, target, time, onTimeChange } = props;
	// const [ selectedTime, setTime ] = useState(time);

	// function handleChange(e, target) {


	// 	const currentTime = selectedTime;
	// 	setTime(e);
	// 	if (e === null) {
	// 		setTime(currentTime);
	// 	} else {
	// 		onTimeChange(e, target);
	// 		// console.log(selectedTime)
	// 		// setTime(time);
	// 	}
	// }

	// useEffect(() => {
	// }, [count]); 


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