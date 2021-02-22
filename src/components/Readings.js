import React from 'react';
import MaiaService from '../services/MaiaService.js';

class Readings extends React.Component {
	/**
		This component is in charge of rendering the measures of the lamp sensor(s). 
		The values are automatically updated. 
	*/


	intervalID;
	state = {'lastUpdate':'', 'measures':{}};
	shouldRefreshReadings = false;
	config = undefined;

	componentDidMount() {
		if (this.config === undefined) {
			this.fetchConfig().then(json => {
				this.config = json;
			});
		}
		//fetch the current values of the measurements
		this.shouldRefreshReadings = true;
		this.getReadings();
		this.getGridSize();
	}

	componentDidUpdate() {
		this.getGridSize();
	}

	componentWillUnmount() {
		//clear the timeout
		this.shouldRefreshReadings = false;
		clearTimeout(this.intervalID);
	}

	fetchConfig() {
		/**
			This method fetches the config json file and returns a promise that resolves with the config file.
		*/

		var p = new Promise(resolve => {
			fetch('config.json').then(response => {
	            return response.json();
	        }).then(json => {
	        	resolve(json);
	        })
	    });
	    return p;
	}


	getGridSize() {
		/**
			This method recomputes the size of the grid to display the readings values, depending on how many are fetched. 
			The disposition of the grid depends on the platform (desktop vs mobile).
		*/
		var numRows;
		if (this.props.target === 'desktop') {
			numRows = Math.ceil(Object.keys(this.state.measures).length / 2);
			document.getElementById("readings-grid").style['grid-template-rows'] = `repeat(${numRows}, minmax(150px, 20vh))`;
		} else if (this.props.target === 'mobile') {
			numRows = Object.keys(this.state.measures).length;
			document.getElementById("readings-grid").style['grid-template-rows'] = `repeat(${numRows}, minmax(75px, 25vh))`;
		}
	}

	getReadings = () => {
		/**
			This method requests readings to the MaiaService. It is executed every 100 ms (using setTimeout). 
			Note that the shouldRefreshReadings state element is used to prevent a refresh
			of the value to be triggered if the component is unmounted (otherwise right after the component is unmounted because the user switched menu
			the last requested value could be provided to the React app, and not being able to be displayed).
		*/

		MaiaService.getReadings()
		.then(measures => {
			if (this.shouldRefreshReadings) {
				this.setState({ 'lastUpdate':Date.now(), measures: {...measures} });
				this.intervalID = setTimeout(this.getReadings, 3000);
			}
		})
	}

	onTempUnitChange = () => {
		let curr_unit = localStorage.getItem('temperature_unit') || this.config.readingsSettings['temperature']['unit'];
		let new_unit = curr_unit === '°C' ? '°F' : '°C';
		localStorage.setItem('temperature_unit', new_unit)
	}

	getFarTemp(temp) {
		// calculate temp in Farenheit
		return (temp * 9 / 5 + 32).toFixed(2)
	}

	renderTemperatureTile() {
		var unit = localStorage.getItem('temperature_unit') || this.config.readingsSettings['temperature']['unit'];
		var measure = unit === '°C' ? this.state.measures['temperature'] : this.getFarTemp(this.state.measures['temperature']);
		var img = this.config.readingsSettings['temperature']['img'];
		var title = this.config.readingsSettings['temperature']['title'];

		return (
			<div className="reading-tile">
				<div className={["reading-title", "grid-row-one"].join(' ')}>
					{title}
					<button id="temp-unit-button" onClick={this.onTempUnitChange} >{unit === '°C' ? '°F' : '°C'}</button>
				</div>
				<div className="reading-measure">
					<div className={["reading-icon", "column-one"].join(' ')}><img width="80" height="80" src={`${process.env.PUBLIC_URL}${img}`} alt={title} /></div>
					<div className={["reading-text", "column-two"].join(' ')}>{measure} {unit}</div>
				</div>
			</div>
		)
	}

	renderTile(item) {
		if (this.config !== undefined) {	
			if (item === 'temperature') {
				return this.renderTemperatureTile(item);
			} else {
				var measure = this.state.measures[item];
				var unit = this.config.readingsSettings[item]['unit'];
				var img = this.config.readingsSettings[item]['img'];
				var title = this.config.readingsSettings[item]['title'];

				return (
					<div className="reading-tile">
						<div className={["reading-title", "grid-row-one"].join(' ')}>{title}</div>
						<div className="reading-measure">
							<div className={["reading-icon", "column-one"].join(' ')}><img width="80" height="80" src={`${process.env.PUBLIC_URL}${img}`} alt={title} /></div>
							<div className={["reading-text", "column-two"].join(' ')}>{measure} {unit}</div>
						</div>
					</div>
				)
			}
		}
		return null;
	}

	render() {
		return (
			<div id="readings-grid">
				{
					React.Children.toArray(
						Object.keys(this.state.measures).map((item, i) => {		
							return this.renderTile(item)
						})
					)
				}
			</div>
		)
	}
}

export default Readings;