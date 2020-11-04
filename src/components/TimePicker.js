import React, { useState } from 'react';
import TimePicker from 'react-time-picker';

function Picker({ time }) {
	const [value, onChange] = useState(time);

	return (
		<div>
			<TimePicker
				disableClock={true}
				clearIcon={null}
				format={"HH:mm"}
				onChange={onChange}
				value={value}
			/>
		</div>
	);
}

export default Picker;