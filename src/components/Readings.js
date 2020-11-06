import React from 'react';

class Readings extends React.Component {

	state = {'lastUpdate':'', 'temperature':'', 'humidity':'', 'airPressure':''};

//automatic refresh every x seconds

	componentDidMount() {
		//fetch the current values of the measurements
		var initialReadings = this.getReadings();
	}

	getReadings = () => {
		console.log(Date.now().toString())
	}

	render() {
		return <div>Mesures</div>
	}
}

export default Readings;