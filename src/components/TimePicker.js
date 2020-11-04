import React, { useState } from 'react';
import TimePicker from 'react-time-picker';

function Picker({ time }) {
	const [value, onChange] = useState(time);

	return (
		<TimePicker
			className="time-picker"
			disableClock={true}
			clearIcon={null}
			format={"HH:mm"}
			onChange={onChange}
			value={value}
		/>
	);
}

export default Picker;